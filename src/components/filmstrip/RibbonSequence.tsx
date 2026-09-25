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
import { FilmstripTemplate } from "../../data/filmstrips";
import { RibbonFrame } from "./RibbonFrame";
import {
  DEFAULT_DIMS,
  NAV_H,
  RIBBON_GAP,
  SPEED_PX,
  bandScale,
  clamp01,
  measure,
  pairCenterTop,
  pairH,
  pairTop,
  stripGap,
  thinRibbon,
  topOpenTop,
} from "./ribbonGeometry";

/** "full": the homepage — both bands open, with the chapter cards between them.
 *  "short": every other page — the pair rises, the top band opens once, then the two bands part
 *  to the edges of the screen and frame the page's own sections as they scroll by; at the end the
 *  bottom band opens and rises with the footer (RibbonFrame.tsx). */
export type RibbonPreset = "full" | "short";

interface RibbonSequenceProps {
  preset: RibbonPreset;
  hero: React.ReactNode;
  /** Short preset only: fills the whole landing screen behind the hero (e.g. a `HeroVideo`). */
  heroBackground?: React.ReactNode;
  /** Full preset only. Cards that pop into the void between the two ribbons, in order. The first
   *  one appears between the two takeovers; the rest follow one at a time afterwards.
   *  `compact` is true when the void is too small for the full-size layout. */
  chapters?: Array<(compact: boolean) => React.ReactNode>;
  /** Short preset only: the page's own sections, which scroll between the two bands. */
  children?: React.ReactNode;
  /** The top band's strip (it opens first) and the bottom band's. */
  top: FilmstripTemplate;
  bottom: FilmstripTemplate;
  /** Full preset: the link shown over both takeovers (the gallery preview). */
  galleryHref?: string;
  /** Where the persistent "skip" link jumps to. */
  skipHref?: string;
}

// The homepage's whole choreography, in units of one stage height of scroll (u = 0 at the first
// scroll). Every timing lives here so it can be tuned by feel. Point 12 of
// documentation/final-polish-v2.0.md: the sequence stays under 8 screen heights in total (it was
// 13.6). Owner, 2026-09-26: each band opens exactly once — the top band at the start, the bottom
// band only at the very end, after the last card, when it opens and then rises, fully open, with
// the footer (point 2) — the same ending as every other page with ribbons.
// RibbonFrame reuses the opening (stages 1–3).
export const U = {
  travelEnd: 0.5, //    stage 1: the ribbon pair rises from the bottom of the hero, the hero exits up
  expandEnd: 1.1, //    stage 2: the interior band opens to fill the stage
  shrinkStart: 1.35, // stage 3: the interior band recedes to the top...
  shrinkEnd: 1.85,
  firstCard: [1.65, 1.95, 2.55, 2.85] as const, // ...while the first card pops in, holds, pops out
  chaptersStart: 2.85, // stage 4: the remaining cards, one after another, between the thin bands
  chapterLen: 0.75,
  popLen: 0.22,
  endOpen: 0.5, //      stage 5: after the last card, the exterior band opens from the bottom edge...
  endHold: 0.15, //     ...holds, then rises fully open with the footer behind it (v3.0 point 2)
};


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

export const RibbonSequence: React.FC<RibbonSequenceProps> = ({ preset, ...props }) =>
  preset === "short" ? (
    <RibbonFrame hero={props.hero} heroBackground={props.heroBackground} top={props.top} bottom={props.bottom} skipHref={props.skipHref}>
      {props.children}
    </RibbonFrame>
  ) : (
    <FullSequence {...props} />
  );

const FullSequence: React.FC<Omit<RibbonSequenceProps, "preset">> = ({
  hero,
  chapters = [],
  top,
  bottom,
  galleryHref,
  skipHref = "#site-footer",
}) => {
  const interiorImages = top.images;
  const exteriorImages = bottom.images;
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
  const R = thinRibbon(S); // thin ribbon height
  const T = S - R - RIBBON_GAP; // largest window either band could open to
  const Ti = Math.round(T * bandScale(top, T)); // fixed image-track heights, per band
  const Te = Math.round(T * bandScale(bottom, T));
  // Extra native scroll the hero needs first when it's taller than the stage (phones).
  const E = Math.max(0, heroH - S);

  const extraChapters = Math.max(0, chapters.length - 1);
  const closeStart = U.chaptersStart + extraChapters * U.chapterLen;
  const endOpen = closeStart + U.endOpen;
  const U_TOTAL = endOpen + U.endHold;
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

  // Hero: consumed by native scroll first (sPre), then carried off the top during stage 1.
  const heroY = useTransform([sPre, u, sMV] as MotionValue<number>[], ([pre, uu, s]: number[]) =>
    -pre - s * transform(uu, [0, U.travelEnd], [0, 1], ease)
  );
  const heroPointer = useTransform(u, (v) => (v < 0.05 ? "auto" : "none"));

  // Interior (top ribbon). Fully open, the band is centred in the space above the exterior sliver;
  // during the cards it waits at the top of the stage, and in the close it comes back down to the pair.
  const intTop = geo((uu, s, r, ti) =>
    transform(
      uu,
      [0, U.travelEnd, U.expandEnd, U.shrinkStart, U.shrinkEnd],
      [pairTop(s, r), pairCenterTop(s, r), topOpenTop(s, r, ti), topOpenTop(s, r, ti), 0],
      ease
    )
  );
  const intH = geo((uu, _s, r, ti) =>
    transform(uu, [0, U.travelEnd, U.expandEnd, U.shrinkStart, U.shrinkEnd], [r, r, ti, ti, r], ease)
  );

  // Exterior (bottom ribbon) — rises with the pair, waits as a thin ribbon at the bottom of the
  // stage through every card, and opens only once: at the end, growing up from the bottom edge.
  const extTop = geo((uu, s, r, _ti, te) =>
    transform(
      uu,
      [0, U.travelEnd, U.expandEnd, closeStart, endOpen],
      [pairTop(s, r) + r + RIBBON_GAP, pairCenterTop(s, r) + r + RIBBON_GAP, s - r, s - r, s - te],
      ease
    )
  );
  const extH = geo((uu, _s, r, _ti, te) =>
    transform(
      uu,
      [0, closeStart, endOpen],
      [r, r, te],
      ease
    )
  );

  // Gallery-preview link: visible while a band is fully open.
  const interiorLinkOpacity = useTransform(u, [U.travelEnd + 0.35, U.expandEnd, U.shrinkStart, U.shrinkStart + 0.15], [0, 1, 1, 0]);
  const exteriorLinkOpacity = useTransform(u, [endOpen - 0.15, endOpen], [0, 1]);
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
      else if (uu > closeStart) exteriorDir.set(dir);
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
          <ScrollFilmstrip images={interiorImages} direction="right" gapClassName={stripGap(top)} />
        </section>
        {chapters.map((render, i) => (
          <div key={i} className="py-12">
            {render(false)}
          </div>
        ))}
        <section className="relative border-t border-neutral-900 bg-neutral-950 py-3 sm:py-4">
          <ScrollFilmstrip images={exteriorImages} direction="left" gapClassName={stripGap(bottom)} />
        </section>
      </>
    );
  }

  const windowFor = (i: number): readonly [number, number, number, number] => {
    if (i === 0) return U.firstCard;
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
          gapClassName={stripGap(top)}
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
          gapClassName={stripGap(bottom)}
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
          className="absolute right-4 z-20 text-label font-semibold text-neutral-300 transition-colors after:absolute after:-inset-x-2 after:-inset-y-3 hover:text-amber-300 sm:right-6"
          style={{ opacity: skipOpacity, pointerEvents: skipPointer, top: R + RIBBON_GAP + 12 }}
        >
          Skip intro ↓
        </motion.a>
      </div>
    </div>
  );
};
