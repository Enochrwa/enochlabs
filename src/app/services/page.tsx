import type { Metadata } from "next";
import { SectionHeading } from "@/components/section-heading";
import { ServiceLedgerRow } from "@/components/service-ledger-row";
import { services } from "@/lib/content/services";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Business websites, e-commerce, business management software, maintenance retainers, and digital services for individuals.",
};

export default function ServicesPage() {
  return (
    <section className="mx-auto max-w-content px-6 py-20">
      <SectionHeading
        eyebrow="Services"
        title="Five categories. One process."
        description="Every engagement starts the same way: understand the problem, then recommend the simplest solution — not the most expensive one."
      />
      <div className="mt-10">
        {services.map((service) => (
          <ServiceLedgerRow key={service.slug} service={service} />
        ))}
      </div>
    </section>
  );
}
