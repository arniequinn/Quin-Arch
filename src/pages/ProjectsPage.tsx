import React from "react";
import { Container } from "../components/Container";
import { PageHeader, SectionHeader } from "../components/SectionHeader";
import { Section } from "../components/PageSections";
import { DeliverablesGallery } from "../components/DeliverablesGallery";
import { Reveal } from "../components/Reveal";
import { Button } from "../components/Button";
import { GallerySection } from "../components/gallery/GallerySection";
import { ProjectCards } from "../components/gallery/ProjectCards";
import { ClientStories } from "../components/gallery/ClientStories";
import {
  CLIENT_STORIES,
  DRAWING_GRID,
  EXTERIOR_GRID,
  FURNITURE,
  FURNITURE_HIGHLIGHTS,
  INTERIOR_GRID,
  WORKFLOW_GROUPS,
  projectBySlug,
  projectsIn,
} from "../data/galleryProjects";
import { projectHref, ROUTES } from "../data/routes";
import { SpecialistProfile } from "../types";

interface ProjectsPageProps {
  specialist: SpecialistProfile;
}

const SECTIONS = [
  { id: "interior", label: "Interior" },
  { id: "exterior", label: "Exterior" },
  { id: "furniture", label: "Furniture & Virtual Staging" },
  { id: "drawing-sets", label: "Drawing sets" },
  { id: "bim-workflow", label: "BIM / CAD workflow" },
];

const byslug = (...slugs: string[]) => slugs.map((s) => projectBySlug(s)!).filter(Boolean);

/** A quiet label between a section's project cards and its grid. */
const SubHeading: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h3 className="eyebrow mb-8 mt-20 border-t border-neutral-800 pt-8 text-neutral-400">{children}</h3>
);

// The Project Library (v3.0 §7): five sections, each with its project cards first, then the
// remaining work in a justified grid with bold captions and a lightbox.
export const ProjectsPage: React.FC<ProjectsPageProps> = () => (
  <main className="flex-1">
    <PageHeader
      breadcrumbs={[{ label: "Home", href: ROUTES.home }, { label: "Project Library" }]}
      eyebrow="Selected work"
      title="Project Library"
      intro="Interiors, exteriors, furniture, permit sets and the models and scripts behind them — every project in one place."
    >
      <nav aria-label="On this page" className="flex flex-wrap justify-center gap-3">
        {SECTIONS.map((s) => (
          <Button key={s.id} href={`#${s.id}`} variant="secondary" size="sm">
            {s.label}
          </Button>
        ))}
      </nav>
    </PageHeader>

    <Section id="interior">
      {/* Earlier links pointed at #visualization and #gallery; keep them landing here. */}
      <span id="visualization" className="block scroll-mt-24" aria-hidden="true" />
      <span id="gallery" className="block scroll-mt-24" aria-hidden="true" />
      <Container>
        <SectionHeader
          eyebrow="Interior"
          title="Interiors, room by room"
          intro="Each project opens onto every view of it. Built work, briefs and the furniture that dresses the rooms."
        />
        <Reveal className="mt-14">
          <ProjectCards projects={projectsIn("interior")} />
        </Reveal>
        <SubHeading>More interiors</SubHeading>
        <GallerySection items={INTERIOR_GRID} />
      </Container>
    </Section>
    <Section id="exterior" raised>
      <Container>
        <SectionHeader eyebrow="Exterior" title="Buildings and their settings" intro="Exterior views, with the 3D model beside the finished image where there is one." />
        <Reveal className="mt-14">
          <ProjectCards projects={projectsIn("exterior")} />
        </Reveal>
        <SubHeading>More exteriors</SubHeading>
        <GallerySection items={EXTERIOR_GRID} />
      </Container>
    </Section>
    <Section id="furniture">
      <Container>
        <SectionHeader
          eyebrow="Furniture & Virtual Staging"
          title="The pieces that make the room"
          intro="A large library of industry-standard, manufacturer-specified furniture, placed into your design with a designer's eye. Want to see your new room with that exact chair? It can be done."
        >
          <Button href={projectHref("furniture")} variant="link">
            Open the full collection
          </Button>
        </SectionHeader>
        <GallerySection
          className="mt-14"
          items={[...FURNITURE_HIGHLIGHTS, ...FURNITURE.filter((f) => !FURNITURE_HIGHLIGHTS.includes(f))]}
          initialCount={FURNITURE_HIGHLIGHTS.length}
          showAllLabel={`Show all ${FURNITURE.length} furniture pieces`}
          currentProject="furniture"
        />
      </Container>
    </Section>
    <Section id="drawing-sets" raised>
      {/* Earlier links pointed at #deliverables; keep them landing here. */}
      <span id="deliverables" className="block scroll-mt-24" aria-hidden="true" />
      <Container>
        <SectionHeader
          eyebrow="Drawing sets"
          title="Permit sets and BIM production"
          intro="Real client drawing sets — plans, elevations, sections, services layouts and renders. Open a project for its sheets and facts."
        />
        <Reveal className="mt-12">
          <DeliverablesGallery />
        </Reveal>
        <SubHeading>Built and documented</SubHeading>
        <ProjectCards projects={byslug("serene-suites", "vip-lounge-dubai", "barndo-florida")} />
        <SubHeading>Client stories</SubHeading>
        <ClientStories stories={CLIENT_STORIES} />
        <SubHeading>Details and elevations</SubHeading>
        <GallerySection items={DRAWING_GRID} />
      </Container>
    </Section>
    <Section id="bim-workflow">
      <Container>
        <SectionHeader
          eyebrow="BIM / CAD workflow"
          title="Inside the production files"
          intro="Screens from real projects: model views, schedules and quantities, and the scripts and analyses behind the geometry."
        />
        {WORKFLOW_GROUPS.map((group, i) => (
          <div key={group.label}>
            {i === 0 ? (
              <h3 className="eyebrow mb-8 mt-14 text-neutral-400">{group.label}</h3>
            ) : (
              <SubHeading>{group.label}</SubHeading>
            )}
            <GallerySection items={group.items} />
          </div>
        ))}
      </Container>
    </Section>
  </main>
);
