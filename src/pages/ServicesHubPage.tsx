import React from "react";
import { ArrowRight, Image as ImageIcon, Layers, UserCheck } from "lucide-react";

interface ServiceCard {
  icon: React.ElementType;
  title: string;
  description: string;
  href: string;
  cta: string;
}

export const ServicesHubPage: React.FC = () => {
  const base = import.meta.env.BASE_URL;

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
      href: `${base}#consultancy`,
      cta: "View Pricing",
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
