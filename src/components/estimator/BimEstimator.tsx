import React, { useMemo, useState } from "react";
import { Check, RotateCcw } from "lucide-react";
import {
  JURISDICTIONS,
  JURISDICTION_TO_MARKET,
  MARKET_IN_PHRASE,
  PROJECT_STAGES,
  PROJECT_TYPES,
  SERVICE_OPTIONS,
  TIMELINE_OPTIONS,
} from "../../data/architecturalData";
import { SHEET_SERIES_ORDER, sheetsFor } from "../../data/sheetCatalogue";
import { ROUTES } from "../../data/routes";
import { ProjectCategory, ServiceId, SpecialistProfile } from "../../types";
import { calculateScope } from "../../utils/calculator";
import { formatUsd, formatUsdRange } from "../../utils/format";
import { AreaScale, AreaUnit, formatArea, formatAreaBoth } from "../../utils/units";
import { AreaInput, CheckboxCards, FieldLabel, OptionCards, SegmentedControl, Step } from "./controls";
import { ResultPanel } from "./ResultPanel";

const COMPLEXITY_TIERS = [
  { value: "standard", label: "Standard", multiplier: 1.0, description: "Orthogonal geometry, conventional program, an easy site." },
  { value: "complex", label: "Complex", multiplier: 1.25, description: "Non-orthogonal forms, several systems to coordinate, a tight site." },
  { value: "landmark", label: "Landmark", multiplier: 1.55, description: "Bespoke parametric geometry, structural innovation or a heritage context." },
] as const;

// R4: presets are the rounded equivalents of each other; the metric slider runs in 5 m² steps.
const AREA_SCALE: AreaScale = {
  ft2: { min: 300, max: 12000, step: 50, presets: [850, 1500, 2800, 4500, 7500] },
  m2: { min: 30, max: 1100, step: 5, presets: [80, 140, 260, 420, 700] },
};

const DEFAULT_SERVICES: ServiceId[] = ["permit_drawings", "bim_modeling", "construction_docs"];

interface BimEstimatorProps {
  specialist: SpecialistProfile;
  unit: AreaUnit;
  onUnitChange: (u: AreaUnit) => void;
  /** Tells the page which market the chosen jurisdiction is in (it sets the default unit). */
  onMarketChange: (marketId: string) => void;
}

export const BimEstimator: React.FC<BimEstimatorProps> = ({ specialist, unit, onUnitChange, onMarketChange }) => {
  const [projectTypeId, setProjectTypeId] = useState<ProjectCategory>("residential_single");
  const [services, setServices] = useState<ServiceId[]>(DEFAULT_SERVICES);
  const [areaSqFt, setAreaSqFt] = useState(2800);
  const [jurisdictionId, setJurisdictionId] = useState("us_irc_ibc");
  const [stageId, setStageId] = useState("schematic");
  const [complexityId, setComplexityId] = useState<(typeof COMPLEXITY_TIERS)[number]["value"]>("standard");
  const [timelineId, setTimelineId] = useState("standard");
  const [projectTitle, setProjectTitle] = useState("");
  // The visitor's own sheet switches, kept apart from the default set so "Reset" is exact.
  const [sheetOverrides, setSheetOverrides] = useState<Record<string, boolean>>({});

  const projectType = PROJECT_TYPES.find((p) => p.id === projectTypeId) ?? PROJECT_TYPES[0];
  const complexity = COMPLEXITY_TIERS.find((c) => c.value === complexityId) ?? COMPLEXITY_TIERS[0];
  const stage = PROJECT_STAGES.find((s) => s.id === stageId) ?? PROJECT_STAGES[1];
  const timeline = TIMELINE_OPTIONS.find((t) => t.id === timelineId) ?? TIMELINE_OPTIONS[0];

  const result = useMemo(
    () =>
      calculateScope({
        projectTypeId,
        selectedServiceIds: services,
        areaSqFt,
        jurisdictionId,
        currentStageId: stageId,
        timelineId,
        complexityMultiplier: complexity.multiplier,
        sheetOverrides,
      }),
    [projectTypeId, services, areaSqFt, jurisdictionId, stageId, timelineId, complexity.multiplier, sheetOverrides]
  );

  const selectProjectType = (id: ProjectCategory) => {
    setProjectTypeId(id);
    setAreaSqFt(PROJECT_TYPES.find((p) => p.id === id)?.defaultSqFt ?? 2000);
    setSheetOverrides({}); // a different building starts from its own default set
  };

  const toggleService = (id: ServiceId) =>
    setServices((prev) => (prev.includes(id) ? (prev.length === 1 ? prev : prev.filter((s) => s !== id)) : [...prev, id]));

  const toggleSheet = (number: string, defaultOn: boolean, included: boolean) =>
    setSheetOverrides((prev) => {
      const next = { ...prev };
      if (!included === defaultOn) delete next[number];
      else next[number] = !included;
      return next;
    });

  const selectJurisdiction = (id: string) => {
    setJurisdictionId(id);
    onMarketChange(JURISDICTION_TO_MARKET[id] ?? "us");
  };

  const includedSheets = result.sheets.filter((s) => s.included);
  const seriesIncluded = SHEET_SERIES_ORDER.filter((series) => includedSheets.some((s) => s.series === series));
  const marketName = MARKET_IN_PHRASE[result.marketId] ?? MARKET_IN_PHRASE.us;
  const serviceNames = SERVICE_OPTIONS.filter((s) => services.includes(s.id)).map((s) => s.shortName);
  const fee = result.estimatedFeeMax > 0 ? formatUsdRange(result.estimatedFeeMin, result.estimatedFeeMax) : "—";

  return (
    <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-14">
      <div className="space-y-10 lg:col-span-7 xl:col-span-8">
        <Step number={1} title="The project">
          <div>
            <FieldLabel>Project type</FieldLabel>
            <OptionCards
              name="bim-project-type"
              ariaLabel="Project type"
              value={projectTypeId}
              onChange={selectProjectType}
              options={PROJECT_TYPES.map((p) => ({
                value: p.id,
                label: p.name,
                description: p.description,
                meta: `~${formatArea(p.defaultSqFt, unit)} · ${sheetsFor(p.id, services).filter((s) => s.defaultOn).length} sheets as standard`,
              }))}
            />
          </div>
          <AreaInput
            name="bim-area"
            label="Gross floor area"
            hint="Enclosed, conditioned floor area across all levels"
            sqft={areaSqFt}
            onChange={setAreaSqFt}
            unit={unit}
            onUnitChange={onUnitChange}
            scale={AREA_SCALE}
          />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <FieldLabel htmlFor="bim-jurisdiction">Jurisdiction</FieldLabel>
              <select
                id="bim-jurisdiction"
                value={jurisdictionId}
                onChange={(e) => selectJurisdiction(e.target.value)}
                className="w-full rounded border border-neutral-700 bg-neutral-950 px-3 py-2.5 text-small text-neutral-100 focus:border-amber-400 focus:outline-none"
              >
                {JURISDICTIONS.map((j) => (
                  <option key={j.id} value={j.id}>
                    {j.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <FieldLabel htmlFor="bim-reference">Project reference (optional)</FieldLabel>
              <input
                id="bim-reference"
                type="text"
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
                placeholder="e.g. Hillside house — phase 1"
                className="w-full rounded border border-neutral-700 bg-neutral-950 px-3 py-2.5 text-small text-neutral-100 placeholder:text-neutral-600 focus:border-amber-400 focus:outline-none"
              />
            </div>
          </div>
        </Step>

        <Step
          number={2}
          title="Services"
          hint="Pick any combination. They share one model and one set, so the price isn't simply added up."
        >
          <CheckboxCards
            ariaLabel="Services"
            values={services}
            onToggle={toggleService}
            options={SERVICE_OPTIONS.map((s) => ({
              value: s.id,
              label: s.name,
              description: s.description,
              meta: `~${s.standardTurnaroundDays} days`,
            }))}
          />
        </Step>

        <Step number={3} title="Stage, complexity and schedule">
          <div>
            <FieldLabel hint={<>Phase names only — LOD is set element by element, not by phase (<a href={ROUTES.lodGuide} className="text-amber-400 hover:text-amber-300">see the LOD guide</a>).</>}>
              Where the project is now
            </FieldLabel>
            <OptionCards
              name="bim-stage"
              ariaLabel="Current project stage"
              value={stageId}
              onChange={setStageId}
              options={PROJECT_STAGES.map((s) => ({ value: s.id, label: s.name, description: s.desc }))}
            />
          </div>
          <div>
            <FieldLabel>Complexity</FieldLabel>
            <OptionCards
              name="bim-complexity"
              ariaLabel="Program complexity"
              columns={3}
              value={complexityId}
              onChange={setComplexityId}
              options={COMPLEXITY_TIERS.map((c) => ({
                value: c.value,
                label: c.label,
                description: c.description,
                meta: c.multiplier === 1 ? "Base rate" : `×${c.multiplier}`,
              }))}
            />
          </div>
          <div>
            <FieldLabel>Schedule</FieldLabel>
            <SegmentedControl
              name="bim-schedule"
              ariaLabel="Delivery schedule"
              value={timelineId}
              onChange={setTimelineId}
              options={TIMELINE_OPTIONS.map((t) => ({ value: t.id, label: t.name, meta: t.note }))}
            />
          </div>
        </Step>

        <Step
          number={4}
          title="Drawing set"
          hint={
            <>
              The standard set for this project type and these services. Switch sheets on or off; each shows its
              typical LOD (<a href={ROUTES.lodGuide} className="text-amber-400 hover:text-amber-300">what LOD means</a>).
            </>
          }
          aside={
            <div className="flex items-center gap-4 text-label text-neutral-400">
              <span>
                {result.includedSheetCount} of {result.sheets.length} sheets
              </span>
              {Object.keys(sheetOverrides).length > 0 && (
                <button
                  type="button"
                  onClick={() => setSheetOverrides({})}
                  className="inline-flex items-center gap-1.5 font-semibold text-amber-400 hover:text-amber-300"
                >
                  <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                  Reset
                </button>
              )}
            </div>
          }
        >
          {result.sheets.length === 0 ? (
            <p className="text-small text-neutral-400">
              These services don't produce drawing sheets on their own — the coordination deliverables are listed in
              the estimate.
            </p>
          ) : (
            <div className="space-y-6">
              {SHEET_SERIES_ORDER.map((series) => {
                const sheets = result.sheets.filter((s) => s.series === series);
                if (!sheets.length) return null;
                return (
                  <fieldset key={series}>
                    <legend className="eyebrow text-neutral-500">{series}</legend>
                    <ul className="mt-2 divide-y divide-neutral-900 border-y border-neutral-900">
                      {sheets.map((sheet) => (
                        <li key={sheet.number}>
                          <label className="flex cursor-pointer items-start gap-3 py-3 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-amber-400">
                            <input
                              type="checkbox"
                              checked={sheet.included}
                              onChange={() => toggleSheet(sheet.number, sheet.defaultOn, sheet.included)}
                              className="sr-only"
                            />
                            <span
                              aria-hidden="true"
                              className={`mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border ${
                                sheet.included ? "border-amber-400 bg-amber-400" : "border-neutral-600"
                              }`}
                            >
                              {sheet.included && <Check className="h-3 w-3 text-neutral-950" strokeWidth={3} />}
                            </span>
                            <span className={`w-16 shrink-0 font-mono text-label leading-6 ${sheet.included ? "text-amber-400" : "text-neutral-500"}`}>
                              {sheet.number}
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className={`block text-small ${sheet.included ? "text-neutral-100" : "text-neutral-400"}`}>
                                {sheet.title}
                              </span>
                              <span className="mt-0.5 block text-label text-neutral-500">{sheet.description}</span>
                            </span>
                            <span className="hidden shrink-0 font-mono text-label leading-6 text-neutral-500 sm:block">
                              {sheet.typicalLod}
                            </span>
                          </label>
                        </li>
                      ))}
                    </ul>
                  </fieldset>
                );
              })}
            </div>
          )}
        </Step>
      </div>

      <aside className="lg:col-span-5 xl:col-span-4">
        <div className="lg:sticky lg:top-[var(--sticky-top,6rem)]">
          <ResultPanel
            service="bim"
            specialist={specialist}
            fee={fee}
            rows={[
              { label: "Turnaround", value: `~${result.estimatedTurnaroundDays} business days` },
              { label: "Drawing set", value: `${result.includedSheetCount} sheets` },
              { label: "Stage", value: stage.name },
              { label: "Complexity", value: complexity.label },
            ]}
            deliverables={[
              ...(result.includedSheetCount > 0
                ? [
                    `${result.includedSheetCount} drawing sheets: ${seriesIncluded
                      .map((s) => s.toLowerCase())
                      .join(", ")}`,
                  ]
                : []),
              ...result.deliverables.map((d) => d.title),
            ]}
            comparison={
              <p>
                Typical in-house cost of this scope in {marketName}:{" "}
                <span className="font-mono text-neutral-200">{formatUsd(result.inHouseCostEstimate)}</span> (benchmark, Sept 2026).
              </p>
            }
            message={{
              subject: `BIM / CAD scope — ${projectTitle || projectType.name}`,
              lines: [
                `Project: ${projectTitle ? `${projectTitle} (${projectType.name})` : projectType.name}`,
                `Area: ${formatAreaBoth(areaSqFt, unit)}`,
                `Jurisdiction: ${JURISDICTIONS.find((j) => j.id === jurisdictionId)?.name ?? ""}`,
                `Stage: ${stage.name}`,
                `Complexity: ${complexity.label}`,
                `Services: ${serviceNames.join(", ")}`,
                `Drawing set: ${result.includedSheetCount} sheets (${includedSheets.map((s) => s.number).join(", ")})`,
                `Schedule: ${timeline.name} (~${result.estimatedTurnaroundDays} business days)`,
                `Indicative fee: ${fee}`,
              ],
            }}
          />
        </div>
      </aside>
    </div>
  );
};
