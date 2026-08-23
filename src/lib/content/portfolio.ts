export type PortfolioItem = {
  slug: string;
  client: string;
  category: string;
  problem: string;
  solution: string;
  outcome: string;
};

export const portfolio: PortfolioItem[] = [
  {
    slug: "seed-project-one",
    client: "Local shop (seed project)",
    category: "Business website",
    problem: "No online presence — relied entirely on word of mouth.",
    solution: "A five-page site with product catalog, WhatsApp ordering, and map/location.",
    outcome: "Customers can now find and message the shop directly.",
  },
  {
    slug: "seed-project-two",
    client: "Small restaurant (seed project)",
    category: "Business website",
    problem: "Menu and hours changed often; customers kept calling to check.",
    solution: "A simple site with an editable menu, hours, and a WhatsApp reservation button.",
    outcome: "Fewer repeat calls; menu updates take minutes, not days.",
  },
];
