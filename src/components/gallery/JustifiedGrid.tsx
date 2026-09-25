import React from "react";
import { TrackImage } from "../../types";
import { projectHref } from "../../data/routes";
import { projectBySlug, thumbOf } from "../../data/galleryProjects";

// The justified-row grid (documentation/v3.0-gallery-expansion.md §7). Every tile keeps its image's
// own proportions and rows fill the width: each tile's flex-grow is its aspect ratio, so every tile
// in a row grows by the same factor and the row stays one height. Pure CSS, so the prerendered
// HTML already has the final layout — nothing jumps when the scripts arrive. A filler after the
// last tile soaks up the leftover width, so a short last row isn't stretched.
//
// Base row height: 120 px on phones (two landscape tiles a row), 210 px on tablets, 240 px on desktop; rows grow from there
// to fill the width, which lands them in the §7 range (about 280–360 px on desktop). No tile is ever wider
// than its image (max-width is the native width), so nothing is upscaled.

// --grow caps how far a tile may grow past the base row height (see tileStyle). Phones have no
// real cap: a lone image there should simply fill the column.
export const ROW_HEIGHTS = "[--row-h:120px] [--grow:9] sm:[--row-h:210px] sm:[--grow:1.75] lg:[--row-h:240px]";
export const CARD_ROW_HEIGHTS = "[--row-h:200px] [--grow:9] sm:[--row-h:220px] sm:[--grow:1.9] lg:[--row-h:260px]";
export const COMPACT_CARD_ROW_HEIGHTS = "[--row-h:160px] [--grow:9] sm:[--row-h:170px] sm:[--grow:1.6] lg:[--row-h:185px]";

const aspectOf = (img: TrackImage) => img.width / img.height;

/** Flex sizing for one tile of a justified row. A tile grows at most var(--grow) × the base row
 *  height: when a row can't fill cleanly (a lone tile before a very wide one), it ends short rather
 *  than blowing one image up to the full width. */
export function tileStyle(img: TrackImage): React.CSSProperties {
  const a = aspectOf(img).toFixed(4);
  return {
    flexGrow: a,
    flexBasis: `calc(var(--row-h) * ${a})`,
    maxWidth: `min(${img.width}px, calc(var(--row-h) * ${a} * var(--grow)))`,
  };
}

/** srcset/sizes for a tile: the ≤ 800 px thumbnail, and the full image for large or dense screens. */
export function tileSources(img: TrackImage, rowHeights: [number, number, number] = [120, 210, 240]) {
  const thumb = thumbOf(img);
  const a = aspectOf(img);
  // A row can grow past its base height to fill the width; allow for that.
  const [phone, tablet, desktop] = rowHeights.map((h) => Math.round(a * h * 1.35));
  return {
    src: thumb.src,
    srcSet: thumb.width < img.width ? `${thumb.src} ${thumb.width}w, ${img.src} ${img.width}w` : undefined,
    sizes: `(min-width: 1024px) ${desktop}px, (min-width: 640px) ${tablet}px, min(100vw, ${phone}px)`,
  };
}

/** White paper under drawings and model views; renders sit on the page. */
export const surfaceOf = (img: TrackImage) => (img.kind === "drawing" || img.kind === "model" ? "bg-white" : "bg-neutral-900");

export const ProjectLink: React.FC<{ slug: string; className?: string }> = ({ slug, className = "" }) => {
  const project = projectBySlug(slug);
  if (!project) return null;
  return (
    <a
      href={projectHref(slug)}
      className={`inline-block text-small font-semibold text-amber-400 transition-colors hover:text-amber-300 ${className}`}
    >
      {project.title} →
    </a>
  );
};

interface JustifiedGridProps {
  items: TrackImage[];
  /** Opens the lightbox at this item's index in `items`. */
  onOpen: (index: number) => void;
  /** Items of this project don't link to it again. */
  currentProject?: string;
  className?: string;
}

export const JustifiedGrid: React.FC<JustifiedGridProps> = ({ items, onOpen, currentProject, className = "" }) => (
  <ul
    className={`flex flex-wrap items-start gap-x-3 gap-y-7 sm:gap-x-4 sm:gap-y-8 after:grow-[1000000] after:content-[''] ${ROW_HEIGHTS} ${className}`}
  >
    {items.map((img, i) => {
      const sources = tileSources(img);
      return (
        <li key={img.src} style={tileStyle(img)} className="min-w-0">
          <figure>
            <button
              type="button"
              onClick={() => onOpen(i)}
              className={`group block w-full cursor-zoom-in overflow-hidden rounded-sm outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400 ${surfaceOf(img)}`}
              style={{ aspectRatio: `${img.width} / ${img.height}` }}
              aria-label={`Open ${img.title}`}
            >
              <img
                {...sources}
                width={img.width}
                height={img.height}
                alt={`${img.title} — ${img.caption}`}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-contain transition-transform duration-500 ease-out group-hover:scale-[1.02]"
              />
            </button>
            <figcaption className="mt-3">
              <p className="text-small font-semibold leading-snug text-neutral-100 sm:text-body">{img.title}</p>
              <p className="mt-0.5 text-label text-neutral-300 sm:text-small">{img.caption}</p>
              {img.project && img.project !== currentProject && <ProjectLink slug={img.project} className="mt-1" />}
            </figcaption>
          </figure>
        </li>
      );
    })}
  </ul>
);
