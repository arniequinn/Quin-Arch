import { MARKET_BENCHMARK_RATES, OFFERED_RATES } from "../data/architecturalData";

function marketRates(targetMarketId: string) {
  return MARKET_BENCHMARK_RATES[targetMarketId] ?? MARKET_BENCHMARK_RATES.us;
}

export interface ConsultingFeeResult {
  offeredFee: number;
  marketFee: number;
  savingsAmount: number;
  savingsPercentage: number;
}

export function calculateConsultingFee(hours: number, targetMarketId: string): ConsultingFeeResult {
  const safeHours = Math.max(1, hours || 0);
  const market = marketRates(targetMarketId);
  const offeredFee = Math.round(safeHours * OFFERED_RATES.consultantHourly);
  const marketFee = Math.round(safeHours * market.consultantHourly);
  const savingsAmount = Math.max(0, marketFee - offeredFee);
  const savingsPercentage = marketFee > 0 ? Math.round((savingsAmount / marketFee) * 100) : 0;
  return { offeredFee, marketFee, savingsAmount, savingsPercentage };
}

export type RenderType = "exterior" | "interior";

// Real rendering studios quote per image/view, not per square foot — view count grows far
// slower than floor area (a 12,000 sq ft building doesn't need 10x the views a 1,200 sq ft one
// does). Below this baseline, the flat per-sq-ft rate tracks researched per-view pricing well;
// beyond it, billable area is dampened with a square-root curve so the fee stays in line with
// what a real per-view quote would total, instead of growing linearly without limit.
const VISUALIZATION_BASELINE_SQFT: Record<RenderType, number> = {
  interior: 1200,
  exterior: 2500,
};

function billableArea(areaSqFt: number, renderType: RenderType): number {
  const baseline = VISUALIZATION_BASELINE_SQFT[renderType];
  return areaSqFt <= baseline ? areaSqFt : baseline * Math.sqrt(areaSqFt / baseline);
}

export interface VisualizationFeeResult {
  offeredFee: number;
  marketFee: number;
  savingsAmount: number;
  savingsPercentage: number;
}

export function calculateVisualizationFee(
  areaSqFt: number,
  renderType: RenderType,
  targetMarketId: string
): VisualizationFeeResult {
  const safeArea = Math.max(50, areaSqFt || 0);
  const billable = billableArea(safeArea, renderType);
  const market = marketRates(targetMarketId);

  const offeredRate = renderType === "exterior" ? OFFERED_RATES.exteriorRenderPerSqFt : OFFERED_RATES.interiorRenderPerSqFt;
  const marketRate = renderType === "exterior" ? market.exteriorRenderPerSqFt : market.interiorRenderPerSqFt;
  const minFee = renderType === "exterior" ? OFFERED_RATES.minExteriorRenderFee : OFFERED_RATES.minInteriorRenderFee;

  const offeredFee = Math.max(minFee, Math.round(billable * offeredRate));
  const marketFee = Math.max(minFee, Math.round(billable * marketRate));
  const savingsAmount = Math.max(0, marketFee - offeredFee);
  const savingsPercentage = marketFee > 0 ? Math.round((savingsAmount / marketFee) * 100) : 0;

  return { offeredFee, marketFee, savingsAmount, savingsPercentage };
}
