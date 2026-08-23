import type { Metadata } from "next";
import { SectionHeading } from "@/components/section-heading";
import { ProcessSteps } from "@/components/process-steps";
import { process } from "@/lib/content/process";

export const metadata: Metadata = {
  title: "About",
  description: "Why EnochLabs exists, and how a project with us actually works.",
};

export default function AboutPage() {
  return (
    <>
      <section className="mx-auto max-w-content px-6 py-20">
        <SectionHeading eyebrow="About" title="Why EnochLabs exists" />
        <div className="mt-6 max-w-2xl space-y-4 font-body text-base leading-relaxed text-ink-100/70">
          <p>
            Many small and growing businesses in Rwanda have good products and real customers, but
            limited access to affordable technology. Stock gets tracked in a notebook. Customers
            find out about a business through word of mouth or a WhatsApp status. A website, if one
            exists, hasn&rsquo;t been touched in a year because there&rsquo;s no one to maintain it.
          </p>
          <p>
            EnochLabs exists to close that gap — with solutions that are affordable, practical, and
            built around how the business actually works, not a one-size-fits-all package.
          </p>
          <p>
            EnochLabs is built and run by Enoch, based in Kigali. Every project starts with a
            conversation, not a sales pitch.
          </p>
        </div>
      </section>

      <section className="border-t border-rule/60 bg-ink-800/40">
        <div className="mx-auto max-w-content px-6 py-20">
          <SectionHeading
            eyebrow="How it works"
            title="Every project follows the same six steps."
          />
          <div className="mt-10">
            <ProcessSteps steps={process} />
          </div>
        </div>
      </section>
    </>
  );
}
