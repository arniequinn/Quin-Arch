import React, { useState } from "react";
import { ArrowRight, ChevronDown } from "lucide-react";
import { Reveal } from "../components/Reveal";
import { SpecialistProfile } from "../types";
import { assetUrl } from "../utils/assetPath";

interface DesignPhilosophyPageProps {
  specialist: SpecialistProfile;
}

// Source: documentation/principal-architect-page-plan.md — the copy below is distilled from the
// portfolio's Design Philosophy / Methodology text, not new material.
const LOGIC_IMAGES = [
  { file: "bimcad-workflow/07-solar-wind-analysis.jpg", caption: "Solar and wind analysis — climate as a design input, not decoration." },
  { file: "bimcad-workflow/05-structural-model-calc.jpg", caption: "Structural modelling and calculation — loads resolved before form is fixed." },
  { file: "bimcad-workflow/06-facade-paneling-script.jpg", caption: "Scripted façade paneling — geometry driven by rules, tuned by eye." },
];

const FEELING_IMAGES = [
  { file: "visualization-showcase/05-classical-dining.jpg", caption: "A room that has to feel calm to sit in." },
  { file: "visualization-showcase/10-sunken-fire-pit-lounge.webp", caption: "Light, warmth and gathering — the reason the room exists." },
];

const MEET_IMAGES = {
  wall: { file: "parametric-furniture/1.webp", caption: "Wave-form slat wall — a script sets the curve, the walnut makes it something you want to touch." },
  desk: { file: "parametric-furniture/0.png", caption: "Reception desk — computed rhythm, hand-scaled warmth." },
  sofa: { file: "parametric-furniture/2.png", caption: "Ribbed seating — structure and comfort resolved as one form." },
};

const DRAWINGS = [1, 2, 3, 4, 5, 6].map((n) => `drawings/${n}.jpg`);

const Figure: React.FC<{ file: string; caption: string; className?: string; imgClassName?: string }> = ({
  file,
  caption,
  className = "",
  imgClassName = "",
}) => (
  <figure className={className}>
    <img
      src={assetUrl(`/portfolio/${file}`)}
      alt={caption}
      loading="lazy"
      className={`w-full object-cover bg-neutral-900 ${imgClassName}`}
    />
    <figcaption className="mt-2 text-xs text-neutral-500 leading-relaxed">{caption}</figcaption>
  </figure>
);

export const DesignPhilosophyPage: React.FC<DesignPhilosophyPageProps> = ({ specialist }) => {
  const base = import.meta.env.BASE_URL;
  const [showDrawings, setShowDrawings] = useState(false);

  return (
    <main className="flex-1">
      {/* 1. Hero — the one-line statement, alone */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 pb-10">
        <div className="flex items-center gap-4">
          {specialist.avatarUrl && (
            <img
              src={specialist.avatarUrl}
              alt={specialist.name}
              className="w-14 h-14 rounded-2xl object-cover bg-neutral-900 shrink-0"
            />
          )}
          <div>
            <span className="text-[11px] font-mono text-neutral-500 tracking-widest uppercase">
              Principal Architect
            </span>
            <p className="font-display text-xl font-bold text-neutral-100">{specialist.name}</p>
          </div>
        </div>
        <h1 className="mt-14 font-display text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] text-neutral-100 max-w-4xl">
          Data and logic, intuition and emotion —{" "}
          <span className="text-amber-400">in equal measure,</span> to solve human problems.
        </h1>

        {/* 2. Two-line subhead */}
        <p className="mt-8 max-w-2xl text-base sm:text-lg text-neutral-400 leading-relaxed font-light">
          Quintessential architecture: harmony between person, place, and space — built with data and
          logic, guided by intuition and emotion.
        </p>
      </section>

      {/* 3. Proof, split in two */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          <Reveal>
            <span className="text-[11px] font-mono text-amber-400 tracking-widest uppercase">
              Data &amp; logic
            </span>
            <p className="mt-2 text-sm text-neutral-400 max-w-md">
              Real inputs, not decoration: loads, solar paths, material behaviour.
            </p>
            <div className="mt-6 space-y-6">
              {LOGIC_IMAGES.map((img) => (
                <Figure key={img.file} {...img} imgClassName="aspect-[16/10] rounded-sm" />
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <span className="text-[11px] font-mono text-amber-400 tracking-widest uppercase">
              Intuition &amp; emotion
            </span>
            <p className="mt-2 text-sm text-neutral-400 max-w-md">
              A building still has to feel like somewhere a person wants to be.
            </p>
            <div className="mt-6 space-y-6">
              {FEELING_IMAGES.map((img) => (
                <Figure key={img.file} {...img} imgClassName="aspect-[16/10] rounded-sm" />
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* 4. Where they meet */}
      <section className="border-t border-neutral-900 py-14 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <span className="text-[11px] font-mono text-amber-400 tracking-widest uppercase">
              Where they meet
            </span>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl font-bold tracking-tight text-neutral-100 max-w-2xl">
              A form driven by a script — that still feels made by hand.
            </h2>
          </Reveal>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-8">
            <Reveal className="md:col-span-2 md:row-span-2">
              <Figure {...MEET_IMAGES.wall} imgClassName="max-h-[720px] rounded-sm" />
            </Reveal>
            <Reveal className="md:col-span-3" delay={0.05}>
              <Figure {...MEET_IMAGES.desk} imgClassName="aspect-[16/10] rounded-sm" />
            </Reveal>
            <Reveal className="md:col-span-3" delay={0.1}>
              <Figure {...MEET_IMAGES.sofa} imgClassName="aspect-[16/10] rounded-sm" />
            </Reveal>
          </div>
        </div>
      </section>

      {/* 5. Free-hand drawings — hidden by default */}
      <section className="border-t border-neutral-900 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => setShowDrawings((v) => !v)}
            aria-expanded={showDrawings}
            className="flex items-center gap-2 text-sm text-neutral-400 hover:text-neutral-100 transition-colors cursor-pointer"
          >
            <span>{showDrawings ? "Hide" : "View"} the free-hand drawings behind the parametric work</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${showDrawings ? "rotate-180" : ""}`} />
          </button>
          {showDrawings && (
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {DRAWINGS.map((file) => (
                <img
                  key={file}
                  src={assetUrl(`/portfolio/${file}`)}
                  alt="Free-hand figure drawing"
                  loading="lazy"
                  className="w-full aspect-[4/3] object-cover bg-neutral-900 rounded-sm"
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 6. The paragraph — after the proof */}
      <section className="border-t border-neutral-900 py-16 sm:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <p className="font-display text-xl sm:text-2xl leading-relaxed text-neutral-200">
              I design with data and logic just as much as intuition and emotion — not one in service
              of the other. Structural loads, solar paths, material behavior: real inputs, not
              decoration. But a building still has to feel like somewhere a person wants to be.
              Quintessential architecture is what happens when both disciplines solve the same basic
              human problem together: shelter, light, comfort, calm.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <a
                href={`${base}#estimator`}
                className="group flex items-center space-x-2 text-sm font-bold text-neutral-950 bg-amber-400 hover:bg-amber-300 px-6 py-3.5 rounded transition-all"
              >
                <span>Start a Project</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href={`${base}services/`}
                className="px-6 py-3.5 rounded border border-neutral-700 text-neutral-300 text-sm hover:text-neutral-100 hover:border-neutral-500 transition-all"
              >
                View Services
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
};
