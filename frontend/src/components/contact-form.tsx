import { useState, type FormEvent } from "react";

type Status = "idle" | "sending" | "sent" | "error";

const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER as string | undefined;
const apiUrl = (import.meta.env.VITE_API_URL as string | undefined) ?? "http://localhost:8000";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setErrorMessage(null);

    const formData = new FormData(event.currentTarget);
    const payload = {
      name: formData.get("name"),
      business: formData.get("business"),
      contact: formData.get("contact"),
      problem: formData.get("problem"),
    };

    try {
      const response = await fetch(`${apiUrl}/api/v1/inquiries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.detail ?? data?.error ?? "Something went wrong.");
      }

      setStatus("sent");
      event.currentTarget.reset();
    } catch (error) {
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Something went wrong.");
    }
  }

  if (status === "sent") {
    return (
      <div className="border border-ledger/40 bg-ledger/10 p-6 font-body text-sm text-paper">
        <p className="font-display text-lg text-paper">Message sent.</p>
        <p className="mt-2 text-ink-100/70">We&rsquo;ll get back to you shortly.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="name"
          className="font-mono text-xs uppercase tracking-widest text-ink-100/50"
        >
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className="mt-2 w-full border border-rule/60 bg-transparent px-4 py-3 font-body text-paper outline-none focus-visible:border-seal"
        />
      </div>

      <div>
        <label
          htmlFor="business"
          className="font-mono text-xs uppercase tracking-widest text-ink-100/50"
        >
          Business (optional)
        </label>
        <input
          id="business"
          name="business"
          type="text"
          className="mt-2 w-full border border-rule/60 bg-transparent px-4 py-3 font-body text-paper outline-none focus-visible:border-seal"
        />
      </div>

      <div>
        <label
          htmlFor="contact"
          className="font-mono text-xs uppercase tracking-widest text-ink-100/50"
        >
          Phone, email, or WhatsApp
        </label>
        <input
          id="contact"
          name="contact"
          type="text"
          required
          className="mt-2 w-full border border-rule/60 bg-transparent px-4 py-3 font-body text-paper outline-none focus-visible:border-seal"
        />
      </div>

      <div>
        <label
          htmlFor="problem"
          className="font-mono text-xs uppercase tracking-widest text-ink-100/50"
        >
          What&rsquo;s the problem?
        </label>
        <textarea
          id="problem"
          name="problem"
          required
          rows={4}
          className="mt-2 w-full border border-rule/60 bg-transparent px-4 py-3 font-body text-paper outline-none focus-visible:border-seal"
        />
      </div>

      <button
        type="submit"
        disabled={status === "sending"}
        className="btn-primary disabled:opacity-60"
      >
        {status === "sending" ? "Sending…" : "Send message"}
      </button>

      {status === "error" ? (
        <div className="border border-seal/40 bg-seal/10 p-4 font-body text-sm text-paper">
          <p>{errorMessage}</p>
          {whatsappNumber ? (
            <a
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-block font-semibold text-seal underline"
            >
              Message us on WhatsApp instead
            </a>
          ) : null}
        </div>
      ) : null}
    </form>
  );
}
