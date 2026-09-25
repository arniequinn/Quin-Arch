import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion, MotionValue, easeInOut, transform, useMotionValue, useScroll, useTransform } from "motion/react";
import { FilmstripMask } from "./FilmstripMask";
import { ScrollFilmstrip } from "./ScrollFilmstrip";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";
import { Button } from "../Button";
import { FilmstripTemplate } from "../../data/filmstrips";
import {
  DEFAULT_DIMS,
  NAV_H,
  RIBBON_GAP,
  SPEED_PX,
  bandScale,
  measure,
  pairCenterTop,
  pairH,
  pairTop,
  stripGap,
  thinRibbon,
  topOpenTop,
} from "./ribbonGeometry";

interface RibbonFrameProps {
  hero: React.ReactNode;
  heroBackground?: React.ReactNode;
  top: FilmstripTemplate;
  bottom: FilmstripTemplate;
  /** The page's own sections. */
  children: React.ReactNode;
  skipHref?: string;
}

// The opening, in stage heights of scroll after any extra hero height (the homepage's stages 1–3).
const OPEN = {
  travelEnd: 0.5, //  the pair rises from the bottom of the hero to the middle; the hero exits up
  expandEnd: 1.1, //  the top band opens
  shrinkStart: 1.35, // ...holds, then parts: the top band recedes to the top edge, the bottom band
  shrinkEnd: 1.85, //    already waits at the bottom edge — the frame is formed
};
// The page's sections start rising into view as the top band begins to recede.
const BODY_IN = OPEN.shrinkStart;
// After the bottom band has opened fully, it holds for this much scroll before rising with the footer.
const END_HOLD = 0.15;

// Every page but the homepage (v3.0 §12, as refined by the owner): the same opening as the
// homepage — the pair at the bottom of the hero rises to the middle and the top band opens — then
// the two bands part to the top and bottom edges of the screen and stay there as a frame while the
// page's own sections scroll through the space between them. At the very end, the bottom band
// opens (it grows upward right behind the last section) and then rises, fully open, with the
// footer coming up behind it.
//
// Built as one sticky layer over the whole page: the layer never moves while the page is read, so
// the bands never jump; it holds the hero, the two bands and two links, and passes every click
// through to the page beneath. Transforms and clip-paths only, as on the homepage.
export const RibbonFrame: React.FC<RibbonFrameProps> = ({ hero, heroBackground, top, bottom, children, skipHref = "#page-body" }) => {
  const reduceMotion = usePrefersReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  const [dims, setDims] = useState(DEFAULT_DIMS);
  const [heroH, setHeroH] = useState(0);
  const [bodyH, setBodyH] = useState(0);
  const [containerTop, setContainerTop] = useState(NAV_H);
  const [onScreen, setOnScreen] = useState(true);

  useLayoutEffect(() => {
    setDims(measure());
  }, []);

  // Ignore small height-only changes (mobile URL bar showing/hiding) so the frame doesn't jitter.
  useEffect(() => {
    const onResize = () => {
      const next = measure();
      setDims((prev) => (next.width !== prev.width || Math.abs(next.stageH - prev.stageH) > 120 ? next : prev));
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, [reduceMotion]);

  useLayoutEffect(() => {
    const observe = (el: HTMLElement | null, set: (h: number) => void) => {
      if (!el) return () => {};
      const read = () => set(el.offsetHeight);
      read();
      const ro = new ResizeObserver(read);
      ro.observe(el);
      return () => ro.disconnect();
    };
    const a = observe(heroRef.current, setHeroH);
    const b = observe(bodyRef.current, setBodyH);
    return () => {
      a();
      b();
    };
  }, [reduceMotion]);

  // Where the frame starts on the page (below the navbar, and anything else above it).
  useLayoutEffect(() => {
    const el = containerRef.current;
    if (el) setContainerTop(el.getBoundingClientRect().top + window.scrollY);
  }, [dims, heroH, bodyH]);

  const S = dims.stageH;
  const R = thinRibbon(S);
  const T = S - R - RIBBON_GAP; // the largest window either band opens to
  const Ti = Math.round(T * bandScale(top, T));
  const Te = Math.round(T * bandScale(bottom, T));
  // Extra native scroll the hero needs first when it's taller than the stage (phones).
  const E = Math.max(0, heroH - S);

  // Layout, top to bottom: the sticky layer (S tall, in the flow), a spacer while the opening
  // plays, the page's sections, and a spacer for the ending. Scroll distance d runs from 0 (the
  // frame's top under the navbar) to the moment the layer lets go and rises with the footer.
  const bodyIn = E + BODY_IN * S; // d at which the sections' top edge reaches the bottom of the screen
  const endStart = bodyIn + bodyH + R; // d at which their last edge reaches the bottom band
  const endOpen = endStart + (Te - R); // the bottom band grows 1:1 behind that edge until it's open
  const endH = Te + END_HOLD * S; // spacer after the sections: the last edge clears the band, it grows, it holds

  // Every value the geometry needs, read by one transform (kept in a ref, bumped on change).
  const g = useRef({ S, R, Ti, Te, E, endStart, endOpen, containerTop });
  g.current = { S, R, Ti, Te, E, endStart, endOpen, containerTop };
  const version = useMotionValue(0);
  useEffect(() => {
    version.set(version.get() + 1);
  }, [S, R, Ti, Te, E, endStart, endOpen, containerTop, version]);

  const { scrollY } = useScroll();
  const frame = <V,>(fn: (d: number, v: typeof g.current) => V) =>
    useTransform([scrollY, version] as MotionValue<number>[], ([y]: number[]) => {
      const v = g.current;
      return fn(y + NAV_H - v.containerTop, v);
    });

  const ease = { ease: easeInOut };
  const uOf = (d: number, v: typeof g.current) => Math.min(OPEN.shrinkEnd, Math.max(0, (d - v.E) / v.S));

  const heroY = frame((d, v) => -Math.min(Math.max(d, 0), v.E) - v.S * transform(uOf(d, v), [0, OPEN.travelEnd], [0, 1], ease));
  const heroPointer = frame((d, v) => (uOf(d, v) < 0.05 ? "auto" : "none"));

  const topTop = frame((d, v) =>
    transform(
      uOf(d, v),
      [0, OPEN.travelEnd, OPEN.expandEnd, OPEN.shrinkStart, OPEN.shrinkEnd],
      [pairTop(v.S, v.R), pairCenterTop(v.S, v.R), topOpenTop(v.S, v.R, v.Ti), topOpenTop(v.S, v.R, v.Ti), 0],
      ease
    )
  );
  const topH = frame((d, v) =>
    transform(uOf(d, v), [0, OPEN.travelEnd, OPEN.expandEnd, OPEN.shrinkStart, OPEN.shrinkEnd], [v.R, v.R, v.Ti, v.Ti, v.R], ease)
  );

  // The bottom band: rises with the pair, waits at the bottom edge through the page, then opens.
  const bottomH = frame((d, v) => Math.min(v.Te, Math.max(v.R, v.R + d - v.endStart)));
  const bottomTop = frame((d, v) => {
    if (d >= v.endStart) return v.S - Math.min(v.Te, v.R + d - v.endStart);
    return transform(
      uOf(d, v),
      [0, OPEN.travelEnd, OPEN.expandEnd],
      [pairTop(v.S, v.R) + v.R + RIBBON_GAP, pairCenterTop(v.S, v.R) + v.R + RIBBON_GAP, v.S - v.R],
      ease
    );
  });

  const linkOpacity = frame((d, v) =>
    transform(uOf(d, v), [OPEN.travelEnd + 0.35, OPEN.expandEnd, OPEN.shrinkStart, OPEN.shrinkStart + 0.15], [0, 1, 1, 0])
  );
  const linkPointer = useTransform(linkOpacity, (o) => (o > 0.5 ? "auto" : "none"));
  const skipOpacity = frame((d, v) => transform(uOf(d, v), [0.3, 0.6, OPEN.shrinkStart - 0.2, OPEN.shrinkStart], [0, 1, 1, 0]));
  const skipPointer = useTransform(skipOpacity, (o) => (o > 0.5 ? "auto" : "none"));

  // The cursor or a finger steers whichever band is open (left half ↔ right half).
  const topDir = useMotionValue(1);
  const bottomDir = useMotionValue(-1);
  useEffect(() => {
    if (reduceMotion) return;
    const setFromX = (clientX: number) => {
      const dir = clientX < window.innerWidth / 2 ? -1 : 1;
      const v = g.current;
      const d = window.scrollY + NAV_H - v.containerTop;
      const u = (d - v.E) / v.S;
      if (u > OPEN.travelEnd && u < OPEN.shrinkEnd) topDir.set(dir);
      else if (d > v.endStart) bottomDir.set(dir);
    };
    const onPointer = (e: PointerEvent) => setFromX(e.clientX);
    const onTouch = (e: TouchEvent) => e.touches[0] && setFromX(e.touches[0].clientX);
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("touchmove", onTouch, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("touchmove", onTouch);
    };
  }, [reduceMotion, topDir, bottomDir]);

  // Anchors inside the page land just below the top band, and sticky panels sit below it too.
  const frameTop = NAV_H + R + RIBBON_GAP + 16;
  const bodyVars = { ["--frame-top" as string]: `${frameTop}px`, ["--sticky-top" as string]: `${frameTop}px` };

  // Accessibility fallback only: no scroll choreography, the pieces in a plain stack.
  if (reduceMotion) {
    return (
      <>
        <div ref={heroRef} className="relative">
          {heroBackground}
          <div className="relative">{hero}</div>
        </div>
        <section className="relative border-t border-neutral-900 bg-neutral-950 py-3 sm:py-4" aria-hidden="true">
          <ScrollFilmstrip images={top.images} direction="right" gapClassName={stripGap(top)} />
        </section>
        <div ref={bodyRef} id="page-body">
          {children}
        </div>
        <section className="relative border-t border-neutral-900 bg-neutral-950 py-3 sm:py-4" aria-hidden="true">
          <ScrollFilmstrip images={bottom.images} direction="left" gapClassName={stripGap(bottom)} eagerFrames={0} />
        </section>
      </>
    );
  }

  return (
    <div ref={containerRef} className="relative">
      <div className="pointer-events-none sticky z-20 overflow-hidden" style={{ top: NAV_H, height: S }}>
        {/* The hero: centred above the pair, and carried off the top as the pair rises */}
        <motion.div
          className="absolute inset-x-0 top-0"
          style={{ y: heroY, pointerEvents: heroPointer, willChange: onScreen ? "transform" : "auto" }}
        >
          <div
            ref={heroRef}
            className="relative flex flex-col justify-center bg-neutral-950 pb-[var(--ribbon-clear)]"
            style={{ minHeight: S, ["--ribbon-clear" as string]: `${pairH(R) + 16}px` }}
          >
            {heroBackground}
            <div className="relative">{hero}</div>
          </div>
        </motion.div>

        <FilmstripMask
          images={top.images}
          direction="right"
          directionOverride={topDir}
          speedPx={SPEED_PX}
          height={topH}
          top={topTop}
          trackHeight={Ti}
          angledEdge="bottom"
          paused={!onScreen}
          willChange={onScreen}
          gapClassName={stripGap(top)}
          className="z-10"
        />
        <FilmstripMask
          images={bottom.images}
          direction="left"
          directionOverride={bottomDir}
          speedPx={SPEED_PX}
          height={bottomH}
          top={bottomTop}
          trackHeight={Te}
          angledEdge="top"
          paused={!onScreen}
          willChange={onScreen}
          gapClassName={stripGap(bottom)}
          className="z-10"
        />

        <motion.div
          className="absolute left-1/2 z-20 -translate-x-1/2"
          style={{ opacity: linkOpacity, pointerEvents: linkPointer, bottom: R + RIBBON_GAP + 20 }}
        >
          <Button href={top.href} variant="secondary" size="sm" arrow>
            View in the Project Library
          </Button>
        </motion.div>

        <motion.a
          href={skipHref}
          className="absolute right-4 z-20 text-label font-semibold text-neutral-300 transition-colors after:absolute after:-inset-x-2 after:-inset-y-3 hover:text-amber-300 sm:right-6"
          style={{ opacity: skipOpacity, pointerEvents: skipPointer, top: R + RIBBON_GAP + 12 }}
        >
          Skip intro ↓
        </motion.a>
      </div>

      <div style={{ height: bodyIn }} aria-hidden="true" />
      <div
        ref={bodyRef}
        id="page-body"
        className="relative [&_[id]]:scroll-mt-[var(--frame-top)]"
        style={{ ...bodyVars, scrollMarginTop: frameTop }}
      >
        {children}
      </div>
      <div style={{ height: endH }} aria-hidden="true" />
    </div>
  );
};
