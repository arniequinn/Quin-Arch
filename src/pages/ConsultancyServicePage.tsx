import React from "react";
import { Container } from "../components/Container";
import { RibbonSequence } from "../components/filmstrip/RibbonSequence";
import { pageFilmstrips } from "../data/filmstrips";
import { PageHeader, SectionHeader } from "../components/SectionHeader";
import { ContactSection, FaqList, NotIncludedSection, Section } from "../components/PageSections";
import { Button } from "../components/Button";
import { Figure } from "../components/gallery/Figure";
import { GallerySection } from "../components/gallery/GallerySection";
import {
  BIM_PRODUCTION_IMAGES,
  COMPUTATIONAL_IMAGES,
  MARKET_BENCHMARK_RATES,
  OFFERED_RATES,
  TARGET_MARKETS,
} from "../data/architecturalData";
import { galleryImage } from "../data/galleryProjects";
import { calculateConsultingFee } from "../utils/pricingTracks";
import { ROUTES } from "../data/routes";
import { SpecialistProfile } from "../types";
import { formatDuration, formatUsd, formatUsdExact } from "../utils/format";

interface ConsultancyServicePageProps {
  specialist: SpecialistProfile;
}

const COVERS = [
  "Parametric and computational design — Rhino + Grasshopper, connected to Archicad through Tapir",
  "Automation — Python scripts that batch-edit properties, place elements and pull schedules from the Archicad model",
  "Environmental and quantity analysis — solar, wind and takeoffs straight from the model",
  "Design review and a second-opinion sign-off before a scheme goes to production",
  "Code-compliance strategy — a jurisdiction pre-check before drafting begins, not after",
  "Plan-check response strategy for contested or unusual review comments",
];

const WHO_ITS_FOR = [
  { title: "Architecture studios", description: "A script or parametric workflow your team needs once, or senior judgment on a design question — without hiring for it." },
  { title: "Contractors & builders", description: "A code-compliance check before committing to a full drafting engagement." },
  { title: "Developers", description: "Independent technical review of a design or a consultant's work before signing it off." },
];

const FAQS = [
  {
    question: "How is this different from BIM/CAD drafting hours?",
    answer:
      "Consulting is advisory time — review, strategy and judgment calls — billed separately from drafting and modeling. It doesn't produce drawing sheets itself, though it often shapes what those sheets should say.",
  },
  {
    question: "Can consulting hours turn into a full production engagement later?",
    answer:
      "Yes — a common path is a short consulting block to settle the direction and scope, followed by a fixed-price or retainer BIM/CAD engagement once the approach is agreed.",
  },
  {
    question: "How do sessions actually happen?",
    answer:
      "Whatever fits the project — video calls, written review over email or Bluebeam markups, or direct coordination in your team's Slack or Teams channel.",
  },
];

// How a session runs, in the owner's terms (D8): orientation isn't billed, working time is.
const SESSION_STEPS = [
  {
    title: "Send the question and the drawings",
    description:
      "The question, the drawings and any code or client constraints. The first 30–45 minutes — reading the brief and getting oriented in the drawings — aren't billed.",
  },
  {
    title: "The session",
    description:
      "A video call or a written review, whichever suits the question — with markups on your drawings where they help.",
  },
  {
    title: "Follow-through",
    description:
      "Follow-up questions, checks against the code and answers by email, billed in 15-minute steps like the rest of the working time.",
  },
];

const BILLING_TERMS: Array<[string, string]> = [
  ["Rate", "$45 an hour, the same worldwide."],
  [
    "Getting oriented",
    "The first 30–45 minutes aren't billed. That's the time it takes to read the brief and get oriented in the drawings.",
  ],
  [
    "After that",
    "Every working minute counts: calls, reading drawings, checking code, research, writing up, and reading and answering emails. It's billed in 15-minute steps.",
  ],
  ["Beyond 5 hours", "It becomes a scoped project (BIM/CAD drafting) or a retainer, quoted separately."],
];

// The worked examples use the estimator's own function, so the page and the estimator agree.
const EXAMPLES = [
  { label: "Quick code or layout question", minutes: 30 },
  { label: "Design review", minutes: 120 },
  { label: "Pre-permit coordination", minutes: 300 },
].map((e) => {
  const result = calculateConsultingFee(e.minutes, "us");
  return {
    ...e,
    duration: formatDuration(e.minutes),
    billed: formatDuration(result.billedMinutes),
    fee: result.offeredFee > 0 ? formatUsdExact(result.offeredFee) : "Not billed",
  };
});

const CONSULTANT_FILES = ["05a-structural-model.webp", "07-solar-wind-analysis.jpg", "05c-quantity-script.webp", "08-environmental-analysis.jpg"];
const HEADER_BAND = CONSULTANT_FILES.map(
  (file) => [...BIM_PRODUCTION_IMAGES, ...COMPUTATIONAL_IMAGES].find((img) => img.src.endsWith(`/${file}`))!
);

const SESSION_IMAGE = galleryImage("sheets/10-fd1-jamb-detail.webp", "Construction detail — the kind of question a session settles", {
  title: "FD1 jamb detail — fire door",
});
const VIP_PLAN = galleryImage("sheets/09-vip-lounge-dubai-suites-plan.webp", "Space plan — occupancy 30 in the main suite, not 50", {
  project: "vip-lounge-dubai",
});

// v3.0 points 13–14: the same template as the BIM/CAD and Visualization pages — work images in
// the header, numbered steps, pricing that explains itself, a worked judgment call — with brass
// eyebrows throughout and the raised background alternating strictly.
// v3.0 §12: computational work opens the page, BIM modelling below it; both close it.
const STRIPS = pageFilmstrips("consultancy");

export const ConsultancyServicePage: React.FC<ConsultancyServicePageProps> = ({ specialist }) => (
  <main className="flex-1">
    <RibbonSequence
      preset="short"
      top={STRIPS[0]}
      bottom={STRIPS[1]}
      hero={
        <PageHeader
          breadcrumbs={[
            { label: "Home", href: ROUTES.home },
            { label: "Services", href: ROUTES.services },
            { label: "Architect Consultant" },
          ]}
          eyebrow="Parametric, automation & design consulting"
          title="Computational Design & Automation for Firms"
          intro="Grasshopper and Python, connected to Archicad through Tapir — parametric geometry, batch model edits, quantity takeoffs and environmental analysis — plus design and code review. A principal architect's judgment, billed hourly at one flat rate worldwide."
        >
          <Button href="#pricing" variant="link" arrow={false}>
            See pricing ↓
          </Button>
        </PageHeader>
      }
    >
      <Container>
        <GallerySection items={HEADER_BAND} />
      </Container>

      <Section className="mt-16 sm:mt-24">
        <Container>
          <SectionHeader eyebrow="Scope" title="What this covers" />
          <ol className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-x-12 gap-y-8 md:grid-cols-2">
            {COVERS.map((item, i) => (
              <li key={item} className="flex items-start gap-5 border-t border-neutral-800 pt-5">
                <span className="w-8 shrink-0 text-h3 font-semibold tabular-nums text-amber-400" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="text-body text-neutral-200">{item}</p>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      <Section raised>
        <Container>
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-6">
              <p className="eyebrow text-amber-400">Process</p>
              <h2 className="heading-2 mt-4 text-neutral-100">How a session works</h2>
              <ol className="mt-10 space-y-8">
                {SESSION_STEPS.map((step, i) => (
                  <li key={step.title} className="flex items-start gap-5">
                    <span className="w-8 shrink-0 text-h3 font-semibold tabular-nums text-amber-400" aria-hidden="true">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="heading-3 text-neutral-100">{step.title}</h3>
                      <p className="mt-2 text-small text-neutral-400">{step.description}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
            <div className="lg:col-span-6">
              <Figure image={SESSION_IMAGE} displayWidth={620} />
            </div>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHeader eyebrow="Clients" title="Who it's for" />
          <div className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-10 sm:grid-cols-3">
            {WHO_ITS_FOR.map((item) => (
              <div key={item.title} className="flex flex-col border-t border-neutral-700 pt-6">
                <h3 className="heading-3 text-neutral-100">{item.title}</h3>
                <p className="mt-3 text-small text-neutral-400">{item.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <NotIncludedSection service="consultancy" />

      <Section id="pricing" raised>
        <Container width="text">
          <SectionHeader
            eyebrow="Pricing"
            title={`${formatUsd(OFFERED_RATES.consultantHourly)} an hour, worldwide`}
            intro="The same rate for every client, anywhere. Here is exactly what an hour covers."
          />

          <h3 className="eyebrow mt-12 text-neutral-400">How billing works</h3>
          <dl className="mt-4 divide-y divide-neutral-800 border-y border-neutral-800">
            {BILLING_TERMS.map(([term, detail]) => (
              <div key={term} className="grid grid-cols-1 gap-1 py-4 sm:grid-cols-[10rem_1fr] sm:gap-6">
                <dt className="text-small font-semibold text-neutral-100">{term}</dt>
                <dd className="text-small text-neutral-300">{detail}</dd>
              </div>
            ))}
          </dl>

          <h3 className="eyebrow mt-12 text-neutral-400">Worked examples</h3>
          <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {EXAMPLES.map((e) => (
              <li key={e.label} className="rounded-sm border border-neutral-800 p-5">
                <p className="text-small font-semibold text-neutral-100">{e.label}</p>
                <p className="mt-1 text-label text-neutral-500">
                  {e.duration} · {e.fee === "Not billed" ? "orientation only" : `${e.billed} billed`}
                </p>
                <p className="mt-4 font-mono text-h3 text-amber-400">{e.fee}</p>
              </li>
            ))}
          </ul>

          <blockquote className="mt-10 border-l-2 border-amber-400/70 pl-5 font-display text-[1.375rem] leading-snug text-neutral-200">
            “When I say I worked three hours, that's three hours at the desk on your project.”
          </blockquote>

          <p className="mt-10 text-center">
            <Button href={`${ROUTES.scopeEstimator}?service=consultancy`} variant="link">
              Estimate your own session
            </Button>
          </p>

          <h3 className="eyebrow mt-12 text-neutral-400">What others charge (Sept 2026)</h3>
          <dl className="mt-4 divide-y divide-neutral-800 border-y border-neutral-800">
            {TARGET_MARKETS.map((m) => (
              <div key={m.id} className="flex items-baseline justify-between gap-6 py-3 text-small">
                <dt className="text-neutral-300">{m.name}</dt>
                <dd className="font-mono text-neutral-100">{formatUsd(MARKET_BENCHMARK_RATES[m.id]?.consultantHourly ?? 0)}/hr</dd>
              </div>
            ))}
          </dl>
          <p className="mt-3 text-label text-neutral-500">Typical architect-consultant rates, billed from the first minute.</p>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <p className="eyebrow text-amber-400">A worked example</p>
              <h2 className="heading-2 mt-4 text-neutral-100">Why the judgment call is worth paying for</h2>
              <p className="mt-6 text-body text-neutral-300">
                On a VIP lounge in Dubai, the client first wanted a maximum occupancy of 50 in the main suite. I strongly
                advised against it; it was reduced to 30, and the plan was drawn around 30.
              </p>
              <p className="mt-5 text-small text-neutral-400">
                {specialist.education}. {specialist.yearsExperience}+ years of independent remote consulting and firm
                coordination across residential, commercial and hospitality work, with {specialist.completedProjectsCount}+
                projects delivered — the same background behind the BIM/CAD and visualization work, applied to a specific
                question instead of a full production engagement.
              </p>
            </div>
            <div className="lg:col-span-7">
              <Figure image={VIP_PLAN} displayWidth={700} />
            </div>
          </div>
        </Container>
      </Section>

      <Section raised>
        <Container width="text">
          <SectionHeader eyebrow="Questions" title="Common questions" />
          <div className="mt-12">
            <FaqList faqs={FAQS} />
          </div>
        </Container>
      </Section>
      <ContactSection service="consultancy" title="Have a design or code question worth a second opinion?" />
    </RibbonSequence>
  </main>
);
