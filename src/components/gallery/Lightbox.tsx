import React, { useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { TrackImage } from "../../types";
import { ProjectLink, surfaceOf } from "./JustifiedGrid";

interface LightboxProps {
  items: TrackImage[];
  /** The open item, or null when closed. */
  index: number | null;
  onIndex: (index: number) => void;
  onClose: () => void;
  currentProject?: string;
}

// The image whole, on the dark background, with its caption (v3.0 §7). A native modal <dialog>:
// the browser traps focus inside it, Esc closes it, and focus goes back to the tile afterwards.
// Arrow keys and swipes move through the section; only the open image and its neighbours load.
// Never shown larger than its own pixels, so it is at most 1:1 on a standard screen.
export const Lightbox: React.FC<LightboxProps> = ({ items, index, onIndex, onClose, currentProject }) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const touchX = useRef<number | null>(null);
  const open = index !== null;
  const img = open ? items[index] : undefined;
  const count = items.length;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
    if (!open) return;
    // The page behind stays still while the lightbox is open.
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = previous;
    };
  }, [open]);

  // Warm the neighbours so the next image is already there.
  useEffect(() => {
    if (index === null || count < 2) return;
    for (const i of [index - 1, index + 1]) {
      const n = items[(i + count) % count];
      if (n) new Image().src = n.src;
    }
  }, [index, items, count]);

  const go = (delta: number) => {
    if (index === null || count < 2) return;
    onIndex((index + delta + count) % count);
  };

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") {
          e.preventDefault();
          go(1);
        } else if (e.key === "ArrowLeft") {
          e.preventDefault();
          go(-1);
        }
      }}
      onTouchStart={(e) => {
        touchX.current = e.touches[0]?.clientX ?? null;
      }}
      onTouchEnd={(e) => {
        const start = touchX.current;
        const end = e.changedTouches[0]?.clientX;
        touchX.current = null;
        if (start == null || end == null || Math.abs(end - start) < 40) return;
        go(end < start ? 1 : -1);
      }}
      aria-label={img ? img.title : "Image viewer"}
      className="m-0 h-dvh max-h-none w-screen max-w-none bg-neutral-950/95 p-0 text-neutral-100 backdrop:bg-neutral-950/80"
    >
      {img && (
        <div className="flex h-full flex-col" onClick={(e) => e.target === e.currentTarget && onClose()}>
          <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6">
            <p className="font-mono text-label text-neutral-400" aria-live="polite">
              {count > 1 ? `${index! + 1} / ${count}` : ""}
            </p>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full text-neutral-300 transition-colors hover:bg-neutral-800 hover:text-neutral-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div
            className="relative flex min-h-0 flex-1 items-center justify-center px-4 sm:px-20"
            onClick={(e) => e.target === e.currentTarget && onClose()}
          >
            <img
              key={img.src}
              src={img.src}
              width={img.width}
              height={img.height}
              alt={`${img.title} — ${img.caption}`}
              decoding="async"
              className={`h-auto w-auto object-contain ${surfaceOf(img)}`}
              style={{ maxWidth: `min(100%, ${img.width}px)`, maxHeight: `min(100%, ${img.height}px)` }}
            />
            {count > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => go(-1)}
                  aria-label="Previous image"
                  className="absolute left-2 top-1/2 hidden h-12 w-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-neutral-900/80 text-neutral-100 transition-colors hover:bg-neutral-800 sm:left-5 sm:flex"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  aria-label="Next image"
                  className="absolute right-2 top-1/2 hidden h-12 w-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-neutral-900/80 text-neutral-100 transition-colors hover:bg-neutral-800 sm:right-5 sm:flex"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}
          </div>

          <div className="mx-auto w-full max-w-4xl px-4 pb-6 pt-4 text-center sm:px-6">
            <p className="text-body font-semibold text-neutral-100">{img.title}</p>
            <p className="mt-0.5 text-small text-neutral-300">{img.caption}</p>
            {img.project && img.project !== currentProject && <ProjectLink slug={img.project} className="mt-1" />}
            {count > 1 && (
              <div className="mt-3 flex justify-center gap-3 sm:hidden">
                <button type="button" onClick={() => go(-1)} aria-label="Previous image" className="flex h-11 w-11 items-center justify-center rounded-full bg-neutral-900">
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button type="button" onClick={() => go(1)} aria-label="Next image" className="flex h-11 w-11 items-center justify-center rounded-full bg-neutral-900">
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </dialog>
  );
};
