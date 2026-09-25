import React, { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { PORTFOLIO_SAMPLES } from "../data/architecturalData";
import { PortfolioItem } from "../types";
import { useAreaUnit } from "../utils/useAreaUnit";
import { Button } from "./Button";
import { ProjectGallery } from "./ProjectGallery";
import { ProjectFactsGrid, projectFactRows } from "./ProjectFacts";
import { UnitToggle } from "./estimator/controls";

// The project library's drawing sets (points 16–18 of documentation/final-polish-v2.0.md).
// Category tabs are built from the projects themselves, so a tab never opens onto nothing, and
// every card has one action: open the project's floating window, which holds everything the
// case-study page would — images, description, facts and software.
export const DeliverablesGallery: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [selected, setSelected] = useState<PortfolioItem | null>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const [unit, setUnit] = useAreaUnit();

  const categories = ["All", ...Array.from(new Set(PORTFOLIO_SAMPLES.map((s) => s.category)))];
  const shown = activeCategory === "All" ? PORTFOLIO_SAMPLES : PORTFOLIO_SAMPLES.filter((s) => s.category === activeCategory);

  const open = (item: PortfolioItem, opener: HTMLElement) => {
    openerRef.current = opener;
    setSelected(item);
  };
  const close = () => {
    setSelected(null);
    openerRef.current?.focus();
  };

  return (
    <div>
      {categories.length > 2 && (
        <div role="tablist" aria-label="Project type" className="mb-10 flex flex-wrap justify-center gap-1 border-b border-neutral-800">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              role="tab"
              aria-selected={activeCategory === cat}
              onClick={() => setActiveCategory(cat)}
              className={`-mb-px cursor-pointer border-b-2 px-4 py-3 text-small font-semibold transition-colors ${
                activeCategory === cat ? "border-amber-400 text-neutral-100" : "border-transparent text-neutral-400 hover:text-neutral-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 gap-x-10 gap-y-14 md:grid-cols-2">
        {shown.map((item) => {
          const drawing = item.cover.kind === "drawing";
          const preview = projectFactRows(item, unit).slice(0, 3);
          return (
            <article key={item.id} className="group flex flex-col">
              <button
                type="button"
                onClick={(e) => open(item, e.currentTarget)}
                className="block cursor-pointer text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-400"
                aria-label={`Open ${item.title}`}
              >
                <div className={`aspect-[4/3] overflow-hidden rounded-sm ${drawing ? "bg-white p-4" : "bg-neutral-900"}`}>
                  <img
                    src={item.cover.src}
                    width={item.cover.width}
                    height={item.cover.height}
                    alt={`${item.title} — ${item.cover.caption}`}
                    loading="lazy"
                    decoding="async"
                    className={`h-full w-full transition-transform duration-500 group-hover:scale-[1.02] ${drawing ? "object-contain" : "object-cover"}`}
                  />
                </div>
              </button>
              <p className="eyebrow mt-5 text-neutral-500">{item.category}</p>
              <h3 className="heading-3 mt-2 text-neutral-100">{item.title}</h3>
              <p className="mt-2 line-clamp-3 text-small text-neutral-400">{item.description}</p>
              {preview.length > 0 && (
                <dl className="mt-4 grid grid-cols-1 gap-x-6 gap-y-2 text-label sm:grid-cols-3">
                  {preview.map(([label, value]) => (
                    <div key={label}>
                      <dt className="text-neutral-500">{label}</dt>
                      <dd className="text-neutral-200">{value}</dd>
                    </div>
                  ))}
                </dl>
              )}
              <Button variant="link" size="sm" className="mt-5 self-start" onClick={(e) => open(item, e.currentTarget)}>
                View project
              </Button>
            </article>
          );
        })}
      </div>

      {selected && <ProjectWindow item={selected} onClose={close} unit={unit} onUnitChange={setUnit} />}
    </div>
  );
};

const ProjectWindow: React.FC<{
  item: PortfolioItem;
  onClose: () => void;
  unit: ReturnType<typeof useAreaUnit>[0];
  onUnitChange: ReturnType<typeof useAreaUnit>[1];
}> = ({ item, onClose, unit, onUnitChange }) => {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/85 p-3 backdrop-blur-sm sm:p-6"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-window-title"
        className="relative flex max-h-[94vh] w-full max-w-6xl flex-col overflow-hidden rounded border border-neutral-800 bg-neutral-950 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-neutral-800 px-5 py-4 sm:px-8">
          <div>
            <p className="eyebrow text-amber-400">{item.category}</p>
            <h2 id="project-window-title" className="heading-3 mt-1 text-neutral-100">
              {item.title}
            </h2>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded text-neutral-400 transition-colors hover:bg-neutral-900 hover:text-neutral-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-6 sm:px-8 sm:py-8">
          <ProjectGallery
            groups={[{ label: item.title, images: [item.cover, ...item.images] }]}
            frameClassName="h-[46vh] min-h-[280px] sm:h-[58vh]"
            autoplay={false}
          />

          <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <p className="eyebrow text-neutral-500">About the project</p>
              <p className="mt-3 text-body text-neutral-300">{item.description}</p>
              <p className="mt-4 text-small text-neutral-400">
                {item.sheetDetails}. Produced in {item.software.join(", ")}.
              </p>
              {item.clientReview && (
                <blockquote className="mt-6 border-l-2 border-amber-400/70 pl-4">
                  <p className="font-display text-h3 leading-snug text-neutral-200">“{item.clientReview.quote}”</p>
                  <p className="mt-2 text-label text-neutral-500">Client review</p>
                </blockquote>
              )}
            </div>
            <div className="lg:col-span-5">
              <div className="flex items-center justify-between gap-4">
                <p className="eyebrow text-neutral-500">Project facts</p>
                {item.facts.areaSqFt && <UnitToggle unit={unit} onChange={onUnitChange} name={`${item.id}-unit`} />}
              </div>
              <div className="mt-3">
                <ProjectFactsGrid item={item} unit={unit} />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end border-t border-neutral-800 px-5 py-4 sm:px-8">
          <Button variant="secondary" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};
