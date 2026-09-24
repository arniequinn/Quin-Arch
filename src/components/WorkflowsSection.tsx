import React from "react";
import { Cloud, FileCode2, Layers, Zap } from "lucide-react";
import { Container } from "./Container";
import { SectionHeader } from "./SectionHeader";
import { FeatureGrid } from "./FeatureGrid";
import { Section } from "./PageSections";
import { Button } from "./Button";
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
    body: "BIM 360, Autodesk Construction Cloud, cloud worksharing, Google Drive or Dropbox — delivered into your office's own titleblocks and CAD layering.",
  },
  {
    icon: FileCode2,
    title: "National CAD Standard & AIA layering",
    body: "Proper line weights, dimension styles, annotation and parametric families on every plan, section and detail — ready for pricing or a stamp.",
  },
];

// The case for firms and contractors, on the Why Work With Us page.
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
      <div className="mt-14 flex justify-center">
        <Button href={ROUTES.services} variant="link">
          Fixed-price and retainer options
        </Button>
      </div>
    </Container>
  </Section>
);
