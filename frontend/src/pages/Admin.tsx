import { useCallback, useEffect, useState, type FormEvent } from "react";
import { useDocumentTitle } from "@/lib/use-document-title";
import { StatusBadge } from "@/components/status-badge";
import { fetchInquiries, AdminApiError, type Inquiry, type StatusFilter } from "@/lib/admin-api";

const STORAGE_KEY = "enochlabs_admin_key";

const statusOptions: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "closed", label: "Closed" },
];

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

/**
 * Internal-only view for reviewing inquiries without touching the database
 * directly (see docs/SPRINT-PLAN.md Sprint 3). Deliberately not linked from
 * site navigation or the sitemap — reachable only by direct URL, and gated
 * by the same shared-secret header the backend's GET /api/v1/inquiries
 * expects. Real per-user auth replaces this in Phase 3 (docs/ROADMAP.md).
 */
export function Admin() {
  useDocumentTitle("Admin", "Internal inquiry review.");

  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
    return () => {
      document.head.removeChild(meta);
    };
  }, []);

  const [adminKey, setAdminKey] = useState<string | null>(() =>
    sessionStorage.getItem(STORAGE_KEY),
  );
  const [keyInput, setKeyInput] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [inquiries, setInquiries] = useState<Inquiry[] | null>(null);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (key: string, filter: StatusFilter) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchInquiries(key, filter);
      setInquiries(data.items);
      setTotal(data.total);
    } catch (err) {
      if (err instanceof AdminApiError && err.status === 401) {
        sessionStorage.removeItem(STORAGE_KEY);
        setAdminKey(null);
      }
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setInquiries(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (adminKey) {
      void load(adminKey, statusFilter);
    }
  }, [adminKey, statusFilter, load]);

  function handleUnlock(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!keyInput.trim()) return;
    sessionStorage.setItem(STORAGE_KEY, keyInput.trim());
    setAdminKey(keyInput.trim());
    setKeyInput("");
  }

  function handleLock() {
    sessionStorage.removeItem(STORAGE_KEY);
    setAdminKey(null);
    setInquiries(null);
  }

  if (!adminKey) {
    return (
      <section className="mx-auto flex max-w-md flex-col px-6 py-24">
        <p className="eyebrow">Admin</p>
        <h1 className="mt-3 font-display text-2xl font-medium text-paper">Enter admin key</h1>
        <p className="mt-2 font-body text-sm text-ink-100/70">
          Kept only for this browser tab — cleared when you lock or close it.
        </p>
        <form onSubmit={handleUnlock} className="mt-6 space-y-4">
          <input
            type="password"
            value={keyInput}
            onChange={(event) => setKeyInput(event.target.value)}
            placeholder="X-Admin-Key value"
            autoComplete="off"
            className="w-full border border-rule/60 bg-transparent px-4 py-3 font-mono text-sm text-paper outline-none focus-visible:border-seal"
          />
          <button type="submit" className="btn-primary w-full justify-center">
            Unlock
          </button>
        </form>
        {error ? (
          <p className="mt-4 border border-seal/40 bg-seal/10 p-3 font-body text-sm text-paper">
            {error}
          </p>
        ) : null}
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-content px-6 py-16">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-rule/60 pb-6">
        <div>
          <p className="eyebrow">Admin</p>
          <h1 className="mt-3 font-display text-3xl font-medium text-paper">Inquiries</h1>
          <p className="mt-2 font-mono text-xs uppercase tracking-widest text-ink-100/50">
            {loading ? "Loading…" : `${total} total`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}
            className="border border-rule/60 bg-ink-900 px-3 py-2 font-mono text-xs uppercase tracking-widest text-paper outline-none focus-visible:border-seal"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => void load(adminKey, statusFilter)}
            className="btn-secondary text-xs"
          >
            Refresh
          </button>
          <button type="button" onClick={handleLock} className="btn-secondary text-xs">
            Lock
          </button>
        </div>
      </div>

      {error ? (
        <p className="mt-6 border border-seal/40 bg-seal/10 p-4 font-body text-sm text-paper">
          {error}
        </p>
      ) : null}

      {inquiries && inquiries.length === 0 && !error ? (
        <p className="mt-10 font-body text-sm text-ink-100/60">No inquiries match this filter.</p>
      ) : null}

      {inquiries && inquiries.length > 0 ? (
        <ul className="mt-6">
          {inquiries.map((inquiry) => (
            <li
              key={inquiry.id}
              className="grid gap-3 border-t border-rule/60 py-6 first:border-t-0 sm:grid-cols-[1fr_auto] sm:items-start sm:gap-6"
            >
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="font-display text-lg font-medium text-paper">{inquiry.name}</h2>
                  {inquiry.business ? (
                    <span className="font-mono text-xs text-ink-100/50">{inquiry.business}</span>
                  ) : null}
                  <StatusBadge status={inquiry.status} />
                </div>
                <p className="mt-2 font-body text-sm leading-relaxed text-ink-100/80">
                  {inquiry.problem}
                </p>
                <p className="mt-3 font-mono text-xs text-ledger-light">{inquiry.contact}</p>
              </div>
              <p className="font-mono text-xs uppercase tracking-widest text-ink-100/40 sm:text-right">
                {formatDate(inquiry.created_at)}
              </p>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
