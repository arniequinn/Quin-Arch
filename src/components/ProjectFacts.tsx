import React from "react";
import { PortfolioItem } from "../types";
import { AreaUnit, formatArea } from "../utils/units";
import { formatNumber } from "../utils/format";

/** A project's facts as label/value rows (point 17): structured facts first, then any extras.
 *  Only what's known is listed — a missing fact is left out, never estimated. */
export function projectFactRows(item: PortfolioItem, unit: AreaUnit): Array<[string, string]> {
  const f = item.facts;
  const rows: Array<[string, string | undefined]> = [
    ["Location", f.location],
    ["Area", f.areaSqFt ? formatArea(f.areaSqFt, unit) : undefined],
    [
      "Bedrooms / bathrooms",
      f.bedrooms != null || f.bathrooms != null ? `${f.bedrooms ?? "—"} / ${f.bathrooms ?? "—"}` : undefined,
    ],
    ["Floors", f.floors],
    ["Year", f.year ? String(f.year) : undefined],
    ["Design & production", f.designDuration],
    [
      "Construction",
      f.constructionStatus ? `${f.constructionStatus}${f.constructionDuration ? ` (${f.constructionDuration})` : ""}` : undefined,
    ],
    ["Role", f.role],
    ["Client", f.clientType],
    ["Sheets in the set", f.sheets != null ? formatNumber(f.sheets) : undefined],
    ["Drawings", f.drawings],
    ...item.specs.map((s): [string, string] => [s.label, s.value]),
  ];
  return rows.filter((r): r is [string, string] => Boolean(r[1]));
}

export const ProjectFactsGrid: React.FC<{ item: PortfolioItem; unit: AreaUnit; columns?: 2 | 3 }> = ({
  item,
  unit,
  columns = 2,
}) => (
  <dl className={`grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2 ${columns === 3 ? "lg:grid-cols-3" : ""}`}>
    {projectFactRows(item, unit).map(([label, value]) => (
      <div key={label} className="border-t border-neutral-800 pt-3">
        <dt className="text-label text-neutral-500">{label}</dt>
        <dd className="mt-1 text-small text-neutral-100">{value}</dd>
      </div>
    ))}
  </dl>
);
