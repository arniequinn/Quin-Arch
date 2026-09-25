import React from "react";
import { Button } from "./Button";
import { TrackImage } from "../types";

export interface ChapterImage {
  src: string;
  /** The thumbnail plus the full image, so the tile stays sharp on dense screens. */
  srcSet?: string;
  alt: string;
  /** Line drawings are shown whole on white paper; renders and screenshots fill their tile. */
  kind?: TrackImage["kind"];
  /** Every tile leads to its project (v3.0 point 4). */
  href: string;
}

interface ChapterCardProps {
  eyebrow: string;
  title: string;
  description: string;
  images: ChapterImage[];
  cta: { label: string; href: string };
  secondary?: { label: string; href: string };
  compact?: boolean;
}

// One homepage chapter, shown in the void between the two filmstrip ribbons (point 5): the text
// block centered, with a row of real images from that service beneath it — three in a 1152 px row
// on desktop (v3.0 point 4: about 373 × 280 each), two across the full width in compact mode
// (phones, short screens). Each tile links to its project. No box, no badges: one button to the
// chapter's own page, and an optional text link.
export const ChapterCard: React.FC<ChapterCardProps> = ({
  eyebrow,
  title,
  description,
  images,
  cta,
  secondary,
  compact = false,
}) => {
  const shown = images.slice(0, compact ? 2 : 3);

  return (
    <section className={`relative bg-neutral-950 ${compact ? "py-2" : "py-6"}`}>
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="eyebrow text-amber-400">{eyebrow}</p>
          <h2
            className={`mt-3 font-display font-semibold leading-[1.08] tracking-tight text-neutral-100 ${
              compact ? "text-[1.75rem]" : "heading-2 sm:text-[2.75rem]"
            }`}
          >
            {title}
          </h2>
          <p className={`mx-auto mt-3 max-w-2xl text-neutral-400 ${compact ? "text-small line-clamp-3" : "text-body"}`}>
            {description}
          </p>
        </div>

        <div className={`mx-auto grid gap-3 ${compact ? "mt-4 w-full grid-cols-2" : "mt-7 max-w-6xl grid-cols-3 sm:gap-4"}`}>
          {shown.map((image) => (
            <a
              key={image.src}
              href={image.href}
              aria-label={image.alt}
              className={`group block aspect-[4/3] overflow-hidden rounded-sm outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400 ${
                image.kind === "drawing" ? "bg-white p-2" : "bg-neutral-900"
              }`}
            >
              <img
                src={image.src}
                srcSet={image.srcSet}
                sizes={compact ? "50vw" : "(min-width: 1200px) 373px, 33vw"}
                alt={image.alt}
                loading="lazy"
                decoding="async"
                className={`h-full w-full transition-transform duration-500 group-hover:scale-[1.03] ${
                  image.kind === "drawing" ? "object-contain" : "object-cover"
                }`}
              />
            </a>
          ))}
        </div>

        <div className={`flex flex-wrap items-center justify-center gap-x-6 gap-y-3 ${compact ? "mt-4" : "mt-7"}`}>
          <Button href={cta.href} size={compact ? "sm" : "md"} arrow>
            {cta.label}
          </Button>
          {secondary && (
            <Button href={secondary.href} variant="link" size={compact ? "sm" : "md"}>
              {secondary.label}
            </Button>
          )}
        </div>
      </div>
    </section>
  );
};
