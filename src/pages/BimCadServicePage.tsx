import React from "react";
import { Container } from "../components/Container";
import { RibbonSequence } from "../components/filmstrip/RibbonSequence";
import { pageFilmstrips } from "../data/filmstrips";
import { PageHeader, SectionHeader } from "../components/SectionHeader";
import { ContactSection, FaqList, ItemList, NotIncludedSection, Section } from "../components/PageSections";
import { Button } from "../components/Button";
import { GallerySection } from "../components/gallery/GallerySection";
import { Figure } from "../components/gallery/Figure";
import { ProjectCards, caseStudyCard } from "../components/gallery/ProjectCards";
import { BIM_PRODUCTION_IMAGES, JURISDICTIONS, PORTFOLIO_SAMPLES } from "../data/architecturalData";
import { CLIENT_STORIES, galleryImage, projectBySlug, thumbOf } from "../data/galleryProjects";
import { LOD_COVERAGE, LOD_500_NOTE } from "../data/lod";
import { testimonialCredit } from "../data/testimonials";
import { ROUTES } from "../data/routes";
import { SpecialistProfile } from "../types";
import { calculateScope } from "../utils/calculator";
import { formatUsdRange } from "../utils/format";
import { formatAreaBoth } from "../utils/units";
import { HERO_VIDEOS, HeroVideo, SCRIM } from "../components/HeroVideo";

interface BimCadServicePageProps {
  specialist: SpecialistProfile;
}

const INCLUDED = [
  "Virtual Design & Construction (VDC) — full remote production",
  "Construction documentation packages (IBC, IRC, Title 24, FBC)",
  "BIM models at LOD 100–350, with LOD 400 by request",
  "Parametric & computational design (Rhino + Grasshopper)",
  "MEP & structural clash detection (Navisworks Manage)",
  "Millwork and casework documentation",
];

const SOFTWARE = [
  "3D BIM modeling (LOD 100–350)",
  "AutoCAD Architectural & detailing",
  "Rhino 7 / Grasshopper",
  "Ladybug & Karamba 3D (solar / structural)",
  "Autodesk Navisworks (clash detection)",
  "Bluebeam Revu (plan-check QA/QC)",
];

// Each step of the process beside a sheet from a real set (v3.0 point 8).
const PROCESS_STEPS = [
  {
    title: "Share drawings or a starting model",
    description:
      "Existing CAD drawings, a BIM or Rhino model, or a scanned plan-check redline set — production starts from whatever you already have.",
    image: galleryImage("sheets/beach-house-first-level-plan.webp", "Plans", { title: "Texas beach house — first-level plan" }),
  },
  {
    title: "Scope and sheet list agreed",
    description:
      "Project type, stage and complexity become a concrete sheet list and a fixed fee before any drafting begins.",
    image: galleryImage("sheets/03-kids-room-elevation-b.webp", "Elevations", { project: "kids-room" }),
  },
  {
    title: "Production to the agreed LOD",
    description:
      "Drafting and modeling in your titleblock, layer standard and pen weights, with the LOD of each element agreed up front.",
    image: galleryImage("sheets/cran-sections-crop.webp", "Sections", { title: "Cran Residence — building sections" }),
  },
  {
    title: "Delivery and rapid redlines",
    description:
      "Sheets in native BIM, DWG and vector PDF. Plan-check comments or structural markups are turned around in 24–48 hours.",
    image: galleryImage("sheets/flats-building-section.webp", "Coordination", { title: "Urban flats — building section" }),
  },
];

const FAQS = [
  {
    question: "What LOD do you actually deliver?",
    answer: `${LOD_COVERAGE} ${LOD_500_NOTE} LOD is agreed element by element — see the LOD guide for what each level means.`,
  },
  {
    question: "How fast are plan-check or structural redlines turned around?",
    answer:
      "24 to 48 hours for corrected sheets once scanned PDFs or a Bluebeam Studio session are shared — so the permit cycle or the site isn't left waiting.",
  },
  {
    question: "Do you work in my jurisdiction's code and CAD standard?",
    answer:
      "Drawings follow the National CAD Standard / AIA layering and are prepared against IBC, IRC, California Title 24, Florida FBC (high-velocity wind zone), NYC DOB, UK Building Regulations, Canadian NBC and the Australian NCC — matched to your project's jurisdiction.",
  },
];

// v3.0 §12: drafting opens the page, BIM modelling below it; both close it.
const STRIPS = pageFilmstrips("bimCad");

const PROOF_SAMPLE_IDS = ["sample-beach-house", "sample-cran-residence", "sample-urban-flats"];
const PROOF_PROJECTS = ["serene-suites", "vip-lounge-dubai"];

const WHATS_INCLUDED_IMAGE = galleryImage("sheets/02-kids-room-elevation-a.webp", "Interior elevation — drawn for the joiner", {
  project: "kids-room",
});
const PRICING_IMAGE = galleryImage("sheets/slamburger-a01-floor-plans.webp", "One sheet of a priced set", {
  title: "Slamburger restaurant — floor plans",
});

// A worked example straight from the estimator, so the page and the estimator can't disagree.
const EXAMPLE = calculateScope({
  projectTypeId: "residential_single",
  selectedServiceIds: ["permit_drawings", "bim_modeling", "construction_docs"],
  areaSqFt: 2800,
  jurisdictionId: "us_irc_ibc",
  currentStageId: "schematic",
  timelineId: "standard",
});

// v3.0 point 8 and §11: image-led, a brass eyebrow on every section, raised backgrounds
// alternating strictly, never more than two text-only sections in a row.
export const BimCadServicePage: React.FC<BimCadServicePageProps> = () => {
  const proofCards = [
    ...PROOF_SAMPLE_IDS.map((id) => PORTFOLIO_SAMPLES.find((s) => s.id === id))
      .filter((s): s is NonNullable<typeof s> => Boolean(s))
      .map(caseStudyCard),
  ];
  const proofProjects = PROOF_PROJECTS.map((slug) => projectBySlug(slug)!).filter(Boolean);

  return (
    <main className="flex-1">
      <RibbonSequence
        preset="short"
        top={STRIPS[0]}
        bottom={STRIPS[1]}
        heroBackground={<HeroVideo {...HERO_VIDEOS.bimCad} scrim={SCRIM.page} />}
        hero={
          <PageHeader
            breadcrumbs={[
              { label: "Home", href: ROUTES.home },
              { label: "Services", href: ROUTES.services },
              { label: "BIM / CAD Drafting" },
            ]}
            eyebrow="BIM / CAD drafting & construction documentation"
            title="Construction Documentation & BIM Production"
            intro="Code-compliant permit sets and BIM models delivered remotely — IBC, IRC, California Title 24 and Florida FBC — to LOD 350 as standard, with 24–48 hour turnaround on plan-check redlines."
          >
            <Button href="#production-work" variant="link">
              See the production work
            </Button>
            <Button href="#pricing" variant="link" arrow={false}>
              See pricing ↓
            </Button>
          </PageHeader>
        }
      >
        <Section id="production-work">
          <Container>
            <SectionHeader
              eyebrow="From real projects"
              title="The production files"
              intro="Model views, schedules and quantities from live projects — each screen shown whole."
            >
              <Button href={`${ROUTES.projects}#bim-workflow`} variant="link">
                The computational work, in the Project Library
              </Button>
            </SectionHeader>
            <GallerySection
              className="mt-12"
              items={BIM_PRODUCTION_IMAGES}
              initialCount={3}
              showAllLabel={`Show all ${BIM_PRODUCTION_IMAGES.length} production screens`}
            />
          </Container>
        </Section>

        <Section raised>
          <Container>
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
              <div className="lg:col-span-5">
                <p className="eyebrow text-amber-400">Scope</p>
                <h2 className="heading-2 mt-4 text-neutral-100">What's included</h2>
                <ItemList items={INCLUDED} className="mt-8" size="small" />
                <p className="mt-8 border-t border-neutral-800 pt-5 text-small text-neutral-400">
                  Not sure what LOD you need?{" "}
                  <a href={ROUTES.lodGuide} className="font-semibold text-amber-400 hover:text-amber-300">
                    Read the LOD guide →
                  </a>
                </p>
              </div>
              <div className="lg:col-span-7">
                <Figure image={WHATS_INCLUDED_IMAGE} displayWidth={700} />
              </div>
            </div>
          </Container>
        </Section>

        <NotIncludedSection service="bim" raised />

        <Section>
          <Container>
            <SectionHeader
              eyebrow="Process"
              title="How a drawing set gets made"
              intro="Four steps, each beside a sheet from a real set."
            />
            <ol className="mt-14 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
              {PROCESS_STEPS.map((step, i) => (
                <li key={step.title}>
                  <div className="flex aspect-[4/3] items-center justify-center overflow-hidden rounded-sm bg-white p-3">
                    <img
                      src={thumbOf(step.image).src}
                      width={step.image.width}
                      height={step.image.height}
                      alt={`${step.image.title} — ${step.image.caption}`}
                      loading="lazy"
                      decoding="async"
                      className="max-h-full w-auto max-w-full object-contain"
                    />
                  </div>
                  <p className="mt-3 text-label text-neutral-500">
                    {step.image.caption} · {step.image.title}
                  </p>
                  <div className="mt-5 flex items-start gap-4">
                    <span className="text-h3 font-semibold tabular-nums text-amber-400" aria-hidden="true">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="heading-3 text-neutral-100">{step.title}</h3>
                      <p className="mt-2 text-small text-neutral-400">{step.description}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </Container>
        </Section>

        <Section raised>
          <Container>
            <SectionHeader eyebrow="Standards" title="Codes, jurisdictions and software" />
            <div className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-12 md:grid-cols-2">
              <div>
                <h3 className="eyebrow text-neutral-400">Jurisdictions & code compliance</h3>
                <ul className="mt-4">
                  {JURISDICTIONS.map((j) => (
                    <li key={j.id} className="border-t border-neutral-800 py-2">
                      <span className="block text-small text-neutral-100">{j.name}</span>
                      <span className="mt-0.5 block text-label text-neutral-500">{j.standard}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="eyebrow text-neutral-400">Software & standards</h3>
                <ItemList items={SOFTWARE} className="mt-5" size="small" />
              </div>
            </div>
          </Container>
        </Section>

        <Section>
          <Container>
            <SectionHeader
              eyebrow="Recent production work"
              title="Drawing sets, built work and briefs"
              intro="Client drawing sets with their case studies, and projects taken from brief to built."
            >
              <Button href={`${ROUTES.projects}#drawing-sets`} variant="link">
                All drawing sets in the Project Library
              </Button>
            </SectionHeader>
            <ProjectCards className="mt-14" cards={proofCards} projects={proofProjects} compact />
            {/* The client stories as quotes; their drawings are in the Project Library. */}
            <ul className="mt-16 grid grid-cols-1 gap-10 border-t border-neutral-800 pt-10 md:grid-cols-3">
              {CLIENT_STORIES.map((story) => (
                <li key={story.title}>
                  <figure className="border-l-2 border-amber-400/70 pl-5">
                    <blockquote className="font-display text-[1.125rem] leading-snug text-neutral-200 line-clamp-5">“{story.quote.quote}”</blockquote>
                    <figcaption className="mt-3 text-label text-neutral-500">{testimonialCredit(story.quote)}</figcaption>
                  </figure>
                </li>
              ))}
            </ul>
            <p className="mt-8 text-center">
              <Button href={`${ROUTES.projects}#drawing-sets`} variant="link" size="sm">
                Their drawings, in the Project Library
              </Button>
            </p>
          </Container>
        </Section>

        <Section id="pricing" raised>
          <Container>
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
              <div className="lg:col-span-6">
                <p className="eyebrow text-amber-400">Pricing</p>
                <h2 className="heading-2 mt-4 text-neutral-100">Priced by the drawing set</h2>
                <p className="mt-5 text-body text-neutral-400">
                  Each sheet is priced at its typical LOD, then scaled for building size, complexity, the stage the project
                  is at and the schedule — so the fee always matches exactly what's being drawn.
                </p>
                <p className="mt-8 border-t border-neutral-800 pt-6 text-small text-neutral-400">
                  For example: a {formatAreaBoth(2800, "ft2")} custom home with the permit set, a BIM model and working
                  drawings — {EXAMPLE.includedSheetCount} sheets — comes to about{" "}
                  <span className="font-mono text-neutral-200">{formatUsdRange(EXAMPLE.estimatedFeeMin, EXAMPLE.estimatedFeeMax)}</span>.
                </p>
              </div>
              <div className="lg:col-span-6">
                <Figure image={PRICING_IMAGE} displayWidth={620} />
              </div>
            </div>
          </Container>
        </Section>

        <Section>
          <Container width="text">
            <SectionHeader eyebrow="Questions" title="Common questions" />
            <div className="mt-12">
              <FaqList faqs={FAQS} />
            </div>
          </Container>
        </Section>
        <ContactSection service="bim" title="Ready to scope your drawing set?" raised />
      </RibbonSequence>
    </main>
  );
};
