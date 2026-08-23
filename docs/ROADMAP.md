# Roadmap

Sequencing follows the business's own long-term vision: individual developer → digital
services business → software development company → SaaS/product company (see
`docs/BUSINESS-OVERVIEW.md`).

## Phase 1 — Launch the marketing site (current)

- [x] Repo initialized: structure, tooling, CI/CD, docs.
- [ ] Home, Services, Work, Pricing, About, Contact pages built.
- [ ] Real portfolio content (even 1–2 seed projects/case studies).
- [ ] Contact flow wired to a real email/relay provider + WhatsApp fallback.
- [ ] Deployed to production domain; `deploy.yml` secrets configured.
- [ ] Analytics in place (privacy-friendly — e.g. Plausible).

**Exit criterion:** a stranger can land on the site, understand what EnochLabs does in
under 10 seconds, and reach Enoch through WhatsApp or the contact form.

## Phase 2 — First paying service clients

- [ ] Case studies added as real projects ship.
- [ ] Maintenance-retainer offering formalized on `/pricing`.
- [ ] Lightweight inquiry tracking (even a spreadsheet/Notion is fine — a database isn't
      justified until volume demands it).

**Exit criterion:** at least one client on a monthly maintenance retainer.

## Phase 3 — Client workspace

- [ ] Authenticated `/portal` route group for active clients (project status, invoices,
      support requests) — introduce a database at this point (see `docs/HLD.md` §5).

**Exit criterion:** a client can self-serve their project status without a WhatsApp
message.

## Phase 4 — First SaaS product

- [ ] Identify the most-requested recurring solution across clients (per the business
      overview's example: inventory management).
- [ ] Extract it into its own product/app instead of rebuilding per client.
- [ ] Subscription pricing (10,000–30,000 RWF/month range, per business overview).

**Exit criterion:** the same product serves more than one paying subscriber without
per-client code changes.

## Not yet scheduled

- Full e-commerce checkout (beyond WhatsApp-order catalogs).
- CMS for non-technical content editing.
- Automated test suite beyond lint/typecheck/build (introduce alongside Phase 3's
  interactive portal logic).
