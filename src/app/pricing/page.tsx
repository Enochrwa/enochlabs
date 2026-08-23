import type { Metadata } from "next";
import { SectionHeading } from "@/components/section-heading";
import { PricingCard } from "@/components/pricing-card";
import { pricing } from "@/lib/content/pricing";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Straightforward starting prices for websites, business software, and maintenance retainers.",
};

export default function PricingPage() {
  return (
    <section className="mx-auto max-w-content px-6 py-20">
      <SectionHeading
        eyebrow="Pricing"
        title="No hidden fees. No inflated quotes."
        description="Starting prices below — final scope depends on what your business actually needs. Every project starts with a conversation, not a quote."
      />
      <div className="mt-10 grid gap-6 sm:grid-cols-3">
        {pricing.map((pkg) => (
          <PricingCard key={pkg.slug} pkg={pkg} />
        ))}
      </div>
      <p className="mt-8 max-w-xl font-body text-sm text-ink-100/60">
        Individual digital services (portfolios, CVs, presentations, document work) are priced per
        request — reach out and we&rsquo;ll quote it directly.
      </p>
    </section>
  );
}
