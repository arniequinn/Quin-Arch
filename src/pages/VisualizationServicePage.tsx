import React from "react";
import { Container } from "../components/Container";
import { RibbonSequence } from "../components/filmstrip/RibbonSequence";
import { pageFilmstrips } from "../data/filmstrips";
import { PageHeader, SectionHeader } from "../components/SectionHeader";
import { ContactSection, FaqList, NotIncludedSection, Section } from "../components/PageSections";
import { Button } from "../components/Button";
import { BarnCompare } from "../components/BarnCompare";
import { Figure } from "../components/gallery/Figure";
import { GallerySection } from "../components/gallery/GallerySection";
import { ProjectCards } from "../components/gallery/ProjectCards";
import { VISUALIZATION_RATES } from "../data/architecturalData";
import { galleryImage, projectBySlug, thumbOf } from "../data/galleryProjects";
import { projectHref, ROUTES } from "../data/routes";
import { TrackImage } from "../types";
import { SpecialistProfile } from "../types";
import { formatUsd } from "../utils/format";
import { HERO_VIDEOS, HeroVideo, SCRIM } from "../components/HeroVideo";

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
      "Real-world materials, fixtures and lighting are set up in Twinmotion, live-linked to the Archicad model, to match the mood and context you're after.",
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
    question: "What software and resolutions do you render in?",
    answer:
      "Twinmotion, live-linked to the Archicad model, for stills and real-time work, and Coohom for interiors — V-Ray or Lumion on your licence if your office standardises on them. Stills come in Standard 2K, High 4K or Hero 6K+, plus 360° panoramas and animation.",
  },
  {
    question: "What file formats are renders delivered in?",
    answer:
      "High-resolution JPG or PNG stills as standard. Layered files or specific sizes for print or web can be arranged — mention it when you get in touch.",
  },
];

// Each view type beside an example of it (v3.0 point 12).
const EXAMPLES: Record<string, TrackImage> = {
  "Interior view": galleryImage("visualization-showcase/02-dark-living-room.jpg", "Interior view", { project: "dark-living-room" }),
  "Exterior view": galleryImage("exterior-showcase/barndo-florida/01-exterior-at-dusk.webp", "Exterior view", { project: "barndo-florida" }),
};

const HERO = galleryImage("visualization-showcase/singles/03-open-kitchen-and-living.webp", "Interior visualization, 4K");

const dark = projectBySlug("dark-living-room")!;
// "Pieces to rooms": five pieces on their own, then the room they furnish.
const PIECES_TO_ROOM = [...(dark.pieces ?? []), dark.cover];

const RATE_ROWS: Array<[string, string]> = [
  ["Interior view", `from ${formatUsd(R.basePerView.interior)}`],
  ["Exterior view", `from ${formatUsd(R.basePerView.exterior)}`],
  ["Aerial view", `from ${formatUsd(R.basePerView.aerial)}`],
  ["360° panorama", `${formatUsd(R.panoramaPerView)} each`],
  ["Animation", `${formatUsd(R.animationPerSecond)} per second (${R.animationMinSeconds} s minimum)`],
  ["Extra revision round", `${formatUsd(R.extraRevisionRound)}`],
];

// v3.0 point 12 and §11: a visualization page that shows renders in every section but the
// questions and the close — brass eyebrows throughout, raised backgrounds alternating strictly.
// v3.0 §12: interior renders open the page, the furniture below them; both close it.
const STRIPS = pageFilmstrips("visualization");

export const VisualizationServicePage: React.FC<VisualizationServicePageProps> = () => (
  <main className="flex-1">
    <RibbonSequence
      preset="short"
      top={STRIPS[0]}
      bottom={STRIPS[1]}
      heroBackground={<HeroVideo {...HERO_VIDEOS.visualization} scrim={SCRIM.page} />}
      hero={
        <PageHeader
          breadcrumbs={[
            { label: "Home", href: ROUTES.home },
            { label: "Services", href: ROUTES.services },
            { label: "Architectural Visualization" },
          ]}
          eyebrow="Architectural visualization"
          title="Photorealistic Rendering, Interior & Exterior"
          intro="Interior, exterior and aerial renders in Twinmotion and Coohom — built from an existing model, CAD drawings or concept sketches, and priced per view."
        >
          <Button href="#renders" variant="link">
            See the renders
          </Button>
          <Button href="#pricing" variant="link" arrow={false}>
            See pricing ↓
          </Button>
        </PageHeader>
      }
    >
      <Container>
        <Figure image={HERO} displayWidth={1216} maxHeight="72svh" caption={false} priority />
      </Container>

      <Section id="renders" className="mt-16 sm:mt-24">
        <Container>
          <SectionHeader
            eyebrow="Selected work"
            title="Rooms, rendered"
            intro="Three interiors from the Project Library — each opens onto every view of it."
          >
            <Button href={`${ROUTES.projects}#interior`} variant="link">
              See all interior projects
            </Button>
            <Button href={`${ROUTES.projects}#exterior`} variant="link">
              Exteriors
            </Button>
          </SectionHeader>
          <ProjectCards
            className="mt-14"
            projects={["dark-living-room", "bright-loft", "classical-apartment"].map((slug) => projectBySlug(slug)!)}
          />
        </Container>
      </Section>

      <Section raised>
        <Container>
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-7">
              <BarnCompare />
            </div>
            <div className="lg:col-span-5">
              <p className="eyebrow text-amber-400">Process</p>
              <h2 className="heading-2 mt-4 text-neutral-100">How a render gets made</h2>
              <p className="mt-4 text-small text-neutral-400">Model first, then light and material — drag across the image to see both.</p>
              <ol className="mt-8 space-y-6">
                {PROCESS_STEPS.map((step, i) => (
                  <li key={step.title} className="flex items-start gap-4">
                    <span className="w-7 shrink-0 text-body font-semibold tabular-nums text-amber-400" aria-hidden="true">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="text-body font-semibold text-neutral-100">{step.title}</h3>
                      <p className="mt-1 text-small text-neutral-400">{step.description}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHeader
            eyebrow="Virtual staging"
            title="From pieces to rooms"
            intro="A large library of industry-standard, manufacturer-specified furniture, placed into your design with a designer's eye. Want to see your new room with that exact chair? It can be done."
          >
            <Button href={projectHref("dark-living-room")} variant="link">
              The whole Dark Living Room
            </Button>
            <Button href={projectHref("furniture")} variant="link">
              The furniture collection
            </Button>
          </SectionHeader>
          <GallerySection className="mt-14" items={PIECES_TO_ROOM} currentProject="furniture" />
        </Container>
      </Section>

      <Section id="pricing" raised>
        <Container width="text">
          <SectionHeader
            eyebrow="Pricing"
            title="Priced per view"
            intro="The rate for one view at the Schematic stage in Standard 2K. What you can supply, the size of the scene, the resolution and the schedule adjust it — and more views of the same scene cost less each."
          />
          <dl className="mt-10 divide-y divide-neutral-800 border-y border-neutral-800">
            {RATE_ROWS.map(([label, value]) => {
              const example = EXAMPLES[label];
              return (
                <div key={label} className="flex items-center justify-between gap-6 py-3 text-small">
                  <dt className="flex items-center gap-4 text-neutral-300">
                    {example && (
                      <img
                        src={thumbOf(example).src}
                        width={example.width}
                        height={example.height}
                        alt={`${example.title} — an example ${label.toLowerCase()}`}
                        loading="lazy"
                        decoding="async"
                        className="h-14 w-20 shrink-0 rounded-sm object-cover"
                      />
                    )}
                    <span>{label}</span>
                  </dt>
                  <dd className="text-right font-mono text-neutral-100">{value}</dd>
                </div>
              );
            })}
          </dl>
          <p className="mt-4 text-center text-label text-neutral-500">
            The same rates for every client, anywhere in the world. {R.includedRevisionRounds} revision rounds included.
          </p>
        </Container>
      </Section>

      <NotIncludedSection service="visualization" raised />

      <Section>
        <Container width="text">
          <SectionHeader eyebrow="Questions" title="Common questions" />
          <div className="mt-12">
            <FaqList faqs={FAQS} />
          </div>
        </Container>
      </Section>
      <ContactSection service="visualization" title="Ready to visualize your project?" raised />
    </RibbonSequence>
  </main>
);
