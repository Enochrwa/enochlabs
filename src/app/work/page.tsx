import type { Metadata } from "next";
import { SectionHeading } from "@/components/section-heading";
import { PortfolioCard } from "@/components/portfolio-card";
import { portfolio } from "@/lib/content/portfolio";

export const metadata: Metadata = {
  title: "Work",
  description: "Recent projects — the problem, the solution, and the outcome.",
};

export default function WorkPage() {
  return (
    <section className="mx-auto max-w-content px-6 py-20">
      <SectionHeading
        eyebrow="Work"
        title="Real problems, real fixes."
        description="A growing record of projects — each one starts with a problem, not a template."
      />
      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {portfolio.map((item) => (
          <PortfolioCard key={item.slug} item={item} />
        ))}
      </div>
    </section>
  );
}
