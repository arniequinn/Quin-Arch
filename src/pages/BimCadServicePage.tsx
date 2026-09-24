import React from "react";
import { Container } from "../components/Container";
import { PageHeader, SectionHeader } from "../components/SectionHeader";
import { ContactSection, FaqList, ItemList, NotIncludedSection, NumberedSteps, Section } from "../components/PageSections";
import { ProjectGallery } from "../components/ProjectGallery";
import { Button } from "../components/Button";
import { BIM_PRODUCTION_IMAGES, COMPUTATIONAL_IMAGES, JURISDICTIONS, PORTFOLIO_SAMPLES } from "../data/architecturalData";
import { LOD_COVERAGE, LOD_500_NOTE } from "../data/lod";
import { caseStudyHref, estimatorHref, ROUTES } from "../data/routes";
import { SpecialistProfile } from "../types";
import { calculateScope } from "../utils/calculator";
import { formatUsdRange } from "../utils/format";
import { formatAreaBoth } from "../utils/units";

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

const PROCESS_STEPS = [
  {
    title: "Share drawings or a starting model",
    description:
      "Existing CAD drawings, a BIM or Rhino model, or a scanned plan-check redline set — production starts from whatever you already have.",
  },
  {
    title: "Scope and sheet list agreed",
    description:
      "Project type, stage and complexity become a concrete sheet list and a fixed fee before any drafting begins.",
  },
  {
    title: "Production to the agreed LOD",
    description:
      "Drafting and modeling in your titleblock, layer standard and pen weights, with the LOD of each element agreed up front.",
  },
  {
    title: "Delivery and rapid redlines",
    description:
      "Sheets in native BIM, DWG and vector PDF. Plan-check comments or structural markups are turned around in 24–48 hours.",
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

const PROOF_SAMPLE_IDS = ["sample-beach-house", "sample-cran-residence", "sample-urban-flats"];

// A worked example straight from the estimator, so the page and the estimator can't disagree.
const EXAMPLE = calculateScope({
  projectTypeId: "residential_single",
  selectedServiceIds: ["permit_drawings", "bim_modeling", "construction_docs"],
  areaSqFt: 2800,
  jurisdictionId: "us_irc_ibc",
  currentStageId: "schematic",
  timelineId: "standard",
});

export const BimCadServicePage: React.FC<BimCadServicePageProps> = ({ specialist }) => {
  const proofSamples = PROOF_SAMPLE_IDS.map((id) => PORTFOLIO_SAMPLES.find((s) => s.id === id)).filter(
    (s): s is NonNullable<typeof s> => Boolean(s)
  );

  return (
    <main className="flex-1">
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
        <Button href={estimatorHref("bim")}>Start a Project</Button>
        <Button href="#production-work" variant="link">
          See the production work
        </Button>
      </PageHeader>

      <Section id="production-work">
        <Container>
          <SectionHeader
            eyebrow="From real projects"
            title="The production files"
            intro="Model views, schedules and quantities, and the scripts behind them — each screen shown whole."
          />
          <div className="mt-12">
            <ProjectGallery
              autoplay={false}
              groups={[
                { label: "BIM production", images: BIM_PRODUCTION_IMAGES },
                { label: "Computational design", images: COMPUTATIONAL_IMAGES },
              ]}
            />
          </div>
        </Container>
      </Section>

      <Section raised>
        <Container width="text">
          <SectionHeader title="What's included" />
          <ItemList items={INCLUDED} className="mt-10" />
        </Container>
      </Section>

      <NotIncludedSection service="bim" />

      <Section raised>
        <Container>
          <SectionHeader title="How a drawing set gets made" />
          <div className="mx-auto mt-12 max-w-5xl">
            <NumberedSteps steps={PROCESS_STEPS} />
          </div>
        </Container>
      </Section>

      <Section>
        <Container width="text">
          <SectionHeader
            eyebrow="Field reference"
            title="Not sure what LOD you need?"
            intro="The plain-language guide to LOD 100–500: what each level contains, what it's for, and how to specify it in a proposal."
          >
            <Button href={ROUTES.lodGuide} variant="secondary">
              Read the LOD guide
            </Button>
          </SectionHeader>
        </Container>
      </Section>

      <Section raised>
        <Container>
          <SectionHeader title="Jurisdictions & code compliance" />
          <ul className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-x-10 sm:grid-cols-2">
            {JURISDICTIONS.map((j) => (
              <li key={j.id} className="border-t border-neutral-800 py-4">
                <span className="block text-small text-neutral-100">{j.name}</span>
                <span className="mt-0.5 block text-label text-neutral-500">{j.standard}</span>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section>
        <Container width="text">
          <SectionHeader title="Software & standards" />
          <ItemList items={SOFTWARE} className="mt-10" />
        </Container>
      </Section>

      <Section raised>
        <Container>
          <SectionHeader
            title="Recent production work"
            intro="Client drawing sets, each with its own case study."
          >
            <Button href={`${ROUTES.projects}#drawing-sets`} variant="link" size="sm">
              All drawing sets in the Project Library
            </Button>
          </SectionHeader>
          <div className="mt-12 grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-3">
            {proofSamples.map((sample) => (
              <a key={sample.id} href={caseStudyHref(sample.id)} className="group block">
                <div className={`aspect-[4/3] overflow-hidden rounded-sm ${sample.cover.kind === "drawing" ? "bg-white p-3" : "bg-neutral-900"}`}>
                  <img
                    src={sample.cover.src}
                    width={sample.cover.width}
                    height={sample.cover.height}
                    alt={`${sample.title} — ${sample.cover.caption}`}
                    loading="lazy"
                    decoding="async"
                    className={`h-full w-full transition-transform duration-500 group-hover:scale-[1.02] ${
                      sample.cover.kind === "drawing" ? "object-contain" : "object-cover"
                    }`}
                  />
                </div>
                <h3 className="heading-3 mt-5 text-neutral-100 transition-colors group-hover:text-amber-300">{sample.title}</h3>
                <p className="mt-2 text-small text-neutral-400">{sample.sheetDetails}</p>
              </a>
            ))}
          </div>
        </Container>
      </Section>

      <Section id="pricing">
        <Container width="text">
          <SectionHeader
            eyebrow="Pricing"
            title="Priced by the drawing set"
            intro="Each sheet is priced at its typical LOD, then scaled for building size, complexity, the stage the project is at and the schedule — so the fee always matches exactly what's being drawn."
          >
            <Button href={estimatorHref("bim")}>Start a Project</Button>
          </SectionHeader>
          <p className="mt-10 border-t border-neutral-800 pt-6 text-center text-small text-neutral-400">
            For example: a {formatAreaBoth(2800, "ft2")} custom home with the permit set, a BIM model and working
            drawings — {EXAMPLE.includedSheetCount} sheets — comes to about{" "}
            <span className="font-mono text-neutral-200">{formatUsdRange(EXAMPLE.estimatedFeeMin, EXAMPLE.estimatedFeeMax)}</span>.
          </p>
        </Container>
      </Section>

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
        service="bim"
        title="Ready to scope your drawing set?"
        inquiry={`Hi ${specialist.name.split(" ")[0]}, I found your BIM/CAD drafting page and would like to discuss a project.`}
        emailSubject="BIM/CAD drafting inquiry"
      />
    </main>
  );
};
