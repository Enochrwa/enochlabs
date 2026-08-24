<div align="center">

# EnochLabs

**Affordable digital solutions for small and growing businesses in Rwanda.**

Websites, business software, and ongoing technical support — built for shops,
restaurants, hotels, salons, clinics, schools, startups, and the people who run them.

[![CI — Frontend](https://github.com/Enochrwa/enochlabs/actions/workflows/ci-frontend.yml/badge.svg)](https://github.com/Enochrwa/enochlabs/actions/workflows/ci-frontend.yml)
[![CI — Backend](https://github.com/Enochrwa/enochlabs/actions/workflows/ci-backend.yml/badge.svg)](https://github.com/Enochrwa/enochlabs/actions/workflows/ci-backend.yml)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?logo=fastapi&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)
![License](https://img.shields.io/badge/license-proprietary-lightgrey)

[Business overview](docs/BUSINESS-OVERVIEW.md) ·
[High-level design](docs/HLD.md) ·
[Low-level design](docs/LLD.md) ·
[Brand guidelines](docs/BRAND-GUIDELINES.md) ·
[Roadmap](docs/ROADMAP.md) ·
[Sprint plan](docs/SPRINT-PLAN.md)

</div>

---

## What EnochLabs is

Many small businesses have good products and real customers, but no professional online
presence — and no affordable, trustworthy way to get one. EnochLabs closes that gap:

1. **Identify** the business's actual problem — not "you need a website," but *why*.
2. **Recommend** the simplest solution that solves it.
3. **Build & deploy** it, then **train** the client to use it.
4. **Support** it on an ongoing monthly retainer — a relationship, not a one-off invoice.

Full detail in [`docs/BUSINESS-OVERVIEW.md`](docs/BUSINESS-OVERVIEW.md).

## What's in this repo

A monorepo with two independent, independently-deployed services:

```
enochlabs/
├── frontend/    React + TypeScript + Vite marketing site
├── backend/     FastAPI + PostgreSQL API
├── docs/        Business overview, HLD, LLD, brand, roadmap, sprint plan, deployment
└── docker-compose.yml   Local dev: postgres + backend + frontend together
```

| | Frontend | Backend |
| --- | --- | --- |
| **Stack** | React 18, TypeScript, Vite, React Router | FastAPI, SQLAlchemy 2.0, Alembic |
| **Styling** | Tailwind CSS (token system) + Radix UI primitives | — |
| **Data** | Typed content modules (`src/content`) — no CMS yet | PostgreSQL |
| **CI** | `.github/workflows/ci-frontend.yml` | `.github/workflows/ci-backend.yml` |
| **CD** | `deploy-frontend.yml` → static host (Vercel etc.) | `deploy-backend.yml` → container host |

Architecture in depth: [`docs/HLD.md`](docs/HLD.md) (system-level) and
[`docs/LLD.md`](docs/LLD.md) (routes, components, data model, both services).

## Design direction

The site's visual language is built around one idea: **a ledger becoming a dashboard.**
The business exists to turn a shopkeeper's notebook into something legible and reliable
— so the interface literally does that, from ruled-line service listings to a hero
that resolves from ledger lines into a live dashboard preview. Full rationale, palette,
and type system in [`docs/BRAND-GUIDELINES.md`](docs/BRAND-GUIDELINES.md).

## Getting started

Everything together, via Docker:

```bash
git clone https://github.com/Enochrwa/enochlabs.git
cd enochlabs
cp backend/.env.example backend/.env
docker compose up --build   # or: make dev
```

Frontend: [http://localhost:5173](http://localhost:5173) · Backend + API docs:
[http://localhost:8000/docs](http://localhost:8000/docs).

Or run each side natively — see [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) and the
[`Makefile`](Makefile) targets below.

## Scripts

A root [`Makefile`](Makefile) wraps the common commands for both services —
`make dev`, `make frontend-lint`, `make backend-test`, `make migrate`,
`make smoke-test FRONTEND_URL=... BACKEND_URL=...`, etc. Or run them directly:

**Frontend** (from `frontend/`):

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the local dev server |
| `npm run build` | Production build |
| `npm run lint` / `lint:fix` | ESLint |
| `npm run format` / `format:check` | Prettier |
| `npm run typecheck` | `tsc -b --noEmit` |

**Backend** (from `backend/`, with `requirements-dev.txt` installed):

| Command | Purpose |
| --- | --- |
| `uvicorn app.main:app --reload` | Start the local dev server |
| `ruff check .` | Lint |
| `mypy app` | Typecheck |
| `pytest` | Run tests |
| `alembic revision --autogenerate -m "..."` | Create a migration |
| `alembic upgrade head` | Apply migrations |

**Deployment:** [`scripts/smoke-test.sh`](scripts/smoke-test.sh) verifies a deployed
frontend/backend are live and can optionally submit a real end-to-end test inquiry —
see [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md).

## Contributing

See [`CONTRIBUTING.md`](CONTRIBUTING.md) for setup, branching, and PR expectations.

## Deployment

See [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) for CI/CD and hosting setup for both
services.

## Planning

Phase-level plan in [`docs/ROADMAP.md`](docs/ROADMAP.md); a concrete, sprint-by-sprint
breakdown with a Definition of Done for each step in
[`docs/SPRINT-PLAN.md`](docs/SPRINT-PLAN.md).

## License

Proprietary — see [`LICENSE`](LICENSE). Contact
[enockuwumukiza850@gmail.com](mailto:enockuwumukiza850@gmail.com) for licensing or
partnership inquiries.

---

<div align="center">

Built by [Enoch](https://github.com/Enochrwa) in Kigali, Rwanda.

</div>
