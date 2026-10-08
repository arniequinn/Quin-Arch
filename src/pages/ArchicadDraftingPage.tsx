import React from "react";
import { Container } from "../components/Container";
import { PageHeader, SectionHeader } from "../components/SectionHeader";
import { ContactSection, FaqList, ItemList, Section } from "../components/PageSections";
import { Button } from "../components/Button";
import { Figure } from "../components/gallery/Figure";
import { ProjectCards, caseStudyCard } from "../components/gallery/ProjectCards";
import { PORTFOLIO_SAMPLES } from "../data/architecturalData";
import { galleryImage } from "../data/galleryProjects";
import { TESTIMONIALS, testimonialCredit } from "../data/testimonials";
import { BOOKING_URL, ROUTES } from "../data/routes";

// Landing page for the Archicad niche: firms that author in Archicad and can't find overflow help
// that works natively in it. Every claim here repeats one already made on the BIM/CAD page, the
// test-sheet page or the specialist profile; the FAQ is mirrored as FAQPage schema in the HTML.

const WHY = [
  {
    title: "Native files back, not a rebuild",
    body: "Most drafting outsourcers work in Revit or AutoCAD. Here the work is authored in Archicad, so you get the native file back — not a DWG your team has to remodel.",
  },
  {
    title: "Your template, pens and titleblock",
    body: "Send your template and a past set. Sheets come back with your titleblock, numbering, pen weights and annotation style, ready to issue under your name.",
  },
  {
    title: "GDL when the library runs out",
    body: "Custom parametric objects are written in GDL, and Revit families you've been sent are converted to GDL so the model stays consistent.",
  },
];

const DELIVERABLES = [
  "Permit sets and full construction documents (IBC, IRC, California Title 24, Florida FBC)",
  "Archicad models to LOD 350, LOD 400 by request",
  "Plans, sections, elevations, wall sections and details",
  "Door, window and finish schedules straight from the model",
  "Interior elevations, millwork and casework drawings",
  "Plan-check and structural redlines turned around in 24–48 hours",
];

const FORMATS = ["Native Archicad", "IFC", "DWG (your layer standard)", "RVT export (geometry only)", "Vector PDF", "BIMx"];

const STEPS = [
  {
    title: "Send one sheet",
    body: "Pick a real sheet from a live project. It comes back within 2 working days as native Archicad, DWG and PDF, so you can judge the drafting before committing.",
  },
  {
    title: "Fix the sheet list and fee",
    body: "Project type, stage and complexity become a concrete sheet list and a fixed fee before drafting starts.",
  },
  {
    title: "Hand off by lunch",
    body: "Online 9 am – 3 pm Eastern, six days a week. Send markups in the morning and review the revised sheets first thing the next day.",
  },
];

export const FAQS = [
  {
    question: "Do you work natively in Archicad?",
    answer:
      "Yes. Archicad is the authoring tool for every project — modeling, drafting, detailing and schedules. You receive the native Archicad file along with IFC, DWG and vector PDF.",
  },
  {
    question: "Which version of Archicad do you use?",
    answer: "Archicad 26.",
  },
  {
    question: "Can you work in our Teamwork project?",
    answer:
      "Yes, as long as your office provides an Archicad licence and access to your Teamwork server. The work then happens directly in your shared project, alongside your team.",
  },
  {
    question: "Can you match our office template and standards?",
    answer:
      "Yes. Send your template and a past set, and sheets come back in your titleblock, sheet numbering, pen weights and annotation style. DWG exports are mapped to your layer standard.",
  },
  {
    question: "Our consultants use Revit. Is that a problem?",
    answer:
      "No. The model is shared as IFC and as an .rvt export — geometry, not editable Revit families — so structural and MEP consultants can reference it in Revit.",
  },
  {
    question: "How fast is turnaround?",
    answer:
      "A test sheet comes back within 2 working days. Plan-check or structural redlines are turned around in 24 to 48 hours once the marked-up PDFs or a Bluebeam Studio session are shared.",
  },
  {
    question: "Who stamps the drawings?",
    answer:
      "Sets are prepared for your architect or engineer of record to review and stamp. The work is done by a PCATP-registered architect (Pakistan Council of Architects and Town Planners, A-07767) with 9+ years of remote production for firms in the US, UK, Canada and Australia.",
  },
  {
    question: "How is it priced?",
    answer:
      "By the drawing set: each sheet is priced at its typical LOD, then scaled for building size, complexity, project stage and schedule. The Scope Estimator gives a range for a single project in a couple of minutes.",
  },
];

const PROOF_SAMPLE_IDS = ["sample-beach-house", "sample-cran-residence", "sample-urban-flats"];

const HERO_IMAGE = galleryImage("sheets/cran-sections-crop.webp", "Building sections — drawn in Archicad", {
  title: "Cran Residence — building sections",
});

export const ArchicadDraftingPage: React.FC = () => {
  const proofCards = PROOF_SAMPLE_IDS.map((id) => PORTFOLIO_SAMPLES.find((s) => s.id === id))
    .filter((s): s is NonNullable<typeof s> => Boolean(s))
    .map(caseStudyCard);

  return (
    <main className="flex-1">
      <PageHeader
        breadcrumbs={[
          { label: "Home", href: ROUTES.home },
          { label: "Services", href: ROUTES.services },
          { label: "Archicad Drafting" },
        ]}
        eyebrow="For Archicad offices"
        title={
          <>
            Archicad drafting & CD sets <span className="text-amber-400">for US architecture firms</span>
          </>
        }
        intro="Overflow documentation from an architect who works in Archicad every day. Permit sets, construction documents and models to LOD 350, drawn in your template and returned as native Archicad files, with 24–48 hour turnaround on redlines."
      >
        <Button href={ROUTES.testSheet}>Send a test sheet</Button>
        <Button href={BOOKING_URL} external variant="secondary">
          Book a 20-min capacity call
        </Button>
      </PageHeader>

      <Section raised>
        <Container>
          <SectionHeader
            eyebrow="Why an Archicad specialist"
            title="Help that doesn't make you change software"
            intro="Archicad offices are a minority in the US, so most outsourced drafting arrives as Revit or AutoCAD files. This doesn't."
          />
          <div className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-10 sm:grid-cols-3">
            {WHY.map((item) => (
              <div key={item.title} className="border-t border-neutral-700 pt-6">
                <h3 className="heading-3 text-neutral-100">{item.title}</h3>
                <p className="mt-3 text-small text-neutral-400">{item.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <p className="eyebrow text-amber-400">Deliverables</p>
              <h2 className="heading-2 mt-4 text-neutral-100">What gets drawn</h2>
              <ItemList items={DELIVERABLES} className="mt-8" size="small" />
              <h3 className="eyebrow mt-10 text-neutral-400">Delivered as</h3>
              <p className="mt-4 text-small text-neutral-300">{FORMATS.join(" · ")}</p>
              <p className="mt-8 border-t border-neutral-800 pt-5 text-small text-neutral-400">
                Not sure what LOD to ask for?{" "}
                <a href={ROUTES.lodGuide} className="font-semibold text-amber-400 hover:text-amber-300">
                  Read the LOD guide →
                </a>
              </p>
            </div>
            <div className="lg:col-span-7">
              <Figure image={HERO_IMAGE} displayWidth={700} />
            </div>
          </div>
        </Container>
      </Section>

      <Section raised>
        <Container>
          <SectionHeader eyebrow="How it starts" title="Try it on one sheet first" />
          <ol className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-10 sm:grid-cols-3">
            {STEPS.map((step, i) => (
              <li key={step.title} className="flex items-start gap-4">
                <span className="text-h3 font-semibold tabular-nums text-amber-400" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="heading-3 text-neutral-100">{step.title}</h3>
                  <p className="mt-2 text-small text-neutral-400">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="mt-12 flex justify-center">
            <Button href={ROUTES.testSheet}>Send a test sheet</Button>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHeader
            eyebrow="Drawn in Archicad"
            title="Recent drawing sets"
            intro="Permit and construction sets, each with its case study."
          >
            <Button href={ROUTES.bimCad} variant="link">
              The full BIM / CAD service
            </Button>
          </SectionHeader>
          <ProjectCards className="mt-14" cards={proofCards} compact />
          <ul className="mt-16 grid grid-cols-1 gap-10 border-t border-neutral-800 pt-10 md:grid-cols-2">
            {[TESTIMONIALS.q1, TESTIMONIALS.q2].map((t) => (
              <li key={t.id}>
                <figure className="border-l-2 border-amber-400/70 pl-5">
                  <blockquote className="font-display text-[1.125rem] leading-snug text-neutral-200">“{t.quote}”</blockquote>
                  <figcaption className="mt-3 text-label text-neutral-500">{testimonialCredit(t)}</figcaption>
                </figure>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section raised>
        <Container width="text">
          <SectionHeader eyebrow="Questions" title="Archicad outsourcing, answered" />
          <div className="mt-12">
            <FaqList faqs={FAQS} />
          </div>
        </Container>
      </Section>

      <ContactSection service="bim" title="Archicad project backing up?" />
    </main>
  );
};
