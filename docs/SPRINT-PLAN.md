# Sprint Plan

Companion to [`docs/ROADMAP.md`](./ROADMAP.md) (phase-level) and
[`docs/HLD.md`](./HLD.md) (architecture). This document breaks the whole project down
into concrete, two-week sprints from repo initialization through the first SaaS
product, for a solo founder-developer (Enoch) working part-time alongside other
commitments.

## How to use this plan

- **Sprint length:** 2 weeks. Adjust pace, not scope order — if a sprint runs long,
  push the next one out rather than cutting corners on Definition of Done.
- **One active phase at a time.** Don't start Phase 2 client-facing work before Phase
  1's exit criterion (a real inquiry, end-to-end, stored in production Postgres) is
  actually met.
- **Every sprint ends with something deployed**, not just code merged — a sprint isn't
  "done" until it's live and checked in production, however small.
- Status markers: ✅ done · 🔜 next up · ⬜ not started.

---

## Phase 1 — Marketing site & inquiry API

**Goal:** a stranger can land on the site, understand what EnochLabs does in under 10
seconds, and reach Enoch through WhatsApp or a contact form whose submissions are
durably stored.

### Sprint 0 — Repo foundation ✅

*Status: complete.*

- [x] Repo cloned, git identity configured.
- [x] Monorepo structure: `frontend/` (React + TypeScript + Vite + Tailwind) and
      `backend/` (FastAPI + PostgreSQL + SQLAlchemy + Alembic).
- [x] Design system defined and implemented (`docs/BRAND-GUIDELINES.md`): the
      "ledger becoming a dashboard" concept, color/type tokens, component patterns.
- [x] All six marketing pages built (Home, Services, Work, Pricing, About, Contact)
      with routing, shared layout, and typed content modules.
- [x] Backend scaffold: health check, `POST /api/v1/inquiries` endpoint, Postgres
      model + migration, service-layer separation, CORS.
- [x] Tooling: ESLint/Prettier/Tailwind (frontend), ruff/mypy/pytest (backend),
      `docker-compose.yml` for local dev.
- [x] Docs: business overview, HLD, LLD, brand guidelines, roadmap, this sprint plan.
- [x] Repo hygiene: LICENSE, SECURITY.md, CONTRIBUTING.md, issue/PR templates,
      CODEOWNERS.

**Definition of Done:** `npm run lint/typecheck/build` (frontend) and
`ruff check . && mypy app && pytest` (backend) all pass locally. Verified in this
sprint.

### Sprint 1 — CI/CD and first deploy 🔜

**Goal:** every PR is gated by CI, and both services are live on the public internet.

- [x] Split CI into `ci-frontend.yml` / `ci-backend.yml`, path-scoped.
- [x] `deploy-frontend.yml`: static build → Vercel, with an automatic post-deploy
      smoke test. `frontend/vercel.json` adds the SPA rewrite rule client-side routing
      needs (without it, refreshing `/services` in production 404s);
      `frontend/public/_redirects` gives Netlify/Cloudflare Pages the same fallback.
- [x] `deploy-backend.yml`: container build → GHCR + generic deploy-hook, for any
      non-Render host.
- [x] `render.yaml` — a Render Blueprint that provisions the backend web service
      **and** a managed Postgres instance together as infrastructure-as-code, with
      `DATABASE_URL` wired automatically and `alembic upgrade head` running as a
      pre-deploy step on every deploy. This is the recommended path (see
      `docs/DEPLOYMENT.md`) and covers "provision production Postgres" and "run
      migrations" without any manual dashboard clicking beyond connecting the repo.
- [x] `CORS_ORIGINS` reworked to accept a plain comma-separated string (was
      JSON-only), so it pastes cleanly into a hosting dashboard as one line.
- [x] `scripts/smoke-test.sh` (+ `make smoke-test`) — checks a deployed
      frontend/backend are serving traffic, and can optionally submit a real test
      inquiry end-to-end. Wired into both deploy workflows.
- [x] Root `Makefile` added for common dev/CI tasks across both services.
- [ ] **Requires your own accounts/credentials — not something I can do from here:**
      actually connect a Render account (Blueprint apply) and a Vercel account to this
      repo, set the `sync: false` env vars (`CORS_ORIGINS`, `INQUIRY_NOTIFY_WEBHOOK`)
      and Vercel env vars (`VITE_API_URL`, `VITE_WHATSAPP_NUMBER`) in each dashboard,
      and point a real domain at the frontend (and a subdomain, e.g. `api.`, at the
      backend). Exact steps for all of this are in `docs/DEPLOYMENT.md`.
- [ ] Smoke test against the real production URLs once live (the tooling is ready;
      running it against a live deployment is the last step above).

**Definition of Done:** `enochlabs.dev` (or chosen domain) is live, the contact form
write path works end-to-end in production, and a push to `main` in either `frontend/`
or `backend/` auto-deploys just that service. All CI/CD/IaC tooling for this is now
committed; what remains is account-level setup only you can perform (see checklist
above and `docs/DEPLOYMENT.md`).

### Sprint 2 — Content & credibility

**Goal:** the site stops looking like a scaffold and starts looking like a real
business.

- [ ] Replace seed portfolio entries with 1–2 real projects (even small ones) — real
      screenshots, real outcomes.
- [ ] Write real About-page copy in Enoch's own voice (beyond the current draft).
- [ ] Add Open Graph/social preview image reflecting the brand system.
- [ ] Basic on-page SEO pass: meta descriptions per page (already wired via
      `useDocumentTitle`), sensible page titles, sitemap/robots for the SPA (prerender
      or a static sitemap.xml served alongside the build).
- [ ] Cross-browser/device pass: verify layout on a real low-end Android phone (primary
      expected visitor device in this market) and slow 3G throttling.

**Definition of Done:** a first-time visitor on a mid-range Android phone can read the
whole site comfortably, and at least one real project is showcased.

### Sprint 3 — Inquiry reliability & notifications

**Goal:** Enoch never misses an inquiry.

- [ ] Configure `INQUIRY_NOTIFY_WEBHOOK` against a real channel (email relay or
      Slack/Telegram webhook) so new inquiries page Enoch immediately.
- [ ] Add basic rate-limiting/spam protection to `POST /api/v1/inquiries` (e.g. a
      honeypot field + simple IP throttling) — cheap, no CAPTCHA dependency yet.
- [ ] Add a minimal admin-only `GET /api/v1/inquiries` (list) endpoint, protected by a
      simple shared-secret header for now (full auth arrives in Phase 3).
- [ ] Build a tiny internal-only view (could be a single authenticated page, or even a
      protected API consumed via a REST client) to review inquiries without touching
      the database directly.

**Definition of Done:** Enoch gets notified within minutes of a real inquiry, and can
review all past inquiries without `psql`.

### Sprint 4 — Analytics & polish

**Goal:** know whether the site is working, and fix what analytics reveals.

- [ ] Add privacy-friendly analytics (e.g. Plausible) via `VITE_PLAUSIBLE_DOMAIN`.
- [ ] Instrument key events: contact form submit, WhatsApp click, pricing page view.
- [ ] Lighthouse pass ≥ 90 performance/accessibility/best-practices on the home page;
      fix what's flagged.
- [ ] `prefers-reduced-motion` and keyboard-navigation pass across all interactive
      elements (see `docs/BRAND-GUIDELINES.md` §Accessibility floor).

**Definition of Done:** Phase 1 exit criterion from `docs/ROADMAP.md` is met — a
stranger can land, understand, and reach Enoch — and it's measurable, not just assumed.

---

## Phase 2 — First paying service clients

**Goal:** at least one client on a monthly maintenance retainer.

### Sprint 5 — Sales-ready pricing & process

- [ ] Validate `/pricing` numbers against 2–3 real client conversations; adjust if the
      market says otherwise.
- [ ] Formalize the maintenance-retainer offering with a simple written scope (what's
      included, response-time expectations) — linked from `/pricing`.
- [ ] Add a lightweight "request a quote" path distinct from the general contact form,
      if client conversations show people want to skip straight to pricing questions.

**Definition of Done:** Enoch can send a prospective client a link, not a paragraph, to
explain pricing and scope.

### Sprint 6 — Inquiry-to-client pipeline

- [ ] Track inquiries through to close using the Sprint 3 admin view — no new tooling
      unless volume genuinely demands it (a spreadsheet/Notion board is fine per
      `docs/ROADMAP.md`).
- [ ] Add a `status` transition (`new → contacted → closed`) to the inquiry admin view
      built in Sprint 3 (the `Inquiry.status` field already exists in the data model).
- [ ] Collect and publish a testimonial or two on `/work` once a project ships.

**Definition of Done:** Phase 2 exit criterion — at least one client on a monthly
maintenance retainer, tracked from first inquiry through to signed engagement.

---

## Phase 3 — Client workspace

**Goal:** a client can self-serve their project status without a WhatsApp message.

### Sprint 7 — Auth foundation

- [ ] Add authentication to the backend (JWT-based session, `passlib`/`bcrypt` for
      password hashing, or magic-link email auth to avoid password management
      entirely — decide based on client sophistication).
- [ ] New tables/migrations: `clients`, `projects` (or similar), linked to `inquiries`
      where relevant.
- [ ] Protect the Sprint 3 admin inquiry view with real auth instead of a shared
      secret.

**Definition of Done:** Enoch can log in; the old shared-secret admin access is
retired.

### Sprint 8 — Client-facing portal (read-only)

- [ ] New frontend route group (e.g. `/portal`) behind login.
- [ ] Client can view their project(s): status, a simple timeline/notes.
- [ ] Client can view and download invoices (even if invoice creation stays manual on
      Enoch's side for now — the point is visibility, not automated billing yet).

**Definition of Done:** a real client logs in and sees accurate, current information
about their project without asking Enoch directly.

### Sprint 9 — Support requests in-portal

- [ ] Client can submit a support/maintenance request from the portal instead of
      WhatsApp (feeds the same notify-webhook pattern from Sprint 3).
- [ ] Enoch can respond/update status from the admin view.

**Definition of Done:** Phase 3 exit criterion met — support requests flow through the
portal for at least one active client.

---

## Phase 4 — First SaaS product

**Goal:** the same product serves more than one paying subscriber without per-client
code changes.

### Sprint 10 — Product selection & scoping

- [ ] Review inquiries/projects to date; identify the most-requested recurring
      solution (the business overview's working example: small-business inventory
      management).
- [ ] Write a lean HLD/LLD for that specific product (new docs, e.g.
      `docs/products/inventory-hld.md`) — don't retrofit this sprint plan's docs for
      product-specific detail.
- [ ] Decide extraction shape: new top-level directory in this monorepo (e.g.
      `products/inventory/`) vs. a separate repo — revisit `docs/HLD.md` §4 once
      scoped.

**Definition of Done:** a written, scoped plan for the first product exists and has
been validated against at least 2–3 real prospective subscribers.

### Sprint 11 — Multi-tenant data model

- [ ] Design and migrate a multi-tenant schema (tenant/business scoping on every
      relevant table) — the biggest architectural jump from Phase 3's single-client
      portal.
- [ ] Tenant-scoped auth (a client only ever sees their own business's data).

**Definition of Done:** two seeded test tenants' data is provably isolated from each
other (a test asserting cross-tenant reads are impossible).

### Sprint 12 — Core product features (MVP)

- [ ] Build the minimum feature set that solves the validated problem end-to-end (for
      inventory: add/edit products, track stock in/out, a basic dashboard).
- [ ] No billing yet — manual subscription tracking is fine for the first
      subscribers, same philosophy as Sprint 6's manual client pipeline.

**Definition of Done:** one real business uses the product for a real week of
operations and it holds up.

### Sprint 13 — Subscriptions & billing

- [ ] Add subscription pricing/billing (10,000–30,000 RWF/month range per
      `docs/BUSINESS-OVERVIEW.md`) — likely via a payment provider with local
      Rwandan payment method support (mobile money), researched fresh at this point
      since provider landscape changes.
- [ ] Self-serve signup for new subscribers, no longer requiring Enoch to manually
      provision each one.

**Definition of Done:** Phase 4 exit criterion met — the product serves more than one
paying subscriber without per-client code changes, and can onboard a new one without
Enoch's manual intervention.

---

## Definition of Done (applies to every sprint)

- All changed code passes CI (`ci-frontend.yml` and/or `ci-backend.yml` as relevant).
- The sprint's changes are deployed to production, not just merged to `main`.
- Any new environment variables or setup steps are documented in the relevant
  `.env.example` and `docs/DEPLOYMENT.md`.
- Any new/changed database schema goes through an Alembic migration, committed and
  reviewed.
- The sprint's own checklist above is fully checked off, or explicitly carried over
  to the next sprint with a written reason (scope creep is fine; silent scope drop
  isn't).

## Risks & assumptions to revisit each phase

- **Solo-founder bandwidth:** this plan assumes part-time, sustained effort — sprints
  will slip in calendar time; the ordering and Definition-of-Done bar should not.
- **Client demand may reorder Phase 4's product choice.** The plan names inventory
  management as the working example throughout `docs/BUSINESS-OVERVIEW.md`, but Sprint
  10 explicitly re-validates this against real data rather than assuming it.
- **Payment provider landscape (Sprint 13)** should be researched fresh when reached,
  not decided this far in advance.
