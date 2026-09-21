import React from "react";
import { Info, CheckCircle2, XCircle } from "lucide-react";

const LOD_LEVELS = [
  {
    level: "LOD 100",
    name: "Conceptual",
    description: "Overall building massing — approximate volume, area, height, and orientation. Used for early feasibility and massing studies.",
    included: true,
  },
  {
    level: "LOD 200",
    name: "Approximate Geometry",
    description: "Generalized systems and assemblies with approximate quantity, size, shape, and location. Suitable for early design coordination.",
    included: true,
  },
  {
    level: "LOD 300",
    name: "Precise Geometry",
    description: "Accurate quantity, size, shape, and location — the standard level for construction documents and permit submission.",
    included: true,
  },
  {
    level: "LOD 350",
    name: "Coordination-Ready",
    description: "Precise geometry plus interfaces with other building systems (structural, MEP), enabling clash detection and multi-trade coordination.",
    included: true,
  },
  {
    level: "LOD 400",
    name: "Fabrication-Ready",
    description: "Complete fabrication, assembly, and installation detail — precise enough for a manufacturer to build directly from the model.",
    included: false,
  },
  {
    level: "LOD 500",
    name: "As-Built / Verified",
    description: "Field-verified model matching the completed, constructed building — used for facility maintenance and operations.",
    included: false,
  },
];

export const LODGuide: React.FC = () => {
  return (
    <section id="lod-guide" className="py-16 bg-neutral-950 border-t border-neutral-900 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold mb-3">
            <Info className="w-3.5 h-3.5" />
            <span>Understanding BIM Deliverables</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-neutral-100 tracking-tight">
            What is LOD (Level of Development)?
          </h2>
          <p className="mt-3 text-sm text-neutral-400 leading-relaxed">
            LOD is the industry-standard scale (AIA / BIMForum) describing how much geometric detail and
            reliable information a BIM model carries at a given stage. Every sheet in your scope estimate
            above is tagged with its LOD, so you always know exactly what you're getting.
          </p>
        </div>

        <div className="rounded-2xl border border-neutral-800 overflow-hidden">
          {LOD_LEVELS.map((lod, idx) => (
            <div
              key={lod.level}
              className={`flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 p-5 ${
                idx !== LOD_LEVELS.length - 1 ? "border-b border-neutral-800" : ""
              } ${lod.included ? "bg-neutral-900/60" : "bg-neutral-950/80"}`}
            >
              <div className="flex items-center gap-3 sm:w-32 shrink-0">
                <span className={`font-mono font-bold text-sm ${lod.included ? "text-amber-400" : "text-neutral-600"}`}>
                  {lod.level}
                </span>
              </div>
              <div className="flex-1">
                <span className={`text-sm font-semibold block ${lod.included ? "text-neutral-100" : "text-neutral-500"}`}>
                  {lod.name}
                </span>
                <p className={`text-xs mt-0.5 leading-relaxed ${lod.included ? "text-neutral-400" : "text-neutral-600"}`}>
                  {lod.description}
                </p>
              </div>
              <div className="shrink-0">
                {lod.included ? (
                  <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-semibold whitespace-nowrap">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Included</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-neutral-800/60 border border-neutral-700 text-neutral-500 text-[11px] font-semibold whitespace-nowrap">
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Not Provided</span>
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-neutral-300 leading-relaxed">
          <span className="font-semibold text-amber-300">Standard delivery covers LOD 100 through LOD 350</span> —
          precise, coordinated geometry ready for permit submission and multi-trade coordination. LOD 400
          (fabrication-ready shop detail) and LOD 500 (as-built/verified) modeling are outside current
          service scope.
        </div>
      </div>
    </section>
  );
};
