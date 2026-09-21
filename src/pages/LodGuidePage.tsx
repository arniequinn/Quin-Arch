import React from "react";
import { ArrowRight, CheckCircle2, MessageSquare, Printer, XCircle } from "lucide-react";
import { EmailCaptureForm } from "../components/EmailCaptureForm";
import { LOD_LEVELS } from "../data/architecturalData";
import { SpecialistProfile } from "../types";

interface LodGuidePageProps {
  specialist: SpecialistProfile;
}

export const LodGuidePage: React.FC<LodGuidePageProps> = ({ specialist }) => {
  const base = import.meta.env.BASE_URL;
  const waLink = (text: string) =>
    `https://wa.me/${specialist.whatsapp.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(text)}`;

  return (
    <main className="flex-1">
      {/* Breadcrumb */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 print-hide">
        <nav className="flex items-center space-x-2 text-xs text-neutral-500 font-mono" aria-label="Breadcrumb">
          <a href={base} className="hover:text-neutral-300 transition-colors">Home</a>
          <span>/</span>
          <a href={`${base}services/bim-cad-drafting/`} className="hover:text-neutral-300 transition-colors">BIM / CAD Drafting</a>
          <span>/</span>
          <span className="text-neutral-300">LOD Guide</span>
        </nav>
      </div>

      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 print-guide">
        <span className="text-[11px] font-mono text-amber-400/90 tracking-widest uppercase">
          Field Reference
        </span>
        <h1 className="font-display text-4xl sm:text-5xl font-bold text-neutral-100 tracking-tight leading-[1.08] mt-3">
          What LOD Actually Means
        </h1>
        <p className="mt-6 text-base text-neutral-400 leading-relaxed font-light">
          "LOD" gets thrown around loosely in BIM conversations — a scope note says "LOD 300" and
          it's not always clear what that promises versus what it doesn't. This is the plain-language
          version: what each level actually contains, what it's used for, and where a typical
          production scope stops.
        </p>

        {/* Email capture — bonus, not a gate: the content below is fully public either way */}
        <div className="mt-8 p-5 rounded-2xl bg-neutral-900/70 border border-neutral-800 print-hide">
          <p className="text-sm text-neutral-300 mb-3">
            Want this as a one-pager you can keep on hand? Send it to your inbox, or just print this
            page — the button below strips it down to a clean, ink-friendly copy.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:items-start">
            <EmailCaptureForm
              resource="the LOD cheat sheet"
              source="LOD Guide page"
              specialistEmail={specialist.email}
              className="flex-1"
            />
            <button
              type="button"
              onClick={() => window.print()}
              className="flex items-center justify-center space-x-2 px-5 py-2.5 rounded-lg border border-neutral-700 text-neutral-300 text-sm font-semibold hover:text-neutral-100 hover:border-neutral-500 transition-all cursor-pointer shrink-0"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save as PDF</span>
            </button>
          </div>
        </div>

        {/* The reference table itself */}
        <div className="mt-10 rounded-2xl border border-neutral-800 overflow-hidden">
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
              <div className="shrink-0 print-hide">
                {lod.included ? (
                  <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-semibold whitespace-nowrap">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Standard Scope</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-neutral-800/60 border border-neutral-700 text-neutral-500 text-[11px] font-semibold whitespace-nowrap">
                    <XCircle className="w-3.5 h-3.5" />
                    <span>By Request</span>
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Practical notes */}
        <div className="mt-10 space-y-6">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-amber-400 font-mono mb-2">
              Why It Matters Before You Scope a Project
            </h2>
            <p className="text-sm text-neutral-300 leading-relaxed">
              LOD is the one number in a proposal that tells you what you're actually going to
              receive. A "LOD 300" model and a "LOD 400" model can look identical in a rendered
              screenshot but mean very different things once a contractor or fabricator tries to
              build from them — 300 is precise enough for permit submission and coordination; 400
              is precise enough to hand directly to a manufacturer. Asking for the wrong one either
              overpays for detail nobody uses, or underdelivers what a downstream trade actually
              needs.
            </p>
          </div>
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-amber-400 font-mono mb-2">
              What a Standard Production Scope Covers
            </h2>
            <p className="text-sm text-neutral-300 leading-relaxed">
              Most permit-set and construction-documentation work sits at LOD 300–350: precise,
              coordinated geometry, ready for city submission and multi-trade clash checking. LOD
              400 (fabrication-ready shop detail) is available on request when a project genuinely
              needs it. LOD 500 (as-built/verified) is a facilities-management deliverable, produced
              after construction is complete — not part of a design-phase scope at all.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-14 pt-10 border-t border-neutral-900 text-center print-hide">
          <h2 className="font-display text-2xl font-bold text-neutral-100 tracking-tight">
            Scoping a Project and Not Sure What LOD You Need?
          </h2>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <a
              href={waLink(`Hi ${specialist.name}, I read the LOD guide and have a question about scoping my project.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 px-6 py-3.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Ask on WhatsApp</span>
            </a>
            <a
              href={`${base}#estimator`}
              className="flex items-center space-x-2 px-6 py-3.5 rounded border border-neutral-700 text-neutral-300 text-sm hover:text-neutral-100 hover:border-neutral-500 transition-all cursor-pointer"
            >
              <span>Open Scope Estimator</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </article>
    </main>
  );
};
