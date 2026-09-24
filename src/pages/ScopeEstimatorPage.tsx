import React, { useLayoutEffect, useState } from "react";
import { Container } from "../components/Container";
import { PageHeader } from "../components/SectionHeader";
import { BimEstimator } from "../components/estimator/BimEstimator";
import { VisualizationEstimator } from "../components/estimator/VisualizationEstimator";
import { ConsultancyEstimator } from "../components/estimator/ConsultancyEstimator";
import { ESTIMATOR_SERVICES, EstimatorService, ROUTES } from "../data/routes";
import { trackEvent } from "../services/analytics";
import { SpecialistProfile } from "../types";
import { useAreaUnit } from "../utils/useAreaUnit";

interface ScopeEstimatorPageProps {
  specialist: SpecialistProfile;
}

const TABS: Array<{ id: EstimatorService; label: string; intro: string }> = [
  {
    id: "bim",
    label: "BIM / CAD",
    intro: "Permit sets, BIM models and working drawings — priced from the drawing set itself, sheet by sheet.",
  },
  {
    id: "visualization",
    label: "Visualization",
    intro: "Photorealistic stills, 360° panoramas and animation — priced per view, like every rendering studio.",
  },
  {
    id: "consultancy",
    label: "Consultancy",
    intro: "Senior design, code and coordination advice on a specific question — billed by the hour.",
  },
];

const isService = (value: string | null): value is EstimatorService =>
  !!value && (ESTIMATOR_SERVICES as string[]).includes(value);

// One page, three tabs, one layout (R2/R5): steps on the left, a sticky result panel on the right.
// `?service=bim|visualization|consultancy` picks the tab, so each service page links straight to
// its own. All three tabs stay mounted, so switching back and forth keeps what was entered.
export const ScopeEstimatorPage: React.FC<ScopeEstimatorPageProps> = ({ specialist }) => {
  const [tab, setTab] = useState<EstimatorService>("bim");
  const [marketId, setMarketId] = useState("us");
  const [unit, setUnit] = useAreaUnit(marketId);

  // The prerendered page shows the BIM tab; an inline script in the page's HTML has already shown
  // the requested tab before first paint (see index.css). Take over from it before the browser
  // paints the hydrated page, so there's no flash of the wrong tab.
  useLayoutEffect(() => {
    const requested = new URLSearchParams(window.location.search).get("service");
    if (isService(requested)) setTab(requested);
    document.documentElement.removeAttribute("data-estimator-tab");
  }, []);

  const selectTab = (id: EstimatorService) => {
    setTab(id);
    const url = new URL(window.location.href);
    url.searchParams.set("service", id);
    window.history.replaceState(null, "", url);
    trackEvent("estimator_tab", { service: id });
  };

  return (
    <main className="flex-1">
      <PageHeader
        breadcrumbs={[{ label: "Home", href: ROUTES.home }, { label: "Scope Estimator" }]}
        eyebrow="Start a project"
        title="Scope Estimator"
        intro={
          <>
            Describe the project and see the scope, the turnaround and an indicative fee — then send it straight to{" "}
            {specialist.name.split(" ")[0]}, the principal architect who will do the work.
          </>
        }
        className="pb-10 sm:pb-12"
      />

      <Container className="pb-24">
        <div role="tablist" aria-label="Service" className="flex justify-center gap-1 border-b border-neutral-800 sm:gap-4">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              id={`estimator-tab-${t.id}`}
              aria-selected={tab === t.id}
              aria-controls={`estimator-panel-${t.id}`}
              data-estimator-tabbtn={t.id}
              onClick={() => selectTab(t.id)}
              className="estimator-tab -mb-px cursor-pointer border-b-2 px-3 py-3 text-small font-semibold transition-colors sm:px-5 sm:text-body"
            >
              {t.label}
            </button>
          ))}
        </div>

        {TABS.map((t) => (
          <div
            key={t.id}
            role="tabpanel"
            id={`estimator-panel-${t.id}`}
            aria-labelledby={`estimator-tab-${t.id}`}
            hidden={tab !== t.id}
            data-estimator-panel={t.id}
            className="pt-10"
          >
            <p className="mx-auto mb-12 max-w-2xl text-center text-body text-neutral-400">{t.intro}</p>
            {t.id === "bim" && (
              <BimEstimator specialist={specialist} unit={unit} onUnitChange={setUnit} onMarketChange={setMarketId} />
            )}
            {t.id === "visualization" && (
              <VisualizationEstimator
                specialist={specialist}
                unit={unit}
                onUnitChange={setUnit}
                marketId={marketId}
                onMarketChange={setMarketId}
              />
            )}
            {t.id === "consultancy" && (
              <ConsultancyEstimator specialist={specialist} marketId={marketId} onMarketChange={setMarketId} />
            )}
          </div>
        ))}
      </Container>
    </main>
  );
};
