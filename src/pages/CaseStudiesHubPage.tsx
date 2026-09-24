import React from "react";
import { Container } from "../components/Container";
import { PageHeader } from "../components/SectionHeader";
import { PORTFOLIO_SAMPLES } from "../data/architecturalData";
import { CASE_STUDY_SLUGS, caseStudyHref, ROUTES } from "../data/routes";

export const CaseStudiesHubPage: React.FC = () => {
  const studies = PORTFOLIO_SAMPLES.filter((s) => CASE_STUDY_SLUGS[s.id]);

  return (
    <main className="flex-1">
      <PageHeader
        breadcrumbs={[{ label: "Home", href: ROUTES.home }, { label: "Case Studies" }]}
        eyebrow="Case studies"
        title="Real Projects, Real Scope"
        intro="Client work — permit sets, BIM models and commercial documentation — with the actual scope, sheets and deliverables behind each one."
      />

      <Container className="pb-24">
        <h2 className="sr-only">Case studies</h2>
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-x-10 gap-y-16 md:grid-cols-2">
          {studies.map((sample) => {
            const drawing = sample.cover.kind === "drawing";
            return (
              <a key={sample.id} href={caseStudyHref(sample.id)} className="group flex flex-col text-center">
                <div className={`aspect-[4/3] overflow-hidden rounded-sm ${drawing ? "bg-white p-4" : "bg-neutral-900"}`}>
                  <img
                    src={sample.cover.src}
                    width={sample.cover.width}
                    height={sample.cover.height}
                    alt={`${sample.title} — ${sample.cover.caption}`}
                    loading="lazy"
                    decoding="async"
                    className={`h-full w-full transition-transform duration-500 group-hover:scale-[1.02] ${drawing ? "object-contain" : "object-cover"}`}
                  />
                </div>
                <p className="eyebrow mt-6 text-neutral-500">{sample.category}</p>
                <h3 className="heading-3 mt-2 text-neutral-100 transition-colors group-hover:text-amber-300">{sample.title}</h3>
                <p className="mx-auto mt-3 line-clamp-2 max-w-xl text-small text-neutral-400">{sample.description}</p>
                <span className="mt-4 text-small font-semibold text-amber-400 group-hover:text-amber-300">Read the case study →</span>
              </a>
            );
          })}
        </div>
      </Container>
    </main>
  );
};
