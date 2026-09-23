import React from "react";
import { ArrowRight, Eye, FileCheck2, MessageSquare, Ruler, UserCheck } from "lucide-react";
import { Reveal } from "../components/Reveal";
import { WorkflowsSection } from "../components/WorkflowsSection";
import { SpecialistProfile } from "../types";

interface WhyWorkWithUsPageProps {
  specialist: SpecialistProfile;
}

const HOMEOWNER_POINTS = [
  {
    icon: UserCheck,
    title: "One architect, start to finish",
    body: "You talk directly to the principal architect who does the work — no account managers, no hand-offs between a salesperson and a drafter.",
  },
  {
    icon: Eye,
    title: "See it before it is built",
    body: "Photorealistic interior and exterior visualization, built from your drawings, model or sketches, so decisions get made on screen instead of on site.",
  },
  {
    icon: FileCheck2,
    title: "Permit-ready drawings",
    body: "Code-compliant construction documents for IBC / IRC / CBC jurisdictions, laid out the way your city's plan checkers expect to receive them.",
  },
  {
    icon: Ruler,
    title: "A clear scope before you commit",
    body: "The Scope Estimator shows what is included and what it costs before anything starts. One flat rate for every client, anywhere in the world.",
  },
];

export const WhyWorkWithUsPage: React.FC<WhyWorkWithUsPageProps> = ({ specialist }) => {
  const base = import.meta.env.BASE_URL;
  const waHref = (text: string) =>
    `https://wa.me/${specialist.whatsapp.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(text)}`;

  return (
    <main className="flex-1">
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-14">
        <nav className="flex items-center space-x-2 text-xs text-neutral-500 font-mono" aria-label="Breadcrumb">
          <a href={base} className="hover:text-neutral-300 transition-colors">Home</a>
          <span>/</span>
          <span className="text-neutral-300">Why Work With Us</span>
        </nav>
        <h1 className="font-display text-4xl sm:text-6xl font-bold text-neutral-100 tracking-tight leading-[1.05] mt-8">
          Principal-level architecture, <span className="text-amber-400">delivered remotely.</span>
        </h1>
        <p className="mt-6 max-w-2xl text-base sm:text-lg text-neutral-400 leading-relaxed font-light">
          Whether you are planning a single build or running a firm with more work than hands, the
          same principle applies: senior judgment applied to every sheet and every model. Pick the
          case that fits you.
        </p>
        <div className="mt-8 flex flex-wrap gap-3 text-sm">
          <a href="#homeowners" className="px-5 py-2.5 rounded border border-neutral-700 text-neutral-300 hover:text-neutral-100 hover:border-neutral-500 transition-all">
            I am planning a home or project
          </a>
          <a href="#firms" className="px-5 py-2.5 rounded border border-neutral-700 text-neutral-300 hover:text-neutral-100 hover:border-neutral-500 transition-all">
            I run a firm or contracting business
          </a>
        </div>
      </section>

      {/* Case 1: individual homeowners / clients */}
      <section id="homeowners" className="border-t border-neutral-900 py-16 sm:py-20 scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <span className="text-[11px] font-mono text-amber-400 tracking-widest uppercase">
              For homeowners and individual clients
            </span>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl font-extrabold text-neutral-100 tracking-tight max-w-2xl">
              A building designed around how you actually live.
            </h2>
            <p className="mt-4 max-w-2xl text-sm text-neutral-400 leading-relaxed">
              Building or renovating is a big decision and a lot of paperwork. You get one accountable
              architect who handles the design thinking and the technical documentation together.
            </p>
          </Reveal>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
            {HOMEOWNER_POINTS.map(({ icon: Icon, title, body }) => (
              <Reveal key={title}>
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-neutral-100">{title}</h3>
                    <p className="text-sm text-neutral-400 mt-2 leading-relaxed">{body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href={`${base}#estimator`}
              className="group flex items-center space-x-2 text-sm font-bold text-neutral-950 bg-amber-400 hover:bg-amber-300 px-6 py-3.5 rounded transition-all"
            >
              <span>Start a Project</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href={waHref(`Hi ${specialist.name}, I am planning a project and would like to talk it through.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 px-6 py-3.5 rounded border border-neutral-700 text-neutral-300 text-sm hover:text-neutral-100 hover:border-neutral-500 transition-all"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Talk it through on WhatsApp</span>
            </a>
            <a
              href={`${base}design-philosophy/`}
              className="text-xs text-amber-400 hover:text-amber-300 transition-colors"
            >
              Read the thinking behind the work →
            </a>
          </div>
        </div>
      </section>

      {/* Case 2: collective firms — the existing outsourcing section, unchanged */}
      <div id="firms" className="scroll-mt-16">
        <WorkflowsSection />
      </div>
    </main>
  );
};
