# High-Level Design (HLD)

## 1. Purpose

EnochLabs is, first, a **marketing and lead-generation platform** for a digital-services
business, and, over time, a **host for the SaaS products** that emerge from repeated
client needs (starting with a small-business inventory/sales tool — see
`docs/ROADMAP.md` and `docs/SPRINT-PLAN.md`). This document describes the system at a
level a new contributor or technical partner can use to understand how the pieces fit
together.

As of this revision, the project is a **decoupled frontend/backend monorepo**:
a React SPA (`frontend/`) talking to a FastAPI service (`backend/`) backed by
PostgreSQL, rather than a single full-stack Next.js app. See §4 for the rationale.

## 2. Goals & non-goals

**Goals**

- Present EnochLabs credibly to a first-time visitor within seconds (who it's for, what
  it solves, how to start).
- Convert visitors into inquiries via low-friction channels (WhatsApp, contact form) —
  inquiries are now durably stored in PostgreSQL via the backend API, not just relayed
  by email.
- Showcase real work (portfolio/case studies) and clear, honest pricing.
- Stay cheap to run and fast to iterate on — this is a bootstrapped business, not a
  funded one.
- Give the backend a real foundation (Postgres + migrations + typed API) so Phase 2+
  features (client portal, SaaS products, admin views of inquiries) build on solid
  ground instead of a rewrite.

**Non-goals (for the current phase)**

- Multi-tenant SaaS infrastructure — deferred until a specific product is validated by
  repeated client demand.
- Payments/billing integration — deferred until a subscription product exists.
- Authentication/authorization — deferred until the client portal (Phase 3) needs it;
  the current backend exposes one public, unauthenticated endpoint (`POST /inquiries`)
  plus a health check.
- CMS/editorial workflow — content starts as versioned code (TypeScript content modules)
  since the team is one person; a headless CMS is an upgrade path, not a launch
  requirement.

## 3. System context

```
                 ┌────────────────────────────────────────────┐
                 │                 Visitors                    │
                 │  (business owners, individuals, partners)   │
                 └───────────────────────┬──────────────────────┘
                                          │  HTTPS
                                          ▼
                 ┌────────────────────────────────────────────┐
                 │      frontend/ — React + TypeScript SPA      │
                 │        (Vite build, static hosting)          │
                 │  ┌────────────┐  ┌────────────┐  ┌────────┐ │
                 │  │ Marketing  │  │  Contact    │  │Portfolio│ │
                 │  │  pages     │  │  form       │  │/ Work   │ │
                 │  │ (React     │  │ (posts to   │  │ pages   │ │
                 │  │  Router)   │  │  backend)   │  │         │ │
                 │  └────────────┘  └──────┬──────┘  └────────┘ │
                 └───────────────────────────┼──────────────────┘
                                              │ REST (JSON) over HTTPS
                                              ▼
                 ┌────────────────────────────────────────────┐
                 │        backend/ — FastAPI service            │
                 │  ┌────────────┐  ┌────────────┐  ┌────────┐ │
                 │  │ /api/v1/   │  │ /api/v1/    │  │ CORS + │ │
                 │  │ health     │  │ inquiries   │  │ config │ │
                 │  └────────────┘  └──────┬──────┘  └────────┘ │
                 └───────────────────────────┼──────────────────┘
                                              │ SQLAlchemy / Alembic
                                              ▼
                                    ┌──────────────────┐
                                    │   PostgreSQL       │
                                    │   (inquiries, ...) │
                                    └──────────────────┘
                                              │
                                              ▼ (optional, best-effort)
                                    ┌──────────────────┐
                                    │  Notify webhook    │
                                    │  (email/Slack/etc) │
                                    └──────────────────┘
```

## 4. Architecture decisions

| Decision | Choice | Rationale |
| --- | --- | --- |
| Repo shape | Monorepo: `frontend/` + `backend/` | One repo, one PR history, one place for docs — but each side deploys, versions, and scales independently, which a growing services-then-SaaS business needs (see `docs/ROADMAP.md` Phase 3–4). |
| Frontend framework | React 18 + TypeScript + Vite, client-side routed with React Router | A pure SPA is the right shape once the backend owns all dynamic data — no need for Next.js SSR/API routes once FastAPI exists. Vite gives fast local dev and a small, fully static production build (deployable to any static host/CDN). |
| Frontend styling | Tailwind CSS (design tokens) + Radix UI primitives | Tailwind keeps the token system from `docs/BRAND-GUIDELINES.md` as the single source of truth; Radix supplies accessible, unstyled interaction primitives (menus, dialogs) for Phase 2+ UI without pulling in a heavy component framework. |
| Fonts | Self-hosted via `@fontsource` packages | No runtime or build-time network dependency on Google Fonts — faster, more reliable builds, works offline/in restricted CI sandboxes. |
| Backend framework | FastAPI (Python 3.12) | Typed request/response models (Pydantic) generate OpenAPI docs for free; async-capable; small, fast, easy for a solo founder to reason about end-to-end. |
| Database | PostgreSQL, accessed via SQLAlchemy 2.0 + Alembic migrations | Relational data (inquiries now; clients, projects, invoices, subscriptions later) fits a relational model well; Alembic gives reviewable, versioned schema history from day one. |
| API shape | REST, versioned under `/api/v1` | Simple, well-understood, easy to document via FastAPI's automatic OpenAPI/Swagger UI at `/docs`. |
| Hosting | Frontend: Vercel (config committed in `frontend/vercel.json`), portable to Netlify/Cloudflare Pages via `frontend/public/_redirects`. Backend: Render via the committed `render.yaml` Blueprint (provisions Postgres + the API together), portable to any container host via `backend/Dockerfile`. | Keeps both sides on generous free/cheap tiers appropriate for a bootstrapped business. The committed config makes the "recommended path" a few dashboard clicks, not a rebuild — see `docs/DEPLOYMENT.md`. |
| CI | GitHub Actions, split by workspace (`ci-frontend.yml`, `ci-backend.yml`) | Each side lints/typechecks/tests/builds independently and only runs when its own files change — faster feedback, no cross-contamination of failures. |
| CD | GitHub Actions → target hosts (`deploy-frontend.yml`, `deploy-backend.yml`) | Independent deploys: shipping a copy change on the site never requires redeploying the API, and vice versa. |

## 5. Phased evolution

1. **Phase 1 — Marketing site + inquiry API (this repo, current scope).** React SPA
   (Home, Services, Work, Pricing, About, Contact) talking to a FastAPI backend that
   durably stores inquiries in Postgres.
2. **Phase 2 — Client workspace.** Authenticated area where a client can see project
   status, invoices, and support requests. New backend routes + auth (e.g. JWT or
   session-based), and new frontend routes behind a login.
3. **Phase 3 — First SaaS product.** Extracted into its own service/app once a specific
   tool (e.g. inventory management) has proven repeat demand across clients, so it can
   version and scale independently of both the marketing site and the core API.

Full sprint-by-sprint breakdown: `docs/SPRINT-PLAN.md`.

## 6. Non-functional requirements

- **Performance:** Frontend Lighthouse performance ≥ 90 on the home page; Vite's
  production build code-splits and tree-shakes automatically. Backend responses for
  `/api/v1/inquiries` under 300ms p95 under normal load.
- **Accessibility:** Keyboard-navigable, visible focus states, semantic landmarks,
  color contrast AA minimum against the token palette (Radix primitives help here for
  any future interactive components).
- **Reliability:** The inquiry endpoint fails loudly (never silently drops an inquiry —
  it either persists to Postgres and returns 201, or returns a real error status); the
  frontend always gives the visitor a WhatsApp fallback if the API call fails.
- **Data integrity:** All schema changes go through Alembic migrations, reviewed in PRs
  — no manual/ad-hoc schema edits against production.
- **Cost:** Runs within free/low tiers (a static frontend host + a small Postgres
  instance + a small container for the API) at current traffic levels.

## 7. Related documents

- [`docs/LLD.md`](./LLD.md) — component/route/data-model detail for both frontend and
  backend.
- [`docs/BRAND-GUIDELINES.md`](./BRAND-GUIDELINES.md) — design tokens and voice.
- [`docs/ROADMAP.md`](./ROADMAP.md) — high-level phase sequencing.
- [`docs/SPRINT-PLAN.md`](./SPRINT-PLAN.md) — sprint-by-sprint delivery plan.
- [`docs/DEPLOYMENT.md`](./DEPLOYMENT.md) — CI/CD and hosting setup for both services.
