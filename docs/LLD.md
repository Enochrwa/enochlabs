# Low-Level Design (LLD)

Companion to [`docs/HLD.md`](./HLD.md). Describes the repo layout, routes, components,
and data shapes for both the `frontend/` (React SPA) and `backend/` (FastAPI + Postgres).

## 1. Repository layout

```
enochlabs/
├── .github/
│   ├── workflows/          ci-frontend.yml, ci-backend.yml, deploy-frontend.yml,
│   │                       deploy-backend.yml
│   ├── ISSUE_TEMPLATE/
│   └── PULL_REQUEST_TEMPLATE.md
├── docs/                    HLD, LLD, brand, roadmap, sprint plan, deployment,
│                            business overview
├── frontend/                React + TypeScript + Vite marketing site
│   ├── public/               Static assets (favicon)
│   ├── src/
│   │   ├── pages/             Route-level components (Home, Services, Work, ...)
│   │   ├── components/        Reusable UI building blocks
│   │   ├── content/            Typed content: services, portfolio, pricing, process
│   │   ├── lib/                 Helpers (e.g. useDocumentTitle)
│   │   └── styles/               globals.css (Tailwind layers, base styles)
│   ├── .eslintrc.json, .prettierrc.json, tailwind.config.ts, vite.config.ts, ...
│   └── Dockerfile             Dev-only image (see docs/DEPLOYMENT.md)
├── backend/                  FastAPI + PostgreSQL service
│   ├── app/
│   │   ├── main.py             FastAPI app instance, CORS, router mounting
│   │   ├── core/config.py       Settings (pydantic-settings, env-driven)
│   │   ├── db/                  session.py, base.py, models/
│   │   ├── schemas/              Pydantic request/response models
│   │   ├── services/              Business logic, separate from routes
│   │   └── api/v1/routes/          One module per resource (health, inquiries)
│   ├── alembic/                 Migrations
│   ├── tests/                    pytest suite (in-memory SQLite, see §6)
│   ├── requirements.txt, requirements-dev.txt, pyproject.toml (ruff/mypy/pytest)
│   └── Dockerfile
├── docker-compose.yml        Local dev: postgres + backend + frontend together
└── (root) LICENSE, SECURITY.md, CONTRIBUTING.md, .editorconfig
```

## 2. Frontend route map (`frontend/src/pages`, wired in `App.tsx`)

| Route | Component | Purpose |
| --- | --- | --- |
| `/` | `Home` | Hero, problem/solution, services summary, process, CTA. |
| `/services` | `Services` | Full breakdown of the five service categories. |
| `/work` | `Work` | Portfolio / case studies. |
| `/pricing` | `Pricing` | Starting packages per `docs/BUSINESS-OVERVIEW.md` §Revenue streams. |
| `/about` | `About` | Founder story, the 6-step engagement flow. |
| `/contact` | `Contact` | Contact form + WhatsApp deep link. |
| `*` | `NotFound` | 404 page. |

Shared chrome (`SiteHeader`, `SiteFooter`, `WhatsAppButton`, `ScrollToTop`) is mounted
once in `App.tsx` around the `<Routes>` tree. Per-page `<title>`/meta description is set
via the `useDocumentTitle` hook (`src/lib/use-document-title.ts`) — the SPA equivalent
of Next.js's old per-page `metadata` export.

## 3. Frontend core components (`frontend/src/components`)

- `SiteHeader` / `SiteFooter` — navigation, brand mark, contact links (React Router
  `Link`, not anchor tags, for client-side navigation).
- `Hero` — the ledger-to-dashboard signature moment (see `docs/BRAND-GUIDELINES.md`).
- `SectionHeading` — eyebrow + heading + supporting copy, reused per section.
- `ServiceLedgerRow` — one row per service category, styled as a ledger line-item.
- `ProcessSteps` — renders the 6-step engagement flow as a real, ordered sequence.
- `PricingCard` — one package (starting price, what's included, CTA).
- `PortfolioCard` — one case study (problem, solution, outcome).
- `WhatsAppButton` — persistent floating CTA using `VITE_WHATSAPP_NUMBER`.
- `ContactForm` — posts to the backend's `POST /api/v1/inquiries`, with a WhatsApp
  fallback shown inline if the request fails.
- `ScrollToTop` — resets scroll position on route change (React Router doesn't do this
  automatically, unlike Next.js).

## 4. Frontend content model (`frontend/src/content`)

Typed, versioned-in-code content — no CMS in Phase 1 (see HLD §2). Same shapes as
before the restructure:

```ts
// frontend/src/content/services.ts
export type ServiceCategory = {
  ref: string;
  slug: string;
  title: string;
  summary: string;
  examples: string[];
  outcome: string;
};

// frontend/src/content/portfolio.ts
export type PortfolioItem = {
  slug: string;
  client: string;
  category: string;
  problem: string;
  solution: string;
  outcome: string;
};
```

Editing content is a code change (PR + CI + preview deploy) — intentional at this scale.

## 5. Backend API (`backend/app`)

| Route | Method | Purpose |
| --- | --- | --- |
| `/` | `GET` | Liveness/root info. |
| `/api/v1/health` | `GET` | Health check (used by hosting platforms/monitoring). |
| `/api/v1/inquiries` | `POST` | Create an inquiry from the contact form. `201` + the created record on success; `422` on validation failure. |

Full request/response schemas are auto-documented at `/docs` (Swagger UI) and
`/redoc` when the API is running.

### Layering

- **`api/v1/routes/*.py`** — thin FastAPI route handlers: parse request, call a
  service function, return a response model. No business logic here.
- **`services/*.py`** — business logic (e.g. `services/inquiries.py::create_inquiry`
  persists the record, then best-effort pings an optional notify webhook without ever
  failing the request if the webhook is down — see HLD §6 Reliability).
- **`db/models/*.py`** — SQLAlchemy ORM models (source of truth for table shape).
- **`schemas/*.py`** — Pydantic models for request/response validation and
  serialization, kept separate from ORM models so the API contract can evolve
  independently of storage details.

### Data model

```python
# backend/app/db/models/inquiry.py
class Inquiry(Base):
    __tablename__ = "inquiries"
    id: UUID            # primary key, server-generated
    name: str
    business: str | None
    contact: str
    problem: str
    status: str          # "new" | "contacted" | "closed"
    created_at: datetime  # server default now()
```

Migrations live in `backend/alembic/versions/`; `0001_create_inquiries_table.py` is the
initial migration. New tables/columns always go through
`alembic revision --autogenerate -m "..."` (see `docs/DEPLOYMENT.md` for the workflow),
never manual DDL against a live database.

## 6. Contact/inquiry flow (end-to-end)

1. Visitor fills out `ContactForm` on `/contact` (name, business, contact method,
   problem).
2. The form `POST`s JSON to `${VITE_API_URL}/api/v1/inquiries`.
3. FastAPI validates the payload against `InquiryCreate` (returns `422` with field
   errors if invalid).
4. `services/inquiries.py::create_inquiry` writes the row to Postgres, then — only if
   `INQUIRY_NOTIFY_WEBHOOK` is configured — best-effort POSTs a notification (e.g. to an
   email relay or Slack webhook). A webhook failure is logged, never surfaced to the
   visitor, and never rolls back the already-saved inquiry.
5. On success, the frontend shows a confirmation state. On any failure (network error,
   API down, `4xx`/`5xx`), the frontend surfaces the WhatsApp deep link
   (`https://wa.me/<VITE_WHATSAPP_NUMBER>`) as a guaranteed fallback.

## 7. Environment & config

**Frontend** (`frontend/.env.example`): `VITE_API_URL` (backend base URL),
`VITE_WHATSAPP_NUMBER`, `VITE_SITE_URL`, `VITE_PLAUSIBLE_DOMAIN` (optional).

**Backend** (`backend/.env.example`): `DATABASE_URL` (Postgres connection string),
`CORS_ORIGINS` (frontend origins allowed to call the API), `INQUIRY_NOTIFY_WEBHOOK`
(optional), `ENVIRONMENT`, `DEBUG`.

## 8. Testing/quality gates

**Frontend** (run from `frontend/`):
- `npm run lint` — ESLint (TypeScript + React Hooks rules + Prettier compatibility).
- `npm run typecheck` — `tsc -b --noEmit`.
- `npm run format:check` — Prettier, including Tailwind class sorting.
- `npm run build` — production build (`tsc -b && vite build`).

**Backend** (run from `backend/`, inside a venv with `requirements-dev.txt` installed):
- `ruff check .` — lint (imports, style, common bugs).
- `mypy app` — static type checking.
- `pytest` — unit/integration tests against an in-memory SQLite DB (fast, no external
  dependency; Postgres-specific behavior is exercised via real migrations in CI/staging
  — see `docs/DEPLOYMENT.md`).

Both suites run in CI on every PR (`ci-frontend.yml`, `ci-backend.yml`), scoped by path
so a frontend-only change doesn't trigger backend CI and vice versa.
