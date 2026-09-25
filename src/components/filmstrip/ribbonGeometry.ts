import { FilmstripTemplate } from "../../data/filmstrips";

// Shared by both ribbon presets (RibbonSequence.tsx: the homepage; RibbonFrame.tsx: every other page).

// Sticky navbar height (Navbar.tsx `h-16`). The stage sits directly below it.
export const NAV_H = 64;
// Gap between the two ribbons — deliberately a sliver of void.
export const RIBBON_GAP = 8;
export const SPEED_PX = 36;

// How much of the stage a band fills when fully open is computed, not fixed (v3.0 §12): never
// taller than the shortest image on its strip, so nothing is upscaled, and never more than the
// strip's own cap (the exterior renders keep their 0.75; drawings and screens stay smaller still).
export const bandScale = (strip: FilmstripTemplate, openH: number) => Math.min(strip.maxScale, strip.minHeight / openH, 1);

// Drawing sheets sit edge to edge on white paper, a hairline apart; renders keep the usual gutter.
export const stripGap = (strip: FilmstripTemplate) => (strip.paper === "white" ? "gap-x-px" : undefined);

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

// Both ribbons share the stage: each band's fixed track is the largest window it ever opens to.
export function measure(): { stageH: number; width: number } {
  return { stageH: Math.max(320, window.innerHeight - NAV_H), width: window.innerWidth };
}

// The prerendered HTML can't know the visitor's viewport, so the first render — on the server
// and the hydrating render in the browser — uses this stand-in; the real size is measured in a
// layout effect, before the browser paints the hydrated page.
export const DEFAULT_DIMS = { stageH: 800, width: 1280 };

/** Thin-ribbon height: 6% of the stage, between 40 and 64 px. */
export const thinRibbon = (stageH: number) => Math.round(Math.min(64, Math.max(40, stageH * 0.06)));

export const pairH = (r: number) => 2 * r + RIBBON_GAP;
/** Where the pair sits once it has risen: a little above the middle of the stage. */
export const pairCenterTop = (s: number, r: number) => 0.4 * s - pairH(r) / 2;
/** The opening frame: the two thin bands together at the bottom of the stage. */
export const pairTop = (s: number, r: number) => s - pairH(r);
/** A top band fully open: centred in the space above the bottom band's sliver. */
export const topOpenTop = (s: number, r: number, t: number) => (s - r - RIBBON_GAP - t) / 2;
/** A bottom band fully open: centred in the space below the top band's sliver. */
export const bottomOpenTop = (s: number, r: number, t: number) => r + RIBBON_GAP + (s - r - RIBBON_GAP - t) / 2;
