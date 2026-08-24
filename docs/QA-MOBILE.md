# Mobile & Cross-Device QA — Sprint 2

Sprint 2's Definition of Done requires verifying the site on "a real low-end Android
phone ... and slow 3G throttling." This document records what was actually done, how,
and what it found — plus what still needs a human with a physical device.

## Methodology

Automated verification used Playwright + headless Chromium, configured to approximate
the target device/network as closely as tooling allows:

- **Viewport:** 360×640 @ 2x device pixel ratio (matches common low-end Android phones,
  e.g. Moto G-series, budget Samsung/Tecno/Infinix models common in this market).
- **Input:** `is_mobile: true`, `has_touch: true`, a real Android Chrome user-agent
  string.
- **Network:** Chrome DevTools Protocol `Network.emulateNetworkConditions` set to
  ~400 kbps down/up with 400 ms latency — a "Slow 3G" profile.
- **Checks run:** horizontal-overflow detection (any element wider than the viewport
  or starting off-screen), interactive-element tap-target sizing (WCAG 2.5.5's 44×44
  CSS px guidance), full-page-weight and load-time measurement, and an end-to-end
  interaction test of the mobile navigation menu (open → links present → click →
  navigates → closes).

This is a genuine, scripted check against the built production bundle (`vite preview`
serving `dist/`), not a manual guess — but it is still emulation. It does not replace
an actual pass on physical hardware over a real carrier network, which behaves
differently in ways emulation can't fully capture (real GPU/CPU throttling, real radio
latency variance, OS-level font rendering, actual carrier data compression proxies on
some Android browsers, etc.).

## Findings & fixes made this sprint

1. **Critical: no mobile navigation.** `SiteHeader`'s nav links were `hidden md:flex`
   with no fallback — below the `md` breakpoint, a visitor could only reach Home and
   Contact (via the persistent CTA button); Services, Work, Pricing, and About were
   unreachable without editing the URL directly. This is the single most important
   finding, given the brief that most visitors arrive on phones. **Fixed:** added an
   accessible hamburger menu (`aria-expanded`, `aria-controls`, keyboard-reachable,
   respects `prefers-reduced-motion` via the existing global rule) that reveals the
   same four nav links in a dropdown panel, verified end-to-end with the interaction
   test above.
2. **Footer/header nav link tap targets were vertically tight** (~20px hit height on
   text-only links). **Fixed:** added `py-2`/`inline-flex items-center` so each link's
   effective tap area is closer to the 44px guidance without changing the visual text
   size or the brand's plain-text link styling.
3. **No horizontal overflow** was found on any of the six routes at 360px width.
4. **New portfolio images load correctly** and are lazy-loaded
   (`loading="lazy"`, explicit `width`/`height` to avoid layout shift) — added as part
   of the Sprint 2 portfolio content work.
5. **Page weight:** home page first load is ~295 KB total across 7 requests (JS, CSS,
   4 font files). At the emulated Slow-3G profile this loaded in ~2.2s. This is
   already reasonably lean; a deeper performance pass (font subsetting, code
   splitting, Lighthouse scoring) is explicitly Sprint 4 scope per
   `docs/SPRINT-PLAN.md`, not Sprint 2's.

## Still needs a human, on a real device

Before fully closing this checklist item, spot-check the following on an actual
low-end Android phone on a real network, ideally throttled via the OS or carrier:

- [ ] Font rendering and line-wrapping at real system font-smoothing settings (emulated
      Chromium renders fonts slightly differently than on-device Android Chrome).
- [ ] Actual perceived load feel on a real cellular connection, not just CDP-throttled
      bandwidth (real radio latency spikes are less uniform than the emulated profile).
- [ ] The WhatsApp floating button's position doesn't obscure content in a real
      on-screen keyboard scenario (e.g., while the contact form is focused).
- [ ] Tap accuracy on the new hamburger menu and mobile nav links with an actual thumb,
      not a scripted click.

None of these are expected to surface new blocking issues given the automated results
above, but "expected to be fine" and "verified" are different claims — this file
exists so that distinction stays visible rather than getting rounded up.
