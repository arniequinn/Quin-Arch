import React, { useEffect, useState } from "react";
import {
  ArrowRight,
  MessageSquare,
  Mail,
  Linkedin
} from "lucide-react";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { HeroBackgroundVideo } from "./components/HeroBackgroundVideo";
import { ScopeEstimator } from "./components/ScopeEstimator";
import { LODGuide } from "./components/LODGuide";
import { CombinedPricingSection } from "./components/CombinedPricingSection";
import { ProjectGallery } from "./components/ProjectGallery";
import { DeliverablesGallery } from "./components/DeliverablesGallery";
import { WorkflowsSection } from "./components/WorkflowsSection";
import { SpecialistProfileCard } from "./components/SpecialistProfileCard";
import { SpecialistDataModal } from "./components/SpecialistDataModal";
import { BIMCAD_WORKFLOW_IMAGES, VISUALIZATION_SHOWCASE_IMAGES, EXTERIOR_SHOWCASE_IMAGES } from "./data/architecturalData";
import { SpecialistProfile } from "./types";
import { isOwnerAuthorized } from "./services/ownerAuth";
import { loadSpecialistProfile, SPECIALIST_PROFILE_STORAGE_KEY } from "./services/specialistProfile";

export default function App() {
  // Specialist Profile state (persisted locally in this browser only)
  const [specialist, setSpecialist] = useState<SpecialistProfile>(loadSpecialistProfile);

  const [isSpecialistEditorOpen, setIsSpecialistEditorOpen] = useState(false);

  // Update specialist profile (restricted to the owner's passkey-unlocked browser session)
  const handleSaveSpecialistProfile = (updated: SpecialistProfile) => {
    if (!isOwnerAuthorized()) {
      console.warn("Unauthorized attempt to update specialist profile blocked.");
      return;
    }
    setSpecialist(updated);
    localStorage.setItem(SPECIALIST_PROFILE_STORAGE_KEY, JSON.stringify(updated));
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

  // The browser's native scroll-to-#hash-on-load fires before this SPA has mounted anything
  // into #root, so a fresh navigation here from another page (e.g. a service page's "Scope
  // Estimator" link) lands at the top instead of the anchor. Retry once mounted.
  useEffect(() => {
    if (window.location.hash) {
      const el = document.getElementById(window.location.hash.slice(1));
      if (el) {
        el.scrollIntoView({ behavior: "auto" });
      }
    }
  }, []);

  // Smooth scroll to estimator
  const scrollToEstimator = () => {
    const el = document.getElementById("estimator");
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

                <a
                  href={`${import.meta.env.BASE_URL}services/`}
                  className="flex items-center space-x-2 px-6 py-3.5 rounded border border-neutral-700 text-neutral-300 text-sm hover:text-neutral-100 hover:border-neutral-500 transition-all cursor-pointer"
                >
                  <span>View Services</span>
                </a>
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

        {/* 3. Concrete Proof: Technical Deliverables Gallery */}
        <DeliverablesGallery />

        {/* Navigable gallery of finished renders — replaces the old before/after script/render
            slider with the full interior + exterior visualization sets. */}
        <ProjectGallery
          id="gallery"
          groups={[
            { label: "Interior Visualization", images: VISUALIZATION_SHOWCASE_IMAGES },
            { label: "Exterior Visualization", images: EXTERIOR_SHOWCASE_IMAGES },
          ]}
        />

        {/* 4. Architect Consultant + Visualization, side by side */}
        <CombinedPricingSection specialist={specialist} />

        {/* 5. BIM/CAD Technician — the Scope Estimator, plain section */}
        <div id="bim-cad" className="scroll-mt-16">
          <ScopeEstimator specialist={specialist} />
        </div>

        {/* Real BIM/CAD production screenshots, immediately before the LOD breakdown they
            substantiate. */}
        <ProjectGallery
          groups={[
            { label: "BIM / CAD Workflow", images: BIMCAD_WORKFLOW_IMAGES },
          ]}
        />

        {/* 6. Educational: What LOD means and what's actually included */}
        <LODGuide />

      </main>

      <Footer specialist={specialist} />

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
