import {
  FX_TO_USD,
  MARKET_BENCHMARK_RATES,
  OFFERED_RATES,
  TIMELINE_OPTIONS,
  VISUALIZATION_RATES,
  VIZ_BENCHMARKS,
  VizScene,
  VizStage,
  VizTier,
} from "../data/architecturalData";
import { scheduledDays } from "./calculator";
import { roundTo } from "./format";

function marketRates(targetMarketId: string) {
  return MARKET_BENCHMARK_RATES[targetMarketId] ?? MARKET_BENCHMARK_RATES.us;
}

export interface ConsultingFeeResult {
  offeredFee: number;
  marketFee: number;
  marketHourly: number;
}

export function calculateConsultingFee(hours: number, targetMarketId: string): ConsultingFeeResult {
  const safeHours = Math.max(1, hours || 0);
  const market = marketRates(targetMarketId);
  return {
    offeredFee: Math.round(safeHours * OFFERED_RATES.consultantHourly),
    marketFee: Math.round(safeHours * market.consultantHourly),
    marketHourly: market.consultantHourly,
  };
}

// ==========================================================================
// Visualization (documentation/final-polish-v2.0.md, Appendix A.3):
//
//   fee = Σ over still views [ base(scene) × size × stage × tier × viewDiscount(n) ]
//       + panoramas × base360 × stage
//       + animationSeconds × ratePerSecond × stage
//   fee = max(minimumFee, fee) × schedule          minimumFee = one standard interior view
//   shown as a range: fee × 0.9 … fee × 1.1
// ==========================================================================

export interface VisualizationScopeInput {
  scene: VizScene;
  areaSqFt: number;
  stage: VizStage;
  /** Still views of the scene, 1–12. */
  views: number;
  tier: VizTier;
  panoramas: number;
  /** 0 for none; otherwise at least VISUALIZATION_RATES.animationMinSeconds. */
  animationSeconds: number;
  timelineId: string;
  marketId: string;
}

export interface VisualizationScopeResult {
  sizeFactor: number;
  /** Price of each still view, in order (view 1, 2, …). */
  viewPrices: number[];
  stillsFee: number;
  panoramaFee: number;
  animationFee: number;
  animationSeconds: number;
  /** After the minimum and the schedule premium, unrounded. */
  fee: number;
  feeMin: number;
  feeMax: number;
  turnaroundDays: number;
  /** `fallback` is true when the visitor's market has no typical-tier data and the US is shown. */
  benchmark: { label: string; min: number; max: number; source: string; fallback: boolean };
}

export function calculateVisualizationScope(input: VisualizationScopeInput): VisualizationScopeResult {
  const R = VISUALIZATION_RATES;
  const views = Math.min(12, Math.max(1, Math.round(input.views || 1)));
  const panoramas = Math.max(0, Math.round(input.panoramas || 0));
  const animationSeconds =
    input.animationSeconds > 0 ? Math.max(R.animationMinSeconds, Math.round(input.animationSeconds)) : 0;
  const area = Math.max(1, input.areaSqFt || 0);
  const stage = R.stage[input.stage];

  const sizeFactor = Math.min(
    R.sizeFactor.max,
    Math.max(R.sizeFactor.min, Math.sqrt(area / R.baselineSqFt[input.scene]))
  );
  const firstView = R.basePerView[input.scene] * sizeFactor * stage * R.tier[input.tier];
  const viewPrices = Array.from({ length: views }, (_, i) => firstView * R.viewDiscount(i + 1));
  const stillsFee = viewPrices.reduce((a, b) => a + b, 0);
  const panoramaFee = panoramas * R.panoramaPerView * stage;
  const animationFee = animationSeconds * R.animationPerSecond * stage;

  const minimumFee = R.basePerView.interior * stage;
  const schedule = TIMELINE_OPTIONS.find((t) => t.id === input.timelineId)?.multiplier ?? 1;
  const fee = Math.max(minimumFee, stillsFee + panoramaFee + animationFee) * schedule;

  const T = R.turnaround;
  const standardDays = Math.max(
    2,
    T.firstViewDays +
      Math.ceil((views - 1) / T.viewsPerExtraDay) +
      Math.ceil(panoramas / T.viewsPerExtraDay) +
      T.stageDays[input.stage] +
      Math.ceil(animationSeconds / T.animationSecondsPerDay)
  );

  return {
    sizeFactor,
    viewPrices,
    stillsFee,
    panoramaFee,
    animationFee,
    animationSeconds,
    fee,
    feeMin: roundTo(fee * (1 - R.rangeSpread), 10),
    feeMax: roundTo(fee * (1 + R.rangeSpread), 10),
    turnaroundDays: scheduledDays(standardDays, input.timelineId, { expedited: 3, urgent: 2 }),
    benchmark: visualizationBenchmark(input.scene, views, panoramas, animationSeconds, input.marketId),
  };
}

// Typical studio price for the same scope — per view, like the sources, with no size or stage
// adjustments. The Canadian range is used only where it covers the whole scope; everything else
// (and every other market) is compared with the US typical tier, and labelled as such.
function visualizationBenchmark(scene: VizScene, views: number, panoramas: number, seconds: number, marketId: string) {
  const ca = VIZ_BENCHMARKS.ca;
  const useCa = marketId === "ca" && !!ca.perView[scene] && panoramas === 0 && seconds === 0;
  const b = useCa ? ca : VIZ_BENCHMARKS.us;
  const fx = FX_TO_USD[b.currency];
  const [vMin, vMax] = b.perView[scene] ?? VIZ_BENCHMARKS.us.perView[scene]!;
  const [pMin, pMax] = b.panoramaPerView ?? [0, 0];
  const [aMin, aMax] = b.animationPerSecond ?? [0, 0];
  return {
    label: `Typical ${b.label} studio price for this scope`,
    min: roundTo((views * vMin + panoramas * pMin + seconds * aMin) * fx, 50),
    max: roundTo((views * vMax + panoramas * pMax + seconds * aMax) * fx, 50),
    source: b.source,
    fallback: marketId !== "us" && !useCa,
  };
}
