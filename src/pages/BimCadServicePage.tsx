import React from "react";
import {
  ArrowRight,
  CheckCircle2,
  FileCheck2,
  FileDown,
  Mail,
  MessageSquare,
} from "lucide-react";
import { ProjectGallery } from "../components/ProjectGallery";
import { EstimateDisclaimer } from "../components/EstimateDisclaimer";
import { BIMCAD_WORKFLOW_IMAGES, JURISDICTIONS, PORTFOLIO_SAMPLES } from "../data/architecturalData";
import { SpecialistProfile } from "../types";

interface BimCadServicePageProps {
  specialist: SpecialistProfile;
}

const INCLUDED = [
  "Virtual Design & Construction (VDC) — full remote production",
  "Construction documentation packages (IBC, IRC, Title 24, FBC)",
  "BIM federated models, LOD 100–400",
  "Parametric & computational design (Rhino + Grasshopper)",
  "MEP & structural clash detection (Navisworks Manage)",
  "Millwork / casework fabrication documentation",
];

const SOFTWARE = [
  "3D BIM Modeling (LOD 200–350)",
  "AutoCAD Architectural & Detailing",
  "Rhino 7 / Grasshopper Algorithmic",
  "Ladybug & Karamba 3D (Solar/Structural)",
  "Autodesk Navisworks (Clash Detection)",
  "Bluebeam Revu (Plan-Check QA/QC)",
];

const PROCESS_STEPS = [
  {
    title: "Share drawings or a starting model",
    description:
      "Send existing CAD drawings, a BIM/Rhino model, or a scanned plan-check redline set — production starts from whatever you already have.",
  },
  {
    title: "Scope & sheet count defined",
    description:
      "The Scope Estimator turns project type, phase, and complexity into a concrete sheet count and LOD target before any drafting begins.",
  },
  {
    title: "Production at the agreed LOD",
    description:
      "Drafting/modeling proceeds in your titleblock, layer standard, and pen weights — LOD 100 through 400, tagged sheet by sheet.",
  },
  {
    title: "Delivery & rapid redlines",
    description:
      "Sheets are delivered in native BIM, DWG, and vector PDF. Plan-check comments or structural markups are turned around in 24–48 hours.",
  },
];

const FAQS = [
  {
    question: "What LOD do you actually deliver?",
    answer:
      "Standard delivery covers LOD 100 through LOD 350 — precise, coordinated geometry ready for permit submission and multi-trade coordination. LOD 400 (fabrication-ready shop detail) is available on request; LOD 500 (as-built/verified) is outside current service scope.",
  },
  {
    question: "How fast are plan-check or structural redlines turned around?",
    answer:
      "24 to 48 hours for corrected sheets once scanned PDFs or a Bluebeam Studio session are shared — the goal is to prevent site or permit-cycle downtime while comments are outstanding.",
  },
  {
    question: "Do you work in my jurisdiction's code and CAD standard?",
    answer:
      "Drawings are produced to National CAD Standard / AIA layering and delivered against IBC, IRC, California Title 24, Florida FBC (high-velocity wind zone), NYC DOB, UK Building Regs, Canadian NBC, and Australian NCC — matched to your project's actual jurisdiction.",
  },
];

const PROOF_SAMPLE_IDS = ["sample-beach-house", "sample-cran-residence", "sample-urban-flats"];

const CASE_STUDY_SLUGS: Record<string, string> = {
  "sample-beach-house": "texas-coastal-beach-house",
  "sample-cran-residence": "cran-residence",
  "sample-urban-flats": "urban-multi-family-flats",
};

export const BimCadServicePage: React.FC<BimCadServicePageProps> = ({ specialist }) => {
  const waLink = (text: string) =>
    `https://wa.me/${specialist.whatsapp.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(text)}`;

  const inquiryText =
    `Hi ${specialist.name}, I found your BIM/CAD Drafting & Construction Documentation service page and would like to discuss a project.`;

  const proofSamples = PROOF_SAMPLE_IDS
    .map((id) => PORTFOLIO_SAMPLES.find((s) => s.id === id))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));

  return (
    <main className="flex-1">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <nav className="flex items-center space-x-2 text-xs text-neutral-500 font-mono" aria-label="Breadcrumb">
          <a href={`${import.meta.env.BASE_URL}`} className="hover:text-neutral-300 transition-colors">Home</a>
          <span>/</span>
          <a href={`${import.meta.env.BASE_URL}services/`} className="hover:text-neutral-300 transition-colors">Services</a>
          <span>/</span>
          <span className="text-neutral-300">BIM / CAD Drafting & Construction Documentation</span>
        </nav>
      </div>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-14">
        <span className="text-[11px] font-mono text-amber-400/90 tracking-widest uppercase">
          BIM / CAD Drafting & Construction Documentation
        </span>
        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-neutral-100 tracking-tight leading-[1.08] mt-3">
          Construction Documentation & BIM Production, LOD 100–400
        </h1>
        <p className="mt-6 text-base sm:text-lg text-neutral-400 leading-relaxed max-w-2xl font-light">
          Code-compliant permit drawing sets and federated BIM models delivered remotely — IBC,
          IRC, California Title 24, and Florida FBC jurisdictions — with 24–48 hour turnaround on
          plan-check redlines.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <a
            href={`${import.meta.env.BASE_URL}#estimator`}
            className="group flex items-center space-x-2 text-sm font-bold text-neutral-950 bg-amber-400 hover:bg-amber-300 px-6 py-3.5 rounded transition-all cursor-pointer shadow-md shadow-amber-500/20"
          >
            <span>Open Scope Estimator</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
          <a
            href="#gallery"
            className="flex items-center space-x-2 px-6 py-3.5 rounded border border-neutral-700 text-neutral-300 text-sm hover:text-neutral-100 hover:border-neutral-500 transition-all cursor-pointer"
          >
            <span>View Production Screenshots</span>
          </a>
        </div>
      </section>

      {/* Real production screenshots */}
      <ProjectGallery
        id="gallery"
        groups={[{ label: "BIM / CAD Workflow", images: BIMCAD_WORKFLOW_IMAGES }]}
      />

      {/* What's included */}
      <section className="py-16 bg-neutral-900/50 border-t border-neutral-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-neutral-100 tracking-tight mb-6">
            What's Included
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {INCLUDED.map((item) => (
              <div key={item} className="flex items-start space-x-2 text-sm text-neutral-300">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-16 bg-neutral-950 border-t border-neutral-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-neutral-100 tracking-tight mb-10">
            How a Drawing Set Gets Made
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {PROCESS_STEPS.map((step, idx) => (
              <div key={step.title} className="flex items-start space-x-4">
                <span className="font-display text-2xl font-bold text-amber-400/80 shrink-0 w-8">
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="text-sm font-bold text-neutral-100">{step.title}</h3>
                  <p className="text-xs text-neutral-400 mt-1.5 leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LOD guide cross-link */}
      <section className="py-10 bg-neutral-950 border-t border-neutral-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <a
            href={`${import.meta.env.BASE_URL}guides/lod-guide/`}
            className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-neutral-900/70 border border-neutral-800 hover:border-amber-500/40 transition-all"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
                <FileDown className="w-4.5 h-4.5" />
              </div>
              <div>
                <span className="text-sm font-bold text-neutral-100 block">
                  Not sure what LOD you need?
                </span>
                <span className="text-xs text-neutral-400">
                  Read the plain-language field guide to LOD 100–500, or get it sent to your inbox.
                </span>
              </div>
            </div>
            <span className="flex items-center space-x-1.5 text-xs font-semibold text-amber-400 group-hover:text-amber-300 transition-colors shrink-0">
              <span>Open the LOD guide</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </a>
        </div>
      </section>

      {/* Jurisdictions */}
      <section className="py-16 bg-neutral-900/50 border-t border-neutral-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-neutral-100 tracking-tight mb-6">
            Jurisdictions & Code Compliance
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {JURISDICTIONS.map((j) => (
              <div key={j.id} className="p-3.5 rounded-xl bg-neutral-900 border border-neutral-800">
                <span className="text-sm text-neutral-200 font-medium block">{j.name}</span>
                <span className="text-[11px] text-neutral-500 font-mono">{j.standard}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Software */}
      <section className="py-16 bg-neutral-950 border-t border-neutral-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-neutral-100 tracking-tight mb-6">
            Software & Standards
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {SOFTWARE.map((item) => (
              <div key={item} className="flex items-center space-x-2 text-sm text-neutral-300">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Proof: real client work */}
      <section className="py-16 bg-neutral-900/50 border-t border-neutral-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-neutral-100 tracking-tight mb-8">
            Recent Production Work
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {proofSamples.map((sample) => (
              <a
                key={sample.id}
                href={`${import.meta.env.BASE_URL}case-studies/${CASE_STUDY_SLUGS[sample.id]}/`}
                className="group rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-amber-500/50 overflow-hidden flex flex-col transition-all"
              >
                <div className="relative h-44 overflow-hidden bg-neutral-950">
                  <img src={sample.imageUrl} alt={sample.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-neutral-100 group-hover:text-amber-400 transition-colors">{sample.title}</h3>
                    <p className="text-xs text-neutral-400 mt-1.5 leading-relaxed">{sample.sheetDetails}</p>
                  </div>
                </div>
              </a>
            ))}
          </div>
          <div className="mt-8 text-center">
            <a
              href={`${import.meta.env.BASE_URL}projects/#deliverables`}
              className="inline-flex items-center space-x-1.5 text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors"
            >
              <FileCheck2 className="w-3.5 h-3.5" />
              <span>View the full deliverables gallery</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-16 bg-neutral-950 border-t border-neutral-900">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-neutral-100 tracking-tight mb-4">
            How Pricing Works
          </h2>
          <p className="text-sm text-neutral-400 leading-relaxed">
            Unlike the flat per-square-foot rate on visualization, BIM/CAD production is priced by
            deliverable scope — project type, phase, sheet count, and complexity — not a single
            number that fits every project. The Scope Estimator below turns those inputs into a
            concrete sheet count and turnaround estimate in real time, with the exact fee worked
            out afterward based on your specific scope.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <a
              href={`${import.meta.env.BASE_URL}#estimator`}
              className="inline-flex items-center space-x-2 text-sm font-bold text-neutral-950 bg-amber-400 hover:bg-amber-300 px-6 py-3.5 rounded transition-all cursor-pointer shadow-md shadow-amber-500/20"
            >
              <span>Open Scope Estimator</span>
              <ArrowRight className="w-4 h-4" />
            </a>
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
            Ready to Scope Your Drawing Set?
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
              href={`mailto:${specialist.email}?subject=${encodeURIComponent("BIM/CAD Drafting Inquiry")}`}
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
