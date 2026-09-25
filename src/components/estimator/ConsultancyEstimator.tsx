import React, { useMemo, useState } from "react";
import { MARKET_IN_PHRASE, OFFERED_RATES } from "../../data/architecturalData";
import { ROUTES } from "../../data/routes";
import { SpecialistProfile } from "../../types";
import {
  calculateConsultingFee,
  CONSULTING_MAX_MINUTES,
  CONSULTING_MIN_MINUTES,
  CONSULTING_STEP_MINUTES,
  CONSULTING_UNBILLED_MINUTES,
} from "../../utils/pricingTracks";
import { formatDuration, formatUsd, formatUsdExact } from "../../utils/format";
import { SliderInput, Step } from "./controls";
import { MarketSelect, ResultPanel } from "./ResultPanel";

interface ConsultancyEstimatorProps {
  specialist: SpecialistProfile;
  marketId: string;
  onMarketChange: (marketId: string) => void;
}

const snap = (v: number) =>
  Math.min(
    CONSULTING_MAX_MINUTES,
    Math.max(CONSULTING_MIN_MINUTES, Math.round(v / CONSULTING_STEP_MINUTES) * CONSULTING_STEP_MINUTES)
  );

// R5: consultancy doesn't need a complicated estimator — one step, the same result panel.
// v3.0 point 7: 30 min – 5 h in 15-minute steps, stored in minutes; the first 30 min aren't billed.
export const ConsultancyEstimator: React.FC<ConsultancyEstimatorProps> = ({ specialist, marketId, onMarketChange }) => {
  const [minutes, setMinutes] = useState(60);
  const result = useMemo(() => calculateConsultingFee(minutes, marketId), [minutes, marketId]);
  const rate = `${formatUsd(OFFERED_RATES.consultantHourly)}/hr`;
  const duration = formatDuration(minutes);
  const billed = formatDuration(result.billedMinutes);
  const unbilled = formatDuration(CONSULTING_UNBILLED_MINUTES);
  const fee = formatUsdExact(result.offeredFee);

  return (
    <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-14">
      <div className="space-y-10 lg:col-span-7 xl:col-span-8">
        <Step
          number={1}
          title="Time"
          hint="Design review, code strategy and coordination — senior judgment on a specific question, billed separately from drafting."
        >
          <SliderInput
            label="Estimated time"
            hint={
              <>
                A focused design or code question is usually 30 min – 2 h. More than 5 hours is a project — see BIM/CAD
                drafting or{" "}
                <a href={ROUTES.services} className="text-amber-400 hover:text-amber-300">
                  a retainer
                </a>
                .
              </>
            }
            value={minutes}
            onChange={(v) => setMinutes(snap(v))}
            min={CONSULTING_MIN_MINUTES}
            max={CONSULTING_MAX_MINUTES}
            step={CONSULTING_STEP_MINUTES}
            formatValue={formatDuration}
            presets={[30, 60, 120, 300]}
            formatPreset={formatDuration}
          />
        </Step>
      </div>

      <aside className="lg:col-span-5 xl:col-span-4">
        <div className="lg:sticky lg:top-[var(--sticky-top,6rem)]">
          <ResultPanel
            service="consultancy"
            specialist={specialist}
            fee={fee}
            feeNote={result.billedMinutes > 0 ? `${billed} billed × ${rate}` : "Not billed"}
            rows={[
              { label: "Rate", value: `${rate}, flat worldwide` },
              { label: "Time", value: duration },
              { label: `First ${unbilled}`, value: "Getting oriented — not billed" },
              { label: "Billed", value: billed },
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
                  <span className="font-mono text-neutral-200">{formatUsd(result.marketHourly)}/hr</span>, billed from the
                  first minute — <span className="font-mono text-neutral-200">{formatUsdExact(result.marketFee)}</span> for{" "}
                  {duration} (benchmark, Sept 2026).
                </p>
              </>
            }
            message={{
              subject: `Architect consultant — ${duration}`,
              lines: [
                `Time: ${duration}`,
                `First ${unbilled}: getting oriented, not billed`,
                `Billed: ${billed}`,
                `Rate: ${rate}, flat worldwide`,
                `Estimated fee: ${fee}`,
              ],
            }}
          />
        </div>
      </aside>
    </div>
  );
};
