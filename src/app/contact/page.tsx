import type { Metadata } from "next";
import { SectionHeading } from "@/components/section-heading";
import { ContactForm } from "@/components/contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description: "Tell EnochLabs what's not working — we'll recommend the simplest fix.",
};

const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;

export default function ContactPage() {
  return (
    <section className="mx-auto max-w-content px-6 py-20">
      <SectionHeading
        eyebrow="Contact"
        title="Tell us what's not working."
        description="A short description is enough to start — we'll ask follow-up questions if we need them."
      />

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_320px]">
        <ContactForm />

        <aside className="space-y-6 border-t border-rule/60 pt-8 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-ink-100/50">
              Prefer WhatsApp?
            </p>
            {whatsappNumber ? (
              <a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-block font-body text-ledger-light underline"
              >
                Message us directly
              </a>
            ) : (
              <p className="mt-2 font-body text-sm text-ink-100/60">
                Set <code className="font-mono">NEXT_PUBLIC_WHATSAPP_NUMBER</code> to enable this.
              </p>
            )}
          </div>
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-ink-100/50">Email</p>
            <a
              href="mailto:enockuwumukiza850@gmail.com"
              className="mt-2 inline-block font-body text-paper underline"
            >
              enockuwumukiza850@gmail.com
            </a>
          </div>
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-ink-100/50">Based in</p>
            <p className="mt-2 font-body text-sm text-ink-100/70">Kigali, Rwanda</p>
          </div>
        </aside>
      </div>
    </section>
  );
}
