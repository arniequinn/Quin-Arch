import React from "react";
import { ArrowRight, Download, ExternalLink, FileCheck2, Mail, MessageSquare, ShieldCheck, Star } from "lucide-react";
import { PortfolioItem, SpecialistProfile } from "../types";

interface CaseStudyPageProps {
  sample: PortfolioItem;
  specialist: SpecialistProfile;
  breadcrumbLabel: string;
}

export const CaseStudyPage: React.FC<CaseStudyPageProps> = ({ sample, specialist, breadcrumbLabel }) => {
  const base = import.meta.env.BASE_URL;
  const waLink = (text: string) =>
    `https://wa.me/${specialist.whatsapp.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(text)}`;

  const inquiryText =
    `Hi ${specialist.name}, I read the "${sample.title}" case study and would like to discuss a similar project.`;

  return (
    <main className="flex-1">
      {/* Breadcrumb */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <nav className="flex items-center flex-wrap gap-x-2 gap-y-1 text-xs text-neutral-500 font-mono" aria-label="Breadcrumb">
          <a href={base} className="hover:text-neutral-300 transition-colors">Home</a>
          <span>/</span>
          <a href={`${base}case-studies/`} className="hover:text-neutral-300 transition-colors">Case Studies</a>
          <span>/</span>
          <span className="text-neutral-300">{breadcrumbLabel}</span>
        </nav>
      </div>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-10">
        <span className="text-[11px] font-mono text-amber-400/90 tracking-widest uppercase">
          {sample.category}
        </span>
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-100 tracking-tight leading-[1.1] mt-3">
          {sample.title}
        </h1>
        <p className="mt-5 text-base text-neutral-400 leading-relaxed max-w-2xl font-light">
          {sample.description}
        </p>
      </section>

      {/* Hero image */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative w-full h-64 sm:h-96 rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-950">
          <img src={sample.imageUrl} alt={sample.title} className="w-full h-full object-cover" />
          {sample.isRealClientWork && (
            <span className="absolute top-4 left-4 px-2.5 py-1 rounded-md bg-emerald-950/80 backdrop-blur-md border border-emerald-500/40 text-[11px] font-mono text-emerald-400 font-semibold flex items-center space-x-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verified Client Work</span>
            </span>
          )}
        </div>
      </div>

      {/* Body: specs sidebar + narrative */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Narrative */}
          <div className="lg:col-span-8 space-y-10">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-amber-400 font-mono mb-3">
                The Scope
              </h2>
              <p className="text-sm text-neutral-300 leading-relaxed">
                {sample.description}
              </p>
            </div>

            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-amber-400 font-mono mb-3">
                Deliverables
              </h2>
              <p className="text-sm text-neutral-300 leading-relaxed">
                {sample.sheetDetails}. Produced in {sample.software.join(", ")}.
              </p>
            </div>

            {sample.clientReview && (
              <div className="p-5 rounded-xl bg-neutral-900 border border-neutral-800">
                <div className="flex items-center space-x-1.5 text-amber-400 mb-2">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span className="text-xs font-bold text-neutral-300 uppercase tracking-wide">
                    {sample.clientReview.platform} Client Review
                  </span>
                </div>
                <p className="text-sm text-neutral-200 italic leading-relaxed">
                  "{sample.clientReview.quote}"
                </p>
              </div>
            )}

            <div className="flex flex-wrap gap-2 pt-2">
              {sample.tags.map((tag) => (
                <span key={tag} className="px-2.5 py-1 rounded bg-neutral-900 border border-neutral-800 text-[11px] font-mono text-neutral-400">
                  {tag}
                </span>
              ))}
            </div>

            {sample.pdfUrl && (
              <a
                href={sample.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-sm text-amber-300 font-medium transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Open Drawing Set (PDF)</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-70" />
              </a>
            )}
          </div>

          {/* Specs sidebar */}
          <div className="lg:col-span-4">
            <div className="p-5 rounded-2xl bg-neutral-900/70 border border-neutral-800 space-y-4 sticky top-24">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 font-mono">
                Project Specs
              </h3>
              <div className="space-y-3">
                {sample.specs.map((spec) => (
                  <div key={spec.label} className="pb-3 border-b border-neutral-800/80 last:border-b-0 last:pb-0">
                    <span className="text-[11px] text-neutral-500 block">{spec.label}</span>
                    <span className="text-sm text-neutral-200 font-medium">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 border-t border-neutral-900">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-neutral-100 tracking-tight">
            Have a Similar Project in Mind?
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
              href={`mailto:${specialist.email}?subject=${encodeURIComponent(`Re: ${sample.title} — Similar Project`)}`}
              className="flex items-center space-x-2 px-6 py-3.5 rounded border border-neutral-700 text-neutral-300 text-sm hover:text-neutral-100 hover:border-neutral-500 transition-all cursor-pointer"
            >
              <Mail className="w-4 h-4 text-amber-400/70" />
              <span>Email</span>
            </a>
          </div>
          <div className="mt-6">
            <a
              href={`${base}case-studies/`}
              className="inline-flex items-center space-x-1.5 text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors"
            >
              <FileCheck2 className="w-3.5 h-3.5" />
              <span>View all case studies</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </section>
    </main>
  );
};
