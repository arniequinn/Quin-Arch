import type { ReactElement } from "react";
import { renderToString } from "react-dom/server";
import { DEFAULT_SPECIALIST_PROFILE } from "./data/architecturalData";
import { SpecialistProfile } from "./types";

// Build-time only. vite-seo-plugin.ts bundles this for Node after the client build and calls
// renderPage once per HTML entry. It renders exactly what the browser mounts — each entry's
// exported `render` (see entries/mountPage.tsx) — with the default specialist profile.
const pages = import.meta.glob<{ render: (specialist: SpecialistProfile) => ReactElement }>(
  ["/src/main.tsx", "/src/entries/*-main.tsx"],
  { eager: true },
);

/** `entry` is the module a page's HTML loads, exactly as in its <script src>, e.g. "/src/main.tsx". */
export function renderPage(entry: string): string {
  const page = pages[entry];
  if (!page?.render) {
    throw new Error(`${entry} doesn't export a render function — wrap the page in mountPage()`);
  }
  return renderToString(page.render(DEFAULT_SPECIALIST_PROFILE));
}
