import React from "react";
import { Container } from "../components/Container";
import { PageHeader, SectionHeader } from "../components/SectionHeader";
import { ContactSection, FaqList, ItemList, NotIncludedSection, NumberedSteps, Section } from "../components/PageSections";
import { ProjectGallery } from "../components/ProjectGallery";
import { Button } from "../components/Button";
import { EXTERIOR_SHOWCASE_IMAGES, VISUALIZATION_RATES, VISUALIZATION_SHOWCASE_IMAGES } from "../data/architecturalData";
import { estimatorHref, ROUTES } from "../data/routes";
import { SpecialistProfile } from "../types";
import { formatUsd } from "../utils/format";

interface VisualizationServicePageProps {
  specialist: SpecialistProfile;
}

const R = VISUALIZATION_RATES;

const PROCESS_STEPS = [
  {
    title: "Share your model or drawings",
    description:
      "An existing 3D model, CAD drawings, or even hand sketches — renders can be built from whichever you already have.",
  },
  {
    title: "Material and lighting setup",
    description:
      "Real-world materials, fixtures and lighting are set up in V-Ray, Lumion or Twinmotion to match the mood and context you're after.",
  },
  {
    title: "First pass for review",
    description:
      "A draft comes back for your feedback before the final pass — camera, materials and lighting can still change at this stage.",
  },
  {
    title: "Revisions and final delivery",
    description:
      "Two revision rounds are included; final high-resolution images are delivered for marketing, planning exhibits or client presentations.",
  },
];

const FAQS = [
  {
    question: "Do you need a finished 3D model, or can you work from 2D drawings?",
    answer:
      "Either works. A finished, textured model is the quickest and cheapest starting point; 2D CAD drawings are the standard one; sketches and references work too, with the modelling done from scratch. The estimator prices all three.",
  },
  {
    question: "How is a render priced?",
    answer:
      "Per view, like every rendering studio — by scene (interior, exterior or aerial), size, what you can supply, resolution and schedule. More views of the same scene cost less each, because the model and lighting are already done.",
  },
  {
    question: "What file formats are renders delivered in?",
    answer:
      "High-resolution JPG or PNG stills as standard. Layered files or specific sizes for print or web can be arranged — mention it when you get in touch.",
  },
];

const RATE_ROWS: Array<[string, string]> = [
  ["Interior view", `from ${formatUsd(R.basePerView.interior)}`],
  ["Exterior view", `from ${formatUsd(R.basePerView.exterior)}`],
  ["Aerial view", `from ${formatUsd(R.basePerView.aerial)}`],
  ["360° panorama", `${formatUsd(R.panoramaPerView)} each`],
  ["Animation", `${formatUsd(R.animationPerSecond)} per second (${R.animationMinSeconds} s minimum)`],
  ["Extra revision round", `${formatUsd(R.extraRevisionRound)}`],
];

export const VisualizationServicePage: React.FC<VisualizationServicePageProps> = ({ specialist }) => (
  <main className="flex-1">
    <PageHeader
      breadcrumbs={[
        { label: "Home", href: ROUTES.home },
        { label: "Services", href: ROUTES.services },
        { label: "Architectural Visualization" },
      ]}
      eyebrow="Architectural visualization"
      title="Photorealistic Rendering, Interior & Exterior"
      intro="Interior, exterior and aerial renders in V-Ray, Lumion and Twinmotion — built from an existing model, CAD drawings or concept sketches, and priced per view."
    >
      <Button href={estimatorHref("visualization")}>Start a Project</Button>
      <Button href="#renders" variant="link">
        See the renders
      </Button>
    </PageHeader>

    <Section id="renders">
      <Container>
        <SectionHeader eyebrow="Selected work" title="Renders" intro="Each render shown whole, at its own resolution." />
        <div className="mt-12">
          <ProjectGallery
            groups={[
              { label: "Interior", images: VISUALIZATION_SHOWCASE_IMAGES },
              { label: "Exterior", images: EXTERIOR_SHOWCASE_IMAGES },
            ]}
          />
        </div>
      </Container>
    </Section>

    <Section raised>
      <Container>
        <SectionHeader title="How a render gets made" />
        <div className="mx-auto mt-12 max-w-5xl">
          <NumberedSteps steps={PROCESS_STEPS} />
        </div>
      </Container>
    </Section>

    <Section>
      <Container width="text">
        <SectionHeader title="Software & delivery" />
        <ItemList
          className="mt-10"
          items={[
            "V-Ray photorealistic rendering",
            "Lumion and Twinmotion real-time visualization",
            "Standard 2K, High 4K or Hero 6K+ stills, 360° panoramas and animation",
          ]}
        />
      </Container>
    </Section>

    <Section id="pricing" raised>
      <Container width="text">
        <SectionHeader
          eyebrow="Pricing"
          title="Priced per view"
          intro="The rate for one view at the Schematic stage in Standard 2K. What you can supply, the size of the scene, the resolution and the schedule adjust it — and more views of the same scene cost less each."
        >
          <Button href={estimatorHref("visualization")}>Start a Project</Button>
        </SectionHeader>
        <dl className="mt-10 divide-y divide-neutral-800 border-y border-neutral-800">
          {RATE_ROWS.map(([label, value]) => (
            <div key={label} className="flex items-baseline justify-between gap-6 py-3 text-small">
              <dt className="text-neutral-300">{label}</dt>
              <dd className="text-right font-mono text-neutral-100">{value}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 text-center text-label text-neutral-500">
          The same rates for every client, anywhere in the world. {R.includedRevisionRounds} revision rounds included.
        </p>
      </Container>
    </Section>

    <NotIncludedSection service="visualization" />

    <Section raised>
      <Container width="text">
        <SectionHeader title="Common questions" />
        <div className="mt-12">
          <FaqList faqs={FAQS} />
        </div>
      </Container>
    </Section>

    <ContactSection
      specialist={specialist}
      service="visualization"
      title="Ready to visualize your project?"
      inquiry={`Hi ${specialist.name.split(" ")[0]}, I found your visualization page and would like to discuss a rendering project.`}
      emailSubject="Visualization inquiry"
    />
  </main>
);
