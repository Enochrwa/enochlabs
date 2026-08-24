import { Link } from "react-router-dom";
import { Hero } from "@/components/hero";
import { SectionHeading } from "@/components/section-heading";
import { ServiceLedgerRow } from "@/components/service-ledger-row";
import { ProcessSteps } from "@/components/process-steps";
import { services } from "@/content/services";
import { process } from "@/content/process";
import { useDocumentTitle } from "@/lib/use-document-title";

export function Home() {
  useDocumentTitle(
    "EnochLabs — Affordable digital solutions for growing businesses",
    "EnochLabs helps small and growing businesses in Rwanda establish an online presence, manage their operations, and grow — through affordable websites, business software, and ongoing support.",
  );

  return (
    <>
      <Hero />

      <section className="mx-auto max-w-content px-6 py-20">
        <SectionHeading
          eyebrow="What we do"
          title="Five ways EnochLabs helps your business run on technology instead of paper."
          description="We start by understanding the problem — then recommend the simplest solution that solves it."
        />
        <div className="mt-10">
          {services.map((service) => (
            <ServiceLedgerRow key={service.slug} service={service} />
          ))}
        </div>
      </section>

      <section className="border-t border-rule/60 bg-ink-800/40">
        <div className="mx-auto max-w-content px-6 py-20">
          <SectionHeading
            eyebrow="How it works"
            title="A relationship, not a one-off invoice."
            description="Six steps, every time — from your first message to ongoing support."
          />
          <div className="mt-10">
            <ProcessSteps steps={process} />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-content px-6 py-20">
        <div className="flex flex-col items-start justify-between gap-6 border border-rule/60 p-10 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-display text-2xl font-medium text-paper sm:text-3xl">
              Have a problem you&rsquo;d like solved?
            </h2>
            <p className="mt-2 font-body text-sm text-ink-100/70">
              Tell us what&rsquo;s not working — we&rsquo;ll recommend the simplest fix.
            </p>
          </div>
          <Link to="/contact" className="btn-primary shrink-0">
            Start a project
          </Link>
        </div>
      </section>
    </>
  );
}
