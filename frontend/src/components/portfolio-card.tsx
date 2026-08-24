import type { PortfolioItem } from "@/content/portfolio";

export function PortfolioCard({ item }: { item: PortfolioItem }) {
  return (
    <div className="border border-rule/60 p-6">
      <p className="eyebrow">{item.category}</p>
      <h3 className="mt-2 font-display text-xl font-medium text-paper">{item.client}</h3>
      <dl className="mt-4 space-y-3 font-body text-sm leading-relaxed text-ink-100/70">
        <div>
          <dt className="font-mono text-xs uppercase tracking-widest text-ink-100/40">Problem</dt>
          <dd className="mt-1">{item.problem}</dd>
        </div>
        <div>
          <dt className="font-mono text-xs uppercase tracking-widest text-ink-100/40">Solution</dt>
          <dd className="mt-1">{item.solution}</dd>
        </div>
        <div>
          <dt className="font-mono text-xs uppercase tracking-widest text-ledger-light">Outcome</dt>
          <dd className="mt-1 text-paper">{item.outcome}</dd>
        </div>
      </dl>
    </div>
  );
}
