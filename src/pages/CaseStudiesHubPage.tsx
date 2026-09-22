import React from "react";
import { ArrowRight } from "lucide-react";
import { PORTFOLIO_SAMPLES } from "../data/architecturalData";

interface CaseStudyLink {
  id: string;
  slug: string;
}

const CASE_STUDY_SLUGS: CaseStudyLink[] = [
  { id: "sample-beach-house", slug: "texas-coastal-beach-house" },
  { id: "sample-slamburger", slug: "slamburger-restaurant" },
  { id: "sample-cran-residence", slug: "cran-residence" },
  { id: "sample-urban-flats", slug: "urban-multi-family-flats" },
];

export const CaseStudiesHubPage: React.FC = () => {
  const base = import.meta.env.BASE_URL;

  const studies = CASE_STUDY_SLUGS
    .map(({ id, slug }) => {
      const sample = PORTFOLIO_SAMPLES.find((s) => s.id === id);
      return sample ? { sample, slug } : null;
    })
    .filter((s): s is { sample: NonNullable<typeof s>["sample"]; slug: string } => Boolean(s));

  return (
    <main className="flex-1">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <nav className="flex items-center space-x-2 text-xs text-neutral-500 font-mono" aria-label="Breadcrumb">
          <a href={base} className="hover:text-neutral-300 transition-colors">Home</a>
          <span>/</span>
          <span className="text-neutral-300">Case Studies</span>
        </nav>
      </div>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-14">
        <span className="text-[11px] font-mono text-amber-400/90 tracking-widest uppercase">
          Case Studies
        </span>
        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-neutral-100 tracking-tight leading-[1.08] mt-3">
          Real Projects, Real Scope
        </h1>
        <p className="mt-6 text-base sm:text-lg text-neutral-400 leading-relaxed max-w-2xl font-light">
          Authentic client work — permit sets, BIM massing studies, and commercial documentation —
          with the actual scope, deliverables, and outcome behind each one.
        </p>
      </section>

      {/* Case study grid */}
      <section className="pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {studies.map(({ sample, slug }) => (
            <a
              key={sample.id}
              href={`${base}case-studies/${slug}/`}
              className="group rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-amber-500/50 overflow-hidden transition-all flex flex-col"
            >
              <div className="relative h-56 overflow-hidden bg-neutral-950">
                <img
                  src={sample.imageUrl}
                  alt={sample.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-md bg-neutral-950/80 backdrop-blur-md border border-neutral-700 text-[11px] font-mono text-amber-400 font-semibold">
                    {sample.category}
                  </span>
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h2 className="text-base font-bold text-neutral-100 group-hover:text-amber-400 transition-colors">
                    {sample.title}
                  </h2>
                  <p className="text-xs text-neutral-400 mt-2 leading-relaxed line-clamp-2">
                    {sample.description}
                  </p>
                </div>
                <div className="mt-4 flex items-center space-x-1.5 text-xs font-semibold text-amber-400 group-hover:text-amber-300 transition-colors">
                  <span>Read Case Study</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
};
