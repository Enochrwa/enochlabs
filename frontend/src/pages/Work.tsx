import { SectionHeading } from "@/components/section-heading";
import { PortfolioCard } from "@/components/portfolio-card";
import { portfolio } from "@/content/portfolio";
import { useDocumentTitle } from "@/lib/use-document-title";

export function Work() {
  useDocumentTitle("Work", "Real projects — the problem, the solution, and the outcome.");

  return (
    <section className="mx-auto max-w-content px-6 py-20">
      <SectionHeading
        eyebrow="Work"
        title="Real problems, real fixes."
        description="A growing record of platforms Enoch has designed and built solo — the same standard EnochLabs brings to every client engagement. Full source history is public on GitHub."
      />
      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {portfolio.map((item) => (
          <PortfolioCard key={item.slug} item={item} />
        ))}
      </div>
      <p className="mt-10 font-body text-sm text-ink-100/60">
        Want to see the code behind these?{" "}
        <a
          href="https://github.com/Enochrwa"
          target="_blank"
          rel="noreferrer"
          className="text-seal underline underline-offset-4 hover:text-seal-light"
        >
          Browse the GitHub profile
        </a>
        .
      </p>
    </section>
  );
}
