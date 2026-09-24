import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  const mql = window.matchMedia(QUERY);
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
}

// motion's useReducedMotion() reads the media query during the very first render. Pages are
// prerendered with motion on, so for visitors who prefer reduced motion that first render would
// produce a different tree than the HTML being hydrated. useSyncExternalStore renders the server
// value (false) while hydrating and switches to the real one straight after; on a plain client
// render it uses the real value from the start.
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
}
