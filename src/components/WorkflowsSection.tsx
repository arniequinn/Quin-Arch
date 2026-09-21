import React from "react";
import {
  Cloud,
  DollarSign,
  FileCode2,
  Zap,
  CheckCircle2,
  ArrowRight
} from "lucide-react";

interface WorkflowsSectionProps {
  onScrollToEstimator: () => void;
}

export const WorkflowsSection: React.FC<WorkflowsSectionProps> = ({ onScrollToEstimator }) => {
  const benefits = [
    {
      icon: DollarSign,
      title: "60% - 70% Production Cost Reduction",
      description:
        "Eliminate the $85,000 - $110,000/year overhead of in-house full-time drafting staff, healthcare benefits, and costly Autodesk software workstation subscriptions. Pay only for the exact drawing sheets and BIM models you need.",
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

  const engagementModels = [
    {
      title: "Per-Project / Turnkey Fixed Price",
      bestFor: "Developers, Builders & Homeowners",
      description: "A single guaranteed fixed fee for the entire drawing set from schematic draft to final permit approval.",
      features: [
        "Fixed milestone-based pricing",
        "Includes 2 rounds of plan-check revisions",
        "Full native BIM, .DWG & Vector PDFs",
        "Guaranteed completion date",
      ],
      cta: "Calculate Project Fee",
    },
    {
      title: "Dedicated Monthly Remote Partner",
      bestFor: "Architectural Studios & Engineering Firms",
      description: "White-label drafting and BIM extension of your in-house team. Offload production backlog without hiring lag.",
      features: [
        "Dedicated weekly drafting bandwidth (20-40 hrs/wk)",
        "Use your studio's custom BIM templates & families",
        "Direct Slack / Teams communication",
        "Priority 24-hour turnaround queue",
      ],
      cta: "Inquire for Retainer",
      featured: true,
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
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

        {/* Engagement Models Comparison */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-neutral-100">
              Flexible Engagement Options
            </h3>
            <p className="text-xs text-neutral-400 mt-1">
              Choose the delivery model that aligns with your project schedule and office workload.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {engagementModels.map((model, i) => (
              <div
                key={i}
                className={`p-6 sm:p-8 rounded-2xl border flex flex-col justify-between transition-all ${
                  model.featured
                    ? "bg-neutral-900 border-amber-500/60 ring-1 ring-amber-500/20 shadow-xl shadow-amber-500/5 relative"
                    : "bg-neutral-900/60 border-neutral-800 hover:border-neutral-700"
                }`}
              >
                {model.featured && (
                  <div className="absolute -top-3 right-6 px-3 py-0.5 rounded-full bg-amber-500 text-neutral-950 text-[10px] font-extrabold uppercase tracking-wider">
                    Most Popular for Busy Firms
                  </div>
                )}

                <div>
                  <span className="text-[11px] font-mono text-amber-400 font-semibold uppercase">
                    {model.bestFor}
                  </span>
                  <h4 className="text-xl font-bold text-neutral-100 mt-1">
                    {model.title}
                  </h4>
                  <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
                    {model.description}
                  </p>

                  <div className="mt-6 pt-5 border-t border-neutral-800/80 space-y-2.5">
                    {model.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-center space-x-2 text-xs text-neutral-300">
                        <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-4">
                  <button
                    onClick={onScrollToEstimator}
                    className={`w-full py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                      model.featured
                        ? "bg-amber-500 hover:bg-amber-400 text-neutral-950 shadow-md shadow-amber-500/20"
                        : "bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700"
                    }`}
                  >
                    <span>{model.cta}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
