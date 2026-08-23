<div align="center">

# EnochLabs

**Affordable digital solutions for small and growing businesses in Rwanda.**

Websites, business software, and ongoing technical support — built for shops,
restaurants, hotels, salons, clinics, schools, startups, and the people who run them.

[![CI](https://github.com/Enochrwa/enochlabs/actions/workflows/ci.yml/badge.svg)](https://github.com/Enochrwa/enochlabs/actions/workflows/ci.yml)
[![Deploy](https://github.com/Enochrwa/enochlabs/actions/workflows/deploy.yml/badge.svg)](https://github.com/Enochrwa/enochlabs/actions/workflows/deploy.yml)
![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?logo=typescript&logoColor=white)
![License](https://img.shields.io/badge/license-proprietary-lightgrey)

[Business overview](docs/BUSINESS-OVERVIEW.md) ·
[High-level design](docs/HLD.md) ·
[Low-level design](docs/LLD.md) ·
[Brand guidelines](docs/BRAND-GUIDELINES.md) ·
[Roadmap](docs/ROADMAP.md)

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

The EnochLabs marketing site — the platform's own front door — built as a fast,
accessible, server-rendered Next.js app. It's also the reference implementation of the
design system future client and product work will build on.

| | |
| --- | --- |
| **Framework** | Next.js 14 (App Router, TypeScript, React Server Components) |
| **Styling** | Tailwind CSS with a token system in `tailwind.config.ts` |
| **Content** | Typed content modules (`src/lib/content`) — no CMS overhead yet |
| **CI** | GitHub Actions — format, lint, typecheck, build on every PR |
| **CD** | GitHub Actions → Vercel, auto-deploy on `main` |

Architecture in depth: [`docs/HLD.md`](docs/HLD.md) (system-level) and
[`docs/LLD.md`](docs/LLD.md) (routes, components, data model).

## Design direction

The site's visual language is built around one idea: **a ledger becoming a dashboard.**
The business exists to turn a shopkeeper's notebook into something legible and reliable
— so the interface literally does that, from ruled-line service listings to a hero
that resolves from ledger lines into a live dashboard preview. Full rationale, palette,
and type system in [`docs/BRAND-GUIDELINES.md`](docs/BRAND-GUIDELINES.md).

## Getting started

```bash
git clone https://github.com/Enochrwa/enochlabs.git
cd enochlabs
cp .env.example .env
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the local dev server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` / `lint:fix` | ESLint |
| `npm run format` / `format:check` | Prettier |
| `npm run typecheck` | `tsc --noEmit` |

## Contributing

See [`CONTRIBUTING.md`](CONTRIBUTING.md) for setup, branching, and PR expectations.

## Deployment

See [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) for CI/CD and hosting setup.

## Roadmap

Phase 1 (this repo) → paying service clients → a client workspace → the first SaaS
product built from the most-requested recurring solution. Detail in
[`docs/ROADMAP.md`](docs/ROADMAP.md).

## License

Proprietary — see [`LICENSE`](LICENSE). Contact
[enockuwumukiza850@gmail.com](mailto:enockuwumukiza850@gmail.com) for licensing or
partnership inquiries.

---

<div align="center">

Built by [Enoch](https://github.com/Enochrwa) in Kigali, Rwanda.

</div>
