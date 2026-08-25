import { trackEvent } from "@/lib/analytics";

const number = import.meta.env.VITE_WHATSAPP_NUMBER as string | undefined;

export function WhatsAppButton() {
  if (!number) return null;

  return (
    <a
      href={`https://wa.me/${number}`}
      target="_blank"
      rel="noreferrer"
      aria-label="Message EnochLabs on WhatsApp"
      onClick={() => trackEvent("WhatsApp Click", { location: "floating-button" })}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-ledger px-4 py-3 font-body text-sm font-semibold text-paper shadow-lg transition hover:bg-ledger-light"
    >
      <span aria-hidden>●</span>
      WhatsApp
    </a>
  );
}
