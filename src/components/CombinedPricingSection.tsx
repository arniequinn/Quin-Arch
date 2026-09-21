import React from "react";
import { Sparkles } from "lucide-react";
import { ConsultancyPricing } from "./ConsultancyPricing";
import { VisualizationPricing } from "./VisualizationPricing";
import { SpecialistProfile } from "../types";

interface CombinedPricingSectionProps {
  specialist: SpecialistProfile;
}

// Consultancy and Visualization side by side — two independent pricing tracks sharing one
// section so a visitor can compare both without scrolling between them.
export const CombinedPricingSection: React.FC<CombinedPricingSectionProps> = ({ specialist }) => {
  return (
    <section className="relative bg-neutral-950 border-t border-neutral-900 py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Two More Service Tracks, Flat Worldwide Rates</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-neutral-100 tracking-tight">
            Consultancy & Visualization Pricing
          </h2>
          <p className="mt-3 text-base text-neutral-400 leading-relaxed">
            Billed separately from BIM/CAD drafting (see the Scope Estimator below), each
            researched against real market rates and offered at a consistent discount — the same
            rate for every client, anywhere in the world.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-0 lg:divide-x lg:divide-neutral-800">
          <div id="consultancy" className="scroll-mt-16 lg:pr-12">
            <ConsultancyPricing specialist={specialist} />
          </div>
          <div id="visualization" className="scroll-mt-16 lg:pl-12">
            <VisualizationPricing specialist={specialist} />
          </div>
        </div>
      </div>
    </section>
  );
};
