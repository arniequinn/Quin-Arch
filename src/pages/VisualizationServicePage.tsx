import React from "react";
import { ArrowRight, CheckCircle2, Mail, MessageSquare } from "lucide-react";
import { ProjectGallery } from "../components/ProjectGallery";
import { EstimateDisclaimer } from "../components/EstimateDisclaimer";
import { VisualizationPricing } from "../components/VisualizationPricing";
import { VISUALIZATION_SHOWCASE_IMAGES, EXTERIOR_SHOWCASE_IMAGES } from "../data/architecturalData";
import { SpecialistProfile } from "../types";

interface VisualizationServicePageProps {
  specialist: SpecialistProfile;
}

const PROCESS_STEPS = [
  {
    title: "Share your model or drawings",
    description:
      "Send an existing 3D BIM/Rhino model, CAD drawings, or even hand sketches — renders can be built from whichever source you already have.",
  },
  {
    title: "Material & lighting setup",
    description:
      "Real-world materials, fixtures, and lighting are set up in V-Ray, Lumion, or Twinmotion 4K to match the mood and context you're after.",
  },
  {
    title: "First-pass render for review",
    description:
      "A draft render comes back for your feedback before the final pass — camera angle, materials, or lighting can still shift at this stage.",
  },
  {
    title: "Revision & final delivery",
    description:
      "Final high-resolution renders are delivered in your requested format, ready for marketing, permit submission exhibits, or client presentations.",
  },
];

const FAQS = [
  {
    question: "Do you need a finished 3D model, or can you work from 2D drawings?",
    answer:
      "Either works. If a 3D BIM or Rhino model already exists it speeds things up, but renders are regularly built directly from 2D CAD drawings or even reference sketches when no 3D model exists yet.",
  },
  {
    question: "What's the difference between interior and exterior rendering pricing?",
    answer:
      "Interior and exterior renders are priced separately per square foot of the visualized area, since lighting and material setup differ significantly between the two — see the rate breakdown below or use the interactive estimator for an exact figure.",
  },
  {
    question: "What file formats are renders delivered in?",
    answer:
      "High-resolution JPG/PNG stills are standard; other formats (layered PSD, specific resolutions/aspect ratios for print or web) can be arranged case by case — mention it upfront when you reach out.",
  },
];

export const VisualizationServicePage: React.FC<VisualizationServicePageProps> = ({ specialist }) => {
  const waLink = (text: string) =>
    `https://wa.me/${specialist.whatsapp.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(text)}`;

  const inquiryText =
    `Hi ${specialist.name}, I found your Architectural Visualization service page and would like to discuss a rendering project.`;

  return (
    <main className="flex-1">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <nav className="flex items-center space-x-2 text-xs text-neutral-500 font-mono" aria-label="Breadcrumb">
          <a href={`${import.meta.env.BASE_URL}`} className="hover:text-neutral-300 transition-colors">Home</a>
          <span>/</span>
          <a href={`${import.meta.env.BASE_URL}services/`} className="hover:text-neutral-300 transition-colors">Services</a>
          <span>/</span>
          <span className="text-neutral-300">Architectural Visualization</span>
        </nav>
      </div>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-14">
        <span className="text-[11px] font-mono text-amber-400/90 tracking-widest uppercase">
          Architectural Visualization
        </span>
        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-neutral-100 tracking-tight leading-[1.08] mt-3">
          Photorealistic Rendering, Interior & Exterior
        </h1>
        <p className="mt-6 text-base sm:text-lg text-neutral-400 leading-relaxed max-w-2xl font-light">
          Interior and exterior architectural renders built in V-Ray, Lumion, and Twinmotion 4K —
          from existing BIM models, CAD drawings, or concept sketches — at a flat worldwide rate
          per square foot of visualized area.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <a
            href={waLink(inquiryText)}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center space-x-2 text-sm font-bold text-neutral-950 bg-amber-400 hover:bg-amber-300 px-6 py-3.5 rounded transition-all cursor-pointer shadow-md shadow-amber-500/20"
          >
            <span>Discuss a Rendering Project</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
          <a
            href="#rate-estimator"
            className="flex items-center space-x-2 px-6 py-3.5 rounded border border-neutral-700 text-neutral-300 text-sm hover:text-neutral-100 hover:border-neutral-500 transition-all cursor-pointer"
          >
            <span>Open Interactive Rate Estimator</span>
          </a>
        </div>
      </section>

      {/* Real work gallery */}
      <ProjectGallery
        id="gallery"
        groups={[
          { label: "Interior Visualization", images: VISUALIZATION_SHOWCASE_IMAGES },
          { label: "Exterior Visualization", images: EXTERIOR_SHOWCASE_IMAGES },
        ]}
      />

      {/* How it works */}
      <section className="py-16 bg-neutral-900/50 border-t border-neutral-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-neutral-100 tracking-tight mb-10">
            How a Render Gets Made
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

      {/* Software / capability */}
      <section className="py-16 bg-neutral-950 border-t border-neutral-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-neutral-100 tracking-tight mb-6">
            Software & Delivery
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              "V-Ray photorealistic rendering",
              "Lumion real-time visualization",
              "Twinmotion 4K output",
            ].map((item) => (
              <div key={item} className="flex items-center space-x-2 text-sm text-neutral-300">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing snapshot */}
      <section id="pricing" className="py-16 bg-neutral-900/50 border-t border-neutral-900">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-neutral-100 tracking-tight mb-6">
            Flat Worldwide Rate
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800">
              <span className="text-[11px] font-mono text-neutral-500 uppercase tracking-wider block">Interior</span>
              <span className="text-3xl font-extrabold font-mono text-neutral-100 block mt-1">$0.75</span>
              <span className="text-xs text-neutral-400">per sq ft of visualized area</span>
            </div>
            <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800">
              <span className="text-[11px] font-mono text-neutral-500 uppercase tracking-wider block">Exterior</span>
              <span className="text-3xl font-extrabold font-mono text-neutral-100 block mt-1">$1.75</span>
              <span className="text-xs text-neutral-400">per sq ft of visualized area</span>
            </div>
          </div>
          <p className="text-xs text-neutral-500 mt-4">
            Same rate for every client, anywhere in the world. For an exact figure based on your
            project's area, use the{" "}
            <a href="#rate-estimator" className="text-amber-400 hover:text-amber-300 transition-colors">
              interactive estimator
            </a>{" "}
            below.
          </p>
          <EstimateDisclaimer specialistFirstName={specialist.name.split(" ")[0]} className="mt-5" />
        </div>
      </section>

      {/* Interactive rate estimator (moved here from the homepage) */}
      <section id="rate-estimator" className="py-16 bg-neutral-900/50 border-t border-neutral-900 scroll-mt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <VisualizationPricing specialist={specialist} />
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-neutral-950 border-t border-neutral-900">
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
            Ready to Visualize Your Project?
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
              href={`mailto:${specialist.email}?subject=${encodeURIComponent("Visualization / Rendering Inquiry")}`}
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
