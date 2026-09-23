import React from "react";
import { ArrowRight } from "lucide-react";

interface ChapterCardProps {
  eyebrow: string;
  title: string;
  description: string;
  /** Up to 3 short points. Shown instead of thumbnails when both are omitted/empty. */
  points?: string[];
  /** Up to 3 preview image URLs. */
  thumbs?: string[];
  cta: { label: string; href: string };
  secondary?: { label: string; href: string };
  compact?: boolean;
}

// One homepage chapter, shown in the void between the two filmstrip ribbons. Same treatment as
// the specialist card: sits directly on the page background — no box, no badges — with one
// primary button to the section's dedicated page.
export const ChapterCard: React.FC<ChapterCardProps> = ({
  eyebrow,
  title,
  description,
  points,
  thumbs,
  cta,
  secondary,
  compact = false,
}) => {
  const showThumbs = !!thumbs?.length && !compact;

  return (
    <section className={`bg-neutral-950 relative ${compact ? "py-4" : "py-10"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`grid grid-cols-1 items-center ${
            showThumbs ? "lg:grid-cols-12 gap-10 lg:gap-16" : "max-w-3xl"
          }`}
        >
          <div className={`space-y-5 ${showThumbs ? "lg:col-span-6" : ""}`}>
            <span className="text-[11px] font-mono text-amber-400 tracking-widest uppercase">{eyebrow}</span>
            <h2
              className={`font-display font-bold text-neutral-100 tracking-tight leading-[1.1] ${
                compact ? "text-2xl" : "text-3xl sm:text-4xl lg:text-5xl"
              }`}
            >
              {title}
            </h2>
            <p className={`text-neutral-400 leading-relaxed ${compact ? "text-sm line-clamp-4" : "text-base max-w-xl"}`}>
              {description}
            </p>

            {!!points?.length && (
              <ul className={`space-y-1.5 text-neutral-300 ${compact ? "text-xs" : "text-sm"}`}>
                {points.slice(0, 3).map((pt) => (
                  <li key={pt} className="flex items-start gap-2">
                    <span className="mt-2 w-1 h-1 rounded-full bg-amber-400 shrink-0" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            )}

            <div className="flex flex-wrap items-center gap-4 pt-1">
              <a
                href={cta.href}
                className="group flex items-center space-x-2 text-sm font-bold text-neutral-950 bg-amber-400 hover:bg-amber-300 px-6 py-3.5 rounded transition-all"
              >
                <span>{cta.label}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
              {secondary && (
                <a href={secondary.href} className="text-xs text-amber-400 hover:text-amber-300 transition-colors">
                  {secondary.label} →
                </a>
              )}
            </div>
          </div>

          {showThumbs && (
            <div className="lg:col-span-6 grid grid-cols-3 gap-3">
              {thumbs!.slice(0, 3).map((src, i) => (
                <img
                  key={src}
                  src={src}
                  alt=""
                  loading="lazy"
                  className={`w-full object-cover bg-neutral-900 rounded-sm aspect-[3/4] ${i === 1 ? "mt-8" : ""}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
