# Deployment

## CI (`.github/workflows/ci.yml`)

Runs on every push/PR to `main` and `develop`: install → `format:check` → `lint` →
`typecheck` → `build`. All four must pass before a PR merges.

## CD (`.github/workflows/deploy.yml`)

Deploys `main` to production on Vercel. One-time setup:

1. Create a project on [vercel.com](https://vercel.com) and run `vercel link` locally
   once to generate `.vercel/project.json` (contains org/project IDs; this folder is
   git-ignored).
2. In the GitHub repo, add these **Actions secrets** (Settings → Secrets and
   variables → Actions):
   - `VERCEL_TOKEN` — from vercel.com/account/tokens
   - `VERCEL_ORG_ID` — from `.vercel/project.json`
   - `VERCEL_PROJECT_ID` — from `.vercel/project.json`
3. In the same GitHub environment (`production`), also mirror the runtime env vars from
   `.env.example` into Vercel's project settings (Environment Variables), since the
   Actions secrets above only authenticate the deploy — they don't set the app's own
   config.
4. Push to `main` — the `Deploy` workflow builds and deploys automatically. Re-run
   manually anytime via the Actions tab (`workflow_dispatch`).

## Alternative hosts

The app is a standard Next.js 14 project — Netlify, Cloudflare Pages, Render, or a plain
Node server all work. Swap `deploy.yml` for the target platform's action/CLI; the CI
gate stays the same either way.

## Custom domain

Point the domain's DNS at the host per its instructions, then set
`NEXT_PUBLIC_SITE_URL` (used for metadata/OG tags and `app/sitemap.ts`) to the final
production URL.
