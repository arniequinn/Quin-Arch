import React from "react";
import {
  Cloud,
  DollarSign,
  FileCode2,
  Zap,
} from "lucide-react";

export const WorkflowsSection: React.FC = () => {
  const benefits = [
    {
      icon: DollarSign,
      title: "Senior-Level Production, On Demand",
      description:
        "Scale drafting and BIM capacity to match each project's actual workload — a principal architect's judgment applied to exactly the drawing sheets and BIM models a phase requires, nothing held back for the next one.",
    },
    {
      icon: Zap,
      title: "24 to 48-Hour Rapid Redline Revisions",
      description:
        "City plan-check comments or structural engineer markups? Send scanned PDFs or Bluebeam Studio sessions and receive corrected sheets within 24 to 48 hours to prevent expensive site downtime.",
    },
    {
      icon: Cloud,
      title: "Seamless Cloud BIM & CAD Integration",
      description:
        "Work in your preferred ecosystem: BIM 360, Autodesk Construction Cloud (ACC), cloud BIM worksharing, Google Drive, or Dropbox. Direct integration into your existing office titleblocks and CAD layering.",
    },
    {
      icon: FileCode2,
      title: "National CAD Standard & AIA Layering",
      description:
        "Every floor plan, section, and detail is delivered using proper line weights, dimension styles, annotation standards, and parametric BIM families ready for immediate contractor bidding or city stamping.",
    },
  ];

  return (
    <section id="workflows" className="py-16 bg-neutral-900/50 border-t border-neutral-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400 font-mono">
            THE REMOTE DIGITAL ADVANTAGE
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-neutral-100 tracking-tight mt-2">
            Why Architecture Studios & Contractors Outsource Production
          </h2>
          <p className="mt-3 text-sm text-neutral-400 leading-relaxed">
            Eliminate drafting bottlenecks, accelerate city permit approval cycles, and scale your firm&apos;s
            project capacity without expanding in-house payroll.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {benefits.map((benefit, idx) => {
            const Icon = benefit.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-all flex items-start space-x-4"
              >
                <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-neutral-100">
                    {benefit.title}
                  </h3>
                  <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Engagement models (fixed-price vs. retainer) live on /services, alongside the
            other decision-stage content — this is just the pointer to it. */}
        <div className="mt-12 text-center">
          <a
            href={`${import.meta.env.BASE_URL}services/`}
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors"
          >
            <span>See fixed-price vs. dedicated-retainer engagement options →</span>
          </a>
        </div>

      </div>
    </section>
  );
};
