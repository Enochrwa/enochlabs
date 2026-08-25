import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { trackPageview } from "@/lib/analytics";

/**
 * Fires a Plausible pageview on mount and on every subsequent client-side
 * route change. See `src/lib/analytics.ts` for why this is manual rather than
 * automatic. Renders nothing — mount once near the app root, like
 * `ScrollToTop`.
 */
export function Analytics() {
  const location = useLocation();

  useEffect(() => {
    trackPageview(location.pathname);
  }, [location.pathname]);

  return null;
}
