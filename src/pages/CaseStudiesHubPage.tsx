import React from "react";
import { Container } from "../components/Container";
import { PageHeader } from "../components/SectionHeader";
import { PORTFOLIO_SAMPLES } from "../data/architecturalData";
import { projectsIn, sheetCountOf } from "../data/galleryProjects";
import { caseStudyHref, projectHref, ROUTES } from "../data/routes";
import { TrackImage } from "../types";

interface StudyCard {
  key: string;
  href: string;
  cover: TrackImage;
  eyebrow: string;
  title: string;
  summary: string;
  sheets: number;
  cta: string;
}

const CASE_STUDIES: StudyCard[] = PORTFOLIO_SAMPLES.filter((s) => s.caseStudySlug).map((s) => ({
  key: s.id,
  href: caseStudyHref(s.caseStudySlug!),
  cover: s.cover,
  eyebrow: s.category,
  title: s.title,
  summary: s.description,
  sheets: s.facts.sheets ?? 0,
  cta: "Read the case study",
}));

// v3.33: the drawing sets published from the owner's sheet PDFs (also in the Project Library).
const DRAWING_SETS: StudyCard[] = projectsIn("drawings").map((p) => ({
  key: p.slug,
  href: projectHref(p.slug),
  cover: p.cover,
  eyebrow: p.kind,
  title: p.title,
  summary: p.summary,
  sheets: sheetCountOf(p),
  cta: "See the drawings",
}));

const ALL = [...CASE_STUDIES, ...DRAWING_SETS];
const TOTAL_SHEETS = ALL.reduce((sum, c) => sum + c.sheets, 0);

const Card: React.FC<{ card: StudyCard }> = ({ card }) => {
  const drawing = card.cover.kind !== "render";
  return (
    <a href={card.href} className="group flex flex-col text-center">
      <div className={`aspect-[4/3] overflow-hidden rounded-sm ${drawing ? "bg-white p-4" : "bg-neutral-900"}`}>
        <img
          src={card.cover.src}
          width={card.cover.width}
          height={card.cover.height}
          alt={`${card.title} — ${card.cover.caption}`}
          loading="lazy"
          decoding="async"
          className={`h-full w-full transition-transform duration-500 group-hover:scale-[1.02] ${drawing ? "object-contain" : "object-cover"}`}
        />
      </div>
      <p className="eyebrow mt-6 text-neutral-500">{card.eyebrow}</p>
      <h3 className="heading-3 mt-2 text-neutral-100 transition-colors group-hover:text-amber-300">{card.title}</h3>
      <p className="mx-auto mt-3 line-clamp-2 max-w-xl text-small text-neutral-400">{card.summary}</p>
      <p className="mt-4 text-small">
        {card.sheets > 0 && <span className="text-neutral-500">{card.sheets} sheets · </span>}
        <span className="font-semibold text-amber-400 group-hover:text-amber-300">{card.cta} →</span>
      </p>
    </a>
  );
};

const Grid: React.FC<{ cards: StudyCard[] }> = ({ cards }) => (
  <div className="mx-auto grid max-w-6xl grid-cols-1 gap-x-10 gap-y-16 md:grid-cols-2">
    {cards.map((card) => (
      <Card key={card.key} card={card} />
    ))}
  </div>
);

export const CaseStudiesHubPage: React.FC = () => (
  <main className="flex-1">
    <PageHeader
      breadcrumbs={[{ label: "Home", href: ROUTES.home }, { label: "Case Studies" }]}
      eyebrow="Case studies"
      title="Real Projects, Real Scope"
      intro="Client work — permit sets, BIM models, renovation and services coordination — with the actual scope, sheets and deliverables behind each one."
    >
      <dl className="flex justify-center gap-12 text-center">
        <div>
          <dt className="eyebrow text-neutral-500">Drawing sets</dt>
          <dd className="mt-2 font-display text-[2rem] leading-none text-neutral-100">{ALL.length}</dd>
        </div>
        <div>
          <dt className="eyebrow text-neutral-500">Sheets</dt>
          <dd className="mt-2 font-display text-[2rem] leading-none text-neutral-100">{TOTAL_SHEETS}</dd>
        </div>
      </dl>
    </PageHeader>

    <Container className="pb-24">
      <h2 className="sr-only">Case studies</h2>
      <Grid cards={CASE_STUDIES} />

      <h2 className="eyebrow mx-auto mb-12 mt-24 max-w-6xl border-t border-neutral-800 pt-12 text-center text-neutral-400">
        More drawing sets
      </h2>
      <Grid cards={DRAWING_SETS} />
    </Container>
  </main>
);
