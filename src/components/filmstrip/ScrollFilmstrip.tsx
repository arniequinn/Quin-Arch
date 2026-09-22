import React, { useMemo } from "react";
import { motion, useReducedMotion } from "motion/react";
import { TrackImage } from "../../types";
import { useMarquee } from "./useMarquee";

const COPIES = 4;

interface ScrollFilmstripProps {
  images: TrackImage[];
  /** Visual direction content appears to drift — not a raw transform sign. */
  direction: "left" | "right";
  speedPx?: number;
  heightClassName?: string;
  /** Gutter between images — applied both within and across duplicated copies so the seam
   *  gets the same spacing as every other image-to-image gap. */
  gapClassName?: string;
}

// A continuously-scrolling, seamlessly-looping strip of images — purely decorative texture,
// not an interactive gallery (see ProjectGallery.tsx for the navigable, captioned version).
// Full-bleed: render with no max-w wrapper around it, same as ProjectGallery's outer section.
export const ScrollFilmstrip: React.FC<ScrollFilmstripProps> = ({
  images,
  direction,
  speedPx = 28,
  heightClassName = "h-[320px] sm:h-[440px]",
  gapClassName = "gap-x-4 sm:gap-x-6",
}) => {
  const reduceMotion = useReducedMotion();
  const sign = direction === "right" ? 1 : -1;
  const { x, trackRef } = useMarquee({ speedPx, direction: sign, paused: !!reduceMotion });

  const copyIndices = useMemo(() => Array.from({ length: COPIES }, (_, i) => i), []);

  if (!images.length) return null;

  if (reduceMotion) {
    return (
      <div className={`relative w-full overflow-hidden ${heightClassName}`} aria-hidden="true">
        <div className={`flex h-full w-max ${gapClassName}`}>
          {images.map((img, i) => (
            <img key={i} src={img.src} alt="" className="h-full w-auto object-cover shrink-0" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`relative w-full overflow-hidden ${heightClassName}`} aria-hidden="true">
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
