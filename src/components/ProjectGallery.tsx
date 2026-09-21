import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { TrackImage } from "../types";

export interface ImageGroup {
  label: string;
  images: TrackImage[];
}

interface ProjectGalleryProps {
  groups: ImageGroup[];
}

const AUTOPLAY_MS = 6000;
const FADE_MS = 700;

// A single, navigable full-bleed gallery — replaces three separate auto-cycling slideshow
// bands (interior renders, exterior renders, BIM/CAD production screenshots) with one
// mechanism: category tabs switch the set, arrows/dots/keyboard let a visitor hold on any
// image as long as they want, and autoplay pauses on hover or the moment someone interacts.
export const ProjectGallery: React.FC<ProjectGalleryProps> = ({ groups }) => {
  const [activeGroup, setActiveGroup] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const images = groups[activeGroup]?.images ?? [];

  useEffect(() => {
    setActiveIndex(0);
  }, [activeGroup]);

  useEffect(() => {
    if (images.length <= 1 || paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => {
      setActiveIndex((i) => (i + 1) % images.length);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [images.length, paused]);

  const goTo = (i: number) => {
    setPaused(true);
    setActiveIndex(((i % images.length) + images.length) % images.length);
  };
  const next = () => goTo(activeIndex + 1);
  const prev = () => goTo(activeIndex - 1);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") { e.preventDefault(); prev(); }
    if (e.key === "ArrowRight") { e.preventDefault(); next(); }
  };

  return (
    <section
      id="gallery"
      className="relative bg-neutral-950 border-t border-neutral-900 py-12 sm:py-16"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
        <div>
          <span className="text-[11px] font-mono text-neutral-500 tracking-widest uppercase">Selected Work</span>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-neutral-100 mt-1">
            {groups[activeGroup]?.label}
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-1">
          {groups.map((g, i) => (
            <button
              key={g.label}
              onClick={() => setActiveGroup(i)}
              className={`px-3 py-2 text-xs font-medium tracking-wide transition-colors cursor-pointer border-b-2 ${
                i === activeGroup
                  ? "text-neutral-100 border-amber-400"
                  : "text-neutral-500 border-transparent hover:text-neutral-300"
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>
      </div>

      <div
        className="relative w-full h-[56vh] sm:h-[72vh] bg-neutral-900 overflow-hidden outline-none"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        role="group"
        aria-label={`${groups[activeGroup]?.label} gallery`}
      >
        {images.map((img, idx) => (
          <img
            key={img.src}
            src={img.src}
            alt=""
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover transition-opacity ease-in-out"
            style={{ opacity: idx === activeIndex ? 1 : 0, transitionDuration: `${FADE_MS}ms` }}
          />
        ))}

        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Previous image"
              className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-neutral-950/50 hover:bg-neutral-950/80 backdrop-blur-sm text-neutral-200 flex items-center justify-center transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={next}
              aria-label="Next image"
              className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-neutral-950/50 hover:bg-neutral-950/80 backdrop-blur-sm text-neutral-200 flex items-center justify-center transition-colors cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => goTo(idx)}
                  aria-label={`Go to image ${idx + 1} of ${images.length}`}
                  className={`h-1.5 rounded-full transition-all cursor-pointer ${
                    idx === activeIndex ? "w-6 bg-amber-400" : "w-1.5 bg-neutral-500/60 hover:bg-neutral-400"
                  }`}
                />
              ))}
            </div>

            <div className="absolute top-4 right-4 px-2 py-1 rounded bg-neutral-950/60 backdrop-blur-sm text-[11px] font-mono text-neutral-300">
              {activeIndex + 1} / {images.length}
            </div>
          </>
        )}
      </div>
    </section>
  );
};
