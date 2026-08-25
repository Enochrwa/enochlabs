/**
 * Privacy-friendly analytics via Plausible (docs/SPRINT-PLAN.md Sprint 4).
 *
 * Entirely opt-in: everything here is a no-op unless `VITE_PLAUSIBLE_DOMAIN` is
 * set (see `frontend/.env.example`). Plausible is cookieless and doesn't
 * collect personal data, which is why it's the analytics choice here — see
 * `docs/ROADMAP.md` Phase 1 ("Analytics in place (privacy-friendly...)").
 *
 * The site is a client-rendered SPA (React Router), so we load Plausible's
 * "manual" script variant — it does NOT auto-track the first pageview — and
 * instead fire every pageview ourselves via `trackPageview()`, once per route
 * change including the first. Without this, only the initial hard page load
 * would ever be counted; client-side navigations to /services, /pricing, etc.
 * would be invisible to analytics entirely.
 */

const domain = import.meta.env.VITE_PLAUSIBLE_DOMAIN;

type PlausibleArgs = [
  eventName: string,
  options?: { props?: Record<string, string | number | boolean> },
];

declare global {
  interface Window {
    plausible?: {
      (...args: PlausibleArgs): void;
      q?: PlausibleArgs[];
    };
  }
}

let scriptInjected = false;

/**
 * Injects the Plausible script tag once, and installs the small stub queue
 * function Plausible's own docs recommend — it lets `trackEvent`/
 * `trackPageview` calls made before the real script finishes loading queue up
 * instead of being silently dropped.
 */
function ensureScriptLoaded(): void {
  if (!domain || scriptInjected || typeof document === "undefined") return;
  scriptInjected = true;

  window.plausible =
    window.plausible ||
    function plausibleStub(...args: PlausibleArgs) {
      (window.plausible!.q = window.plausible!.q || []).push(args);
    };

  const script = document.createElement("script");
  script.defer = true;
  script.dataset.domain = domain;
  // "manual" variant: no automatic pageview/outbound-link tracking, since we
  // drive pageviews ourselves for correct SPA behavior (see module docblock).
  script.src = "https://plausible.io/js/script.manual.js";
  document.head.appendChild(script);
}

/** Records a pageview for the given path. Safe to call with analytics disabled. */
export function trackPageview(path: string): void {
  if (!domain) return;
  ensureScriptLoaded();
  window.plausible?.("pageview", { props: { path } });
}

/** Records a custom event/goal (e.g. "Contact Form Submit"). Safe to call with analytics disabled. */
export function trackEvent(
  eventName: string,
  props?: Record<string, string | number | boolean>,
): void {
  if (!domain) return;
  ensureScriptLoaded();
  window.plausible?.(eventName, props ? { props } : undefined);
}
