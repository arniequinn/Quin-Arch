import React from "react";
import { motion, MotionValue } from "motion/react";
import { ScrollFilmstrip } from "./ScrollFilmstrip";
import { TrackImage } from "../../types";

// Fixed px offset for the 15deg-style angled plane edges (see sketch 1). A constant offset
// rather than a trig'd angle: at thin band heights it reads as ~15 degrees per the sketch, and
// once a band is mid/full-expand the cut edge is mostly off-frame anyway, so a fixed value is a
// simpler and more predictable knob than an angle that gets steeper as the band shrinks.
const ANGLE_OFFSET_PX = 18;

function angledClipPath(edge: "top" | "bottom" | "both") {
  const top = edge === "top" || edge === "both";
  const bottom = edge === "bottom" || edge === "both";
  const topLeft = top ? `${ANGLE_OFFSET_PX}px` : "0px";
  const topRight = "0px";
  const bottomRight = bottom ? `${ANGLE_OFFSET_PX}px` : "0px";
  const bottomLeft = "0px";
  return `polygon(0 ${topLeft}, 100% ${topRight}, 100% calc(100% - ${bottomRight}), 0 calc(100% - ${bottomLeft}))`;
}

interface FilmstripMaskProps {
  images: TrackImage[];
  direction: "left" | "right";
  directionOverride?: MotionValue<number>;
  speedPx?: number;
  /** Mask window height — animate this, never the image track's own size. */
  height: MotionValue<string> | MotionValue<number> | string | number;
  /** Optional vertical position for callers that place the mask absolutely. */
  top?: MotionValue<number> | number;
  /** Which edge(s) of the mask get the angled plane cut. */
  angledEdge?: "top" | "bottom" | "both" | "none";
  /** Where the fixed-size image track sits within the (possibly taller/shorter) mask window. */
  align?: "start" | "center" | "end";
  paused?: boolean;
  trackHeightClassName?: string;
  /** Fixed pixel track height (takes precedence over the class). */
  trackHeight?: number;
  className?: string;
}

// The mask is the only thing that resizes. The image track inside (`ScrollFilmstrip`) always
// renders at its own fixed height — this wrapper just clips a shorter or taller window over it,
// like an iris, so images are never stretched or squashed as a chapter/finale sequence animates.
export const FilmstripMask: React.FC<FilmstripMaskProps> = ({
  images,
  direction,
  directionOverride,
  speedPx,
  height,
  top,
  angledEdge = "none",
  align = "center",
  paused,
  trackHeightClassName,
  trackHeight,
  className = "",
}) => {
  const alignClass = align === "start" ? "items-start" : align === "end" ? "items-end" : "items-center";
  const clipPath = angledEdge === "none" ? undefined : angledClipPath(angledEdge as "top" | "bottom" | "both");

  return (
    <motion.div
      className={`${className.includes("absolute") ? "" : "relative"} overflow-hidden pointer-events-none ${className}`}
      style={{ height, top, clipPath }}
    >
      <div className={`flex h-full w-full ${alignClass}`}>
        <ScrollFilmstrip
          images={images}
          direction={direction}
          directionOverride={directionOverride}
          speedPx={speedPx}
          paused={paused}
          heightClassName={trackHeightClassName}
          trackHeight={trackHeight}
        />
      </div>
    </motion.div>
  );
};
