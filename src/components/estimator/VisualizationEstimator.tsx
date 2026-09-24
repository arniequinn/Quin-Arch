import React, { useMemo, useState } from "react";
import { MARKET_IN_PHRASE, TIMELINE_OPTIONS, VISUALIZATION_RATES, VizScene, VizStage, VizTier } from "../../data/architecturalData";
import { SpecialistProfile } from "../../types";
import { calculateVisualizationScope } from "../../utils/pricingTracks";
import { formatUsd, formatUsdRange } from "../../utils/format";
import { AreaScale, AreaUnit, formatArea, formatAreaBoth } from "../../utils/units";
import { AreaInput, FieldLabel, OptionCards, SegmentedControl, SliderInput, Step } from "./controls";
import { MarketSelect, ResultPanel } from "./ResultPanel";

const SCENES: Array<{ value: VizScene; label: string; areaLabel: string; areaHint: string }> = [
  { value: "interior", label: "Interior", areaLabel: "Area of the space", areaHint: "The rooms the views look into" },
  { value: "exterior", label: "Exterior", areaLabel: "Building area", areaHint: "Gross floor area of the building shown" },
  { value: "aerial", label: "Aerial", areaLabel: "Site area", areaHint: "The site and surroundings the view covers" },
];

// Point 20: presets per scene type, in both units.
const AREA_SCALES: Record<VizScene, AreaScale> = {
  interior: {
    ft2: { min: 100, max: 6000, step: 50, presets: [250, 500, 1000, 2000, 4000] },
    m2: { min: 10, max: 560, step: 5, presets: [25, 45, 90, 185, 370] },
  },
  exterior: {
    ft2: { min: 500, max: 40000, step: 100, presets: [1500, 3000, 6000, 12000, 25000] },
    m2: { min: 50, max: 3700, step: 10, presets: [140, 280, 560, 1110, 2320] },
  },
  aerial: {
    ft2: { min: 2000, max: 200000, step: 500, presets: [5000, 10000, 25000, 50000, 100000] },
    m2: { min: 200, max: 18600, step: 50, presets: [465, 930, 2320, 4650, 9290] },
  },
};

const DEFAULT_AREA: Record<VizScene, number> = { interior: 1200, exterior: 3000, aerial: 10000 };

const STAGES: Array<{ value: VizStage; label: string; description: string }> = [
  { value: "concept", label: "Concept", description: "Sketches, references or massing — the model is built from scratch." },
  { value: "schematic", label: "Schematic", description: "2D CAD plans, elevations and sections, with the intended materials." },
  { value: "modeled", label: "Modeled & textured", description: "A finished, textured 3D model — lighting, cameras, rendering and post-production only." },
];

const TIERS: Array<{ value: VizTier; label: string; meta: string; name: string }> = [
  { value: "standard", label: "Standard 2K", meta: "Web and social", name: "Standard 2K" },
  { value: "high", label: "High 4K", meta: "Print and presentations", name: "High 4K" },
  { value: "hero", label: "Hero 6K+", meta: "Marketing, full entourage", name: "Hero 6K+" },
];

interface VisualizationEstimatorProps {
  specialist: SpecialistProfile;
  unit: AreaUnit;
  onUnitChange: (u: AreaUnit) => void;
  marketId: string;
  onMarketChange: (marketId: string) => void;
}

export const VisualizationEstimator: React.FC<VisualizationEstimatorProps> = ({
  specialist,
  unit,
  onUnitChange,
  marketId,
  onMarketChange,
}) => {
  const [scene, setScene] = useState<VizScene>("interior");
  const [areaSqFt, setAreaSqFt] = useState(DEFAULT_AREA.interior);
  const [stage, setStage] = useState<VizStage>("schematic");
  const [views, setViews] = useState(2);
  const [tier, setTier] = useState<VizTier>("standard");
  const [panoramas, setPanoramas] = useState(0);
  const [animationSeconds, setAnimationSeconds] = useState(0);
  const [timelineId, setTimelineId] = useState("standard");

  const result = useMemo(
    () =>
      calculateVisualizationScope({ scene, areaSqFt, stage, views, tier, panoramas, animationSeconds, timelineId, marketId }),
    [scene, areaSqFt, stage, views, tier, panoramas, animationSeconds, timelineId, marketId]
  );

  const sceneInfo = SCENES.find((s) => s.value === scene) ?? SCENES[0];
  const stageInfo = STAGES.find((s) => s.value === stage) ?? STAGES[1];
  const tierInfo = TIERS.find((t) => t.value === tier) ?? TIERS[0];
  const timeline = TIMELINE_OPTIONS.find((t) => t.id === timelineId) ?? TIMELINE_OPTIONS[0];
  const R = VISUALIZATION_RATES;
  const fee = formatUsdRange(result.feeMin, result.feeMax);

  const selectScene = (s: VizScene) => {
    setScene(s);
    setAreaSqFt(DEFAULT_AREA[s]);
  };

  const deliverables = [
    `${views} still ${views === 1 ? "view" : "views"}, ${tierInfo.name}`,
    ...(panoramas ? [`${panoramas} × 360° ${panoramas === 1 ? "panorama" : "panoramas"}`] : []),
    ...(result.animationSeconds ? [`${result.animationSeconds} s of animation`] : []),
    `${R.includedRevisionRounds} revision rounds included (extra rounds ${formatUsd(R.extraRevisionRound)} each)`,
    "High-resolution JPG or PNG files",
  ];

  return (
    <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-14">
      <div className="space-y-10 lg:col-span-7 xl:col-span-8">
        <Step number={1} title="Scene and size">
          <div>
            <FieldLabel>Scene</FieldLabel>
            <SegmentedControl
              name="viz-scene"
              ariaLabel="Scene"
              value={scene}
              onChange={selectScene}
              options={SCENES.map((s) => ({ value: s.value, label: s.label }))}
            />
          </div>
          <AreaInput
            key={scene}
            name="viz-area"
            label={sceneInfo.areaLabel}
            hint={sceneInfo.areaHint}
            sqft={areaSqFt}
            onChange={setAreaSqFt}
            unit={unit}
            onUnitChange={onUnitChange}
            scale={AREA_SCALES[scene]}
          />
        </Step>

        <Step
          number={2}
          title="What you can supply"
          hint="The existing design stage sets how much modelling happens before rendering starts."
        >
          <OptionCards
            name="viz-stage"
            ariaLabel="Existing design stage"
            columns={3}
            value={stage}
            onChange={setStage}
            options={STAGES.map((s) => ({ value: s.value, label: s.label, description: s.description }))}
          />
        </Step>

        <Step number={3} title="Deliverables">
          <SliderInput
            label="Still views"
            hint="Views of the same scene get cheaper after the first."
            value={views}
            onChange={(v) => setViews(Math.round(v))}
            min={1}
            max={12}
            step={1}
          />
          <div>
            <FieldLabel>Resolution</FieldLabel>
            <SegmentedControl
              name="viz-tier"
              ariaLabel="Resolution"
              value={tier}
              onChange={setTier}
              options={TIERS.map((t) => ({ value: t.value, label: t.label, meta: t.meta }))}
            />
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
            <SliderInput
              label="360° panoramas"
              hint={`${formatUsd(R.panoramaPerView)} each at the Schematic stage`}
              value={panoramas}
              onChange={(v) => setPanoramas(Math.round(v))}
              min={0}
              max={6}
              step={1}
            />
            <SliderInput
              label="Animation"
              hint={`Seconds of walkthrough — ${formatUsd(R.animationPerSecond)}/s, ${R.animationMinSeconds} s minimum`}
              value={animationSeconds}
              onChange={(v) => setAnimationSeconds(v <= 0 ? 0 : Math.max(R.animationMinSeconds, Math.round(v / 5) * 5))}
              min={0}
              max={120}
              step={5}
              suffix="s"
            />
          </div>
        </Step>

        <Step number={4} title="Schedule">
          <SegmentedControl
            name="viz-schedule"
            ariaLabel="Delivery schedule"
            value={timelineId}
            onChange={setTimelineId}
            options={TIMELINE_OPTIONS.map((t) => ({ value: t.id, label: t.name, meta: t.note }))}
          />
        </Step>
      </div>

      <aside className="lg:col-span-5 xl:col-span-4">
        <div className="lg:sticky lg:top-24">
          <ResultPanel
            service="visualization"
            specialist={specialist}
            fee={fee}
            rows={[
              { label: "Turnaround", value: `~${result.turnaroundDays} business days` },
              { label: "Scene", value: `${sceneInfo.label}, ${formatArea(areaSqFt, unit)}` },
              { label: "Design stage", value: stageInfo.label },
              { label: "Revisions", value: `${R.includedRevisionRounds} rounds included` },
            ]}
            deliverables={deliverables}
            comparison={
              <>
                <MarketSelect id="viz-market" value={marketId} onChange={onMarketChange} />
                <p>
                  {result.benchmark.label}:{" "}
                  <span className="font-mono text-neutral-200">{formatUsdRange(result.benchmark.min, result.benchmark.max)}</span>{" "}
                  (benchmark, Sept 2026).
                  {result.benchmark.fallback &&
                    ` There's no typical-tier data for ${MARKET_IN_PHRASE[marketId] ?? "this market"} yet, so this is the US figure.`}
                </p>
              </>
            }
            message={{
              subject: `Visualization scope — ${sceneInfo.label.toLowerCase()}, ${views} ${views === 1 ? "view" : "views"}`,
              lines: [
                `Scene: ${sceneInfo.label}, ${formatAreaBoth(areaSqFt, unit)}`,
                `Design stage: ${stageInfo.label} (${stageInfo.description})`,
                `Views: ${views} still ${views === 1 ? "view" : "views"}, ${tierInfo.name}`,
                ...(panoramas ? [`360° panoramas: ${panoramas}`] : []),
                ...(result.animationSeconds ? [`Animation: ${result.animationSeconds} s`] : []),
                `Schedule: ${timeline.name} (~${result.turnaroundDays} business days)`,
                `Indicative fee: ${fee}`,
              ],
            }}
          />
        </div>
      </aside>
    </div>
  );
};
