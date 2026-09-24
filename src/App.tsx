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
import { SpecialistProfileCard } from "./components/SpecialistProfileCard";
import { SpecialistDataModal } from "./components/SpecialistDataModal";
import { Reveal } from "./components/Reveal";
import { HeroSequence } from "./components/filmstrip/HeroSequence";
import { ChapterCard } from "./components/ChapterCard";
import { BIMCAD_WORKFLOW_IMAGES, VISUALIZATION_SHOWCASE_IMAGES, EXTERIOR_SHOWCASE_IMAGES } from "./data/architecturalData";
import { SpecialistProfile } from "./types";
import { isOwnerAuthorized } from "./services/ownerAuth";
import { SPECIALIST_PROFILE_STORAGE_KEY } from "./services/specialistProfile";

interface AppProps {
  /** Resolved by mountPage: the default profile, or the owner's locally saved edit. */
  initialSpecialist: SpecialistProfile;
}

export default function App({ initialSpecialist }: AppProps) {
  // Specialist Profile state (persisted locally in this browser only)
  const [specialist, setSpecialist] = useState<SpecialistProfile>(initialSpecialist);

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

  // The browser's native scroll-to-#hash-on-load lands on the prerendered layout, but
  // HeroSequence re-measures its stage for the real viewport as the page hydrates, which moves
  // everything below it (e.g. #estimator, the target of every "Scope Planner" link on other
  // pages). Re-scroll on the next frame, once that re-measured layout has been committed.
  useEffect(() => {
    if (!window.location.hash) return;
    const frame = requestAnimationFrame(() => {
      document.getElementById(window.location.hash.slice(1))?.scrollIntoView({ behavior: "auto" });
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  const base = import.meta.env.BASE_URL;

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

        {/* Hero → interior/exterior ribbons → specialist card → exterior takeover: one continuous
            scroll-linked sequence (see documentation/scroll-filmstrip-concept §9/§11). */}
        <HeroSequence
          interiorImages={VISUALIZATION_SHOWCASE_IMAGES}
          exteriorImages={EXTERIOR_SHOWCASE_IMAGES}
          hero={
            <section className="relative pt-6 pb-[var(--ribbon-clear)] sm:pt-10 sm:pb-[calc(var(--ribbon-clear)+1rem)] overflow-hidden sm:min-h-[640px] flex-1 flex items-center">
              {/* Background: looping rendering animation, muted, no controls */}
              <HeroBackgroundVideo />

              {/* Subtle architectural coordinate grid overlay */}
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:20px_20px]" />

              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="max-w-3xl">

                  {/* Disciplines — a plain line, not a row of bordered chips competing with the headline */}
                  <div className="text-outlined text-[10px] sm:text-[11px] font-mono tracking-widest uppercase mb-3 sm:mb-8">
                    Virtual Design & Construction · Parametric Modeling · BIM LOD 100–400 · Computational Analysis
                  </div>

                  {/* Editorial Headline — the dominant element on first paint */}
                  <h1 className="font-display text-[clamp(1.75rem,min(9vw,4.6vh),3rem)] sm:text-[clamp(2.75rem,min(7vw,8.5vh),6rem)] font-bold text-neutral-100 tracking-tight leading-[1.05]">
                    Computational Design,{" "}
                    <br className="hidden sm:block" />
                    Virtual Design & Construction.{" "}
                    <span className="text-amber-400">
                      Delivered Globally.
                    </span>
                  </h1>

                  {/* Sub-copy */}
                  <p className="text-outlined mt-3 sm:mt-6 text-[13px] sm:text-lg leading-snug sm:leading-relaxed max-w-2xl font-normal sm:font-light">
                    NCA-trained Principal Architect delivering code-compliant BIM production,
                    parametric modeling (LOD 100–400), and full-scope construction documentation
                    sets across IBC / IRC / CBC jurisdictions — remotely, from concept to closeout.
                  </p>

                  {/* Action row — one primary action, one secondary channel */}
                  <div className="mt-5 sm:mt-8 flex flex-wrap items-center gap-3 sm:gap-4">
                    <button
                      id="hero-estimator-cta-btn"
                      onClick={scrollToEstimator}
                      className="group flex items-center space-x-2 text-sm font-bold text-neutral-950 bg-amber-400 hover:bg-amber-300 px-5 sm:px-6 py-3 sm:py-3.5 rounded transition-all cursor-pointer shadow-md shadow-amber-500/20"
                    >
                      <span>Start a Project</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>

                    <a
                      href={`${import.meta.env.BASE_URL}services/`}
                      className="text-outlined flex items-center space-x-2 px-5 sm:px-6 py-3 sm:py-3.5 rounded border border-neutral-500 text-sm hover:border-neutral-300 transition-all cursor-pointer"
                    >
                      <span>View Services</span>
                    </a>
                  </div>

                  {/* Direct contact — present, but de-emphasized relative to the primary action */}
                  <div className="text-outlined mt-3 sm:mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs">
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
                  <div className="hidden [@media(min-height:1000px)]:grid mt-8 pt-6 border-t border-neutral-800/60 grid-cols-4 gap-6 text-xs font-mono">
                    <div>
                      <span className="text-amber-400 font-semibold block text-sm">AIA · NCS</span>
                      <span className="text-outlined text-[11px] tracking-wide">Layering Standards</span>
                    </div>
                    <div>
                      <span className="text-neutral-200 font-semibold block text-sm">LOD 100–400</span>
                      <span className="text-outlined text-[11px] tracking-wide">BIM Federated Models</span>
                    </div>
                    <div>
                      <span className="text-amber-400 font-semibold block text-sm">24–48h</span>
                      <span className="text-outlined text-[11px] tracking-wide">Construction Administration</span>
                    </div>
                    <div>
                      <span className="text-emerald-400 font-semibold block text-sm">Native Delivery</span>
                      <span className="text-outlined text-[11px] tracking-wide">IFC · DWG · Arch D PDF</span>
                    </div>
                  </div>

                </div>
              </div>
            </section>
          }
          galleryHref={`${import.meta.env.BASE_URL}projects/`}
          chapters={[
            (compact) => (
              <SpecialistProfileCard
                specialist={specialist}
                onScrollToEstimator={scrollToEstimator}
                compact={compact}
              />
            ),
            (compact) => (
              <ChapterCard
                compact={compact}
                eyebrow="Why work with us"
                title="Principal-level architecture, delivered remotely."
                description="One accountable architect for homeowners planning a build — and senior production capacity for firms and contractors who have more work than hands."
                points={[
                  "A direct line to the principal architect",
                  "24 to 48-hour redline revisions",
                  "Native BIM / CAD delivery in your standards",
                ]}
                cta={{ label: "Why work with us", href: `${base}why-work-with-us/` }}
                secondary={{ label: "The thinking behind the work", href: `${base}design-philosophy/` }}
              />
            ),
            (compact) => (
              <ChapterCard
                compact={compact}
                eyebrow="BIM & construction documentation"
                title="High-precision deliverables, permit-ready."
                description="Code-compliant permit sets and BIM models from LOD 100 to 400, delivered in the formats and layering standards your office already uses."
                thumbs={BIMCAD_WORKFLOW_IMAGES.slice(0, 3).map((i) => i.src)}
                cta={{ label: "See BIM / CAD services", href: `${base}services/bim-cad-drafting/` }}
                secondary={{ label: "Project library", href: `${base}projects/#deliverables` }}
              />
            ),
            (compact) => (
              <ChapterCard
                compact={compact}
                eyebrow="Architect consultant"
                title="A second set of expert eyes."
                description="Design coordination, code-compliance review, and computational or parametric consulting for studios and contractors — billed hourly at one flat worldwide rate."
                cta={{ label: "Explore consultancy", href: `${base}services/consultancy/` }}
              />
            ),
            (compact) => (
              <ChapterCard
                compact={compact}
                eyebrow="Photorealistic visualization"
                title="See it before it is built."
                description="Photorealistic interior and exterior renders in V-Ray, Lumion and Twinmotion 4K — built from an existing model, CAD drawings, or sketches."
                thumbs={[
                  VISUALIZATION_SHOWCASE_IMAGES[4]?.src,
                  EXTERIOR_SHOWCASE_IMAGES[3]?.src,
                  VISUALIZATION_SHOWCASE_IMAGES[7]?.src,
                ].filter(Boolean) as string[]}
                cta={{ label: "Explore visualization", href: `${base}services/visualization/` }}
                secondary={{ label: "Project library", href: `${base}projects/#gallery` }}
              />
            ),
          ]}
        />

        {/* 5. BIM/CAD Technician — the Scope Estimator, plain section */}
        <div id="bim-cad" className="scroll-mt-16">
          <Reveal>
            <ScopeEstimator specialist={specialist} />
          </Reveal>
        </div>

        {/* 6. Educational: What LOD means and what's actually included */}
        <Reveal>
          <LODGuide />
        </Reveal>

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
