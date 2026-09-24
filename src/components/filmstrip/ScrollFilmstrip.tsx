import React, { useMemo } from "react";
import { motion, MotionValue } from "motion/react";
import { TrackImage } from "../../types";
import { useMarquee } from "./useMarquee";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

const COPIES = 4;

interface ScrollFilmstripProps {
  images: TrackImage[];
  /** Visual direction content appears to drift — not a raw transform sign. */
  direction: "left" | "right";
  speedPx?: number;
  heightClassName?: string;
  /** Fixed pixel track height — overrides `heightClassName` when the caller has measured the
   *  exact size the strip must render at (e.g. a full-stage takeover). */
  trackHeight?: number;
  /** Gutter between images — applied both within and across duplicated copies so the seam
   *  gets the same spacing as every other image-to-image gap. */
  gapClassName?: string;
  /** External pause (e.g. a caller that knows the strip is currently zero-height/off-screen),
   *  ORed with the internal prefers-reduced-motion pause. */
  paused?: boolean;
  /** Supersedes the `direction` prop's fixed sign with a live value (e.g. driven by cursor
   *  position) — same speed magnitude, continuously steerable direction. Reuses useMarquee's
   *  existing MotionValue support with no change to the animation loop itself. */
  directionOverride?: MotionValue<number>;
}

// A continuously-scrolling, seamlessly-looping strip of images — purely decorative texture,
// not an interactive gallery (see ProjectGallery.tsx for the navigable, captioned version).
// Full-bleed: render with no max-w wrapper around it, same as ProjectGallery's outer section.
export const ScrollFilmstrip: React.FC<ScrollFilmstripProps> = ({
  images,
  direction,
  speedPx = 28,
  heightClassName = "h-[320px] sm:h-[440px]",
  trackHeight,
  gapClassName = "gap-x-4 sm:gap-x-6",
  paused = false,
  directionOverride,
}) => {
  const reduceMotion = usePrefersReducedMotion();
  const sign = direction === "right" ? 1 : -1;
  const { x, trackRef } = useMarquee({
    speedPx,
    direction: directionOverride ?? sign,
    paused: paused || !!reduceMotion,
  });

  const copyIndices = useMemo(() => Array.from({ length: COPIES }, (_, i) => i), []);

  if (!images.length) return null;

  const sizeClass = trackHeight ? "" : heightClassName;
  const sizeStyle = trackHeight ? { height: trackHeight } : undefined;

  if (reduceMotion) {
    return (
      <div className={`relative w-full overflow-hidden ${sizeClass}`} style={sizeStyle} aria-hidden="true">
        <div className={`flex h-full w-max ${gapClassName}`}>
          {images.map((img, i) => (
            <img key={i} src={img.src} alt="" className="h-full w-auto object-cover shrink-0" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`relative w-full overflow-hidden ${sizeClass}`} style={sizeStyle} aria-hidden="true">
      <motion.div className={`flex h-full w-max ${gapClassName}`} style={{ x }}>
        {copyIndices.map((copyIdx) => (
          <div
            key={copyIdx}
            ref={copyIdx === 0 ? trackRef : undefined}
            className={`flex h-full shrink-0 ${gapClassName}`}
          >
            {images.map((img, i) => (
              <img
                key={i}
                src={img.src}
                alt=""
                loading={copyIdx === 0 ? "eager" : "lazy"}
                className="h-full w-auto object-cover shrink-0"
              />
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
};
