import React, { useEffect, useState } from "react";
import { motion, MotionValue } from "motion/react";
import { TrackImage } from "../../types";
import { useMarquee } from "./useMarquee";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

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
  /** External pause (e.g. the strip is off-screen), ORed with prefers-reduced-motion. */
  paused?: boolean;
  /** Supersedes the `direction` prop's fixed sign with a live value (e.g. driven by cursor
   *  position) — same speed magnitude, continuously steerable direction. */
  directionOverride?: MotionValue<number>;
}

// A continuously-scrolling, seamlessly-looping strip of images — purely decorative texture,
// not an interactive gallery (see ProjectGallery.tsx for the navigable, captioned version).
// Two copies of the set are enough for the loop to be seamless once one copy is wider than the
// screen (a third is added only when it isn't); each image carries its native size, so the track
// has its final width before a single image has loaded.
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
  const { x, trackRef, width } = useMarquee({
    speedPx,
    direction: directionOverride ?? sign,
    paused: paused || !!reduceMotion,
  });

  const [viewport, setViewport] = useState(0);
  useEffect(() => {
    const read = () => setViewport(window.innerWidth);
    read();
    window.addEventListener("resize", read);
    return () => window.removeEventListener("resize", read);
  }, []);
  const copies = width > 0 && width < viewport ? Math.ceil(viewport / width) + 1 : 2;

  if (!images.length) return null;

  const sizeClass = trackHeight ? "" : heightClassName;
  const sizeStyle = trackHeight ? { height: trackHeight } : undefined;
  // Only the first few frames are on screen when the page opens; the rest load lazily as the
  // strip drifts towards them, so they don't compete with the fonts and scripts on first load.
  const renderImage = (img: TrackImage, key: React.Key, eager: boolean) => (
    <img
      key={key}
      src={img.lightSrc ?? img.src}
      width={img.width}
      height={img.height}
      alt=""
      loading={eager ? "eager" : "lazy"}
      fetchPriority={eager ? "auto" : "low"}
      decoding="async"
      className="h-full w-auto shrink-0 object-cover"
    />
  );
  const EAGER_FRAMES = 3;

  if (reduceMotion) {
    return (
      <div className={`relative w-full overflow-hidden ${sizeClass}`} style={sizeStyle} aria-hidden="true">
        <div className={`flex h-full w-max ${gapClassName}`}>{images.map((img, i) => renderImage(img, i, i < EAGER_FRAMES))}</div>
      </div>
    );
  }

  return (
    <div className={`relative w-full overflow-hidden ${sizeClass}`} style={sizeStyle} aria-hidden="true">
      <motion.div className={`flex h-full w-max ${gapClassName}`} style={{ x }}>
        {Array.from({ length: copies }, (_, copyIdx) => (
          <div key={copyIdx} ref={copyIdx === 0 ? trackRef : undefined} className={`flex h-full shrink-0 ${gapClassName}`}>
            {images.map((img, i) => renderImage(img, i, copyIdx === 0 && i < EAGER_FRAMES))}
          </div>
        ))}
      </motion.div>
    </div>
  );
};
