import { StrictMode, type ReactNode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { DEFAULT_SPECIALIST_PROFILE } from "../data/architecturalData";
import { trackContactClicks } from "../services/analytics";
import { hasSavedSpecialistProfile, loadSpecialistProfile } from "../services/specialistProfile";
import { SpecialistProfile } from "../types";
import "../index.css";

// Every HTML entry (index.html → src/main.tsx, every other page → src/entries/*-main.tsx) passes
// its page to mountPage and exports the result as `render`:
//  - In the browser, the page is mounted into #root, hydrating the HTML prerendered there.
//  - At build time, vite-seo-plugin.ts imports the same module in Node (via src/prerender.tsx),
//    where there is no document, and calls `render` to produce that HTML. The prerendered markup
//    and the hydrated page therefore always come from one component tree.
export function mountPage(page: (specialist: SpecialistProfile) => ReactNode) {
  const render = (specialist: SpecialistProfile) => <StrictMode>{page(specialist)}</StrictMode>;

  if (typeof document !== "undefined") {
    const container = document.getElementById("root")!;
    // Pages are prerendered with the default profile. The owner's own browser can hold an edited
    // one (see specialistProfile.ts) that wouldn't match that markup, so it renders fresh instead.
    if (container.hasAttribute("data-prerendered") && !hasSavedSpecialistProfile()) {
      hydrateRoot(container, render(DEFAULT_SPECIALIST_PROFILE));
    } else {
      createRoot(container).render(render(loadSpecialistProfile()));
    }
    trackContactClicks();
  }

  return render;
}
