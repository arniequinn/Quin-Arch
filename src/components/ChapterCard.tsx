import React from "react";
import { Button } from "./Button";
import { TrackImage } from "../types";

export interface ChapterImage {
  src: string;
  alt: string;
  /** Line drawings are shown whole on white paper; renders and screenshots fill their tile. */
  kind?: TrackImage["kind"];
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
// block centered, with a row of real images from that service beneath it — three or four on
// desktop, two in compact mode (phones, short screens). No box, no badges: one button to the
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
  const shown = images.slice(0, compact ? 2 : 4);

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

        <div
          className={`mx-auto grid gap-3 ${compact ? "mt-4 max-w-md grid-cols-2" : "mt-7 max-w-5xl grid-cols-2 sm:gap-4 lg:grid-cols-4"} ${
            !compact && shown.length === 3 ? "lg:max-w-4xl lg:grid-cols-3" : ""
          }`}
        >
          {shown.map((image, i) => (
            <div
              key={image.src}
              className={`aspect-[4/3] overflow-hidden rounded-sm ${
                image.kind === "drawing" ? "bg-white p-2" : "bg-neutral-900"
              } ${!compact && shown.length === 4 && i >= 2 ? "hidden lg:block" : ""}`}
            >
              <img
                src={image.src}
                alt={image.alt}
                loading="lazy"
                decoding="async"
                className={`h-full w-full ${image.kind === "drawing" ? "object-contain" : "object-cover"}`}
              />
            </div>
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
