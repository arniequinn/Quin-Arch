import React, { useMemo, useState } from "react";
import { MARKET_IN_PHRASE, OFFERED_RATES } from "../../data/architecturalData";
import { SpecialistProfile } from "../../types";
import { calculateConsultingFee } from "../../utils/pricingTracks";
import { formatUsd } from "../../utils/format";
import { SliderInput, Step } from "./controls";
import { MarketSelect, ResultPanel } from "./ResultPanel";

interface ConsultancyEstimatorProps {
  specialist: SpecialistProfile;
  marketId: string;
  onMarketChange: (marketId: string) => void;
}

// R5: consultancy doesn't need a complicated estimator — one step, the same result panel.
export const ConsultancyEstimator: React.FC<ConsultancyEstimatorProps> = ({ specialist, marketId, onMarketChange }) => {
  const [hours, setHours] = useState(10);
  const result = useMemo(() => calculateConsultingFee(hours, marketId), [hours, marketId]);
  const rate = `${formatUsd(OFFERED_RATES.consultantHourly)}/hr`;

  return (
    <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-14">
      <div className="space-y-10 lg:col-span-7 xl:col-span-8">
        <Step
          number={1}
          title="Hours"
          hint="Design review, code strategy and coordination — senior judgment on a specific question, billed separately from drafting."
        >
          <SliderInput
            label="Estimated hours"
            hint="A focused design or code review is often 4–10 hours; ongoing coordination runs longer."
            value={hours}
            onChange={(v) => setHours(Math.round(v))}
            min={1}
            max={80}
            step={1}
            suffix="h"
          />
        </Step>
      </div>

      <aside className="lg:col-span-5 xl:col-span-4">
        <div className="lg:sticky lg:top-24">
          <ResultPanel
            service="consultancy"
            specialist={specialist}
            fee={formatUsd(result.offeredFee)}
            feeNote={`${hours} h × ${rate}`}
            rows={[
              { label: "Rate", value: `${rate}, flat worldwide` },
              { label: "Hours", value: `${hours}` },
            ]}
            deliverables={[
              "Video calls or written review — whichever suits the question",
              "Markups on your drawings (PDF or Bluebeam)",
              "Direct coordination in your team's Slack or Teams, if useful",
            ]}
            comparison={
              <>
                <MarketSelect id="consultancy-market" value={marketId} onChange={onMarketChange} />
                <p>
                  Typical architect-consultant rate in {MARKET_IN_PHRASE[marketId] ?? MARKET_IN_PHRASE.us}:{" "}
                  <span className="font-mono text-neutral-200">{formatUsd(result.marketHourly)}/hr</span> —{" "}
                  <span className="font-mono text-neutral-200">{formatUsd(result.marketFee)}</span> for {hours} hours (benchmark, Sept 2026).
                </p>
              </>
            }
            message={{
              subject: `Architect consultant — ${hours} ${hours === 1 ? "hour" : "hours"}`,
              lines: [`Hours: ${hours}`, `Rate: ${rate}, flat worldwide`, `Estimated fee: ${formatUsd(result.offeredFee)}`],
            }}
          />
        </div>
      </aside>
    </div>
  );
};
