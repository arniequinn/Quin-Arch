import React from "react";
import { Container } from "../components/Container";
import { PageHeader, SectionHeader } from "../components/SectionHeader";
import { ContactSection, Section } from "../components/PageSections";
import { ProjectGallery } from "../components/ProjectGallery";
import { ProjectFactsGrid } from "../components/ProjectFacts";
import { Button } from "../components/Button";
import { ROUTES } from "../data/routes";
import { PortfolioItem, SpecialistProfile } from "../types";

interface CaseStudyPageProps {
  sample: PortfolioItem;
  specialist: SpecialistProfile;
  breadcrumbLabel: string;
}

export const CaseStudyPage: React.FC<CaseStudyPageProps> = ({ sample, specialist, breadcrumbLabel }) => {
  const drawing = sample.cover.kind === "drawing";

  return (
    <main className="flex-1">
      <PageHeader
        breadcrumbs={[
          { label: "Home", href: ROUTES.home },
          { label: "Case Studies", href: ROUTES.caseStudies },
          { label: breadcrumbLabel },
        ]}
        eyebrow={sample.category}
        title={sample.title}
        intro={sample.description}
        className="pb-10 sm:pb-12"
      />

      {/* Cover — shown whole, never wider than its own pixels */}
      <Container>
        <figure className="mx-auto" style={{ maxWidth: sample.cover.width }}>
          <div className={`overflow-hidden rounded-sm ${drawing ? "bg-white p-4 sm:p-8" : "bg-neutral-900"}`}>
            <img
              src={sample.cover.src}
              width={sample.cover.width}
              height={sample.cover.height}
              alt={`${sample.title} — ${sample.cover.caption}`}
              className="mx-auto h-auto max-h-[75vh] w-auto max-w-full"
            />
          </div>
          <figcaption className="mt-3 text-center text-label text-neutral-500">{sample.cover.caption}</figcaption>
        </figure>
      </Container>

      <Section className="mt-16">
        <Container width="text">
          <SectionHeader eyebrow="The project" title="Scope and facts" />
          <p className="mt-10 text-body text-neutral-300">
            {sample.sheetDetails}. Produced in {sample.software.join(", ")}.
          </p>
          <div className="mt-10">
            <ProjectFactsGrid item={sample} unit="ft2" />
          </div>
          {sample.clientReview && (
            <blockquote className="mt-12 border-l-2 border-amber-400/70 pl-5">
              <p className="font-display text-[1.5rem] leading-snug text-neutral-200">“{sample.clientReview.quote}”</p>
              <p className="mt-3 text-label text-neutral-500">Client review, via {sample.clientReview.platform}</p>
            </blockquote>
          )}
        </Container>
      </Section>

      {sample.images.length > 0 && (
        <Section raised>
          <Container>
            <SectionHeader
              eyebrow="From the drawing set"
              title="Sheets and renders"
              intro="Each sheet shown whole. Use the arrows or swipe to move through the set."
            />
            <div className="mt-12">
              <ProjectGallery groups={[{ label: sample.title, images: sample.images }]} autoplay={false} />
            </div>
          </Container>
        </Section>
      )}

      <ContactSection
        specialist={specialist}
        service="bim"
        title="Have a similar project in mind?"
        inquiry={`Hi ${specialist.name.split(" ")[0]}, I read the "${sample.title}" case study and would like to discuss a similar project.`}
        emailSubject={`Re: ${sample.title} — similar project`}
      />

      <div className="flex justify-center pb-20">
        <Button href={ROUTES.caseStudies} variant="link">
          All case studies
        </Button>
      </div>
    </main>
  );
};
