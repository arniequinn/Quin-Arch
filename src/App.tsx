import React, { useState } from "react";
import {
  Compass,
  Sparkles,
  ArrowRight,
  MessageSquare,
  Mail,
  Linkedin
} from "lucide-react";
import { Navbar } from "./components/Navbar";
import { ScopeEstimator } from "./components/ScopeEstimator";
import { DeliverablesGallery } from "./components/DeliverablesGallery";
import { WorkflowsSection } from "./components/WorkflowsSection";
import { SpecialistProfileCard } from "./components/SpecialistProfileCard";
import { LeadCaptureModal } from "./components/LeadCaptureModal";
import { BlueprintReportModal } from "./components/BlueprintReportModal";
import { SpecialistDataModal } from "./components/SpecialistDataModal";
import { DEFAULT_SPECIALIST_PROFILE } from "./data/architecturalData";
import { SpecialistProfile, ArchitecturalBlueprint } from "./types";
import { ScopeCalculationInput, ScopeCalculationResult } from "./utils/calculator";
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

  // Modals state
  const [isLeadCaptureOpen, setIsLeadCaptureOpen] = useState(false);
  const [activeCalculationInput, setActiveCalculationInput] = useState<ScopeCalculationInput | null>(null);
  const [activeCalculationResult, setActiveCalculationResult] = useState<ScopeCalculationResult | null>(null);

  const [isBlueprintOpen, setIsBlueprintOpen] = useState(false);
  const [activeBlueprint, setActiveBlueprint] = useState<ArchitecturalBlueprint | null>(null);
  const [activeLeadData, setActiveLeadData] = useState<{ name: string; email: string; phone?: string; firmOrRole: string; customNotes?: string; projectFilesLink?: string }>({
    name: "",
    email: "",
    firmOrRole: "",
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
    setIsOwnerEditingUnlocked(true);
  };

  // Trigger Lead Capture from Estimator
  const handleProceedToLeadCapture = (input: ScopeCalculationInput, calculation: ScopeCalculationResult) => {
    setActiveCalculationInput(input);
    setActiveCalculationResult(calculation);
    setIsLeadCaptureOpen(true);
  };

  // Blueprint generated callback
  const handleBlueprintGenerated = (
    blueprint: ArchitecturalBlueprint,
    leadData: { name: string; email: string; phone?: string; firmOrRole: string; customNotes?: string; projectFilesLink?: string }
  ) => {
    setActiveBlueprint(blueprint);
    setActiveLeadData(leadData);
    setIsLeadCaptureOpen(false);
    setIsBlueprintOpen(true);
  };

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
        isOwner={isOwnerEditingUnlocked}
        onOpenSpecialistEditor={() => setIsSpecialistEditorOpen(true)}
        onScrollToEstimator={scrollToEstimator}
      />

      {/* Main Content */}
      <main className="flex-1">

        {/* Architectural Hero Banner */}
        <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 overflow-hidden">
          {/* Subtle architectural coordinate grid in background */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:20px_20px]" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="max-w-3xl">

              {/* Badges Bar: Service scope */}
              <div className="flex flex-wrap items-center gap-2.5 mb-6">
                <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
                  <Compass className="w-3.5 h-3.5" />
                  <span>Remote Architectural BIM Services • Revit LOD 200–400 • CAD Permitting</span>
                </div>
              </div>

              {/* Display Headline targeting long-tail search queries */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-neutral-100 tracking-tight leading-[1.12]">
                Remote Architectural BIM Services & Permit CAD Sets.{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500">
                  Delivered Globally.
                </span>
              </h1>

              {/* Sub-copy */}
              <p className="mt-5 text-base sm:text-lg text-neutral-300 leading-relaxed max-w-2xl">
                Partner with an NCA-trained senior architect for code-compliant
                remote architectural BIM services, Autodesk Revit 3D modeling (LOD 200–400), and
                millimeter-precise permit drawing sets (IBC/IRC/Title 24). Save 60-70% overhead
                compared to in-house drafter payroll with 24-48h redline turnarounds.
              </p>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <button
                  id="hero-estimator-cta-btn"
                  onClick={scrollToEstimator}
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-bold text-sm shadow-xl shadow-amber-500/20 transition-all flex items-center space-x-2 group cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-neutral-950" />
                  <span>Estimate Project Scope & Fees</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <a
                  href={`https://wa.me/${specialist.whatsapp.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                    `Hi ${specialist.name}, I'm looking for a remote architecture and drafting specialist.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3.5 rounded-xl bg-emerald-700/80 hover:bg-emerald-600/90 text-white font-semibold text-sm border border-emerald-500/40 flex items-center space-x-2 transition-all cursor-pointer shadow-md shadow-emerald-900/20"
                >
                  <MessageSquare className="w-4 h-4 fill-white/20" />
                  <span>WhatsApp: {specialist.phone || "+92 322 4316477"}</span>
                </a>

                <a
                  href={`mailto:${specialist.email}`}
                  className="px-4 py-3.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 text-sm font-mono border border-neutral-800 flex items-center space-x-2 transition-all cursor-pointer"
                >
                  <Mail className="w-4 h-4 text-amber-400" />
                  <span>Email Direct</span>
                </a>

                <a
                  href={specialist.socials?.linkedin || "https://www.linkedin.com/in/arslan-qaiser-947976188/"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-3.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 text-sm font-mono border border-neutral-800 flex items-center space-x-2 transition-all cursor-pointer"
                >
                  <Linkedin className="w-4 h-4 text-sky-400" />
                  <span>LinkedIn</span>
                </a>
              </div>

              {/* Fast Trust Indicators */}
              <div className="mt-10 pt-8 border-t border-neutral-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
                <div>
                  <span className="text-amber-400 font-bold block text-sm">AIA & NCS</span>
                  <span className="text-neutral-400 text-[11px]">CAD Layering Standards</span>
                </div>
                <div>
                  <span className="text-neutral-100 font-bold block text-sm">LOD 200 - 400</span>
                  <span className="text-neutral-400 text-[11px]">Revit BIM Modeling</span>
                </div>
                <div>
                  <span className="text-amber-400 font-bold block text-sm">24-48h</span>
                  <span className="text-neutral-400 text-[11px]">Redline Turnaround</span>
                </div>
                <div>
                  <span className="text-emerald-400 font-bold block text-sm">100% Native</span>
                  <span className="text-neutral-400 text-[11px]">RVT, DWG & Arch D PDF</span>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* 1. Core Lead Magnet: The Interactive Scope & Fee Estimator */}
        <ScopeEstimator onProceedToLeadCapture={handleProceedToLeadCapture} />

        {/* 2. Concrete Proof: Technical Deliverables & Before/After Gallery */}
        <DeliverablesGallery />

        {/* 3. Value Proposition: Remote Delivery Advantage & Engagement Models */}
        <WorkflowsSection onScrollToEstimator={scrollToEstimator} />

        {/* 4. Specialist Identity & Direct Booking */}
        <SpecialistProfileCard
          specialist={specialist}
          onOpenEditor={() => setIsSpecialistEditorOpen(true)}
          onScrollToEstimator={scrollToEstimator}
          isOwner={isOwnerEditingUnlocked}
        />

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
            <div className="flex items-center space-x-6 text-neutral-400">
              <a href="#estimator" className="hover:text-amber-400 transition-colors">Scope Estimator</a>
              <a href="#deliverables" className="hover:text-amber-400 transition-colors">Drawing Sets & PDFs</a>
              <a href="#workflows" className="hover:text-amber-400 transition-colors">Delivery Process</a>
              <a href="#specialist" className="hover:text-amber-400 transition-colors">About Specialist</a>
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
      {isLeadCaptureOpen && activeCalculationInput && activeCalculationResult && (
        <LeadCaptureModal
          isOpen={isLeadCaptureOpen}
          onClose={() => setIsLeadCaptureOpen(false)}
          input={activeCalculationInput}
          calculation={activeCalculationResult}
          onBlueprintGenerated={handleBlueprintGenerated}
        />
      )}

      {isBlueprintOpen && activeBlueprint && activeCalculationInput && activeCalculationResult && (
        <BlueprintReportModal
          isOpen={isBlueprintOpen}
          onClose={() => setIsBlueprintOpen(false)}
          blueprint={activeBlueprint}
          input={activeCalculationInput}
          calculation={activeCalculationResult}
          leadData={activeLeadData}
          specialist={specialist}
        />
      )}

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
