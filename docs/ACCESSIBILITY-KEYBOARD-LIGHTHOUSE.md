# Accessibility, Keyboard Navigation & Lighthouse — Sprint 4

Companion to [`docs/QA-MOBILE.md`](./QA-MOBILE.md) (Sprint 2's mobile/cross-device
pass). This document records Sprint 4's `prefers-reduced-motion` /
keyboard-navigation pass and the Lighthouse ≥90 requirement
(`docs/SPRINT-PLAN.md`) — what was checked, what was fixed, and what's now enforced
by CI going forward rather than verified once and left to drift.

## `prefers-reduced-motion`

Handled globally since Sprint 2/3 (`frontend/src/styles/globals.css`): a single
`@media (prefers-reduced-motion: reduce)` block collapses all animation/transition
durations to near-zero and forces `scroll-behavior: auto`, rather than relying on
each component to opt in individually. Reviewed every component this sprint for
anything that would bypass this (raw `<video>`/`requestAnimationFrame`/CSS not using
`animation`/`transition` properties) — none found. No changes needed.

## Keyboard-navigation pass

Manual, per-component review of every interactive element (see `frontend/src/App.tsx`
for the full component tree) plus targeted fixes. This is a code-level review, not a
scripted/recorded keyboard walkthrough — see "What still needs a live pass" below.

### Findings & fixes made this sprint

1. **No "skip to content" link.** A keyboard user landing on any page had to tab
   through the full header nav before reaching the actual page content — no way to
   jump straight past it. **Fixed:** added a `.skip-link` (first focusable element on
   every page, off-screen until focused) that jumps to a new `id="main-content"` on
   `<main>` (`frontend/src/App.tsx`, `.skip-link` in `globals.css`).
2. **Mobile nav had no Escape-to-close.** The hamburger menu (`SiteHeader`) could be
   opened and its links reached via keyboard, but a keyboard user had no way to
   dismiss it short of tabbing all the way through it or re-activating the toggle
   button. **Fixed:** an Escape keydown handler closes the menu while it's open.
3. **Admin unlock field had no accessible label.** `frontend/src/pages/Admin.tsx`'s
   `X-Admin-Key value` input relied on `placeholder` alone, which most assistive tech
   does not treat as an accessible name (WCAG 4.1.2 / axe's `label` rule — this is
   also what Lighthouse's accessibility category checks for). **Fixed:** added a
   visually-hidden (`sr-only`) `<label>`.
4. **Everything else already worked:** honeypot field correctly excluded from tab
   order (`tabIndex={-1}`) rather than merely hidden visually; all form inputs already
   had visible `<label>`s and `focus-visible` styling; the hamburger toggle already
   had `aria-expanded`/`aria-controls`/`aria-label`; all links/buttons have
   discernible accessible names; focus-visible outline (`outline-seal`, defined
   globally) is present on every interactive element reviewed, with no component
   overriding it away.

### What still needs a live pass

Same honesty as `docs/QA-MOBILE.md`: a code review catches structural gaps (missing
labels, missing skip links, wrong tab order) but doesn't replace an actual keyboard
walkthrough — tabbing through every page with a real keyboard, verifying focus order
matches visual order, and confirming the focus ring is legible against every
background it lands on. Worth a human pass before the Phase 1 exit criterion
(`docs/ROADMAP.md`) is called fully closed.

## Lighthouse ≥90 (performance, accessibility, best-practices) on the home page

`docs/SPRINT-PLAN.md` Sprint 4 asks for a Lighthouse pass and fixing what's flagged.
Rather than a one-off manual run that goes stale the moment a dependency or a page
changes, this is now a **CI gate**: `.github/workflows/ci-frontend.yml` has a
`lighthouse` job that builds the site, serves it via `vite preview`, and runs
Lighthouse CI (`frontend/lighthouserc.json`) against `/` three times, failing the
build if performance, accessibility, or best-practices drops below 0.9 (90) on any
run. `npm run lighthouse` (or `make frontend-lighthouse`) runs the same check locally.

**Why this doc doesn't include a numeric before/after score, unlike `QA-MOBILE.md`'s
Playwright pass:** Lighthouse needs a real Chrome/Chromium binary to launch, and the
sandbox this sprint's work was implemented in has network egress restricted to
package registries (npm, PyPI, crates.io, Ubuntu's own archives) — no browser vendor's
download CDN or the Snap Store is reachable, so no real Chrome could be installed
here to actually execute a run (`apt install chromium-browser` only installs a Snap
stub with no working browser behind it, confirmed by trying it). GitHub Actions'
`ubuntu-latest` runners ship Chrome preinstalled and have unrestricted network access,
so the `lighthouse` CI job runs for real on every PR against `frontend/` — this is
the numbers you'll see, on the first PR that touches this branch.

**What was checked and fixed via code review in the meantime** (the same
`docs/QA-MOBILE.md`-style distinction between "verified" and "expected to be fine"):

- Fonts (`@fontsource/*`) already ship with `font-display: swap` — no flash-of-invisible-text
  penalty, confirmed by inspecting the generated `@font-face` rules directly.
- The one third-party script this sprint adds (Plausible, see "Configuring
  analytics" in `docs/DEPLOYMENT.md`) is `defer`red and entirely absent from the
  bundle/network when `VITE_PLAUSIBLE_DOMAIN` is unset — it can't regress
  performance or best-practices scores on any deploy that hasn't configured it.
- All `target="_blank"` links already carry `rel="noreferrer"` (WhatsApp, GitHub
  profile links), which satisfies Lighthouse best-practice's reverse-tabnabbing
  check.
- The accessibility fixes above (skip link, Escape-to-close, admin field label) were
  made specifically because they're the kind of gap Lighthouse's `axe-core`-based
  accessibility audit flags.

If the first real CI run on this branch surfaces something this review missed, treat
it the same way Sprint 2 treated its mobile-nav finding: fix it, note it here, don't
quietly round up.
