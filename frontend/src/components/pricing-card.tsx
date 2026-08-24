import { Link } from "react-router-dom";
import type { PricingPackage } from "@/content/pricing";

export function PricingCard({ pkg }: { pkg: PricingPackage }) {
  return (
    <div
      className={`flex h-full flex-col border p-6 ${
        pkg.featured ? "border-seal bg-ink-800" : "border-rule/60"
      }`}
    >
      <h3 className="font-display text-lg font-medium text-paper">{pkg.name}</h3>
      <p className="mt-3 font-mono text-2xl text-seal">{pkg.price}</p>
      {pkg.cadence ? (
        <p className="font-mono text-xs uppercase tracking-widest text-ink-100/40">{pkg.cadence}</p>
      ) : null}
      <p className="mt-4 font-body text-sm leading-relaxed text-ink-100/70">{pkg.description}</p>
      <ul className="mt-6 space-y-2 font-body text-sm text-ink-100/70">
        {pkg.includes.map((item) => (
          <li key={item} className="flex items-start gap-2">
            <span aria-hidden className="mt-1 text-ledger-light">
              —
            </span>
            {item}
          </li>
        ))}
      </ul>
      <Link to="/contact" className="btn-secondary mt-8 self-start">
        Get this
      </Link>
    </div>
  );
}
