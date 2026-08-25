import { SectionHeading } from "@/components/section-heading";
import { ProcessSteps } from "@/components/process-steps";
import { process } from "@/content/process";
import { useDocumentTitle } from "@/lib/use-document-title";

export function About() {
  useDocumentTitle("About", "Why EnochLabs exists, and how a project with us actually works.");

  return (
    <>
      <section className="mx-auto max-w-content px-6 py-20">
        <SectionHeading eyebrow="About" title="Why EnochLabs exists" />
        <div className="mt-6 max-w-2xl space-y-4 font-body text-base leading-relaxed text-ink-100/70">
          <p>
            I&rsquo;m Enoch. I write and ship software full-time, and I&rsquo;m finishing a degree
            in Biomedical Laboratory Sciences on the side — two fields that, on paper, have nothing
            to do with each other. What they share is the same habit: look at the actual problem in
            front of you before you reach for a tool.
          </p>
          <p>
            Most of the small and growing businesses I meet in Kigali have that problem in common —
            good products, real customers, and stock or sales still tracked in a notebook. A
            website, if one exists, hasn&rsquo;t been touched in a year because there&rsquo;s no one
            on call to maintain it. The gap isn&rsquo;t ambition or demand. It&rsquo;s affordable,
            trustworthy access to people who build and stay.
          </p>
          <p>
            EnochLabs is how I close that gap. I work across the stack — React and TypeScript on the
            frontend, FastAPI and Python on the backend, Postgres and Redis underneath, and machine
            learning where a problem actually calls for it — because a shop owner doesn&rsquo;t care
            which layer their problem lives in, and neither should the person fixing it. The
            projects on the{" "}
            <a
              href="/work"
              className="text-seal underline underline-offset-4 hover:text-seal-light"
            >
              work page
            </a>{" "}
            are the same code, tools, and standards I bring to every EnochLabs engagement.
          </p>
          <p>
            Every project starts with a conversation, not a sales pitch. I&rsquo;d rather talk you
            out of a feature you don&rsquo;t need than build it and bill you for it.
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
