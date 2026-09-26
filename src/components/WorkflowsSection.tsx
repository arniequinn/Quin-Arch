import React from "react";
import { Cloud, FileCode2, Layers, Zap } from "lucide-react";
import { Container } from "./Container";
import { SectionHeader } from "./SectionHeader";
import { FeatureGrid } from "./FeatureGrid";
import { Section } from "./PageSections";
import { Button } from "./Button";
import { GallerySection } from "./gallery/GallerySection";
import { galleryImage } from "../data/galleryProjects";
import { ROUTES } from "../data/routes";

const BENEFITS = [
  {
    icon: Layers,
    title: "Senior-level production, on demand",
    body: "Drafting and BIM capacity that follows each project's real workload — a principal architect's judgment on exactly the sheets and models a phase needs.",
  },
  {
    icon: Zap,
    title: "24 to 48-hour redline revisions",
    body: "Plan-check comments or structural markups? Send scanned PDFs or a Bluebeam Studio session and get corrected sheets back within 24 to 48 hours.",
  },
  {
    icon: Cloud,
    title: "Your cloud, your templates",
    body: "Your shared drive — Dropbox, Google Drive or your own platform — with BIMx models for review, delivered into your office's own titleblocks and CAD layering.",
  },
  {
    icon: FileCode2,
    title: "National CAD Standard & AIA layering",
    body: "Proper line weights, dimension styles, annotation and parametric GDL objects on every plan, section and detail — ready for pricing or a stamp.",
  },
];

// H1 (v3.0 §11): the firm's case, shown — a sheet from a production set, the model behind a
// tower, and a section with its quantity takeoff.
const PRODUCTION_IMAGES = [
  galleryImage("sheets/slamburger-a01-floor-plans.webp", "Production set — floor plans", { title: "Slamburger restaurant" }),
  galleryImage("bimcad-workflow/05a-structural-model.webp", "BIM model — structure of a residential tower", { title: "Structural model" }),
  galleryImage("sheets/flats-section-quantities.webp", "Building section with its quantity takeoff", { title: "Urban flats" }),
];

// The case for firms and contractors, on the How We Work page.
export const WorkflowsSection: React.FC = () => (
  <Section id="firms" raised>
    <Container>
      <SectionHeader
        eyebrow="For firms and contractors"
        title="Why architecture studios and contractors outsource production"
        intro="Clear drafting bottlenecks, move permit cycles faster, and take on more projects without adding to in-house payroll."
      />
      <div className="mt-14">
        <FeatureGrid features={BENEFITS} />
      </div>
      <GallerySection className="mt-14" items={PRODUCTION_IMAGES} />
      <div className="mt-14 flex justify-center">
        <Button href={ROUTES.services} variant="link">
          Fixed-price and retainer options
        </Button>
      </div>
    </Container>
  </Section>
);
