// Fixed-locale formatting. Pages are prerendered in Node and hydrated in the visitor's browser;
// a bare toLocaleString() would print "2.800" in a German browser where the HTML says "2,800",
// which breaks hydration. Every number the site shows goes through these.
const integer = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

export const formatNumber = (n: number) => integer.format(Math.round(n));
export const formatUsd = (n: number) => `$${integer.format(Math.round(n))}`;

const cents = new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/** "$45" for whole dollars, "$22.50" when there are cents (hourly fees billed in 15-minute steps). */
export const formatUsdExact = (n: number) => {
  const rounded = Math.round(n * 100) / 100;
  return Number.isInteger(rounded) ? formatUsd(rounded) : "$" + cents.format(rounded);
};

/** A duration in minutes as "30 min", "1 h" or "1 h 45 min". */
export const formatDuration = (minutes: number) => {
  const m = Math.max(0, Math.round(minutes));
  const h = Math.floor(m / 60);
  const rest = m % 60;
  if (h === 0) return `${rest} min`;
  return rest === 0 ? `${h} h` : `${h} h ${rest} min`;
};

/** "$800–980" — a fee range, en dash, no spaces. */
export const formatUsdRange = (min: number, max: number) =>
  min === max ? formatUsd(min) : `${formatUsd(min)}–${integer.format(Math.round(max))}`;

/** Rounds to the nearest `step` (fee ranges are shown to the nearest $10). */
export const roundTo = (n: number, step: number) => Math.round(n / step) * step;
