import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  motion,
  MotionValue,
  backOut,
  easeInOut,
  transform,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { FilmstripMask } from "./FilmstripMask";
import { ScrollFilmstrip } from "./ScrollFilmstrip";
import { TrackImage } from "../../types";

interface HeroSequenceProps {
  hero: React.ReactNode;
  /** Rendered in the void between the two ribbons. `compact` is true when the void is too small
   *  (phone / short viewport) for the full two-column card. */
  renderCard: (compact: boolean) => React.ReactNode;
  interiorImages: TrackImage[];
  exteriorImages: TrackImage[];
}

// Sticky navbar height (Navbar.tsx `h-16`). The stage sits directly below it.
const NAV_H = 64;
// Scroll length of the choreography, in stage-heights.
const SCROLL_STAGES = 6;
// Gap between the two ribbons — deliberately a sliver of void.
const RIBBON_GAP = 8;
const SPEED_PX = 36;

// Timeline (q = 0..1 across the choreography). See documentation/scroll-filmstrip-concept §9/§11.
const Q = {
  travelEnd: 0.16, //   stage 1: ribbons rise to the hero's old position, hero exits up
  expandEnd: 0.32, //   stage 2: interior fills the stage (exterior sliver stays)
  shrinkStart: 0.36, // stage 3: interior recedes...
  shrinkEnd: 0.5,
  cardIn: [0.44, 0.54] as const, // ...and the card pops in
  cardOut: [0.66, 0.76] as const, // stage 4: card pops out...
  exteriorStart: 0.76, //  ...then the exterior fills the stage (once)
  exteriorEnd: 0.9,
};

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

// Both ribbons share ONE fixed track height: the largest window either band ever opens to
// (the stage minus the other band's sliver). Masks resize over it; images never do.
function measure(): { stageH: number; width: number } {
  return { stageH: Math.max(320, window.innerHeight - NAV_H), width: window.innerWidth };
}

export const HeroSequence: React.FC<HeroSequenceProps> = ({
  hero,
  renderCard,
  interiorImages,
  exteriorImages,
}) => {
  const reduceMotion = useReducedMotion();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const [dims, setDims] = useState(() => (typeof window === "undefined" ? { stageH: 800, width: 1280 } : measure()));
  const [heroH, setHeroH] = useState(0);
  const [cardH, setCardH] = useState(0);

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

  useLayoutEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const read = () => setHeroH(el.offsetHeight);
    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, [reduceMotion]);

  useLayoutEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const read = () => setCardH(el.offsetHeight);
    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, [reduceMotion, dims.width]);

  const S = dims.stageH;
  const R = Math.round(Math.min(64, Math.max(40, S * 0.06))); // thin ribbon height
  const T = S - R - RIBBON_GAP; // fixed image-track height = max window either band opens to
  // Extra native scroll the hero needs first when it's taller than the stage (phones).
  const E = Math.max(0, heroH - S);
  const wrapperH = E + (SCROLL_STAGES + 1) * S;

  const sMV = useMotionValue(S);
  const rMV = useMotionValue(R);
  const eMV = useMotionValue(E);
  useEffect(() => {
    sMV.set(S);
    rMV.set(R);
    eMV.set(E);
  }, [S, R, E, sMV, rMV, eMV]);

  const { scrollYProgress } = useScroll({ target: wrapperRef, offset: [`start ${NAV_H}px`, "end end"] });

  // Pre-phase scroll consumed by a tall hero, and the choreography progress q after it.
  const sPre = useTransform([scrollYProgress, sMV, eMV] as MotionValue<number>[], ([p, s, e]: number[]) =>
    Math.min(e, Math.max(0, p * (e + SCROLL_STAGES * s)))
  );
  const q = useTransform([scrollYProgress, sMV, eMV] as MotionValue<number>[], ([p, s, e]: number[]) =>
    clamp01((p * (e + SCROLL_STAGES * s) - e) / (SCROLL_STAGES * s))
  );

  const ease = { ease: easeInOut };
  const geo = (fn: (q: number, s: number, r: number) => number) =>
    useTransform([q, sMV, rMV] as MotionValue<number>[], ([qq, s, r]: number[]) => fn(qq, s, r));

  const pairH = (r: number) => 2 * r + RIBBON_GAP;
  const pairCenterTop = (s: number, r: number) => 0.4 * s - pairH(r) / 2;

  // Hero: consumed by native scroll first (sPre), then carried off the top during stage 1.
  const heroY = useTransform([sPre, q, sMV] as MotionValue<number>[], ([pre, qq, s]: number[]) =>
    -pre - s * transform(qq, [0, Q.travelEnd], [0, 1], ease)
  );
  const heroPointer = useTransform(q, (v) => (v < 0.05 ? "auto" : "none"));

  // Interior (top ribbon)
  const intTop = geo((qq, s, r) =>
    transform(qq, [0, Q.travelEnd, Q.expandEnd, 1], [s - pairH(r), pairCenterTop(s, r), 0, 0], ease)
  );
  const intH = geo((qq, s, r) =>
    transform(
      qq,
      [0, Q.travelEnd, Q.expandEnd, Q.shrinkStart, Q.shrinkEnd, 1],
      [r, r, s - r - RIBBON_GAP, s - r - RIBBON_GAP, r, r],
      ease
    )
  );
  // Exterior (bottom ribbon) — height only changes once, in stage 4.
  const extTop = geo((qq, s, r) =>
    transform(
      qq,
      [0, Q.travelEnd, Q.expandEnd, Q.exteriorStart, Q.exteriorEnd],
      [s - pairH(r) + r + RIBBON_GAP, pairCenterTop(s, r) + r + RIBBON_GAP, s - r, s - r, r + RIBBON_GAP],
      ease
    )
  );
  const extH = geo((qq, s, r) =>
    transform(qq, [0, Q.exteriorStart, Q.exteriorEnd], [r, r, s - r - RIBBON_GAP], ease)
  );

  // Card "pop": one function of progress p (0 → 1), played forward on entry and backward on exit
  // so the exit is exactly the entrance reversed. Back-out easing gives a small overshoot.
  const popP = (qq: number) =>
    qq < (Q.cardIn[1] + Q.cardOut[0]) / 2
      ? clamp01((qq - Q.cardIn[0]) / (Q.cardIn[1] - Q.cardIn[0]))
      : clamp01((Q.cardOut[1] - qq) / (Q.cardOut[1] - Q.cardOut[0]));
  const cardOpacity = useTransform(q, (qq) => clamp01(popP(qq) * 1.8));
  const cardScale = useTransform(q, (qq) => 0.88 + 0.12 * backOut(popP(qq)));
  const cardY = useTransform(q, (qq) => 36 * (1 - backOut(popP(qq))));
  const cardPointer = useTransform(cardOpacity, (o) => (o > 0.7 ? "auto" : "none"));

  // Cursor / finger steers whichever band is currently expanded (left half ↔ right half).
  const interiorDir = useMotionValue(1);
  const exteriorDir = useMotionValue(-1);
  useEffect(() => {
    const el = stageRef.current;
    if (!el || reduceMotion) return;
    const setFromX = (clientX: number) => {
      const rect = el.getBoundingClientRect();
      const dir = clientX < rect.left + rect.width / 2 ? -1 : 1;
      const qq = q.get();
      if (qq > Q.travelEnd && qq < Q.shrinkEnd) interiorDir.set(dir);
      else if (qq > Q.exteriorStart) exteriorDir.set(dir);
    };
    const onPointer = (e: PointerEvent) => setFromX(e.clientX);
    const onTouch = (e: TouchEvent) => e.touches[0] && setFromX(e.touches[0].clientX);
    el.addEventListener("pointermove", onPointer);
    el.addEventListener("touchmove", onTouch, { passive: true });
    return () => {
      el.removeEventListener("pointermove", onPointer);
      el.removeEventListener("touchmove", onTouch);
    };
  }, [q, interiorDir, exteriorDir, reduceMotion]);

  // Last-resort guarantee: if the card is still taller than the void (very short viewports),
  // scale it down to fit rather than clip it.
  const voidH = S - 2 * (R + RIBBON_GAP) - 12;
  const fitScale = cardH > voidH ? Math.max(0.45, voidH / cardH) : 1;
  const compact = dims.width < 1024 || S - 2 * R - 2 * RIBBON_GAP < 560;

  // Accessibility fallback only: no scroll choreography, just the pieces in a plain stack.
  if (reduceMotion) {
    return (
      <>
        <div ref={heroRef}>{hero}</div>
        <section className="relative bg-neutral-950 border-t border-neutral-900 py-3 sm:py-4">
          <ScrollFilmstrip images={interiorImages} direction="right" />
        </section>
        {renderCard(false)}
        <section className="relative bg-neutral-950 border-t border-neutral-900 py-3 sm:py-4">
          <ScrollFilmstrip images={exteriorImages} direction="left" />
        </section>
      </>
    );
  }

  return (
    <div ref={wrapperRef} className="relative" style={{ height: wrapperH }}>
      <div
        ref={stageRef}
        className="sticky overflow-hidden bg-neutral-950"
        style={{ top: NAV_H, height: S }}
      >
        {/* Hero: exits up through the top of the stage */}
        <motion.div
          className="absolute inset-x-0 top-0 z-0"
          style={{ y: heroY, pointerEvents: heroPointer }}
        >
          <div ref={heroRef} className="flex flex-col" style={{ minHeight: S }}>
            {hero}
          </div>
        </motion.div>

        {/* The void between the ribbons — the card pops into it */}
        <motion.div
          className="absolute inset-x-0 z-[5] flex items-center justify-center overflow-hidden"
          style={{
            top: R + RIBBON_GAP,
            bottom: R + RIBBON_GAP,
            opacity: cardOpacity,
            scale: cardScale,
            y: cardY,
            pointerEvents: cardPointer,
          }}
        >
          <div ref={cardRef} className="w-full" style={{ transform: `scale(${fitScale})`, transformOrigin: "center" }}>
            {renderCard(compact)}
          </div>
        </motion.div>

        <FilmstripMask
          images={interiorImages}
          direction="right"
          directionOverride={interiorDir}
          speedPx={SPEED_PX}
          height={intH}
          top={intTop}
          angledEdge="bottom"
          align="center"
          className="absolute inset-x-0 z-10"
          trackHeight={T}
        />
        <FilmstripMask
          images={exteriorImages}
          direction="left"
          directionOverride={exteriorDir}
          speedPx={SPEED_PX}
          height={extH}
          top={extTop}
          angledEdge="top"
          align="center"
          className="absolute inset-x-0 z-10"
          trackHeight={T}
        />
      </div>
    </div>
  );
};
