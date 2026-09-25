import React from "react";
import { ArrowRight } from "lucide-react";
import { GalleryProject } from "../../data/galleryProjects";
import { caseStudyHref, projectHref } from "../../data/routes";
import { PortfolioItem, TrackImage } from "../../types";
import { CARD_ROW_HEIGHTS, COMPACT_CARD_ROW_HEIGHTS, surfaceOf, tileSources, tileStyle } from "./JustifiedGrid";

export interface Card {
  key: string;
  href: string;
  cover: TrackImage;
  eyebrow: string;
  title: string;
  summary: string;
  /** e.g. "10 items" or "6 sheets". */
  count?: string;
  cta?: string;
}

export const projectCard = (project: GalleryProject): Card => ({
  key: project.slug,
  href: projectHref(project.slug),
  cover: project.cover,
  eyebrow: project.kind,
  title: project.title,
  summary: project.summary,
  count: `${project.items.length + (project.pieces?.length ?? 0)} items`,
});

/** A drawing-set case study, in the same card style. */
export const caseStudyCard = (sample: PortfolioItem): Card => ({
  key: sample.id,
  href: caseStudyHref(sample.id),
  cover: sample.cover,
  eyebrow: "Drawing set",
  title: sample.title,
  summary: sample.sheetDetails,
  count: `${sample.images.length} sheets`,
  cta: "Read the case study",
});

// Project cards (v3.0 §7): a large cover at its own proportions, a bold title, one line, the item
// count and "View project". Laid out in justified rows like the grid, at a larger row height, so
// the covers are never cropped. The whole card is one link.
/** `compact`: smaller covers, for pages where the cards support other work. */
export const ProjectCards: React.FC<{ projects?: GalleryProject[]; cards?: Card[]; compact?: boolean; className?: string }> = ({
  projects = [],
  cards = [],
  compact = false,
  className = "",
}) => (
  <ul
    className={`flex flex-wrap items-start gap-x-6 gap-y-12 after:grow-[1000000] after:content-[''] ${compact ? COMPACT_CARD_ROW_HEIGHTS : CARD_ROW_HEIGHTS} ${className}`}
  >
    {[...projects.map(projectCard), ...cards].map((card) => {
      const cover = card.cover;
      const sources = tileSources(cover, [200, 220, 260]);
      return (
        <li key={card.key} style={tileStyle(cover)} className="min-w-0">
          <a href={card.href} className="group block outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-400">
            <div className={`overflow-hidden rounded-sm ${surfaceOf(cover)}`} style={{ aspectRatio: `${cover.width} / ${cover.height}` }}>
              <img
                {...sources}
                width={cover.width}
                height={cover.height}
                alt={`${cover.title} — ${card.title}`}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-contain transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              />
            </div>
            <p className="eyebrow mt-4 text-amber-400">{card.eyebrow}</p>
            <h3 className="heading-3 mt-1.5 text-neutral-100 transition-colors group-hover:text-amber-300">{card.title}</h3>
            <p className="mt-1.5 max-w-xl text-small text-neutral-300">{card.summary}</p>
            <p className="mt-3 flex items-center gap-2 text-small font-semibold text-amber-400">
              {card.count && <span className="font-normal text-neutral-500">{card.count} ·</span>}
              {card.cta ?? "View project"}
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
            </p>
          </a>
        </li>
      );
    })}
  </ul>
);
