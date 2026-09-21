import React, { useState } from "react";
import {
  Compass,
  ArrowRight,
  MessageSquare,
  Mail,
  Linkedin,
  UserCheck,
  Image as ImageIcon,
  Layers
} from "lucide-react";
import { Navbar } from "./components/Navbar";
import { HeroBackgroundVideo } from "./components/HeroBackgroundVideo";
import { ScopeEstimator } from "./components/ScopeEstimator";
import { LODGuide } from "./components/LODGuide";
import { CombinedPricingSection } from "./components/CombinedPricingSection";
import { ImageSlideshowBand } from "./components/ImageSlideshowBand";
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

  const [isOwnerEditingUnlocked, setIsOwnerEditingUnlocked] = useState(() => isOwnerAuthorized());

  const [isSpecialistEditorOpen, setIsSpecialistEditorOpen] = useState(false);

  // Update specialist profile (restricted to the owner's passkey-unlocked browser session)
  const handleSaveSpecialistProfile = (updated: SpecialistProfile) => {
    if (!isOwnerAuthorized()) {
      console.warn("Unauthorized attempt to update specialist profile blocked.");
      return;
    }
    setSpecialist(updated);
    localStorage.setItem("archscope_specialist_profile_v4", JSON.stringify(updated));
    setIsOwnerEditingUnlocked(true);
  };

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
        isOwner={isOwnerEditingUnlocked}
        onOpenSpecialistEditor={() => setIsSpecialistEditorOpen(true)}
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

              {/* Discipline Tags */}
              <div className="flex flex-wrap items-center gap-2 mb-8">
                <span className="text-[11px] font-mono text-neutral-500 tracking-widest uppercase">Disciplines</span>
                {["Virtual Design & Construction", "Parametric Modeling", "BIM LOD 100–400", "Computational Analysis"].map((tag) => (
                  <span key={tag} className="px-2.5 py-1 rounded border border-neutral-800 text-neutral-400 text-[11px] font-mono tracking-wide">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Quick track navigation */}
              <div className="flex flex-wrap items-center gap-2.5 mb-8">
                <span className="text-[11px] font-mono text-neutral-500 tracking-widest uppercase mr-1">Tracks</span>
                <button type="button" onClick={() => scrollToSection("consultancy")}
                  className="px-3 py-1.5 rounded border border-neutral-800 bg-transparent text-neutral-400 text-xs hover:text-neutral-100 hover:border-neutral-600 transition-all cursor-pointer flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5" />
                  Consultancy
                </button>
                <button type="button" onClick={() => scrollToSection("visualization")}
                  className="px-3 py-1.5 rounded border border-neutral-800 bg-transparent text-neutral-400 text-xs hover:text-neutral-100 hover:border-neutral-600 transition-all cursor-pointer flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5" />
                  Visualization
                </button>
                <button type="button" onClick={() => scrollToSection("bim-cad")}
                  className="px-3 py-1.5 rounded border border-neutral-800 bg-transparent text-neutral-400 text-xs hover:text-neutral-100 hover:border-neutral-600 transition-all cursor-pointer flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5" />
                  BIM / VDC
                </button>
              </div>

              {/* Editorial Headline */}
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-neutral-100 tracking-tight leading-[1.08]">
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

              {/* Action row — minimal, editorial */}
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <button
                  id="hero-estimator-cta-btn"
                  onClick={scrollToEstimator}
                  className="group flex items-center space-x-2 text-sm font-medium text-amber-400 border border-amber-500/40 px-5 py-3 rounded hover:bg-amber-500/10 hover:border-amber-500/70 transition-all cursor-pointer"
                >
                  <span>Scope Planner</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <a
                  href={`https://wa.me/${specialist.whatsapp.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                    `Hi ${specialist.name}, I'd like to discuss a project.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 px-5 py-3 rounded border border-neutral-700 text-neutral-300 text-sm hover:text-neutral-100 hover:border-neutral-500 transition-all cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-400" />
                  <span>WhatsApp</span>
                </a>

                <a href={`mailto:${specialist.email}`}
                  className="flex items-center space-x-2 px-5 py-3 rounded border border-neutral-700 text-neutral-300 text-sm hover:text-neutral-100 hover:border-neutral-500 transition-all cursor-pointer">
                  <Mail className="w-4 h-4 text-amber-400/70" />
                  <span>Email</span>
                </a>

                <a
                  href={specialist.socials?.linkedin || "https://www.linkedin.com/in/arslan-qaiser-947976188/"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 px-5 py-3 rounded border border-neutral-700 text-neutral-300 text-sm hover:text-neutral-100 hover:border-neutral-500 transition-all cursor-pointer">
                  <Linkedin className="w-4 h-4 text-sky-400/70" />
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
          onOpenEditor={() => setIsSpecialistEditorOpen(true)}
          onScrollToEstimator={scrollToEstimator}
          isOwner={isOwnerEditingUnlocked}
        />

        {/* 2. Value Proposition: Remote Delivery Advantage & Engagement Models */}
        <WorkflowsSection onScrollToEstimator={scrollToEstimator} />

        {/* 3. Concrete Proof: Technical Deliverables & Before/After Gallery */}
        <DeliverablesGallery />

        {/* 4. Architect Consultant + Visualization, side by side */}
        <CombinedPricingSection specialist={specialist} />

        {/* Breathing-space divider: finished-render slideshow, following Visualization */}
        <ImageSlideshowBand images={VISUALIZATION_SHOWCASE_IMAGES} imagesPerCard={1} title="Interior Visualization" />

        {/* Breathing-space divider: exterior renders & facade studies, distinct from interiors above */}
        <ImageSlideshowBand images={EXTERIOR_SHOWCASE_IMAGES} imagesPerCard={1} title="Exterior Visualization" />

        {/* 5. BIM/CAD Technician — the Scope Estimator, plain section */}
        <div id="bim-cad" className="scroll-mt-16">
          <ScopeEstimator specialist={specialist} />
        </div>

        {/* Breathing-space divider: real BIM/CAD production screenshots, following BIM/CAD —
            paired two-up since these screenshots are wide */}
        <ImageSlideshowBand images={BIMCAD_WORKFLOW_IMAGES} imagesPerCard={2} title="BIM / CAD Workflow" />

        {/* 6. Educational: What LOD means and what's actually included — after the BIM slideshow */}
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
              <button
                onClick={() => setIsSpecialistEditorOpen(true)}
                className="hover:text-amber-400 transition-colors cursor-pointer flex items-center space-x-1"
                title={isOwnerEditingUnlocked ? "Edit profile settings (Owner)" : "Specialist Profile & Credentials (Protected)"}
              >
                <span>Profile & Links Settings</span>
                {!isOwnerEditingUnlocked && (
                  <span className="text-[10px] text-neutral-500 font-mono">(Protected)</span>
                )}
              </button>
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
