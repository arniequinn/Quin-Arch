import React, { useEffect, useState } from "react";
import {
  Compass,
  ArrowRight,
  MessageSquare,
  Mail,
  Linkedin
} from "lucide-react";
import { Navbar } from "./components/Navbar";
import { HeroBackgroundVideo } from "./components/HeroBackgroundVideo";
import { ScopeEstimator } from "./components/ScopeEstimator";
import { LODGuide } from "./components/LODGuide";
import { CombinedPricingSection } from "./components/CombinedPricingSection";
import { ProjectGallery } from "./components/ProjectGallery";
import { DeliverablesGallery } from "./components/DeliverablesGallery";
import { WorkflowsSection } from "./components/WorkflowsSection";
import { SpecialistProfileCard } from "./components/SpecialistProfileCard";
import { SpecialistDataModal } from "./components/SpecialistDataModal";
import { DEFAULT_SPECIALIST_PROFILE, BIMCAD_WORKFLOW_IMAGES, VISUALIZATION_SHOWCASE_IMAGES, EXTERIOR_SHOWCASE_IMAGES } from "./data/architecturalData";
import { SpecialistProfile } from "./types";
import { isOwnerAuthorized } from "./services/ownerAuth";

export default function App() {
  // Specialist Profile state (persisted locally in this browser only)
  const [specialist, setSpecialist] = useState<SpecialistProfile>(() => {
    const saved = localStorage.getItem("archscope_specialist_profile_v4");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_SPECIALIST_PROFILE,
          ...parsed,
          phone: "+92 322 4316477",
          whatsapp: "+923224316477",
          socials: {
            ...DEFAULT_SPECIALIST_PROFILE.socials,
            ...(parsed.socials || {}),
            linkedin: parsed.socials?.linkedin || DEFAULT_SPECIALIST_PROFILE.socials.linkedin
          }
        };
      } catch (e) {
        console.error("Failed to parse saved specialist profile:", e);
      }
    }
    return DEFAULT_SPECIALIST_PROFILE;
  });

  const [isSpecialistEditorOpen, setIsSpecialistEditorOpen] = useState(false);

  // Update specialist profile (restricted to the owner's passkey-unlocked browser session)
  const handleSaveSpecialistProfile = (updated: SpecialistProfile) => {
    if (!isOwnerAuthorized()) {
      console.warn("Unauthorized attempt to update specialist profile blocked.");
      return;
    }
    setSpecialist(updated);
    localStorage.setItem("archscope_specialist_profile_v4", JSON.stringify(updated));
  };

  // Owner-only entry point for the profile editor — deliberately absent from all public chrome
  // (nav, footer, profile card); the editor itself still gates saves behind the passkey.
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "e") {
        e.preventDefault();
        setIsSpecialistEditorOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Smooth scroll to estimator
  const scrollToEstimator = () => {
    const el = document.getElementById("estimator");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Smooth scroll to any of the three pricing track sections
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans selection:bg-amber-500 selection:text-neutral-950 flex flex-col justify-between">

      {/* Navigation */}
      <Navbar
        specialist={specialist}
        onScrollToEstimator={scrollToEstimator}
      />

      {/* Main Content */}
      <main className="flex-1">

        {/* Architectural Hero Banner */}
        <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 overflow-hidden min-h-[640px] flex items-center">
          {/* Background: looping rendering animation, muted, no controls */}
          <HeroBackgroundVideo />

          {/* Subtle architectural coordinate grid overlay */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:20px_20px]" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-3xl">

              {/* Disciplines — a plain line, not a row of bordered chips competing with the headline */}
              <div className="text-[11px] font-mono text-neutral-500 tracking-widest uppercase mb-8">
                Virtual Design & Construction · Parametric Modeling · BIM LOD 100–400 · Computational Analysis
              </div>

              {/* Editorial Headline — the dominant element on first paint */}
              <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold text-neutral-100 tracking-tight leading-[1.05]">
                Computational Design,{" "}
                <br className="hidden sm:block" />
                Virtual Design & Construction.{" "}
                <span className="text-amber-400">
                  Delivered Globally.
                </span>
              </h1>

              {/* Sub-copy */}
              <p className="mt-6 text-base sm:text-lg text-neutral-400 leading-relaxed max-w-2xl font-light">
                NCA-trained Principal Architect delivering code-compliant BIM production,
                parametric modeling (LOD 100–400), and full-scope construction documentation
                sets across IBC / IRC / CBC jurisdictions — remotely, from concept to closeout.
              </p>

              {/* Action row — one primary action, one secondary channel */}
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <button
                  id="hero-estimator-cta-btn"
                  onClick={scrollToEstimator}
                  className="group flex items-center space-x-2 text-sm font-bold text-neutral-950 bg-amber-400 hover:bg-amber-300 px-6 py-3.5 rounded transition-all cursor-pointer shadow-md shadow-amber-500/20"
                >
                  <span>Start a Project</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  type="button"
                  onClick={() => scrollToSection("gallery")}
                  className="flex items-center space-x-2 px-6 py-3.5 rounded border border-neutral-700 text-neutral-300 text-sm hover:text-neutral-100 hover:border-neutral-500 transition-all cursor-pointer"
                >
                  <span>View Selected Work</span>
                </button>
              </div>

              {/* Direct contact — present, but de-emphasized relative to the primary action */}
              <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-neutral-500">
                <a
                  href={`https://wa.me/${specialist.whatsapp.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                    `Hi ${specialist.name}, I'd like to discuss a project.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1.5 hover:text-neutral-200 transition-colors cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
                <a href={`mailto:${specialist.email}`}
                  className="flex items-center space-x-1.5 hover:text-neutral-200 transition-colors cursor-pointer">
                  <Mail className="w-3.5 h-3.5" />
                  <span>Email</span>
                </a>
                <a
                  href={specialist.socials?.linkedin || "https://www.linkedin.com/in/arslan-qaiser-947976188/"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1.5 hover:text-neutral-200 transition-colors cursor-pointer">
                  <Linkedin className="w-3.5 h-3.5" />
                  <span>LinkedIn</span>
                </a>
              </div>

              {/* Credential Strip */}
              <div className="mt-12 pt-8 border-t border-neutral-800/60 grid grid-cols-2 sm:grid-cols-4 gap-6 text-xs font-mono">
                <div>
                  <span className="text-amber-400 font-semibold block text-sm">AIA · NCS</span>
                  <span className="text-neutral-500 text-[11px] tracking-wide">Layering Standards</span>
                </div>
                <div>
                  <span className="text-neutral-200 font-semibold block text-sm">LOD 100–400</span>
                  <span className="text-neutral-500 text-[11px] tracking-wide">BIM Federated Models</span>
                </div>
                <div>
                  <span className="text-amber-400 font-semibold block text-sm">24–48h</span>
                  <span className="text-neutral-500 text-[11px] tracking-wide">Construction Administration</span>
                </div>
                <div>
                  <span className="text-emerald-400 font-semibold block text-sm">Native Delivery</span>
                  <span className="text-neutral-500 text-[11px] tracking-wide">IFC · DWG · Arch D PDF</span>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* 1. Specialist Identity & Direct Booking */}
        <SpecialistProfileCard
          specialist={specialist}
          onScrollToEstimator={scrollToEstimator}
        />

        {/* 2. Value Proposition: Remote Delivery Advantage & Engagement Models */}
        <WorkflowsSection onScrollToEstimator={scrollToEstimator} />

        {/* 3. Concrete Proof: Technical Deliverables & Before/After Gallery */}
        <DeliverablesGallery />

        {/* 4. Architect Consultant + Visualization, side by side */}
        <CombinedPricingSection specialist={specialist} />

        {/* One navigable gallery covering interior renders, exterior renders, and BIM/CAD
            production screenshots — category tabs switch the set instead of stacking three
            separate auto-cycling full-viewport bands down the page. */}
        <ProjectGallery
          groups={[
            { label: "Interior Visualization", images: VISUALIZATION_SHOWCASE_IMAGES },
            { label: "Exterior Visualization", images: EXTERIOR_SHOWCASE_IMAGES },
            { label: "BIM / CAD Workflow", images: BIMCAD_WORKFLOW_IMAGES },
          ]}
        />

        {/* 5. BIM/CAD Technician — the Scope Estimator, plain section */}
        <div id="bim-cad" className="scroll-mt-16">
          <ScopeEstimator specialist={specialist} />
        </div>

        {/* 6. Educational: What LOD means and what's actually included */}
        <LODGuide />

      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-900 bg-neutral-950 py-12 text-xs text-neutral-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center space-x-3">
              {specialist.logoUrl ? (
                <img
                  src={specialist.logoUrl}
                  alt={specialist.brandName || specialist.name}
                  className="w-9 h-9 object-contain rounded-lg bg-neutral-900 p-1 border border-neutral-800"
                />
              ) : (
                <Compass className="w-5 h-5 text-amber-500" />
              )}
              <div>
                <span className="font-bold text-neutral-200 text-sm block">
                  {specialist.brandName || specialist.name}
                </span>
                <span className="text-neutral-400 text-xs">
                  {specialist.name} • {specialist.title}
                </span>
              </div>
            </div>

            {/* Social and freelance links in footer */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-neutral-400">
              <a
                href={specialist.socials?.linkedin || "https://www.linkedin.com/in/arslan-qaiser-947976188/"}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-sky-400 text-sky-400/90 font-semibold transition-colors flex items-center space-x-1"
              >
                <span>LinkedIn</span>
              </a>
              {specialist.socials?.instagram && (
                <a
                  href={specialist.socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-400 transition-colors"
                >
                  Instagram ({specialist.socials.instagramHandle || "@quin_arch"})
                </a>
              )}
              {specialist.socials?.youtube && (
                <a
                  href={specialist.socials.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-red-400 transition-colors"
                >
                  YouTube
                </a>
              )}
              {specialist.socials?.upwork && (
                <a
                  href={specialist.socials.upwork}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 transition-colors"
                >
                  Upwork
                </a>
              )}
              {specialist.socials?.fiverr && (
                <a
                  href={specialist.socials.fiverr}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 transition-colors"
                >
                  Fiverr
                </a>
              )}
              {specialist.socials?.freelancer && (
                <a
                  href={specialist.socials.freelancer}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-400 transition-colors"
                >
                  Freelancer
                </a>
              )}
              {specialist.socials?.cadcrowd && (
                <a
                  href={specialist.socials.cadcrowd}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-sky-400 transition-colors"
                >
                  Cad Crowd
                </a>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-neutral-900">
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-neutral-400">
              <a href="#estimator" className="hover:text-amber-400 transition-colors">Scope Estimator</a>
              <a href="#consultancy" className="hover:text-amber-400 transition-colors">Pricing</a>
              <a href="#deliverables" className="hover:text-amber-400 transition-colors">Construction Documentation</a>
              <a href="#workflows" className="hover:text-amber-400 transition-colors">Delivery Process</a>
              <a href="#specialist" className="hover:text-amber-400 transition-colors">Principal Architect</a>
            </div>

            <div>
              © {new Date().getFullYear()} {specialist.brandName || "Quintessential Architecture"}. All drawings & BIM deliverables code-compliant.
            </div>
          </div>
        </div>
      </footer>

      {/* Modals & Drawers */}
      {isSpecialistEditorOpen && (
        <SpecialistDataModal
          isOpen={isSpecialistEditorOpen}
          onClose={() => setIsSpecialistEditorOpen(false)}
          currentProfile={specialist}
          onSaveProfile={handleSaveSpecialistProfile}
        />
      )}

    </div>
  );
}
