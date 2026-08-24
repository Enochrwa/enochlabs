# Contributing

EnochLabs is currently maintained by a single founder-developer, but is built to be
contributor-ready from day one. This is a monorepo: `frontend/` (React + TypeScript +
Vite) and `backend/` (FastAPI + PostgreSQL) are independent projects that share this
repo, docs, and CI/CD conventions.

## Getting started

The fastest path — everything together via Docker:

```bash
git clone https://github.com/Enochrwa/enochlabs.git
cd enochlabs
cp backend/.env.example backend/.env
docker compose up --build
```

Frontend at `http://localhost:5173`, backend + docs at `http://localhost:8000/docs`.

Or run each side natively — see `frontend/` and `backend/` quick-starts in
`docs/DEPLOYMENT.md`.

## Before opening a PR

**Frontend changes** (from `frontend/`):

```bash
npm run format:check   # or: npm run format to auto-fix
npm run lint
npm run typecheck
npm run build
```

**Backend changes** (from `backend/`, with `requirements-dev.txt` installed):

```bash
ruff check .
mypy app
pytest
```

Both sets of checks run in CI (`.github/workflows/ci-frontend.yml`,
`ci-backend.yml`), scoped by path, and must pass before merge.

## Branching

- `main` — production; auto-deploys via `deploy-frontend.yml` / `deploy-backend.yml`,
  each triggered only by changes in its own directory.
- `develop` — integration branch for in-progress work.
- Feature branches: `feature/<short-description>`, `fix/<short-description>`.

## Commit style

Prefer [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`,
`docs:`, `chore:`, `refactor:`) — not enforced by tooling yet, but keeps history
readable as the project grows.

## Design changes

Any UI change should stay consistent with `docs/BRAND-GUIDELINES.md` — the palette,
type roles, and the "ledger, not generic cards" structural language are deliberate
choices, not defaults.

## Content changes

Site copy (services, pricing, portfolio) lives as typed data in
`frontend/src/content/` — see `docs/LLD.md` §4. Edit the relevant file and open a PR;
the preview deploy on the PR lets you check it renders correctly before merge.

## Database changes

Any change to `backend/app/db/models/` needs an Alembic migration:

```bash
cd backend
alembic revision --autogenerate -m "describe the change"
```

Review the generated migration before committing it — autogenerate is a starting
point, not a guarantee. See `docs/LLD.md` §5 and `docs/DEPLOYMENT.md`.

## Planning

See `docs/ROADMAP.md` for the phase-level plan and `docs/SPRINT-PLAN.md` for the
current sprint's concrete scope.
