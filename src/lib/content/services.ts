export type ServiceCategory = {
  ref: string;
  slug: string;
  title: string;
  summary: string;
  examples: string[];
  outcome: string;
};

export const services: ServiceCategory[] = [
  {
    ref: "01",
    slug: "websites",
    title: "Business websites",
    summary:
      "A professional online identity — menu, rooms, services, hours, location, and a way for customers to reach you.",
    examples: ["Restaurants & hotels", "Salons & clinics", "Schools & NGOs"],
    outcome: "Found online",
  },
  {
    ref: "02",
    slug: "ecommerce",
    title: "E-commerce & product presentation",
    summary:
      "Customers browse, search, and request products — with WhatsApp ordering built in from day one.",
    examples: ["Product catalogs", "Price lists", "WhatsApp checkout"],
    outcome: "More orders",
  },
  {
    ref: "03",
    slug: "software",
    title: "Business management software",
    summary:
      "Replace the notebook: stock, sales, customers, expenses, invoicing, and a dashboard that shows what's happening.",
    examples: ["Inventory tracking", "Sales & invoicing", "Reporting dashboards"],
    outcome: "Fewer errors",
  },
  {
    ref: "04",
    slug: "maintenance",
    title: "Maintenance & support",
    summary:
      "A monthly retainer that keeps your site or system working — updates, fixes, monitoring, small improvements.",
    examples: ["Content updates", "Bug fixes", "Uptime monitoring"],
    outcome: "Peace of mind",
  },
  {
    ref: "05",
    slug: "individual",
    title: "Digital services for individuals",
    summary:
      "Portfolios, CVs, presentations, and document or data work for students, researchers, and job seekers.",
    examples: ["Portfolio sites", "CV websites", "Slides & documents"],
    outcome: "Ready to send",
  },
];
