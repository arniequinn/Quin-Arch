import React, { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { usePrefersReducedMotion } from "./filmstrip/usePrefersReducedMotion";

export interface CompareImage {
  src: string;
  width: number;
  height: number;
  alt: string;
  /** Corner label, e.g. "Model". */
  label: string;
}

interface CompareSliderProps {
  /** Revealed on the left of the line (clipped). */
  overlay: CompareImage;
  /** The full image underneath, seen on the right of the line. */
  base: CompareImage;
  className?: string;
}

const clamp = (v: number, lo = 0, hi = 100) => Math.min(hi, Math.max(lo, v));
const SNAPS = [0, 50, 100];

// Two images from the same camera, compared by dragging a line across them (v3.0 §8):
//  - the whole image is shown at its own proportions — nothing is cropped
//  - drag anywhere on it (pointer capture; vertical swipes still scroll the page on phones)
//  - a real slider for keyboards: arrows move 2%, Shift+arrows 10%, Home/End jump to the ends
//  - double-click or double-tap snaps between 0, 50 and 100%
//  - the corner labels fade as the line reaches them, so they're never cut in half
//  - a one-time nudge the first time it scrolls into view shows that it moves (not with reduced motion)
//  - the reveal is a clip-path on the top image only, so dragging never causes layout
export const CompareSlider: React.FC<CompareSliderProps> = ({ overlay, base, className = "" }) => {
  const [pos, setPos] = useState(50);
  const [gripY, setGripY] = useState(50);
  const boxRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const touched = useRef(false);
  const lastTap = useRef(0);
  const reduceMotion = usePrefersReducedMotion();

  // The nudge: 50 → 42 → 50 over 900 ms, once, when half the image is on screen.
  useEffect(() => {
    const el = boxRef.current;
    if (!el || reduceMotion) return;
    let frame = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || touched.current) return;
        io.disconnect();
        const start = performance.now();
        const step = (now: number) => {
          if (touched.current) return;
          const t = Math.min(1, (now - start) / 900);
          setPos(50 - 8 * Math.sin(Math.PI * t));
          if (t < 1) frame = requestAnimationFrame(step);
        };
        frame = requestAnimationFrame(step);
      },
      { threshold: 0.5 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [reduceMotion]);

  const fromPointer = (e: React.PointerEvent) => {
    const rect = boxRef.current!.getBoundingClientRect();
    return {
      x: clamp(((e.clientX - rect.left) / rect.width) * 100),
      y: clamp(((e.clientY - rect.top) / rect.height) * 100, 8, 92),
    };
  };

  const snap = () => {
    touched.current = true;
    setPos((p) => SNAPS[(SNAPS.findIndex((s) => Math.abs(s - p) < 25) + 1) % SNAPS.length] ?? 50);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const big = e.shiftKey ? 10 : 2;
    let next: number | null = null;
    if (e.key === "ArrowLeft" || e.key === "ArrowDown") next = pos - big;
    else if (e.key === "ArrowRight" || e.key === "ArrowUp") next = pos + big;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = 100;
    if (next === null) return;
    e.preventDefault();
    touched.current = true;
    setPos(clamp(next));
  };

  const leftLabel = clamp((pos - 10) / 12, 0, 1);
  const rightLabel = clamp((90 - pos) / 12, 0, 1);

  return (
    <div
      ref={boxRef}
      role="slider"
      tabIndex={0}
      aria-label={`Compare the ${overlay.label.toLowerCase()} with the ${base.label.toLowerCase()}`}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(pos)}
      aria-valuetext={`${Math.round(pos)}% ${overlay.label.toLowerCase()}`}
      onKeyDown={onKeyDown}
      onPointerDown={(e) => {
        if (e.button !== 0) return;
        touched.current = true;
        dragging.current = true;
        e.currentTarget.setPointerCapture(e.pointerId);
        const p = fromPointer(e);
        setPos(p.x);
        if (e.pointerType === "mouse") setGripY(p.y);
      }}
      onPointerMove={(e) => {
        const p = fromPointer(e);
        if (e.pointerType === "mouse") setGripY(p.y);
        if (dragging.current) setPos(p.x);
      }}
      onPointerUp={(e) => {
        dragging.current = false;
        if (e.pointerType !== "mouse") {
          const now = e.timeStamp;
          if (now - lastTap.current < 300) snap();
          lastTap.current = now;
        }
      }}
      onPointerCancel={() => {
        dragging.current = false;
      }}
      onDoubleClick={snap}
      className={`group relative mx-auto w-full cursor-ew-resize touch-pan-y select-none overflow-hidden rounded-sm bg-white outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-400 ${className}`}
      style={{ aspectRatio: `${base.width} / ${base.height}`, maxWidth: `${base.width}px` }}
    >
      <img
        src={base.src}
        width={base.width}
        height={base.height}
        alt={base.alt}
        loading="lazy"
        decoding="async"
        draggable={false}
        className="pointer-events-none absolute inset-0 h-full w-full"
      />
      <img
        src={overlay.src}
        width={overlay.width}
        height={overlay.height}
        alt={overlay.alt}
        loading="lazy"
        decoding="async"
        fetchPriority="low"
        draggable={false}
        className="pointer-events-none absolute inset-0 h-full w-full will-change-[clip-path]"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
      />

      <span
        className="pointer-events-none absolute left-3 top-3 rounded bg-neutral-950/75 px-2 py-1 text-label font-semibold text-neutral-100 transition-opacity sm:left-4 sm:top-4"
        style={{ opacity: leftLabel }}
        aria-hidden="true"
      >
        {overlay.label}
      </span>
      <span
        className="pointer-events-none absolute right-3 top-3 rounded bg-neutral-950/75 px-2 py-1 text-label font-semibold text-neutral-100 transition-opacity sm:right-4 sm:top-4"
        style={{ opacity: rightLabel }}
        aria-hidden="true"
      >
        {base.label}
      </span>

      {/* The line and its grip. The grip follows the pointer's height on desktop. */}
      <div
        className="pointer-events-none absolute inset-y-0 w-0.5 -translate-x-1/2 bg-white shadow-[0_0_6px_rgba(0,0,0,0.45)]"
        style={{ left: `${pos}%` }}
        aria-hidden="true"
      >
        <div
          className="absolute left-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-neutral-900 shadow-[0_2px_10px_rgba(0,0,0,0.35)] transition-[top] duration-75"
          style={{ top: `${gripY}%` }}
        >
          <ChevronLeft className="-mr-1 h-4 w-4" />
          <ChevronRight className="-ml-1 h-4 w-4" />
        </div>
      </div>
    </div>
  );
};
