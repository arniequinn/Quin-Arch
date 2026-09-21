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
  const market = marketRates(targetMarketId);

  const offeredRate = renderType === "exterior" ? OFFERED_RATES.exteriorRenderPerSqFt : OFFERED_RATES.interiorRenderPerSqFt;
  const marketRate = renderType === "exterior" ? market.exteriorRenderPerSqFt : market.interiorRenderPerSqFt;
  const minFee = renderType === "exterior" ? OFFERED_RATES.minExteriorRenderFee : OFFERED_RATES.minInteriorRenderFee;

  const offeredFee = Math.max(minFee, Math.round(safeArea * offeredRate));
  const marketFee = Math.max(minFee, Math.round(safeArea * marketRate));
  const savingsAmount = Math.max(0, marketFee - offeredFee);
  const savingsPercentage = marketFee > 0 ? Math.round((savingsAmount / marketFee) * 100) : 0;

  return { offeredFee, marketFee, savingsAmount, savingsPercentage };
}
