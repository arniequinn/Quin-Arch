import { useEffect, useRef, useState } from "react";
import { MotionValue, useAnimationFrame, useMotionValue } from "motion/react";

interface UseMarqueeOptions {
  /** Magnitude in px/sec — always positive; sign comes from `direction`. */
  speedPx?: number;
  /** +1 = content drifts right, -1 = content drifts left. A MotionValue lets a later
   *  (mouse-driven) caller change direction continuously without touching this hook. */
  direction: number | MotionValue<number>;
  paused?: boolean;
}

// Drives a looping horizontal `x` offset via rAF rather than a CSS keyframe animation, so a
// caller can feed `direction` a live, continuously-changing MotionValue (e.g. from cursor
// position) without any change to this update loop — only the input changes.
export function useMarquee({ speedPx = 28, direction, paused = false }: UseMarqueeOptions) {
  const trackRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const widthRef = useRef(0);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const measure = () => {
      widthRef.current = el.scrollWidth;
      setWidth(el.scrollWidth);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useAnimationFrame((_, delta) => {
    if (paused) return;
    const w = widthRef.current;
    if (!w) return;
    const dir = typeof direction === "number" ? direction : direction.get();
    const raw = x.get() + dir * speedPx * (delta / 1000);
    // Keep x within (-width, 0] — the track is tiled with period `width`, so any value
    // congruent mod width looks identical, making the wrap invisible either direction.
    x.set((((raw % w) + w) % w) - w);
  });

  return { x, trackRef, width };
}
