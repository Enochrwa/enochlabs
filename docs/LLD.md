# Low-Level Design (LLD)

Companion to [`docs/HLD.md`](./HLD.md). Describes the repo layout, routes, components,
and data shapes for the Phase 1 marketing site.

## 1. Repository layout

```
enochlabs/
├── .github/
│   ├── workflows/          CI (lint/typecheck/build) and CD (Vercel deploy)
│   ├── ISSUE_TEMPLATE/
│   └── PULL_REQUEST_TEMPLATE.md
├── docs/                    HLD, LLD, brand, roadmap, deployment, business overview
├── public/                  Static assets (favicon, og-image, logo marks)
├── src/
│   ├── app/                 Next.js App Router: routes, layouts, API routes
│   ├── components/          Reusable UI building blocks
│   ├── lib/
│   │   ├── content/         Typed content: services, portfolio, pricing, testimonials
│   │   └── utils/           Formatting/helpers
│   └── styles/              globals.css (Tailwind layers, base styles, font-face)
├── .editorconfig, .eslintrc.json, .prettierrc.json, .prettierignore
├── tailwind.config.ts, postcss.config.mjs, next.config.mjs, tsconfig.json
└── package.json
```

## 2. Route map (`src/app`)

| Route | File | Purpose |
| --- | --- | --- |
| `/` | `app/page.tsx` | Home — hero, problem/solution, services summary, proof, CTA. |
| `/services` | `app/services/page.tsx` | Full breakdown of the five service categories. |
| `/work` | `app/work/page.tsx` | Portfolio / case studies. |
| `/pricing` | `app/pricing/page.tsx` | Starting packages per `docs/BUSINESS-OVERVIEW.md` §Revenue streams. |
| `/about` | `app/about/page.tsx` | Founder story, how EnochLabs works (the 6-step engagement flow). |
| `/contact` | `app/contact/page.tsx` | Contact form + WhatsApp deep link, rendered client-side. |
| `/api/inquiry` | `app/api/inquiry/route.ts` | `POST` handler that validates and forwards a contact-form submission. |
| `/sitemap.xml`, `/robots.txt` | `app/sitemap.ts`, `app/robots.ts` | Generated via Next.js metadata routes. |

Shared chrome (`<Header>`, `<Footer>`, WhatsApp floating action button) lives in
`app/layout.tsx`.

## 3. Core components (`src/components`)

- `Header` / `Footer` — navigation, brand mark, contact links.
- `Hero` — the ledger-to-dashboard signature moment (see brand guidelines).
- `SectionHeading` — eyebrow + heading + supporting copy, reused per section.
- `ServiceLedgerRow` — one row per service category, styled as a ledger line-item
  (number column, description, outcome tag) — see `docs/BRAND-GUIDELINES.md` for why.
- `ProcessSteps` — renders the 6-step engagement flow as a real, ordered sequence.
- `PricingCard` — one package (starting price, what's included, CTA).
- `PortfolioCard` — one case study (thumbnail, problem solved, outcome, link).
- `WhatsAppButton` — persistent floating CTA using `NEXT_PUBLIC_WHATSAPP_NUMBER`.
- `ContactForm` — client component; posts to `/api/inquiry`, has a WhatsApp fallback if
  the request fails.

## 4. Content model (`src/lib/content`)

Typed, versioned-in-code content — no CMS in Phase 1 (see HLD §4). Example shapes:

```ts
// src/lib/content/services.ts
export type ServiceCategory = {
  slug: string;
  title: string;
  summary: string;
  examples: string[];
  startingPrice?: string;
};

// src/lib/content/portfolio.ts
export type CaseStudy = {
  slug: string;
  client: string;
  problem: string;
  solution: string;
  outcome: string;
  href?: string;
  image: string;
};
```

Editing content is a code change (PR + CI + preview deploy) — intentional at this scale:
it keeps content correctness checked by TypeScript and reviewable in git history.

## 5. Contact/inquiry flow

1. Visitor submits `ContactForm` (name, business, problem, contact method).
2. Client calls `POST /api/inquiry`.
3. Route handler validates the payload (zod or manual checks), then forwards to
   `CONTACT_FORM_ENDPOINT` (an email/relay provider) using the server-only env var.
4. On success: confirmation state in the form. On failure: the form surfaces the
   WhatsApp deep link (`https://wa.me/<NEXT_PUBLIC_WHATSAPP_NUMBER>`) as a guaranteed
   fallback — an inquiry must never be a dead end.

## 6. Environment & config

See `.env.example` for the full list. Required for a working contact flow:
`NEXT_PUBLIC_WHATSAPP_NUMBER`, `CONTACT_FORM_ENDPOINT`. `NEXT_PUBLIC_SITE_URL` feeds
`app/sitemap.ts` and Open Graph metadata.

## 7. Testing/quality gates

- `npm run lint` — ESLint (`next/core-web-vitals` + Prettier compatibility).
- `npm run typecheck` — `tsc --noEmit`.
- `npm run format:check` — Prettier, including Tailwind class sorting.
- `npm run build` — production build; also the CI gate in `.github/workflows/ci.yml`.

Component-level tests are intentionally deferred until interactive logic (contact form
validation, future portal) exists beyond presentational components — see
`docs/ROADMAP.md` for when a test runner is introduced.
