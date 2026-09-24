import React from "react";
import { Eye, FileCheck2, MessageSquare, Ruler, UserCheck } from "lucide-react";
import { Container } from "../components/Container";
import { PageHeader, SectionHeader } from "../components/SectionHeader";
import { FeatureGrid } from "../components/FeatureGrid";
import { Section } from "../components/PageSections";
import { Reveal } from "../components/Reveal";
import { Button } from "../components/Button";
import { WorkflowsSection } from "../components/WorkflowsSection";
import { ROUTES } from "../data/routes";
import { whatsappHref } from "../services/contact";
import { SpecialistProfile } from "../types";

interface WhyWorkWithUsPageProps {
  specialist: SpecialistProfile;
}

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
    body: "Code-compliant construction documents for IBC / IRC / CBC jurisdictions, laid out the way your city's plan checkers expect to receive them.",
  },
  {
    icon: Ruler,
    title: "A clear scope before you commit",
    body: "The Scope Estimator shows what's included and what it costs before anything starts. One rate for every client, anywhere in the world.",
  },
];

// Point 11: every section header centered, both feature grids in the same container.
export const WhyWorkWithUsPage: React.FC<WhyWorkWithUsPageProps> = ({ specialist }) => (
  <main className="flex-1">
    <PageHeader
      breadcrumbs={[{ label: "Home", href: ROUTES.home }, { label: "Why Work With Us" }]}
      eyebrow="Why work with us"
      title={
        <>
          Principal-level architecture, <span className="text-amber-400">delivered remotely.</span>
        </>
      }
      intro="Whether you're planning a single build or running a firm with more work than hands, the same principle applies: senior judgment on every sheet and every model. Pick the case that fits you."
    >
      <Button href="#homeowners" variant="secondary">
        I'm planning a home or project
      </Button>
      <Button href="#firms" variant="secondary">
        I run a firm or contracting business
      </Button>
    </PageHeader>

    <Section id="homeowners">
      <Container>
        <Reveal>
          <SectionHeader
            eyebrow="For homeowners and individual clients"
            title="A building designed around how you actually live."
            intro="Building or renovating is a big decision and a lot of paperwork. You get one accountable architect who handles the design thinking and the technical documentation together."
          />
        </Reveal>
        <div className="mt-14">
          <FeatureGrid features={HOMEOWNER_POINTS} />
        </div>
        <div className="mt-14 flex flex-wrap items-center justify-center gap-x-6 gap-y-4">
          <Button href={ROUTES.scopeEstimator}>Start a Project</Button>
          <Button
            variant="secondary"
            icon={MessageSquare}
            href={whatsappHref(specialist, `Hi ${specialist.name.split(" ")[0]}, I'm planning a project and would like to talk it through.`)}
            external
          >
            WhatsApp
          </Button>
          <Button href={ROUTES.designPhilosophy} variant="link">
            Design Philosophy
          </Button>
        </div>
      </Container>
    </Section>

    <WorkflowsSection />
  </main>
);
