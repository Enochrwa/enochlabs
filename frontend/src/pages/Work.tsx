import { SectionHeading } from "@/components/section-heading";
import { PortfolioCard } from "@/components/portfolio-card";
import { portfolio } from "@/content/portfolio";
import { useDocumentTitle } from "@/lib/use-document-title";

export function Work() {
  useDocumentTitle("Work", "Recent projects — the problem, the solution, and the outcome.");

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
