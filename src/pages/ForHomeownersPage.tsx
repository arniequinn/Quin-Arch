import React from "react";
import { Eye, FileCheck2, Ruler, UserCheck } from "lucide-react";
import { Container } from "../components/Container";
import { PageHeader } from "../components/SectionHeader";
import { FeatureGrid } from "../components/FeatureGrid";
import { Section } from "../components/PageSections";
import { Button } from "../components/Button";
import { GallerySection } from "../components/gallery/GallerySection";
import { galleryImage } from "../data/galleryProjects";
import { ROUTES } from "../data/routes";

// v3.3 Phase 4 (D3): the homeowner case, moved here from Why Work With Us so firm visitors never
// scroll past it. Reached from the footer and a small link on How We Work.
const HOMEOWNER_POINTS = [
  {
    icon: UserCheck,
    title: "One architect, start to finish",
    body: "You talk directly to the principal architect who does the work — no account managers, no hand-offs between a salesperson and a drafter.",
  },
  {
    icon: Eye,
    title: "See it before it is built",
    body: "Photorealistic interior and exterior visualization, built from your drawings, model or sketches, so decisions get made on screen instead of on site.",
  },
  {
    icon: FileCheck2,
    title: "Permit-ready drawings",
    body: "Code-compliant construction documents for IBC / IRC / CBC jurisdictions, prepared for a locally licensed architect or engineer to review and stamp where your jurisdiction requires it.",
  },
  {
    icon: Ruler,
    title: "A clear scope before you commit",
    body: "The Scope Estimator shows what's included and what it costs before anything starts. One rate for every client, anywhere in the world.",
  },
];

// A furnished plan, the room it becomes, and a sheet from a permit set.
const HOMEOWNER_IMAGES = [
  galleryImage("sheets/01-three-bed-apartment-furnished-plan.webp", "Furnished plan", { title: "Three-bed apartment — furnished plan" }),
  galleryImage("visualization-showcase/singles/01-three-bed-apartment-living-room.webp", "The living room it becomes"),
  galleryImage("sheets/beach-house-first-level-plan.webp", "Permit set — first-level plan", { title: "Texas beach house" }),
];

export const ForHomeownersPage: React.FC = () => (
  <main className="flex-1">
    <PageHeader
      breadcrumbs={[{ label: "Home", href: ROUTES.home }, { label: "For Homeowners" }]}
      eyebrow="For homeowners and individual clients"
      title="A building designed around how you actually live."
      intro="Building or renovating is a big decision and a lot of paperwork. You get one accountable architect who handles the design thinking and the technical documentation together."
    />
    <Section raised>
      <Container>
        <FeatureGrid features={HOMEOWNER_POINTS} />
        <GallerySection className="mt-14" items={HOMEOWNER_IMAGES} />
        <div className="mt-14 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
          <Button href={ROUTES.scopeEstimator}>Price your project</Button>
          <Button href={ROUTES.designPhilosophy} variant="link">
            Design Philosophy
          </Button>
        </div>
      </Container>
    </Section>
  </main>
);
