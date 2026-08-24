export type ProcessStep = {
  step: number;
  title: string;
  description: string;
};

export const process: ProcessStep[] = [
  {
    step: 1,
    title: "Identify",
    description:
      "You describe the problem — no website, no way to track stock, no time to update your site.",
  },
  {
    step: 2,
    title: "Diagnose",
    description: "We learn what your business does, how it works today, and what you can afford.",
  },
  {
    step: 3,
    title: "Recommend",
    description:
      "The simplest solution that actually solves the problem — not the most expensive one.",
  },
  {
    step: 4,
    title: "Build",
    description: "Designed and built around your requirements, not a generic template.",
  },
  {
    step: 5,
    title: "Deploy & train",
    description: "Your site or system goes live, and we show you exactly how to use it.",
  },
  {
    step: 6,
    title: "Support",
    description:
      "An optional monthly retainer keeps it working — a relationship, not a one-off invoice.",
  },
];
