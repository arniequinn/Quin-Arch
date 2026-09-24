import React from "react";
import type { LucideIcon } from "lucide-react";

export interface Feature {
  icon: LucideIcon;
  title: string;
  body: string;
}

// Two columns of short features — the same grid in every section that uses it, so their titles
// share one left edge down the page (point 11).
export const FeatureGrid: React.FC<{ features: Feature[] }> = ({ features }) => (
  <div className="mx-auto grid max-w-5xl grid-cols-1 gap-x-14 gap-y-12 md:grid-cols-2">
    {features.map(({ icon: Icon, title, body }) => (
      <div key={title} className="flex items-start gap-5">
        <Icon className="mt-1 h-6 w-6 shrink-0 text-amber-400" strokeWidth={1.5} aria-hidden="true" />
        <div>
          <h3 className="heading-3 text-neutral-100">{title}</h3>
          <p className="mt-2 text-body text-neutral-400">{body}</p>
        </div>
      </div>
    ))}
  </div>
);
