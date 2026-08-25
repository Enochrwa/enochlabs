# Deployment

The frontend and backend deploy independently. Each has its own CI gate and its own
CD path. This document covers local development, then the concrete steps to take the
app to production using the config already committed in this repo
(`render.yaml`, `frontend/vercel.json`).

## Local development (all services together)

The fastest way to run the full stack locally:

```bash
cp backend/.env.example backend/.env
docker compose up --build
```

Or with `make`:

```bash
make dev
```

This starts Postgres, the FastAPI backend (`http://localhost:8000`, docs at `/docs`),
and the Vite dev server (`http://localhost:5173`) with hot reload on both sides.
First run: apply migrations inside the backend container:

```bash
docker compose exec backend alembic upgrade head
```

### Backend without Docker

```bash
make backend-install   # creates backend/.venv and installs requirements-dev.txt
cp backend/.env.example backend/.env   # point DATABASE_URL at a local Postgres
make migrate
make backend-dev
```

### Frontend without Docker

```bash
make frontend-install
cp frontend/.env.example frontend/.env   # point VITE_API_URL at the backend
make frontend-dev
```

## CI

- **`.github/workflows/ci-frontend.yml`** — runs on changes under `frontend/`: a
  `quality` job (install → `format:check` → `lint` → `typecheck` → `build`) followed
  by a `lighthouse` job that builds the site, serves it with `vite preview`, and runs
  Lighthouse CI (`frontend/lighthouserc.json`) against the home page three times,
  failing the build if performance, accessibility, or best-practices drops below 90
  (`docs/SPRINT-PLAN.md` Sprint 4). GitHub's `ubuntu-latest` runners ship Chrome
  preinstalled, so this needs no extra setup in CI; to run it locally you need a real
  Chrome/Chromium binary on your machine (`npm run lighthouse` from `frontend/`, or
  `make frontend-lighthouse`).
- **`.github/workflows/ci-backend.yml`** — runs on changes under `backend/`: a
  `quality` job (install → `ruff check` → `mypy` → `pytest`) and a `build` job that
  builds `backend/Dockerfile` (via Buildx, not pushed anywhere) so a broken image
  fails the PR instead of the next deploy. Both run in parallel.

Both must pass before a PR merges; scoping by path keeps feedback fast and avoids
unrelated failures blocking unrelated changes.

## Going to production

### Backend — Render, via the committed Blueprint (recommended)

`render.yaml` at the repo root is a
[Render Blueprint](https://render.com/docs/blueprint-spec) — infrastructure as code
that provisions **both** the backend web service **and** a managed PostgreSQL instance
in one step, and wires them together automatically.

1. In the Render dashboard: **New → Blueprint**, connect this GitHub repo. Render
   reads `render.yaml` and shows a plan: one web service (`enochlabs-backend`, built
   from `backend/Dockerfile`) and one database (`enochlabs-db`).
2. Click **Apply**. Render provisions the Postgres instance, builds the backend image,
   sets `DATABASE_URL` on the web service automatically (via `fromDatabase` in
   `render.yaml`), and runs `alembic upgrade head` as a **pre-deploy** step before the
   new version starts serving traffic.
3. Once the first deploy finishes, set the two `sync: false` variables in the
   Render dashboard (Blueprint owners fill these in manually — they're
   deployment-specific, not something to hardcode in the repo):
   - `CORS_ORIGINS` → the deployed frontend's URL (see below), comma-separated if more
     than one (e.g. `https://enochlabs.dev,https://www.enochlabs.dev`).
   - `INQUIRY_NOTIFY_WEBHOOK` → optional; a webhook URL to notify on new inquiries (see
     "Configuring inquiry notifications" below).
   - `ADMIN_API_KEY` → a long random secret; required to use the admin inquiry listing
     (`GET /api/v1/inquiries`) and the frontend's `/admin` view. Generate one with e.g.
     `openssl rand -hex 32`. Leave unset and the admin endpoint refuses every request
     (`503`) rather than silently allowing access.
4. From here, **every push to `main` that touches `backend/` auto-deploys** — Render's
   GitHub integration watches the repo directly. You do not need to run
   `.github/workflows/deploy-backend.yml` for this path; it exists for non-Render
   hosts (see below).
5. Grab the deployed service's URL from the Render dashboard (e.g.
   `https://enochlabs-backend.onrender.com`) — you'll need it for the frontend's
   `VITE_API_URL` and for the smoke test below.

### Backend — any other container host

If you're not using Render, `.github/workflows/deploy-backend.yml` builds and pushes a
container image (from `backend/Dockerfile`) to GitHub Container Registry on every push
to `main` that touches `backend/`, then optionally pings a deploy-trigger webhook —
the pattern most hosts (Railway, Fly.io, a plain VPS with a webhook listener) support.

1. Provision Postgres on your chosen host; note the connection string.
2. Create a service that deploys from the pushed image
   (`ghcr.io/<owner>/<repo>-backend:latest`), or configure it to build from
   `backend/Dockerfile` directly.
3. Set its environment variables from `backend/.env.example`: `DATABASE_URL`,
   `CORS_ORIGINS`, `INQUIRY_NOTIFY_WEBHOOK` + `INQUIRY_NOTIFY_WEBHOOK_FORMAT`
   (optional), `INQUIRY_RATE_LIMIT_MAX` / `INQUIRY_RATE_LIMIT_WINDOW_SECONDS`
   (optional — sensible defaults ship), `ADMIN_API_KEY` (required for the admin
   inquiry listing).
4. If your host supports a deploy webhook, add it as the repository secret
   `DEPLOY_HOOK_URL`. If it needs a CLI instead (e.g. `flyctl deploy`), swap the
   relevant step in `deploy-backend.yml` for that CLI's GitHub Action.
5. Apply migrations as a controlled release step (see "Database migrations in
   production" below) — never by hand against a live database outside of a deploy.

### Frontend — Vercel, via the committed config (recommended)

`frontend/vercel.json` is already configured for a Vite SPA: correct build command,
output directory, and — importantly — a rewrite rule so client-side routes (e.g.
`/services`, refreshed directly or shared as a link) don't 404 on the host.

1. In the Vercel dashboard: **New Project**, import this repo, and set the project's
   **Root Directory** to `frontend` (Vercel's monorepo support — this is a dashboard
   setting, not something `vercel.json` controls).
2. Set the frontend's runtime env vars in the Vercel project's **Environment
   Variables** settings — these are baked in at build time for a Vite app, so they
   must be set on the host, not just in a local `.env`:
   - `VITE_API_URL` → the backend URL from the step above.
   - `VITE_WHATSAPP_NUMBER`
   - `VITE_SITE_URL` → the frontend's own final URL, once known. Also used at build
     time to generate `dist/sitemap.xml` and `dist/robots.txt` (see
     `frontend/scripts/generate-seo-files.mjs`) and to fill in Open
     Graph/Twitter-card/canonical URLs in `index.html`. Falls back to
     `https://enochlabs.dev` if unset, so the build never fails without it — but set
     it to the real domain once one is live, or social previews and the sitemap will
     point at the wrong place.
   - `VITE_PLAUSIBLE_DOMAIN` → optional; see "Configuring analytics" below. Leave
     unset and analytics stays fully disabled (no script loads, no network calls) —
     safe default for local dev and preview deploys.
3. Deploy. Every push to `main` that touches `frontend/` redeploys automatically via
   Vercel's own GitHub integration.
4. Optionally, wire `.github/workflows/deploy-frontend.yml` instead/in addition if you
   want the deploy driven from GitHub Actions rather than Vercel's native integration
   — add the repository secrets `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`
   (from running `vercel link` once inside `frontend/`). This workflow also runs the
   smoke test below automatically against the freshly deployed URL.

### Frontend — Netlify / Cloudflare Pages (alternative)

`frontend/public/_redirects` provides the same SPA-fallback behavior as
`vercel.json`'s rewrite rule, using the `_redirects` syntax both Netlify and
Cloudflare Pages understand. Point either at `frontend/` as the base directory, with
build command `npm run build` and publish directory `dist`.

## Smoke-testing a deployment

`scripts/smoke-test.sh` checks that a deployed frontend and/or backend are actually
serving traffic, and can optionally submit a real test inquiry end-to-end:

```bash
./scripts/smoke-test.sh \
  --frontend-url https://enochlabs.dev \
  --backend-url https://enochlabs-backend.onrender.com \
  --submit-test-inquiry
```

Or: `make smoke-test FRONTEND_URL=... BACKEND_URL=...`

`deploy-frontend.yml` runs this automatically against the URL Vercel just deployed.
`deploy-backend.yml` runs it automatically if the repository **variable** (not
secret) `BACKEND_URL` is set — add it once under Settings → Secrets and variables →
Actions → Variables.

## Database migrations in production

Never run `alembic upgrade head` by hand against production outside of a controlled
deploy step. On the recommended Render path, this already happens automatically via
`preDeployCommand` in `render.yaml` — migrations run before the new backend version
starts serving traffic, on every deploy. On any other host, wire the equivalent
release-phase/pre-deploy hook if it has one; otherwise, run migrations as an explicit,
reviewed step immediately before the new version goes live. Always review generated
migrations in PRs before merge — see `docs/LLD.md` §5.

## Configuring inquiry notifications

`INQUIRY_NOTIFY_WEBHOOK` is a best-effort POST fired after each inquiry is durably
saved (see `docs/LLD.md` §6) — it never blocks or fails the visitor's submission, even
if the webhook is down or misconfigured. Point it at whichever channel Enoch actually
watches:

- **Email relay / Zapier / Make** — leave `INQUIRY_NOTIFY_WEBHOOK_FORMAT=generic` (the
  default). The webhook receives the raw inquiry fields as JSON
  (`name`, `business`, `contact`, `problem`) for the relay to template into an email.
- **Slack** — create an
  [incoming webhook](https://api.slack.com/messaging/webhooks) for the channel to
  notify, set `INQUIRY_NOTIFY_WEBHOOK` to its URL, and set
  `INQUIRY_NOTIFY_WEBHOOK_FORMAT=slack`. Slack expects `{"text": "..."}`, not arbitrary
  JSON — the backend builds that shape for you.
- **Discord** — same idea: a channel webhook URL plus
  `INQUIRY_NOTIFY_WEBHOOK_FORMAT=discord`, which posts `{"content": "..."}`.

Whichever target is used, this is the last piece of Sprint 3's "Enoch never misses an
inquiry" goal (`docs/SPRINT-PLAN.md`) — the other two (rate limiting and the admin
view) work without any account setup at all.

## Configuring analytics

`VITE_PLAUSIBLE_DOMAIN` turns on privacy-friendly, cookieless analytics via
[Plausible](https://plausible.io) (`docs/SPRINT-PLAN.md` Sprint 4, `docs/ROADMAP.md`
Phase 1). Unset — the default in `.env.example` and every preview deploy — it's a
complete no-op: no script loads, no request ever leaves the browser
(`frontend/src/lib/analytics.ts`).

1. Create a site in your Plausible account (self-hosted or plausible.io) for the
   domain you're deploying to.
2. Set `VITE_PLAUSIBLE_DOMAIN` to that exact domain (e.g. `enochlabs.dev`) as a
   Vercel/Netlify build-time env var — same caveat as the others above, this is baked
   in at build time.
3. Because the frontend is a client-rendered SPA, the script loads in "manual" mode
   (`script.manual.js`) rather than Plausible's default auto-tracking script — the app
   fires pageviews itself on every route change (`src/components/analytics.tsx`), so
   navigating to `/services` or `/pricing` without a full page reload is still
   counted. Three custom events are also tracked as goals, set these up under the
   Plausible site's **Goals** if you want them broken out individually: `Contact Form
   Submit`, `WhatsApp Click` (with a `location` prop —
   `floating-button`/`contact-page`/`contact-form-fallback`), and `Pricing Page View`.

## Reviewing inquiries without `psql`

Two things gate `GET /api/v1/inquiries` and the frontend's `/admin` view: an
`ADMIN_API_KEY` set on the backend, and entering that same value into the `/admin`
page's unlock prompt (kept only in that browser tab's `sessionStorage`, never written
to disk). Generate a strong key — `openssl rand -hex 32` works well — and set it as
`ADMIN_API_KEY` wherever the backend runs (see the Render step above, or your
`.env` for local development). This is an interim shared secret, not per-user login;
Phase 3 (`docs/ROADMAP.md`) replaces it with real auth once the client portal exists.

## Custom domains

Point each service's domain/subdomain at its host per that host's instructions (e.g.
`enochlabs.dev` → frontend on Vercel, `api.enochlabs.dev` → backend on Render). Update
`VITE_API_URL` and `CORS_ORIGINS` to match the final URLs once both are live.
