import React from "react";
import {
  ArrowRight,
  CheckCircle2,
  GraduationCap,
  Mail,
  MessageSquare,
} from "lucide-react";
import { EstimateDisclaimer } from "../components/EstimateDisclaimer";
import { MARKET_BENCHMARK_RATES, OFFERED_RATES, TARGET_MARKETS } from "../data/architecturalData";
import { SpecialistProfile } from "../types";

interface ConsultancyServicePageProps {
  specialist: SpecialistProfile;
}

const COVERS = [
  "Design review & second-opinion sign-off before a scheme goes to production",
  "Code-compliance strategy — a jurisdiction pre-check before drafting begins, not after",
  "Client-facing technical coordination, acting as an embedded advisor in project meetings",
  "Parametric / computational design strategy (Rhino + Grasshopper workflow planning)",
  "Structural & MEP coordination oversight ahead of formal clash detection",
  "Plan-check response strategy for contested or unusual review comments",
];

const WHO_ITS_FOR = [
  {
    title: "Architecture studios",
    description: "Overflow senior judgment on a specific design question, without hiring for it.",
  },
  {
    title: "Contractors & builders",
    description: "A code-compliance sanity check before committing to a full drafting engagement.",
  },
  {
    title: "Developers",
    description: "Independent technical review of a design or consultant's work before signing off.",
  },
];

const FAQS = [
  {
    question: "How is this different from BIM/CAD drafting hours?",
    answer:
      "Consulting is advisory time — review, strategy, and judgment calls — billed separately from drafting/modeling production hours. It doesn't produce drawing sheets itself, though it often shapes what those sheets should say.",
  },
  {
    question: "Can consulting hours turn into a full production engagement later?",
    answer:
      "Yes — a common path is a short consulting block to validate direction and scope, followed by a fixed-price or retainer BIM/CAD engagement once the approach is confirmed.",
  },
  {
    question: "How do sessions actually happen?",
    answer:
      "Whatever fits the project — video calls, async written review over email or Bluebeam markups, or direct coordination in your team's Slack/Teams channel.",
  },
];

export const ConsultancyServicePage: React.FC<ConsultancyServicePageProps> = ({ specialist }) => {
  const waLink = (text: string) =>
    `https://wa.me/${specialist.whatsapp.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(text)}`;

  const inquiryText =
    `Hi ${specialist.name}, I found your Architect Consultant service page and would like to discuss a consulting engagement.`;

  return (
    <main className="flex-1">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <nav className="flex items-center space-x-2 text-xs text-neutral-500 font-mono" aria-label="Breadcrumb">
          <a href={`${import.meta.env.BASE_URL}`} className="hover:text-neutral-300 transition-colors">Home</a>
          <span>/</span>
          <a href={`${import.meta.env.BASE_URL}services/`} className="hover:text-neutral-300 transition-colors">Services</a>
          <span>/</span>
          <span className="text-neutral-300">Architect Consultant</span>
        </nav>
      </div>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-14">
        <span className="text-[11px] font-mono text-amber-400/90 tracking-widest uppercase">
          Architect Consultant
        </span>
        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-neutral-100 tracking-tight leading-[1.08] mt-3">
          Hourly Design & Strategy Consulting
        </h1>
        <p className="mt-6 text-base sm:text-lg text-neutral-400 leading-relaxed max-w-2xl font-light">
          Design review, code strategy, and client-facing coordination — senior architect
          judgment billed hourly, separate from drafting production, at a flat rate worldwide.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <a
            href={waLink(inquiryText)}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center space-x-2 text-sm font-bold text-neutral-950 bg-amber-400 hover:bg-amber-300 px-6 py-3.5 rounded transition-all cursor-pointer shadow-md shadow-amber-500/20"
          >
            <span>Discuss a Consulting Engagement</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
          <a
            href={`${import.meta.env.BASE_URL}#consultancy`}
            className="flex items-center space-x-2 px-6 py-3.5 rounded border border-neutral-700 text-neutral-300 text-sm hover:text-neutral-100 hover:border-neutral-500 transition-all cursor-pointer"
          >
            <span>Open Interactive Rate Estimator</span>
          </a>
        </div>
      </section>

      {/* What this covers */}
      <section className="py-16 bg-neutral-900/50 border-t border-neutral-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-neutral-100 tracking-tight mb-6">
            What This Covers
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {COVERS.map((item) => (
              <div key={item} className="flex items-start space-x-2 text-sm text-neutral-300">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who it's for */}
      <section className="py-16 bg-neutral-950 border-t border-neutral-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-neutral-100 tracking-tight mb-10">
            Who It's For
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {WHO_ITS_FOR.map((item) => (
              <div key={item.title}>
                <h3 className="text-sm font-bold text-neutral-100">{item.title}</h3>
                <p className="text-xs text-neutral-400 mt-1.5 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Credentials */}
      <section className="py-16 bg-neutral-900/50 border-t border-neutral-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-neutral-100 tracking-tight mb-6">
            Why the Judgment Call Is Worth Paying For
          </h2>
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
              <GraduationCap className="w-5 h-5" />
            </div>
            <p className="text-sm text-neutral-300 leading-relaxed max-w-2xl">
              {specialist.education}. {specialist.yearsExperience}+ years of independent remote
              consulting and firm coordination across residential, commercial, and hospitality
              sectors, with {specialist.completedProjectsCount}+ projects delivered — the same
              background behind the BIM/CAD and visualization tracks, applied to a specific
              question instead of a full production engagement.
            </p>
          </div>
        </div>
      </section>

      {/* Rate comparison */}
      <section id="pricing" className="py-16 bg-neutral-950 border-t border-neutral-900">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-neutral-100 tracking-tight mb-2">
            Flat Worldwide Rate
          </h2>
          <p className="text-sm text-neutral-400 mb-6">
            ${OFFERED_RATES.consultantHourly}/hr for every client, anywhere in the world —
            researched against real market benchmarks below.
          </p>

          <div className="rounded-2xl border border-neutral-800 overflow-hidden">
            <div className="grid grid-cols-2 gap-3 p-4 bg-neutral-900 border-b border-neutral-800 text-[11px] font-mono uppercase tracking-wider text-neutral-500">
              <span>Market</span>
              <span className="text-right">Typical hourly rate</span>
            </div>
            {TARGET_MARKETS.map((m) => (
              <div key={m.id} className="grid grid-cols-2 gap-3 p-4 border-b border-neutral-800/60 last:border-b-0 bg-neutral-900/60">
                <span className="text-sm text-neutral-200">{m.name}</span>
                <span className="text-sm text-neutral-400 font-mono text-right">
                  ${MARKET_BENCHMARK_RATES[m.id]?.consultantHourly}/hr
                </span>
              </div>
            ))}
            <div className="grid grid-cols-2 gap-3 p-4 bg-amber-500/10 border-t border-amber-500/30">
              <span className="text-sm text-amber-300 font-semibold">This rate, worldwide</span>
              <span className="text-sm text-amber-400 font-mono font-bold text-right">
                ${OFFERED_RATES.consultantHourly}/hr
              </span>
            </div>
          </div>

          <EstimateDisclaimer specialistFirstName={specialist.name.split(" ")[0]} className="mt-6" />
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-neutral-900/50 border-t border-neutral-900">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-neutral-100 tracking-tight mb-8">
            Common Questions
          </h2>
          <div className="space-y-6">
            {FAQS.map((faq) => (
              <div key={faq.question}>
                <h3 className="text-sm font-bold text-neutral-100">{faq.question}</h3>
                <p className="text-sm text-neutral-400 mt-1.5 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 border-t border-neutral-900">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-neutral-100 tracking-tight">
            Have a Design or Code Question Worth a Second Opinion?
          </h2>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href={waLink(inquiryText)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 px-6 py-3.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp</span>
            </a>
            <a
              href={`mailto:${specialist.email}?subject=${encodeURIComponent("Architect Consultant Hours Inquiry")}`}
              className="flex items-center space-x-2 px-6 py-3.5 rounded border border-neutral-700 text-neutral-300 text-sm hover:text-neutral-100 hover:border-neutral-500 transition-all cursor-pointer"
            >
              <Mail className="w-4 h-4 text-amber-400/70" />
              <span>Email</span>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
};
