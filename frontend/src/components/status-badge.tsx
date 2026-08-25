import type { InquiryStatus } from "@/lib/admin-api";

const styles: Record<InquiryStatus, string> = {
  new: "bg-seal/10 text-seal",
  contacted: "bg-ink-100/10 text-ink-100/80",
  closed: "bg-ledger/10 text-ledger-light",
};

export function StatusBadge({ status }: { status: InquiryStatus }) {
  return (
    <span
      className={`inline-block rounded-sm px-2 py-1 font-mono text-xs uppercase tracking-widest ${styles[status]}`}
    >
      {status}
    </span>
  );
}
