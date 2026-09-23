import React, { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { ScrollFilmstrip } from "./ScrollFilmstrip";
import { FilmstripMask } from "./FilmstripMask";
import { TrackImage } from "../../types";

interface ChapterFrameProps {
  topImages: TrackImage[];
  bottomImages: TrackImage[];
  children: React.ReactNode;
}

// How tall each band grows at its fully-open point, as a fraction of the viewport height —
// the "thin strip" state (sketch 1). The two bands stay pinned at the very top/bottom viewport
// edges (`sticky top-0` / `sticky bottom-0`) for the whole section, so the gap for the card
// (sketch 2) already exists between them without any extra translate — no need to push the
// bands further apart, which was just shoving them off-screen entirely.
const OPEN_BAND_VH = 12;

// Phase 2 of the scroll filmstrip concept: the same two bands from the ambient hero strip
// (Phase 1) reused as a scroll-linked "frame" around a content section — growing in from
// nothing at the top/bottom viewport edges as the section scrolls into view, holding open
// while the content passes through, then closing again as it scrolls away.
//
// Deliberately NOT scroll-jacked and NOT a pinned/fixed-height stage: the content stays in
// normal document flow at its natural height (no risk of clipping a section that's taller
// than expected), and only the two decorative bands are `position: sticky`, growing/shrinking
// height in response to native scroll progress through this wrapper. Native wheel/trackpad/
// touch/keyboard scrolling is never intercepted.
export const ChapterFrame: React.FC<ChapterFrameProps> = ({ topImages, bottomImages, children }) => {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

  // Stage A (sketch 1): thin angled strips grow in from nothing and hold.
  const bandVh = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, OPEN_BAND_VH, OPEN_BAND_VH, 0]);
  const bandHeight = useTransform(bandVh, (v) => `${v}vh`);

  // Stage B (sketch 2): the card swoops into the gap already held open between the two sticky
  // bands, holds, then swoops back out.
  const cardOpacity = useTransform(scrollYProgress, [0.22, 0.34, 0.66, 0.78], [0, 1, 1, 0]);
  const cardX = useTransform(scrollYProgress, [0.22, 0.34, 0.66, 0.78], [-56, 0, 0, 56]);
  const cardY = useTransform(scrollYProgress, [0.22, 0.34, 0.66, 0.78], [28, 0, 0, -28]);
  const cardScale = useTransform(scrollYProgress, [0.22, 0.34, 0.66, 0.78], [0.92, 1, 1, 0.92]);

  // The only fallback left is accessibility (prefers-reduced-motion), not screen size — the
  // choreography below is scroll-reading (native scroll drives it, nothing is scroll-jacked),
  // so it works the same on a phone's touch-scroll as it does on a desktop wheel. A viewer who
  // has asked the OS for reduced motion gets the bands as simple static strips instead.
  if (reduceMotion) {
    return (
      <>
        <section className="relative bg-neutral-950 border-t border-neutral-900 py-3 sm:py-4">
          <ScrollFilmstrip images={topImages} direction="right" />
        </section>
        {children}
        <section className="relative bg-neutral-950 border-t border-neutral-900 py-3 sm:py-4">
          <ScrollFilmstrip images={bottomImages} direction="left" />
        </section>
      </>
    );
  }

  return (
    <div ref={ref} className="relative">
      <motion.div className="sticky top-0 z-10" style={{ height: bandHeight }}>
        <FilmstripMask
          images={topImages}
          direction="right"
          height="100%"
          angledEdge="bottom"
          align="end"
          className="h-full"
          trackHeightClassName="h-[150px] sm:h-[220px] lg:h-[440px]"
        />
      </motion.div>

      <motion.div style={{ opacity: cardOpacity, x: cardX, y: cardY, scale: cardScale }}>
        {children}
      </motion.div>

      <motion.div className="sticky bottom-0 z-10" style={{ height: bandHeight }}>
        <FilmstripMask
          images={bottomImages}
          direction="left"
          height="100%"
          angledEdge="top"
          align="start"
          className="h-full"
          trackHeightClassName="h-[150px] sm:h-[220px] lg:h-[440px]"
        />
      </motion.div>
    </div>
  );
};
