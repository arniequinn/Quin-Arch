import { useEffect, useState } from "react";

// True once the page has finished loading (and the browser has a moment to spare), false before —
// including in the prerendered HTML. The ribbons load their images only then (v3.0 phase 8): on
// the landing screen they're thin bands, so their pictures shouldn't compete with the fonts and
// the page's title for the first seconds of a slow connection. A timeout caps the wait, since
// `load` also waits for embedded videos.
export function useAfterLoad(maxWaitMs = 3000): boolean {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let done = false;
    const go = () => {
      if (done) return;
      done = true;
      const idle = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number })
        .requestIdleCallback;
      if (idle) idle(() => setReady(true), { timeout: 800 });
      else setTimeout(() => setReady(true), 150);
    };
    if (document.readyState === "complete") go();
    else window.addEventListener("load", go, { once: true });
    const cap = setTimeout(go, maxWaitMs);
    return () => {
      window.removeEventListener("load", go);
      clearTimeout(cap);
    };
  }, [maxWaitMs]);
  return ready;
}
