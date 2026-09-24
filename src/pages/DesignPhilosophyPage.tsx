import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Container } from "../components/Container";
import { SectionHeader } from "../components/SectionHeader";
import { Section } from "../components/PageSections";
import { PracticeNote } from "../components/PracticeNote";
import { Reveal } from "../components/Reveal";
import { Button } from "../components/Button";
import { ROUTES } from "../data/routes";
import { SpecialistProfile } from "../types";
import { assetUrl } from "../utils/assetPath";

interface DesignPhilosophyPageProps {
  specialist: SpecialistProfile;
}

// Source: documentation/principal-architect-page-plan.md — the copy below is distilled from the
// portfolio's Design Philosophy / Methodology text, not new material.
const LOGIC_IMAGES = [
  { file: "bimcad-workflow/07-solar-wind-analysis.jpg", width: 1920, height: 1041, caption: "Solar and wind analysis — climate as a design input, not decoration." },
  { file: "bimcad-workflow/05a-structural-model.webp", width: 800, height: 810, caption: "Structural modelling — loads resolved before form is fixed." },
  { file: "bimcad-workflow/06-facade-paneling-script.jpg", width: 1920, height: 1042, caption: "Scripted façade paneling — geometry driven by rules, tuned by eye." },
];

const FEELING_IMAGES = [
  { file: "visualization-showcase/05-classical-dining.jpg", width: 1920, height: 1080, caption: "A room that has to feel calm to sit in." },
  { file: "visualization-showcase/10-sunken-fire-pit-lounge.webp", width: 1103, height: 896, caption: "Light, warmth and gathering — the reason the room exists." },
];

const MEET_IMAGES = {
  wall: { file: "parametric-furniture/1.webp", width: 761, height: 895, caption: "Wave-form slat wall — a script sets the curve, the walnut makes it something you want to touch." },
  desk: { file: "parametric-furniture/0.png", width: 1229, height: 752, caption: "Reception desk — computed rhythm, hand-scaled warmth." },
  sofa: { file: "parametric-furniture/2.png", width: 2530, height: 1536, caption: "Ribbed seating — structure and comfort resolved as one form." },
};

const DRAWINGS = [1, 2, 3, 4, 5, 6].map((n) => `drawings/${n}.jpg`);

// Images are shown whole, at their own proportions.
const Figure: React.FC<{ file: string; width: number; height: number; caption: string; className?: string }> = ({
  file,
  width,
  height,
  caption,
  className = "",
}) => (
  <figure className={className}>
    <img
      src={assetUrl(`/portfolio/${file}`)}
      width={width}
      height={height}
      alt={caption}
      loading="lazy"
      decoding="async"
      className="h-auto w-full rounded-sm bg-neutral-900"
    />
    <figcaption className="mt-2 text-label text-neutral-500">{caption}</figcaption>
  </figure>
);

export const DesignPhilosophyPage: React.FC<DesignPhilosophyPageProps> = ({ specialist }) => {
  const [showDrawings, setShowDrawings] = useState(false);

  return (
    <main className="flex-1">
      {/* 1. The one-line statement, alone */}
      <Container className="pt-16 pb-10 text-center sm:pt-24">
        {specialist.avatarUrl && (
          <img src={specialist.avatarUrl} alt={specialist.name} className="mx-auto h-16 w-16 rounded object-cover bg-neutral-900" />
        )}
        <p className="eyebrow mt-4 text-neutral-500">Principal Architect</p>
        <p className="mt-1 font-display text-h3 font-semibold text-neutral-100">{specialist.name}</p>
        <h1 className="heading-1 mx-auto mt-12 max-w-5xl text-neutral-100">
          Data and logic, intuition and emotion — <span className="text-amber-400">in equal measure,</span> to solve human problems.
        </h1>
        <p className="mx-auto mt-8 max-w-2xl text-body text-neutral-400">
          Quintessential architecture: harmony between person, place, and space — built with data and logic, guided by
          intuition and emotion.
        </p>
      </Container>

      {/* 2. The proof, split in two */}
      <Container className="py-14 sm:py-20">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <div className="text-center">
              <p className="eyebrow text-amber-400">Data &amp; logic</p>
              <p className="mt-2 text-small text-neutral-400">Real inputs, not decoration: loads, solar paths, material behaviour.</p>
            </div>
            <div className="mt-8 space-y-8">
              {LOGIC_IMAGES.map((img) => (
                <Figure key={img.file} {...img} />
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="text-center">
              <p className="eyebrow text-amber-400">Intuition &amp; emotion</p>
              <p className="mt-2 text-small text-neutral-400">A building still has to feel like somewhere a person wants to be.</p>
            </div>
            <div className="mt-8 space-y-8">
              {FEELING_IMAGES.map((img) => (
                <Figure key={img.file} {...img} />
              ))}
            </div>
          </Reveal>
        </div>
      </Container>

      {/* 3. Where they meet */}
      <Section>
        <Container>
          <Reveal>
            <SectionHeader eyebrow="Where they meet" title="A form driven by a script — that still feels made by hand." />
          </Reveal>
          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-5">
            <Reveal className="md:col-span-2 md:row-span-2">
              <Figure {...MEET_IMAGES.wall} />
            </Reveal>
            <Reveal className="md:col-span-3" delay={0.05}>
              <Figure {...MEET_IMAGES.desk} />
            </Reveal>
            <Reveal className="md:col-span-3" delay={0.1}>
              <Figure {...MEET_IMAGES.sofa} />
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* 4. The practice note: render and wireframe of one building */}
      <PracticeNote />

      {/* 5. Free-hand drawings — hidden by default */}
      <Section tight>
        <Container>
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => setShowDrawings((v) => !v)}
              aria-expanded={showDrawings}
              className="flex cursor-pointer items-center gap-2 text-small text-neutral-300 transition-colors hover:text-neutral-100"
            >
              <span>{showDrawings ? "Hide" : "View"} the free-hand drawings behind the parametric work</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${showDrawings ? "rotate-180" : ""}`} />
            </button>
          </div>
          {showDrawings && (
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {DRAWINGS.map((file) => (
                <img
                  key={file}
                  src={assetUrl(`/portfolio/${file}`)}
                  alt="Free-hand figure drawing"
                  loading="lazy"
                  className="aspect-[4/3] w-full rounded-sm bg-neutral-900 object-cover"
                />
              ))}
            </div>
          )}
        </Container>
      </Section>

      {/* 6. The paragraph — after the proof */}
      <Section>
        <Container width="text">
          <Reveal>
            <p className="font-display text-[1.375rem] leading-relaxed text-neutral-200 sm:text-[1.625rem]">
              I design with data and logic just as much as intuition and emotion — not one in service of the other.
              Structural loads, solar paths, material behavior: real inputs, not decoration. But a building still has to
              feel like somewhere a person wants to be. Quintessential architecture is what happens when both
              disciplines solve the same basic human problem together: shelter, light, comfort, calm.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Button href={ROUTES.scopeEstimator}>Start a Project</Button>
              <Button href={ROUTES.services} variant="secondary">
                View Services
              </Button>
            </div>
          </Reveal>
        </Container>
      </Section>
    </main>
  );
};
