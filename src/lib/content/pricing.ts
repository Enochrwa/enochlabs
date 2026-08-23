export type PricingPackage = {
  slug: string;
  name: string;
  price: string;
  cadence?: string;
  description: string;
  includes: string[];
  featured?: boolean;
};

export const pricing: PricingPackage[] = [
  {
    slug: "website",
    name: "Business website",
    price: "50,000 – 150,000 RWF",
    cadence: "per project",
    description: "A professional site your customers can find and trust.",
    includes: [
      "Up to 5 pages",
      "Mobile responsive",
      "WhatsApp & maps integration",
      "Basic SEO setup",
    ],
  },
  {
    slug: "software",
    name: "Business software",
    price: "Custom quote",
    cadence: "per project",
    description: "Inventory, sales, or customer management, scoped to how you work.",
    includes: [
      "Requirements workshop",
      "Built around your workflow",
      "Training included",
      "Source you own",
    ],
    featured: true,
  },
  {
    slug: "maintenance",
    name: "Maintenance retainer",
    price: "20,000 – 75,000 RWF",
    cadence: "per month",
    description: "Ongoing support so your site or system keeps working.",
    includes: ["Content updates", "Bug fixes", "Monitoring", "Priority response"],
  },
];
