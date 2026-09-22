import React from "react";
import { ArrowRight, CheckCircle2, Image as ImageIcon, Layers, UserCheck } from "lucide-react";

interface ServiceCard {
  icon: React.ElementType;
  title: string;
  description: string;
  href: string;
  cta: string;
}

interface EngagementModel {
  title: string;
  bestFor: string;
  description: string;
  features: string[];
  cta: string;
  featured?: boolean;
}

export const ServicesHubPage: React.FC = () => {
  const base = import.meta.env.BASE_URL;

  const engagementModels: EngagementModel[] = [
    {
      title: "Per-Project / Turnkey Fixed Price",
      bestFor: "Developers & Builders",
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

  const services: ServiceCard[] = [
    {
      icon: Layers,
      title: "BIM / CAD Drafting & Construction Documentation",
      description:
        "3D BIM modeling (LOD 100–400), parametric coordination, and full municipal permit drawing sets across IBC / IRC / CBC jurisdictions.",
      href: `${base}services/bim-cad-drafting/`,
      cta: "View Service Details",
    },
    {
      icon: ImageIcon,
      title: "Architectural Visualization",
      description:
        "Photorealistic interior and exterior renders in V-Ray, Lumion, and Twinmotion 4K — built from an existing model, CAD drawings, or sketches.",
      href: `${base}services/visualization/`,
      cta: "View Service Details",
    },
    {
      icon: UserCheck,
      title: "Architect Consultant",
      description:
        "Design coordination, code-compliance review, and computational/parametric consulting for studios and contractors who need a second set of expert eyes.",
      href: `${base}services/consultancy/`,
      cta: "View Service Details",
    },
  ];

  return (
    <main className="flex-1">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <nav className="flex items-center space-x-2 text-xs text-neutral-500 font-mono" aria-label="Breadcrumb">
          <a href={base} className="hover:text-neutral-300 transition-colors">Home</a>
          <span>/</span>
          <span className="text-neutral-300">Services</span>
        </nav>
      </div>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-14">
        <span className="text-[11px] font-mono text-amber-400/90 tracking-widest uppercase">
          Services
        </span>
        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-neutral-100 tracking-tight leading-[1.08] mt-3">
          Three Ways to Work Together
        </h1>
        <p className="mt-6 text-base sm:text-lg text-neutral-400 leading-relaxed max-w-2xl font-light">
          Remote BIM/CAD production, architectural visualization, and architect-consultant
          coordination — each billed separately, each at a flat worldwide rate, each delivered by
          a principal architect rather than a production queue.
        </p>
      </section>

      {/* Service cards */}
      <section className="pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <a
                key={service.title}
                href={service.href}
                className="group p-6 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h2 className="text-base font-bold text-neutral-100">
                    {service.title}
                  </h2>
                  <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
                    {service.description}
                  </p>
                </div>
                <div className="mt-6 flex items-center space-x-1.5 text-xs font-semibold text-amber-400 group-hover:text-amber-300 transition-colors">
                  <span>{service.cta}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </a>
            );
          })}
        </div>
      </section>

      {/* Engagement models: fixed-price vs. dedicated retainer */}
      <section className="py-16 border-t border-neutral-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <span className="text-[11px] font-mono text-amber-400/90 tracking-widest uppercase">
              How You Engage
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-neutral-100 tracking-tight mt-2">
              Fixed Price or Dedicated Retainer
            </h2>
            <p className="mt-3 text-sm text-neutral-400 leading-relaxed max-w-xl mx-auto">
              Choose the delivery model that aligns with your project schedule and office
              workload — both apply across BIM/CAD, visualization, and consultancy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {engagementModels.map((model) => (
              <div
                key={model.title}
                className={`p-6 sm:p-8 rounded-2xl border flex flex-col justify-between transition-all ${
                  model.featured
                    ? "bg-neutral-900 border-amber-500/60 ring-1 ring-amber-500/20"
                    : "bg-neutral-900/60 border-neutral-800 hover:border-neutral-700"
                }`}
              >
                <div>
                  <span className="text-[11px] font-mono text-amber-400 font-semibold uppercase">
                    {model.bestFor}
                  </span>
                  <h3 className="text-xl font-bold text-neutral-100 mt-1">
                    {model.title}
                  </h3>
                  <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
                    {model.description}
                  </p>

                  <div className="mt-6 pt-5 border-t border-neutral-800/80 space-y-2.5">
                    {model.features.map((feat) => (
                      <div key={feat} className="flex items-center space-x-2 text-xs text-neutral-300">
                        <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-4">
                  <a
                    href={`${base}#estimator`}
                    className={`w-full py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                      model.featured
                        ? "bg-amber-500 hover:bg-amber-400 text-neutral-950"
                        : "bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700"
                    }`}
                  >
                    <span>{model.cta}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 border-t border-neutral-900">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-neutral-100 tracking-tight">
            Not Sure Which Track Fits Your Project?
          </h2>
          <p className="mt-3 text-sm text-neutral-400">
            The Scope Estimator walks through your project type and area, then recommends a track.
          </p>
          <div className="mt-8">
            <a
              href={`${base}#estimator`}
              className="inline-flex items-center space-x-2 text-sm font-bold text-neutral-950 bg-amber-400 hover:bg-amber-300 px-6 py-3.5 rounded transition-all cursor-pointer shadow-md shadow-amber-500/20"
            >
              <span>Open Scope Estimator</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>
    </main>
  );
};
