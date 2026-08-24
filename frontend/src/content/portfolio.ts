export type PortfolioItem = {
  slug: string;
  client: string;
  category: string;
  problem: string;
  solution: string;
  outcome: string;
  stack: string[];
  image: string;
  imageAlt: string;
};

export const portfolio: PortfolioItem[] = [
  {
    slug: "handyrwanda",
    client: "HandyRwanda",
    category: "Marketplace platform",
    problem:
      "Skilled artisans — welders, tailors, carpenters, leatherworkers — had no shared place to list their work, take job requests, or be found beyond word of mouth.",
    solution:
      "A two-sided marketplace: artisan profiles, a client job dashboard, authentication, and file storage, built end-to-end across the frontend and backend.",
    outcome:
      "Artisans manage their own profile, incoming job requests, and portfolio — without calling a developer for every change.",
    stack: ["React", "FastAPI", "TanStack Router", "Supabase Storage"],
    image: "/images/portfolio/handyrwanda.svg",
    imageAlt: "HandyRwanda interface preview showing an artisan's job request dashboard",
  },
  {
    slug: "pixelmind-ai",
    client: "PixelMindAI",
    category: "Business management software",
    problem:
      "Small businesses generate a steady stream of paperwork — receipts, invoices, business cards, forms — that still gets typed in by hand.",
    solution:
      "A multi-tenant document platform that reads receipts, invoices, business cards, menus, and handwritten forms and turns them into structured data, scoped for the African market from day one.",
    outcome:
      "Eight different document types can be scanned and turned into usable records automatically instead of manual re-typing.",
    stack: ["FastAPI", "React", "Computer vision / OCR", "Multi-tenant architecture"],
    image: "/images/portfolio/pixelmind-ai.svg",
    imageAlt:
      "PixelMindAI interface preview showing a scanned invoice next to its extracted fields",
  },
];
