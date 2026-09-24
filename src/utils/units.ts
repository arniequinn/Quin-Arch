import { formatNumber } from "./format";

// Area units for the estimators (R4). All maths stays in square feet; values are converted only
// where they're entered or shown.
export type AreaUnit = "ft2" | "m2";

export const SQFT_PER_SQM = 10.7639;

export const unitLabel = (unit: AreaUnit) => (unit === "ft2" ? "ft²" : "m²");

/** Square feet → the number shown in `unit`. */
export const toUnit = (sqft: number, unit: AreaUnit) => (unit === "ft2" ? sqft : sqft / SQFT_PER_SQM);

/** A number entered in `unit` → square feet. */
export const fromUnit = (value: number, unit: AreaUnit) => (unit === "ft2" ? value : value * SQFT_PER_SQM);

export const formatArea = (sqft: number, unit: AreaUnit) => `${formatNumber(toUnit(sqft, unit))} ${unitLabel(unit)}`;

/** "2,800 ft² (260 m²)" — the chosen unit first, the other in brackets (for sent messages). */
export const formatAreaBoth = (sqft: number, unit: AreaUnit) => {
  const other: AreaUnit = unit === "ft2" ? "m2" : "ft2";
  return `${formatArea(sqft, unit)} (${formatArea(sqft, other)})`;
};

/** US and Canadian visitors think in ft²; the UK, Australia and everyone else in m². */
export const DEFAULT_UNIT_BY_MARKET: Record<string, AreaUnit> = {
  us: "ft2",
  ca: "ft2",
  uk: "m2",
  au: "m2",
  international: "m2",
};

/** A slider/preset scale in both units. Presets are the rounded equivalents of each other. */
export interface AreaScale {
  ft2: { min: number; max: number; step: number; presets: number[] };
  m2: { min: number; max: number; step: number; presets: number[] };
}
