import React from "react";
import { ArrowRight } from "lucide-react";

const DESTINATIONS: Array<[label: string, path: string]> = [
  ["Services", "services/"],
  ["Case Studies", "case-studies/"],
  ["Project Library", "projects/"],
  ["Why Work With Us", "why-work-with-us/"],
  ["LOD Guide", "guides/lod-guide/"],
  ["Scope Estimator", "#estimator"],
];

// Served by GitHub Pages (as /404.html) for any URL that doesn't exist — typically an old or
// mistyped link — so a visitor lands one click from every real page instead of a dead end.
export const NotFoundPage: React.FC = () => {
  const base = import.meta.env.BASE_URL;

  return (
    <main className="flex-1">
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-28 pb-24">
        <span className="text-[11px] font-mono text-amber-400/90 tracking-widest uppercase">
          404 · Page not found
        </span>
        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-neutral-100 tracking-tight leading-[1.08] mt-3">
          This page isn't here.
        </h1>
        <p className="mt-6 text-base sm:text-lg text-neutral-400 leading-relaxed max-w-2xl font-light">
          The link may be out of date, or the page may have moved. Everything on the site is one
          step from here.
        </p>

        <ul className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-x-10 border-t border-neutral-900">
          {DESTINATIONS.map(([label, path]) => (
            <li key={path} className="border-b border-neutral-900">
              <a
                href={`${base}${path}`}
                className="group flex items-center justify-between py-4 text-sm text-neutral-300 hover:text-amber-400 transition-colors"
              >
                <span>{label}</span>
                <ArrowRight className="w-4 h-4 text-neutral-600 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
              </a>
            </li>
          ))}
        </ul>

        <a
          href={base}
          className="mt-10 inline-flex items-center space-x-2 text-sm font-bold text-neutral-950 bg-amber-400 hover:bg-amber-300 px-6 py-3.5 rounded transition-all"
        >
          <span>Back to the homepage</span>
        </a>
      </section>
    </main>
  );
};
