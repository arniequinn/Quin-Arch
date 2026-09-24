import React from "react";
import { FileText } from "lucide-react";
import { Container } from "../components/Container";
import { PageHeader, SectionHeader } from "../components/SectionHeader";
import { Section } from "../components/PageSections";
import { DeliverablesGallery } from "../components/DeliverablesGallery";
import { ProjectGallery } from "../components/ProjectGallery";
import { Reveal } from "../components/Reveal";
import { Button } from "../components/Button";
import {
  BIM_PRODUCTION_IMAGES,
  COMPUTATIONAL_IMAGES,
  EXTERIOR_SHOWCASE_IMAGES,
  VISUALIZATION_SHOWCASE_IMAGES,
} from "../data/architecturalData";
import { ROUTES } from "../data/routes";
import { SpecialistProfile } from "../types";
import { assetUrl } from "../utils/assetPath";

interface ProjectsPageProps {
  specialist: SpecialistProfile;
}

const SECTIONS = [
  { id: "drawing-sets", label: "Drawing sets" },
  { id: "visualization", label: "Visualization" },
  { id: "bim-workflow", label: "BIM / CAD workflow" },
];

// The project library (point 15): three clearly labelled sections with an index at the top.
// The render-vs-wireframe practice note now lives on the Design Philosophy page.
export const ProjectsPage: React.FC<ProjectsPageProps> = () => (
  <main className="flex-1">
    <PageHeader
      breadcrumbs={[{ label: "Home", href: ROUTES.home }, { label: "Project Library" }]}
      eyebrow="Selected work"
      title="Project Library"
      intro="Permit sets and BIM production, photorealistic visualization, and the scripts and models behind them — selected work, in one place."
    >
      <nav aria-label="On this page" className="flex flex-wrap justify-center gap-3">
        {SECTIONS.map((s) => (
          <Button key={s.id} href={`#${s.id}`} variant="secondary" size="sm">
            {s.label}
          </Button>
        ))}
      </nav>
    </PageHeader>

    <Section id="drawing-sets">
      {/* Earlier links pointed at #deliverables; keep them landing here. */}
      <span id="deliverables" className="block scroll-mt-24" aria-hidden="true" />
      <Container>
        <SectionHeader
          eyebrow="Drawing sets"
          title="Permit sets and BIM production"
          intro="Real client drawing sets — plans, elevations, sections, services layouts and renders. Open a project for its sheets and facts."
        >
          <Button
            href={assetUrl("/portfolio/docs/Architecture Portfolio - Arslan Qaiser_compressed.pdf")}
            variant="link"
            size="sm"
            icon={FileText}
            arrow={false}
            external
          >
            Download the full portfolio (PDF)
          </Button>
        </SectionHeader>
        <Reveal className="mt-12">
          <DeliverablesGallery />
        </Reveal>
      </Container>
    </Section>

    <Section id="visualization" raised>
      <span id="gallery" className="block scroll-mt-24" aria-hidden="true" />
      <Container>
        <SectionHeader
          eyebrow="Visualization"
          title="Interior and exterior renders"
          intro="Finished renders, each shown whole."
        />
        <Reveal className="mt-12">
          <ProjectGallery
            groups={[
              { label: "Interior", images: VISUALIZATION_SHOWCASE_IMAGES },
              { label: "Exterior", images: EXTERIOR_SHOWCASE_IMAGES },
            ]}
          />
        </Reveal>
      </Container>
    </Section>

    <Section id="bim-workflow">
      <Container>
        <SectionHeader
          eyebrow="BIM / CAD workflow"
          title="Inside the production files"
          intro="Screens from real projects: model views, schedules and quantities, and the scripts and analyses behind the geometry."
        />
        <Reveal className="mt-12">
          <ProjectGallery
            autoplay={false}
            groups={[
              { label: "BIM production", images: BIM_PRODUCTION_IMAGES },
              { label: "Computational design", images: COMPUTATIONAL_IMAGES },
            ]}
          />
        </Reveal>
      </Container>
    </Section>
  </main>
);
