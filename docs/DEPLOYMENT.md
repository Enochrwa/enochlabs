# Deployment

The frontend and backend deploy independently. Each has its own CI gate and its own
CD workflow.

## Local development (all services together)

The fastest way to run the full stack locally:

```bash
cp backend/.env.example backend/.env
docker compose up --build
```

This starts Postgres, the FastAPI backend (`http://localhost:8000`, docs at
`/docs`), and the Vite dev server (`http://localhost:5173`) with hot reload on both
sides. First run: apply migrations inside the backend container:

```bash
docker compose exec backend alembic upgrade head
```

Without Docker, run each piece directly — see `frontend/README` usage in the root
`README.md` and the backend quick-start below.

### Backend without Docker

```bash
cd backend
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements-dev.txt
cp .env.example .env   # point DATABASE_URL at a local Postgres
alembic upgrade head
uvicorn app.main:app --reload
```

## CI

- **`.github/workflows/ci-frontend.yml`** — runs on changes under `frontend/`:
  install → `format:check` → `lint` → `typecheck` → `build`.
- **`.github/workflows/ci-backend.yml`** — runs on changes under `backend/`: install →
  `ruff check` → `mypy` → `pytest`.

Both must pass before a PR merges; scoping by path keeps feedback fast and avoids
unrelated failures blocking unrelated changes.

## CD — Frontend (`.github/workflows/deploy-frontend.yml`)

Deploys `frontend/` to Vercel (or swap for Netlify/Cloudflare Pages) on every push to
`main` that touches `frontend/`. One-time setup:

1. Create a project on the chosen static host, pointed at the `frontend/` subdirectory
   as the project root.
2. Add these **Actions secrets**: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`
   (from `vercel link` inside `frontend/`).
3. Set the frontend's runtime env vars (`VITE_API_URL` pointing at the deployed
   backend, `VITE_WHATSAPP_NUMBER`, etc.) in the host's project settings — these are
   baked in at build time for a Vite app, so they must be set on the host, not just in
   `.env`.
4. Push to `main` — the workflow builds and deploys automatically.

## CD — Backend (`.github/workflows/deploy-backend.yml`)

Deploys `backend/` as a container (using the provided `Dockerfile`) on every push to
`main` that touches `backend/`. Works with Render, Fly.io, Railway, or any
container-accepting host. One-time setup:

1. Create a Postgres instance on your chosen provider (or use the host's managed
   Postgres add-on) and note its connection string.
2. Create a web service pointed at `backend/` with the `Dockerfile` build.
3. Set the service's environment variables: `DATABASE_URL` (from step 1),
   `CORS_ORIGINS` (the deployed frontend's URL), `INQUIRY_NOTIFY_WEBHOOK` (optional).
4. Add whatever deploy-trigger secret your host requires as a GitHub Actions secret
   (e.g. `RENDER_DEPLOY_HOOK_URL`, `FLY_API_TOKEN`) and reference it in
   `deploy-backend.yml`.
5. Run migrations against the new database once (`alembic upgrade head`, e.g. via a
   one-off container command or a release-phase hook depending on the host).
6. Push to `main` — the workflow builds and deploys automatically.

The exact deploy step in `deploy-backend.yml` is written for a generic "build and push
a container image" flow — swap in your host's specific action/CLI as needed; the CI
gate stays the same regardless of target.

## Database migrations in production

Never run `alembic upgrade head` by hand against production outside of a controlled
deploy step. The recommended flow: the backend's deploy step (or a release-phase hook,
if the host supports one) runs migrations automatically before the new version starts
serving traffic. Always review generated migrations in PRs before merge — see
`docs/LLD.md` §5.

## Custom domains

Point each service's domain/subdomain at its host per that host's instructions (e.g.
`enochlabs.dev` → frontend, `api.enochlabs.dev` → backend). Update
`VITE_API_URL` and `CORS_ORIGINS` to match the final URLs.
