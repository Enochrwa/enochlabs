# High-Level Design (HLD)

## 1. Purpose

EnochLabs is, first, a **marketing and lead-generation platform** for a digital-services
business, and, over time, a **host for the SaaS products** that emerge from repeated
client needs (starting with a small-business inventory/sales tool — see
[`docs/ROADMAP.md`](./ROADMAP.md)). This document describes the system at a level a new
contributor or technical partner can use to understand how the pieces fit together.

## 2. Goals & non-goals

**Goals**

- Present EnochLabs credibly to a first-time visitor within seconds (who it's for, what
  it solves, how to start).
- Convert visitors into inquiries via low-friction channels (WhatsApp, contact form).
- Showcase real work (portfolio/case studies) and clear, honest pricing.
- Stay cheap to run and fast to iterate on — this is a bootstrapped business, not a
  funded one.
- Be architected so that Phase 2+ (client portal, SaaS products) can be added without a
  rewrite.

**Non-goals (for the current phase)**

- Multi-tenant SaaS infrastructure — deferred until a specific product is validated by
  repeated client demand.
- Payments/billing integration — deferred until a subscription product exists.
- CMS/editorial workflow — content starts as versioned code (MDX/JSON) since the team is
  one person; a headless CMS is an upgrade path, not a launch requirement.

## 3. System context

```
                 ┌────────────────────────────────────────────┐
                 │                 Visitors                    │
                 │  (business owners, individuals, partners)   │
                 └───────────────────────┬──────────────────────┘
                                          │  HTTPS
                                          ▼
                 ┌────────────────────────────────────────────┐
                 │              enochlabs.dev (Next.js)         │
                 │  ┌────────────┐  ┌────────────┐  ┌────────┐ │
                 │  │ Marketing  │  │  Contact /  │  │Portfolio│ │
                 │  │  pages     │  │  inquiry API│  │/ Case   │ │
                 │  │ (App Router│  │  route      │  │studies │ │
                 │  │  RSC)      │  │             │  │         │ │
                 │  └────────────┘  └──────┬──────┘  └────────┘ │
                 └───────────────────────────┼──────────────────┘
                                              │
                        ┌─────────────────────┼─────────────────────┐
                        ▼                     ▼                     ▼
                 ┌────────────┐      ┌────────────────┐    ┌────────────────┐
                 │  WhatsApp   │      │ Email / form    │    │ Analytics       │
                 │  deep link  │      │ backend (e.g.   │    │ (privacy-       │
                 │             │      │ Resend/Formspree│    │ friendly, e.g.  │
                 │             │      │  or a serverless│    │ Plausible)      │
                 │             │      │  function)      │    │                 │
                 └────────────┘      └────────────────┘    └────────────────┘
```

## 4. Architecture decisions

| Decision | Choice | Rationale |
| --- | --- | --- |
| Framework | Next.js 14 (App Router, TypeScript) | Server components keep the marketing site fast and SEO-friendly; API routes cover the contact flow without a separate backend; one deploy target keeps ops simple for a solo founder. |
| Styling | Tailwind CSS + design tokens in `tailwind.config.ts` | Fast iteration, and the token file doubles as the single source of truth for the brand system (see `docs/BRAND-GUIDELINES.md`). |
| Content | Local TypeScript/MDX data under `src/lib/content` | No CMS cost/complexity for a single-editor site; typed content catches broken links/data at build time. |
| Hosting | Vercel (or any Node-capable host) | Zero-config Next.js deploys, preview URLs per PR, generous free tier for a bootstrapped business. |
| CI | GitHub Actions (`ci.yml`) | Lint, typecheck, and build gate every PR before merge. |
| CD | GitHub Actions (`deploy.yml`) → Vercel | `main` auto-deploys to production once secrets are configured (see `docs/DEPLOYMENT.md`). |

## 5. Phased evolution

1. **Phase 1 — Marketing site (this repo, current scope).** Home, services, portfolio,
   pricing, about, contact. Single Next.js app.
2. **Phase 2 — Client workspace.** Lightweight authenticated area where a client can see
   project status, invoices, and support requests. Likely a new route group
   (`/app/(portal)`) plus a database (e.g. Postgres via a managed provider).
3. **Phase 3 — First SaaS product.** Extracted into its own package/app once a specific
   tool (e.g. inventory management) has proven repeat demand across clients, so it can
   version and scale independently of the marketing site.

## 6. Non-functional requirements

- **Performance:** Lighthouse performance ≥ 90 on the home page; images optimized via
  `next/image`.
- **Accessibility:** Keyboard-navigable, visible focus states, semantic landmarks,
  color contrast AA minimum against the token palette.
- **Reliability:** Static/ISR pages for content that rarely changes; the contact API
  route fails loudly (never silently drops an inquiry) and always gives the visitor a
  WhatsApp fallback.
- **Cost:** Runs within free tiers (Vercel Hobby, a free-tier form/email provider) at
  current traffic levels.

## 7. Related documents

- [`docs/LLD.md`](./LLD.md) — component/route/data-model detail.
- [`docs/BRAND-GUIDELINES.md`](./BRAND-GUIDELINES.md) — design tokens and voice.
- [`docs/ROADMAP.md`](./ROADMAP.md) — sequencing and milestones.
- [`docs/DEPLOYMENT.md`](./DEPLOYMENT.md) — CI/CD and hosting setup.
