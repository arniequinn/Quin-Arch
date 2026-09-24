import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  motion,
  MotionValue,
  backOut,
  easeInOut,
  transform,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "motion/react";
import { FilmstripMask } from "./FilmstripMask";
import { ScrollFilmstrip } from "./ScrollFilmstrip";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";
import { Button } from "../Button";
import { TrackImage } from "../../types";

interface HeroSequenceProps {
  hero: React.ReactNode;
  /** Cards that pop into the void between the two ribbons, in order. The first one appears
   *  between the interior and exterior takeovers; the rest follow one at a time afterwards.
   *  `compact` is true when the void is too small for the full-size layout. */
  chapters: Array<(compact: boolean) => React.ReactNode>;
  interiorImages: TrackImage[];
  exteriorImages: TrackImage[];
  /** Link shown over both takeovers (the gallery preview). */
  galleryHref?: string;
  /** Where the persistent "skip" link jumps to. */
  skipHref?: string;
}

// Sticky navbar height (Navbar.tsx `h-16`). The stage sits directly below it.
const NAV_H = 64;
// Gap between the two ribbons — deliberately a sliver of void.
const RIBBON_GAP = 8;
const SPEED_PX = 36;

// How much of the full-stage track height each band uses when fully open (1 = fills the stage).
// The exterior renders are lower-resolution than the interior ones, so that band stays smaller
// (leaving some void around it) to keep them from being upscaled into softness.
const INTERIOR_SCALE = 1;
const EXTERIOR_SCALE = 0.75;

// The whole choreography, in units of one stage height of scroll (u = 0 at the first scroll).
// Every timing lives here so it can be tuned by feel. Point 12 of
// documentation/final-polish-v2.0.md: the sequence stays under 8 screen heights in total (it was
// 13.6); R3: after the last card, the bands close up into the opening pair and release the page.
const U = {
  travelEnd: 0.5, //    stage 1: the ribbon pair rises from the bottom of the hero, the hero exits up
  expandEnd: 1.1, //    stage 2: the interior band opens to fill the stage
  shrinkStart: 1.35, // stage 3: the interior band recedes to the top...
  shrinkEnd: 1.85,
  profile: [1.65, 1.95, 2.55, 2.85] as const, // ...while the profile card pops in, holds, pops out
  exteriorStart: 2.85, // stage 4: the exterior band opens once
  exteriorEnd: 3.35,
  recedeStart: 3.6, //  stage 5: ...and recedes to a thin ribbon at the bottom
  recedeEnd: 4.0,
  chaptersStart: 4.0, // the remaining cards, one after another
  chapterLen: 0.75,
  popLen: 0.22,
  closeLen: 0.45, //    stage 6: the bands close into the opening pair; then the page scrolls on
};

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

// Both ribbons share the stage: each band's fixed track is the largest window it ever opens to.
function measure(): { stageH: number; width: number } {
  return { stageH: Math.max(320, window.innerHeight - NAV_H), width: window.innerWidth };
}

// The prerendered HTML can't know the visitor's viewport, so the first render — on the server
// and the hydrating render in the browser — uses this stand-in; the real size is measured in a
// layout effect, before the browser paints the hydrated page.
const DEFAULT_DIMS = { stageH: 800, width: 1280 };

interface CardLayerProps {
  u: MotionValue<number>;
  /** [in start, in end, out start, out end] in scroll units. */
  win: readonly [number, number, number, number];
  top: number;
  bottom: number;
  voidH: number;
  compactNow: boolean;
  render: (compact: boolean) => React.ReactNode;
}

// One card in the void. The pop is a single function of progress p (0 → 1): played forward on
// entry and backward on exit, so the exit is exactly the entrance reversed. Back-out easing gives
// a small overshoot. While invisible the card is `inert` so keyboard users can't tab into it.
const CardLayer: React.FC<CardLayerProps> = ({ u, win, top, bottom, voidH, compactNow, render }) => {
  const innerRef = useRef<HTMLDivElement>(null);
  const [cardH, setCardH] = useState(0);
  const [active, setActive] = useState(false);

  useLayoutEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    const read = () => setCardH(el.offsetHeight);
    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, [compactNow]);

  const p = useTransform(u, (v: number) =>
    Math.min(clamp01((v - win[0]) / (win[1] - win[0])), clamp01((win[3] - v) / (win[3] - win[2])))
  );
  const opacity = useTransform(p, (v) => clamp01(v * 1.8));
  const scale = useTransform(p, (v) => 0.88 + 0.12 * backOut(v));
  const y = useTransform(p, (v) => 36 * (1 - backOut(v)));
  const pointer = useTransform(opacity, (o) => (o > 0.7 ? "auto" : "none"));
  const visibility = useTransform(opacity, (o) => (o > 0 ? "visible" : "hidden"));
  useMotionValueEvent(opacity, "change", (o) => setActive(o > 0.7));

  // Last-resort guarantee: if the card is still taller than the void, scale it down to fit.
  const fit = cardH > voidH ? Math.max(0.45, voidH / cardH) : 1;

  return (
    <motion.div
      className="absolute inset-x-0 z-[5] flex items-center justify-center overflow-hidden"
      style={{ top, bottom, opacity, scale, y, pointerEvents: pointer, visibility }}
      inert={!active}
      aria-hidden={!active}
    >
      <div ref={innerRef} className="w-full" style={{ transform: `scale(${fit})`, transformOrigin: "center" }}>
        {render(compactNow)}
      </div>
    </motion.div>
  );
};

export const HeroSequence: React.FC<HeroSequenceProps> = ({
  hero,
  chapters,
  interiorImages,
  exteriorImages,
  galleryHref,
  skipHref = "#site-footer",
}) => {
  const reduceMotion = usePrefersReducedMotion();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  const [dims, setDims] = useState(DEFAULT_DIMS);
  const [heroH, setHeroH] = useState(0);
  // Compositor hints and the ribbons' marquees only run while the sequence is on screen.
  const [onScreen, setOnScreen] = useState(true);

  useLayoutEffect(() => {
    setDims(measure());
  }, []);

  // Ignore small height-only changes (mobile URL bar showing/hiding) so the stage doesn't jitter.
  useEffect(() => {
    const onResize = () => {
      const next = measure();
      setDims((prev) =>
        next.width !== prev.width || Math.abs(next.stageH - prev.stageH) > 120 ? next : prev
      );
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, [reduceMotion]);

  useLayoutEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const read = () => setHeroH(el.offsetHeight);
    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, [reduceMotion]);

  const S = dims.stageH;
  const R = Math.round(Math.min(64, Math.max(40, S * 0.06))); // thin ribbon height
  const T = S - R - RIBBON_GAP; // largest window either band could open to
  const Ti = Math.round(T * INTERIOR_SCALE); // fixed image-track heights, per band
  const Te = Math.round(T * EXTERIOR_SCALE);
  // Extra native scroll the hero needs first when it's taller than the stage (phones).
  const E = Math.max(0, heroH - S);

  const extraChapters = Math.max(0, chapters.length - 1);
  const closeStart = U.chaptersStart + extraChapters * U.chapterLen;
  const U_TOTAL = closeStart + U.closeLen;
  const wrapperH = E + (U_TOTAL + 1) * S;

  const sMV = useMotionValue(S);
  const rMV = useMotionValue(R);
  const tiMV = useMotionValue(Ti);
  const teMV = useMotionValue(Te);
  const eMV = useMotionValue(E);
  useEffect(() => {
    sMV.set(S);
    rMV.set(R);
    tiMV.set(Ti);
    teMV.set(Te);
    eMV.set(E);
  }, [S, R, E, Ti, Te, sMV, rMV, eMV, tiMV, teMV]);

  const { scrollYProgress } = useScroll({ target: wrapperRef, offset: [`start ${NAV_H}px`, "end end"] });

  // Pre-phase scroll consumed by a tall hero, and the choreography progress u after it.
  const sPre = useTransform([scrollYProgress, sMV, eMV] as MotionValue<number>[], ([p, s, e]: number[]) =>
    Math.min(e, Math.max(0, p * (e + U_TOTAL * s)))
  );
  const u = useTransform([scrollYProgress, sMV, eMV] as MotionValue<number>[], ([p, s, e]: number[]) =>
    Math.min(U_TOTAL, Math.max(0, (p * (e + U_TOTAL * s) - e) / s))
  );

  const ease = { ease: easeInOut };
  const geo = (fn: (uu: number, s: number, r: number, ti: number, te: number) => number) =>
    useTransform(
      [u, sMV, rMV, tiMV, teMV] as MotionValue<number>[],
      ([uu, s, r, ti, te]: number[]) => fn(uu, s, r, ti, te)
    );

  const pairH = (r: number) => 2 * r + RIBBON_GAP;
  const pairCenterTop = (s: number, r: number) => 0.4 * s - pairH(r) / 2;
  // The opening frame (u = 0) and the closing frame (u = U_TOTAL) are the same: the two thin
  // bands together as a pair at the bottom of the stage.
  const pairTop = (s: number, r: number) => s - pairH(r);

  // Hero: consumed by native scroll first (sPre), then carried off the top during stage 1.
  const heroY = useTransform([sPre, u, sMV] as MotionValue<number>[], ([pre, uu, s]: number[]) =>
    -pre - s * transform(uu, [0, U.travelEnd], [0, 1], ease)
  );
  const heroPointer = useTransform(u, (v) => (v < 0.05 ? "auto" : "none"));

  // Interior (top ribbon). Fully open, the band is centred in the space above the exterior sliver;
  // during the cards it waits at the top of the stage, and in the close it comes back down to the pair.
  const intOpenTop = (s: number, r: number, ti: number) => (s - r - RIBBON_GAP - ti) / 2;
  const intTop = geo((uu, s, r, ti) =>
    transform(
      uu,
      [0, U.travelEnd, U.expandEnd, U.shrinkStart, U.shrinkEnd, closeStart, U_TOTAL],
      [pairTop(s, r), pairCenterTop(s, r), intOpenTop(s, r, ti), intOpenTop(s, r, ti), 0, 0, pairTop(s, r)],
      ease
    )
  );
  const intH = geo((uu, _s, r, ti) =>
    transform(uu, [0, U.travelEnd, U.expandEnd, U.shrinkStart, U.shrinkEnd, U_TOTAL], [r, r, ti, ti, r, r], ease)
  );

  // Exterior (bottom ribbon) — opens once (stage 4), then waits as a thin ribbon at the bottom of
  // the stage, which is already where the closing pair needs it.
  const extOpenTop = (s: number, r: number, te: number) => r + RIBBON_GAP + (s - r - RIBBON_GAP - te) / 2;
  const extTop = geo((uu, s, r, _ti, te) =>
    transform(
      uu,
      [0, U.travelEnd, U.expandEnd, U.exteriorStart, U.exteriorEnd, U.recedeStart, U.recedeEnd, U_TOTAL],
      [
        pairTop(s, r) + r + RIBBON_GAP,
        pairCenterTop(s, r) + r + RIBBON_GAP,
        s - r,
        s - r,
        extOpenTop(s, r, te),
        extOpenTop(s, r, te),
        s - r,
        s - r,
      ],
      ease
    )
  );
  const extH = geo((uu, _s, r, _ti, te) =>
    transform(
      uu,
      [0, U.exteriorStart, U.exteriorEnd, U.recedeStart, U.recedeEnd, U_TOTAL],
      [r, r, te, te, r, r],
      ease
    )
  );

  // Gallery-preview link: visible while a band is fully open.
  const interiorLinkOpacity = useTransform(u, [U.travelEnd + 0.35, U.expandEnd, U.shrinkStart, U.shrinkStart + 0.15], [0, 1, 1, 0]);
  const exteriorLinkOpacity = useTransform(u, [U.exteriorEnd - 0.15, U.exteriorEnd, U.recedeStart, U.recedeStart + 0.15], [0, 1, 1, 0]);
  const interiorLinkPointer = useTransform(interiorLinkOpacity, (o) => (o > 0.5 ? "auto" : "none"));
  const exteriorLinkPointer = useTransform(exteriorLinkOpacity, (o) => (o > 0.5 ? "auto" : "none"));
  const skipOpacity = useTransform(u, [0.3, 0.6, closeStart - 0.2, closeStart], [0, 1, 1, 0]);
  const skipPointer = useTransform(skipOpacity, (o) => (o > 0.5 ? "auto" : "none"));

  // Cursor / finger steers whichever band is currently expanded (left half ↔ right half).
  const interiorDir = useMotionValue(1);
  const exteriorDir = useMotionValue(-1);
  useEffect(() => {
    const el = stageRef.current;
    if (!el || reduceMotion) return;
    const setFromX = (clientX: number) => {
      const rect = el.getBoundingClientRect();
      const dir = clientX < rect.left + rect.width / 2 ? -1 : 1;
      const uu = u.get();
      if (uu > U.travelEnd && uu < U.shrinkEnd) interiorDir.set(dir);
      else if (uu > U.exteriorStart && uu < U.recedeEnd) exteriorDir.set(dir);
    };
    const onPointer = (e: PointerEvent) => setFromX(e.clientX);
    const onTouch = (e: TouchEvent) => e.touches[0] && setFromX(e.touches[0].clientX);
    el.addEventListener("pointermove", onPointer);
    el.addEventListener("touchmove", onTouch, { passive: true });
    return () => {
      el.removeEventListener("pointermove", onPointer);
      el.removeEventListener("touchmove", onTouch);
    };
  }, [u, interiorDir, exteriorDir, reduceMotion]);

  const voidH = S - 2 * (R + RIBBON_GAP) - 12;
  const compact = dims.width < 1024 || S - 2 * R - 2 * RIBBON_GAP < 560;

  // Accessibility fallback only: no scroll choreography, just the pieces in a plain stack.
  if (reduceMotion) {
    return (
      <>
        <div ref={heroRef}>{hero}</div>
        <section className="relative border-t border-neutral-900 bg-neutral-950 py-3 sm:py-4">
          <ScrollFilmstrip images={interiorImages} direction="right" />
        </section>
        {chapters.map((render, i) => (
          <div key={i} className="py-12">
            {render(false)}
          </div>
        ))}
        <section className="relative border-t border-neutral-900 bg-neutral-950 py-3 sm:py-4">
          <ScrollFilmstrip images={exteriorImages} direction="left" />
        </section>
      </>
    );
  }

  const windowFor = (i: number): readonly [number, number, number, number] => {
    if (i === 0) return U.profile;
    const a = U.chaptersStart + (i - 1) * U.chapterLen;
    return [a, a + U.popLen, a + U.chapterLen - U.popLen, a + U.chapterLen];
  };

  const linkClass = "absolute left-1/2 z-20 -translate-x-1/2";

  return (
    <div ref={wrapperRef} className="relative" style={{ height: wrapperH }}>
      <div ref={stageRef} className="sticky overflow-hidden bg-neutral-950" style={{ top: NAV_H, height: S }}>
        {/* Hero: exits up through the top of the stage */}
        <motion.div
          className="absolute inset-x-0 top-0 z-0"
          style={{ y: heroY, pointerEvents: heroPointer, willChange: onScreen ? "transform" : "auto" }}
        >
          {/* --ribbon-clear: how far the hero section keeps its content above the ribbons resting at the bottom edge (the video still runs beneath them) */}
          <div ref={heroRef} className="flex flex-col" style={{ minHeight: S, ["--ribbon-clear" as string]: `${pairH(R) + 16}px` }}>
            {hero}
          </div>
        </motion.div>

        {/* The void between the ribbons — cards pop into it, one at a time */}
        {chapters.map((render, i) => (
          <CardLayer
            key={i}
            u={u}
            win={windowFor(i)}
            top={R + RIBBON_GAP}
            bottom={R + RIBBON_GAP}
            voidH={voidH}
            compactNow={compact}
            render={render}
          />
        ))}

        <FilmstripMask
          images={interiorImages}
          direction="right"
          directionOverride={interiorDir}
          speedPx={SPEED_PX}
          height={intH}
          top={intTop}
          trackHeight={Ti}
          angledEdge="bottom"
          paused={!onScreen}
          willChange={onScreen}
          className="z-10"
        />
        <FilmstripMask
          images={exteriorImages}
          direction="left"
          directionOverride={exteriorDir}
          speedPx={SPEED_PX}
          height={extH}
          top={extTop}
          trackHeight={Te}
          angledEdge="top"
          paused={!onScreen}
          willChange={onScreen}
          className="z-10"
        />

        {galleryHref && (
          <>
            <motion.div
              className={linkClass}
              style={{ opacity: interiorLinkOpacity, pointerEvents: interiorLinkPointer, bottom: R + RIBBON_GAP + 20 }}
            >
              <Button href={galleryHref} variant="secondary" size="sm" arrow>
                View the full project library
              </Button>
            </motion.div>
            <motion.div
              className={linkClass}
              style={{ opacity: exteriorLinkOpacity, pointerEvents: exteriorLinkPointer, bottom: 20 }}
            >
              <Button href={galleryHref} variant="secondary" size="sm" arrow>
                View the full project library
              </Button>
            </motion.div>
          </>
        )}

        <motion.a
          href={skipHref}
          className="absolute right-4 z-20 text-label font-semibold text-neutral-300 transition-colors hover:text-amber-300 sm:right-6"
          style={{ opacity: skipOpacity, pointerEvents: skipPointer, top: R + RIBBON_GAP + 12 }}
        >
          Skip intro ↓
        </motion.a>
      </div>
    </div>
  );
};
