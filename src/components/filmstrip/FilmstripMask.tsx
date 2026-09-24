import React from "react";
import { motion, MotionValue, useTransform } from "motion/react";
import { ScrollFilmstrip } from "./ScrollFilmstrip";
import { TrackImage } from "../../types";

// Fixed px offset for the 15deg-style angled plane edges (see sketch 1). A constant offset
// rather than a trig'd angle: at thin band heights it reads as ~15 degrees per the sketch, and
// once a band is mid/full-expand the cut edge is mostly off-frame anyway, so a fixed value is a
// simpler and more predictable knob than an angle that gets steeper as the band shrinks.
const ANGLE_OFFSET_PX = 18;

interface FilmstripMaskProps {
  images: TrackImage[];
  direction: "left" | "right";
  directionOverride?: MotionValue<number>;
  speedPx?: number;
  /** Top edge of the visible window, in stage pixels. */
  top: MotionValue<number>;
  /** Height of the visible window, in stage pixels (never more than trackHeight). */
  height: MotionValue<number>;
  /** Fixed pixel height of the image track — the largest window this band ever opens to. */
  trackHeight: number;
  /** Which edge of the window gets the angled plane cut. */
  angledEdge?: "top" | "bottom" | "none";
  paused?: boolean;
  /** Promote to its own compositor layer (only while the sequence is on screen). */
  willChange?: boolean;
  className?: string;
}

// The band is a fixed-size image track that never resizes or re-lays-out while the sequence
// plays (point 12 of documentation/final-polish-v2.0.md): it's moved with a transform and cut to
// its current window with a clip-path, like an iris, so images are never stretched or squashed
// and the browser can animate it without a layout pass on every scroll frame.
export const FilmstripMask: React.FC<FilmstripMaskProps> = ({
  images,
  direction,
  directionOverride,
  speedPx,
  top,
  height,
  trackHeight,
  angledEdge = "none",
  paused,
  willChange = false,
  className = "",
}) => {
  // The track stays centred on the window: its top sits half the unused height above it.
  const y = useTransform([top, height] as MotionValue<number>[], ([t, h]: number[]) => t + h / 2 - trackHeight / 2);
  const clipPath = useTransform(height, (h: number) => {
    const a = Math.max(0, (trackHeight - h) / 2);
    const b = trackHeight - a;
    const cut = Math.min(ANGLE_OFFSET_PX, h);
    if (angledEdge === "top") return `polygon(0 ${a + cut}px, 100% ${a}px, 100% ${b}px, 0 ${b}px)`;
    if (angledEdge === "bottom") return `polygon(0 ${a}px, 100% ${a}px, 100% ${b - cut}px, 0 ${b}px)`;
    return `polygon(0 ${a}px, 100% ${a}px, 100% ${b}px, 0 ${b}px)`;
  });

  return (
    <motion.div
      className={`pointer-events-none absolute inset-x-0 top-0 overflow-hidden ${className}`}
      style={{ height: trackHeight, y, clipPath, willChange: willChange ? "transform, clip-path" : "auto" }}
    >
      <ScrollFilmstrip
        images={images}
        direction={direction}
        directionOverride={directionOverride}
        speedPx={speedPx}
        paused={paused}
        trackHeight={trackHeight}
      />
    </motion.div>
  );
};
