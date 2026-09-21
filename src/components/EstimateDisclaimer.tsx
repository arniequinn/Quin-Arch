import React from "react";
import { Info } from "lucide-react";

interface EstimateDisclaimerProps {
  specialistFirstName: string;
  className?: string;
}

// Shared disclaimer used under every cost estimator (Consultancy, Visualization, BIM/CAD) so the
// "this is a ballpark, not a quote" message reads identically everywhere on the site.
export const EstimateDisclaimer: React.FC<EstimateDisclaimerProps> = ({ specialistFirstName, className = "" }) => (
  <div className={`flex items-start space-x-2 px-3.5 py-2.5 rounded-xl bg-neutral-900/60 border border-neutral-800 ${className}`}>
    <Info className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
    <p className="text-[11px] text-neutral-400 leading-relaxed">
      This is a ballpark estimate only, not a binding quote. Reach out with more details about your
      project and {specialistFirstName} will work out a proper quote with an hourly breakdown of
      services based on your exact scope.
    </p>
  </div>
);
