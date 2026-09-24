// Fixed-locale formatting. Pages are prerendered in Node and hydrated in the visitor's browser;
// a bare toLocaleString() would print "2.800" in a German browser where the HTML says "2,800",
// which breaks hydration. Every number the site shows goes through these.
const integer = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

export const formatNumber = (n: number) => integer.format(Math.round(n));
export const formatUsd = (n: number) => `$${integer.format(Math.round(n))}`;

/** "$800–980" — a fee range, en dash, no spaces. */
export const formatUsdRange = (min: number, max: number) =>
  min === max ? formatUsd(min) : `${formatUsd(min)}–${integer.format(Math.round(max))}`;

/** Rounds to the nearest `step` (fee ranges are shown to the nearest $10). */
export const roundTo = (n: number, step: number) => Math.round(n / step) * step;
