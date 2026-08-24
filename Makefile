# Convenience targets for local development. See docs/DEPLOYMENT.md for full detail.

.PHONY: dev dev-down frontend-install frontend-dev frontend-lint frontend-typecheck \
        frontend-build backend-install backend-dev backend-lint backend-typecheck \
        backend-test migrate smoke-test

## Full stack via Docker (postgres + backend + frontend)
dev:
	docker compose up --build

dev-down:
	docker compose down

## Frontend
frontend-install:
	cd frontend && npm install

frontend-dev:
	cd frontend && npm run dev

frontend-lint:
	cd frontend && npm run lint && npm run format:check

frontend-typecheck:
	cd frontend && npm run typecheck

frontend-build:
	cd frontend && npm run build

## Backend
backend-install:
	cd backend && python3 -m venv .venv && .venv/bin/pip install -r requirements-dev.txt

backend-dev:
	cd backend && .venv/bin/uvicorn app.main:app --reload

backend-lint:
	cd backend && .venv/bin/ruff check .

backend-typecheck:
	cd backend && .venv/bin/mypy app

backend-test:
	cd backend && .venv/bin/pytest -v

migrate:
	cd backend && .venv/bin/alembic upgrade head

## Smoke-test a deployed environment: make smoke-test FRONTEND_URL=... BACKEND_URL=...
smoke-test:
	./scripts/smoke-test.sh --frontend-url "$(FRONTEND_URL)" --backend-url "$(BACKEND_URL)"
