# Contributing

EnochLabs is currently maintained by a single founder-developer, but is built to be
contributor-ready from day one.

## Getting started

```bash
git clone https://github.com/Enochrwa/enochlabs.git
cd enochlabs
cp .env.example .env
npm install
npm run dev
```

Visit `http://localhost:3000`.

## Before opening a PR

```bash
npm run format:check   # or: npm run format to auto-fix
npm run lint
npm run typecheck
npm run build
```

All four run in CI (`.github/workflows/ci.yml`) and must pass before merge.

## Branching

- `main` — production; auto-deploys via `.github/workflows/deploy.yml`.
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

Site copy (services, pricing, portfolio) lives as typed data in `src/lib/content/` — see
`docs/LLD.md` §4. Edit the relevant file and open a PR; the preview deploy on the PR
lets you check it renders correctly before merge.
