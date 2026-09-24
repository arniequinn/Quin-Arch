import React, { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { TrackImage } from "../types";

export interface ImageGroup {
  label: string;
  images: TrackImage[];
}

interface ProjectGalleryProps {
  groups: ImageGroup[];
  id?: string;
  /** Frame height; the default suits full-width galleries. */
  frameClassName?: string;
  /** Autoplay between images (paused on hover and after any interaction). */
  autoplay?: boolean;
}

const AUTOPLAY_MS = 6000;
const FADE_MS = 500;

// One navigable gallery (point 16 of documentation/final-polish-v2.0.md). Every image is shown
// whole — never cropped to the frame, never enlarged past its own pixel size — with its title
// and caption underneath. Tabs switch between sets; arrows, keys and swipes move through a set.
export const ProjectGallery: React.FC<ProjectGalleryProps> = ({
  groups,
  id,
  frameClassName = "h-[52vh] min-h-[320px] sm:h-[68vh] sm:max-h-[860px]",
  autoplay = true,
}) => {
  const [activeGroup, setActiveGroup] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchX = useRef<number | null>(null);

  const images = groups[activeGroup]?.images ?? [];
  const current = images[activeIndex];

  useEffect(() => {
    setActiveIndex(0);
  }, [activeGroup]);

  useEffect(() => {
    if (!autoplay || images.length <= 1 || paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setActiveIndex((i) => (i + 1) % images.length), AUTOPLAY_MS);
    return () => window.clearInterval(timer);
  }, [autoplay, images.length, paused]);

  const goTo = (i: number) => {
    setPaused(true);
    setActiveIndex(((i % images.length) + images.length) % images.length);
  };
  const next = () => goTo(activeIndex + 1);
  const prev = () => goTo(activeIndex - 1);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      prev();
    }
    if (e.key === "ArrowRight") {
      e.preventDefault();
      next();
    }
  };

  return (
    <div id={id} className="scroll-mt-20" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      {groups.length > 1 && (
        <div role="tablist" aria-label="Image sets" className="mb-6 flex flex-wrap justify-center gap-1 border-b border-neutral-800">
          {groups.map((g, i) => (
            <button
              key={g.label}
              type="button"
              role="tab"
              aria-selected={i === activeGroup}
              onClick={() => {
                setPaused(true);
                setActiveGroup(i);
              }}
              className={`-mb-px cursor-pointer border-b-2 px-4 py-3 text-small font-semibold transition-colors ${
                i === activeGroup ? "border-amber-400 text-neutral-100" : "border-transparent text-neutral-400 hover:text-neutral-200"
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>
      )}

      <figure>
        <div
          className={`relative w-full overflow-hidden rounded-sm bg-neutral-900 outline-none focus-visible:outline-2 focus-visible:outline-amber-400 ${frameClassName}`}
          tabIndex={0}
          onKeyDown={onKeyDown}
          onTouchStart={(e) => {
            touchX.current = e.touches[0]?.clientX ?? null;
          }}
          onTouchEnd={(e) => {
            const start = touchX.current;
            const end = e.changedTouches[0]?.clientX;
            touchX.current = null;
            if (start == null || end == null || Math.abs(end - start) < 40) return;
            if (end < start) next();
            else prev();
          }}
          role="group"
          aria-roledescription="carousel"
          aria-label={`${groups[activeGroup]?.label} — use the arrow keys to move between images`}
        >
          {images.map((img, idx) => {
            // Only the current image and its neighbours are in the page — every slide sits in the
            // same frame, so the browser would otherwise download the whole set up front.
            const distance = Math.min(
              Math.abs(idx - activeIndex),
              images.length - Math.abs(idx - activeIndex)
            );
            if (distance > 1) return null;
            return (
              <div
                key={img.src}
                className={`absolute inset-0 flex items-center justify-center transition-opacity ease-in-out ${
                  img.kind === "drawing" ? "p-3 sm:p-6" : "p-0"
                }`}
                style={{ opacity: idx === activeIndex ? 1 : 0, transitionDuration: `${FADE_MS}ms` }}
                aria-hidden={idx !== activeIndex}
              >
                <img
                  src={img.src}
                  width={img.width}
                  height={img.height}
                  alt={`${img.title} — ${img.caption}`}
                  loading="lazy"
                  fetchPriority={idx === activeIndex ? "auto" : "low"}
                  decoding="async"
                  className={`h-auto max-h-full w-auto max-w-full object-contain ${img.kind === "drawing" ? "bg-white" : ""}`}
                />
              </div>
            );
          })}

          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={prev}
                aria-label="Previous image"
                className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-neutral-950/60 text-neutral-100 backdrop-blur-sm transition-colors hover:bg-neutral-950/90 sm:left-5"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={next}
                aria-label="Next image"
                className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-neutral-950/60 text-neutral-100 backdrop-blur-sm transition-colors hover:bg-neutral-950/90 sm:right-5"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}
        </div>

        {current && (
          <figcaption className="mt-4 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
            <p className="text-small text-neutral-300">
              <span className="font-semibold text-neutral-100">{current.title}</span>
              <span className="text-neutral-500"> — </span>
              {current.caption}
            </p>
            {images.length > 1 && (
              <p className="font-mono text-label text-neutral-500" aria-live="polite">
                {activeIndex + 1} / {images.length}
              </p>
            )}
          </figcaption>
        )}
      </figure>

      {/* Dots on phones only, where there's no room to hover for the arrows. */}
      {images.length > 1 && (
        <div className="mt-4 flex flex-wrap justify-center gap-1.5 sm:hidden">
          {images.map((img, idx) => (
            <button
              key={img.src}
              type="button"
              onClick={() => goTo(idx)}
              aria-label={`Image ${idx + 1} of ${images.length}`}
              className={`h-1.5 cursor-pointer rounded-full transition-all ${idx === activeIndex ? "w-6 bg-amber-400" : "w-1.5 bg-neutral-600"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
