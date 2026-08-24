import type { ServiceCategory } from "@/content/services";

export function ServiceLedgerRow({ service }: { service: ServiceCategory }) {
  return (
    <div className="ledger-row">
      <span className="font-mono text-sm text-ink-100/40">{service.ref}</span>
      <div>
        <h3 className="font-display text-xl font-medium text-paper">{service.title}</h3>
        <p className="mt-2 max-w-xl font-body text-sm leading-relaxed text-ink-100/70">
          {service.summary}
        </p>
        <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 font-mono text-xs text-ink-100/50">
          {service.examples.map((example) => (
            <li key={example}>{example}</li>
          ))}
        </ul>
      </div>
      <span className="justify-self-start rounded-sm bg-ledger/10 px-3 py-1 font-mono text-xs text-ledger-light sm:justify-self-end">
        {service.outcome}
      </span>
    </div>
  );
}
