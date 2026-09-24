import { PROJECT_TYPES, SERVICE_OPTIONS, PROJECT_STAGES, JURISDICTION_TO_MARKET, MARKET_BENCHMARK_RATES, TIMELINE_OPTIONS } from "../data/architecturalData";
import { CatalogueSheet, DeliverableSpec, TypicalLod, deliverablesFor, sheetsFor } from "../data/sheetCatalogue";
import { ProjectCategory, ServiceId } from "../types";
import { roundTo } from "./format";

export interface ScopeCalculationInput {
  projectTypeId: ProjectCategory;
  selectedServiceIds: ServiceId[];
  areaSqFt: number;
  jurisdictionId: string;
  currentStageId: string;
  timelineId: string;
  /** Program complexity tier (Standard ×1, Complex ×1.25, Landmark ×1.55). */
  complexityMultiplier?: number;
  /** The visitor's own switches on top of the default set, by sheet number. */
  sheetOverrides?: Record<string, boolean>;
}

export interface ScopeSheet extends CatalogueSheet {
  included: boolean;
}

export interface ScopeCalculationResult {
  estimatedFeeMin: number;
  estimatedFeeMax: number;
  estimatedTurnaroundDays: number;
  /** Every sheet that belongs to this project type and these services, switched on or off. */
  sheets: ScopeSheet[];
  includedSheetCount: number;
  deliverables: DeliverableSpec[];
  /** Typical in-house (onshore) cost of the same scope in the visitor's market. */
  inHouseCostEstimate: number;
  marketId: string;
}

// Base price per sheet at each typical LOD, calibrated against researched US remote/outsourced
// BIM & CAD drafting rates ($25-150/sheet outsourced; LOD 300 modeling ~$0.25-0.45/sqft; LOD 350
// coordination sheets command a premium over LOD 300 for multi-trade interface work). Applied at
// a reference project size — see areaFactor below for how it scales with actual building size.
const LOD_BASE_PRICE: Record<TypicalLod, number> = {
  "LOD 100": 175,
  "LOD 200": 260,
  "LOD 300": 340,
  "LOD 350": 460,
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/** Faster schedules shorten the turnaround, never lengthen it past the standard one. */
export function scheduledDays(standardDays: number, timelineId: string, floors = { expedited: 4, urgent: 3 }): number {
  if (timelineId === "expedited") return Math.min(standardDays, Math.max(floors.expedited, Math.round(standardDays * 0.65)));
  if (timelineId === "urgent") return Math.min(standardDays, Math.max(floors.urgent, Math.round(standardDays * 0.45)));
  return standardDays;
}

export function calculateScope(input: ScopeCalculationInput): ScopeCalculationResult {
  const projectType = PROJECT_TYPES.find((p) => p.id === input.projectTypeId) || PROJECT_TYPES[0];
  const selectedServices = SERVICE_OPTIONS.filter((s) => input.selectedServiceIds.includes(s.id));
  const area = Math.max(200, input.areaSqFt || 2000);
  const complexity = projectType.baseComplexity * (input.complexityMultiplier ?? 1);

  // The drawing set is the single source of truth: the price below is computed from exactly the
  // sheets that are switched on. The default set depends only on project type + services; the
  // visitor's own switches are applied on top, so the same inputs always give the same defaults.
  const overrides = input.sheetOverrides ?? {};
  const sheets: ScopeSheet[] = sheetsFor(projectType.id, input.selectedServiceIds).map((sheet) => ({
    ...sheet,
    included: overrides[sheet.number] ?? sheet.defaultOn,
  }));
  const activeSheets = sheets.filter((s) => s.included);
  const deliverables = deliverablesFor(input.selectedServiceIds);

  // Price: each active sheet's LOD-tier base rate (plus non-sheet deliverables priced as sheets),
  // scaled by complexity and a sublinear area factor — a 6,500 sq ft floor plan takes more time
  // than an 850 sq ft one, but nowhere near 7.6x more; most of the added area is repetitive.
  const areaFactor = clamp(Math.sqrt(area / projectType.defaultSqFt), 0.5, 2.4);
  const units =
    activeSheets.reduce((sum, sheet) => sum + LOD_BASE_PRICE[sheet.typicalLod], 0) +
    deliverables.reduce((sum, d) => sum + LOD_BASE_PRICE[d.priceAs.lod] * d.priceAs.sheets, 0);
  const production = units * complexity * areaFactor;

  // Larger drawing sets amortize model setup/coordination overhead better per sheet.
  let volumeDiscount = 1;
  if (activeSheets.length >= 20) volumeDiscount = 0.9;
  else if (activeSheets.length >= 16) volumeDiscount = 0.95;

  // Project stage: how much of the production work is actually still ahead. Grounded in industry
  // fee-distribution research (Schematic Design is only ~15% of total effort; Design Development +
  // Construction Documents make up 50-75%), so only construction administration — correcting an
  // existing set rather than producing one — gets a real discount.
  const stageMultiplier = PROJECT_STAGES.find((s) => s.id === input.currentStageId)?.priceMultiplier ?? 1;
  const timelineMultiplier = TIMELINE_OPTIONS.find((t) => t.id === input.timelineId)?.multiplier ?? 1;
  const subtotal = production * volumeDiscount * stageMultiplier * timelineMultiplier;

  // Turnaround: driven by whichever selected service has the longest standard delivery time.
  let totalDays = 4;
  selectedServices.forEach((service) => {
    totalDays = Math.max(totalDays, service.standardTurnaroundDays + Math.round(area / 3000));
  });
  // Plan-check corrections are explicitly a rapid, bounded task, not a full production run.
  if (input.currentStageId === "redlines_revisions") totalDays = Math.min(totalDays, 2);
  totalDays = scheduledDays(totalDays, input.timelineId);

  // In-house comparison: an in-house drafter juggling multiple projects typically runs ~8
  // hours/sheet for a set this involved, billed at the researched onshore payroll rate for the
  // visitor's own market, with the same stage, rush and complexity factors applied — an in-house
  // team pays real overtime for rush work too.
  const marketId = JURISDICTION_TO_MARKET[input.jurisdictionId] || "us";
  const payrollHourly = (MARKET_BENCHMARK_RATES[marketId] ?? MARKET_BENCHMARK_RATES.us).inHousePayrollHourly;
  const estimatedHours = (activeSheets.length * 8 + area / 300) * stageMultiplier;
  const inHouseCostEstimate = estimatedHours * payrollHourly * timelineMultiplier * (input.complexityMultiplier ?? 1);

  return {
    estimatedFeeMin: roundTo(subtotal * 0.9, 10),
    estimatedFeeMax: roundTo(subtotal * 1.18, 10),
    estimatedTurnaroundDays: totalDays,
    sheets,
    includedSheetCount: activeSheets.length,
    deliverables,
    inHouseCostEstimate: roundTo(inHouseCostEstimate, 50),
    marketId,
  };
}
