import React from "react";
import { Container } from "../components/Container";
import { RibbonSequence } from "../components/filmstrip/RibbonSequence";
import { pageFilmstrips } from "../data/filmstrips";
import { PageHeader, SectionHeader } from "../components/SectionHeader";
import { ItemList, Section } from "../components/PageSections";
import { Button } from "../components/Button";
import { ROUTES } from "../data/routes";
import { SpecialistProfile } from "../types";
import { assetUrl } from "../utils/assetPath";

interface ServicesHubPageProps {
  specialist: SpecialistProfile;
}

const SERVICES = [
  {
    title: "BIM / CAD Drafting & Construction Documentation",
    description:
      "BIM models to LOD 350 (LOD 400 by request), parametric coordination, and full municipal permit sets across IBC / IRC / CBC jurisdictions.",
    href: ROUTES.bimCad,
    image: "sheets-beach-house-first-level-plan.webp",
    drawing: true,
  },
  {
    title: "Architectural Visualization",
    description:
      "Photorealistic interior, exterior and aerial renders in Twinmotion (live-linked to the Archicad model) and Coohom — built from an existing model, CAD drawings or sketches.",
    href: ROUTES.visualization,
    image: "visualization-showcase-05-classical-dining.webp",
    drawing: false,
  },
  {
    title: "Architect Consultant",
    description:
      "Design coordination, code-compliance review, and computational or parametric consulting for studios and contractors who need a second set of expert eyes.",
    href: ROUTES.consultancy,
    image: "bimcad-workflow-07-solar-wind-analysis.webp",
    drawing: false,
  },
];

// v3.0 §12: interior renders open the page, BIM modelling below them.
const STRIPS = pageFilmstrips("servicesHub");

export const ServicesHubPage: React.FC<ServicesHubPageProps> = ({ specialist }) => (
  <main className="flex-1">
    <RibbonSequence
      preset="short"
      top={STRIPS[0]}
      bottom={STRIPS[1]}
      hero={
        <PageHeader
          breadcrumbs={[{ label: "Home", href: ROUTES.home }, { label: "Services" }]}
          eyebrow="Services"
          title="Three Ways to Work Together"
          intro="Remote BIM/CAD production, architectural visualization and architect-consultant advice — each billed separately, each at one rate worldwide, each delivered by a principal architect rather than a production queue."
        />
      }
    >
      <Container className="pb-20">
        <h2 className="sr-only">The three services</h2>
        <div className="grid grid-cols-1 gap-x-10 gap-y-14 md:grid-cols-3">
          {SERVICES.map((service) => (
            <a key={service.href} href={service.href} className="group flex flex-col text-center">
              <div className={`aspect-[4/3] overflow-hidden rounded-sm ${service.drawing ? "bg-white p-3" : "bg-neutral-900"}`}>
                <img
                  src={assetUrl(`/portfolio/thumbs/${service.image}`)}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className={`h-full w-full transition-transform duration-500 group-hover:scale-[1.02] ${service.drawing ? "object-contain" : "object-cover"}`}
                />
              </div>
              <h3 className="heading-3 mt-6 text-neutral-100 transition-colors group-hover:text-amber-300">{service.title}</h3>
              <p className="mt-3 flex-1 text-small text-neutral-400">{service.description}</p>
              <span className="mt-5 text-small font-semibold text-amber-400 group-hover:text-amber-300">View the service →</span>
            </a>
          ))}
        </div>
      </Container>

      <Section raised>
        <Container>
          <SectionHeader
            eyebrow="How you engage"
            title="Fixed price or dedicated retainer"
            intro="Choose the model that fits your schedule and your office's workload — both apply across BIM/CAD, visualization and consultancy."
          />
          <div className="mx-auto mt-14 grid max-w-5xl grid-cols-1 gap-12 md:grid-cols-2">
            <div className="flex flex-col border-t border-neutral-700 pt-6">
              <p className="eyebrow text-neutral-500">For developers & builders</p>
              <h3 className="heading-3 mt-2 text-neutral-100">Per project, fixed price</h3>
              <p className="mt-3 text-small text-neutral-400">
                One fixed fee for the whole drawing set, from the schematic draft to the final permit approval.
              </p>
              <ItemList
                className="mt-6 flex-1" size="small"
                items={[
                  "Milestone-based payments",
                  "Two rounds of plan-check revisions included",
                  "Archicad · IFC · RVT · DWG · PDF",
                  "An agreed completion date",
                ]}
              />
              <div className="mt-8">
                <Button href={ROUTES.bimCad} variant="link">
                  See BIM / CAD drafting
                </Button>
              </div>
            </div>
            <div className="flex flex-col border-t border-neutral-700 pt-6">
              <p className="eyebrow text-neutral-500">For architecture & engineering firms</p>
              <h3 className="heading-3 mt-2 text-neutral-100">Dedicated monthly partner</h3>
              <p className="mt-3 text-small text-neutral-400">
                White-label drafting and BIM as an extension of your team — clear the production backlog without the
                hiring lag.
              </p>
              <ItemList
                className="mt-6 flex-1" size="small"
                items={[
                  "Dedicated weekly capacity (20–40 hours a week)",
                  "Your studio's templates, layer standards and titleblocks — Revit families converted to GDL when needed",
                  "Direct Slack or Teams communication",
                  "A priority 24-hour turnaround queue",
                ]}
              />
              <div className="mt-8">
                <Button href="#contact" variant="link">
                  Discuss a retainer
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHeader
            title="Not sure which service fits?"
            intro="The estimator covers all three — pick a tab, describe the project, and send the scope straight over."
          >
            <Button href={ROUTES.scopeEstimator}>Start a Project</Button>
          </SectionHeader>
        </Container>
      </Section>
    </RibbonSequence>
  </main>
);
