import React, { useEffect, useState } from "react";
import { Mail, MessageSquare } from "lucide-react";
import { PageShell } from "./components/PageShell";
import { HeroBackgroundVideo } from "./components/HeroBackgroundVideo";
import { SpecialistProfileCard } from "./components/SpecialistProfileCard";
import { SpecialistDataModal } from "./components/SpecialistDataModal";
import { HeroSequence } from "./components/filmstrip/HeroSequence";
import { ChapterCard, ChapterImage } from "./components/ChapterCard";
import { Button } from "./components/Button";
import { VISUALIZATION_SHOWCASE_IMAGES, EXTERIOR_SHOWCASE_IMAGES } from "./data/architecturalData";
import { ROUTES } from "./data/routes";
import { SpecialistProfile } from "./types";
import { isOwnerAuthorized } from "./services/ownerAuth";
import { SPECIALIST_PROFILE_STORAGE_KEY } from "./services/specialistProfile";
import { mailtoHref, whatsappHref } from "./services/contact";
import { assetUrl } from "./utils/assetPath";

interface AppProps {
  /** Resolved by mountPage: the default profile, or the owner's locally saved edit. */
  initialSpecialist: SpecialistProfile;
}

const thumb = (file: string) => assetUrl(`/portfolio/thumbs/${file}`);

// Point 5: real pictures on every chapter, from the work each one is about.
const WHY_IMAGES: ChapterImage[] = [
  { src: thumb("barn-residence-vray.webp"), alt: "Barn-style residence, finished render", kind: "render" },
  { src: thumb("barndominium-interior.webp"), alt: "Barndominium living room and kitchen under the mezzanine, interior render", kind: "render" },
  { src: thumb("cran-perspective.webp"), alt: "Cran Residence, perspective from the working model", kind: "drawing" },
  { src: thumb("sheets-slamburger-render-counter.webp"), alt: "Slamburger restaurant, counter and seating render", kind: "render" },
];
const BIM_IMAGES: ChapterImage[] = [
  { src: thumb("sheets-beach-house-first-level-plan.webp"), alt: "Texas beach house, first level plan", kind: "drawing" },
  { src: thumb("sheets-beach-house-south-elevation.webp"), alt: "Texas beach house, south elevation", kind: "drawing" },
  { src: thumb("sheets-flats-basement-plan-crop.webp"), alt: "Urban flats, basement plan on the structural grid", kind: "drawing" },
  { src: thumb("sheets-cran-sections-crop.webp"), alt: "Cran Residence, building sections", kind: "drawing" },
];
const CONSULTANT_IMAGES: ChapterImage[] = [
  { src: thumb("bimcad-workflow-05a-structural-model.webp"), alt: "Structural model of a residential tower", kind: "screenshot" },
  { src: thumb("bimcad-workflow-07-solar-wind-analysis.webp"), alt: "Solar and wind analysis for a site", kind: "screenshot" },
  { src: thumb("bimcad-workflow-05c-quantity-script.webp"), alt: "Wall and slab quantities calculated from the model", kind: "screenshot" },
  { src: thumb("bimcad-workflow-08-environmental-analysis.webp"), alt: "Sun-hours and wind analysis around a building", kind: "screenshot" },
];
const VISUALIZATION_IMAGES: ChapterImage[] = [
  { src: thumb("visualization-showcase-05-classical-dining.webp"), alt: "Classical dining room, interior render", kind: "render" },
  { src: thumb("exterior-showcase-12-cube-facade-render.webp"), alt: "Cubic façade study, exterior render", kind: "render" },
  { src: thumb("visualization-showcase-08-spiral-stair-library.webp"), alt: "Library with a spiral stair, interior render", kind: "render" },
  { src: thumb("visualization-showcase-10-sunken-fire-pit-lounge.webp"), alt: "Sunken fire-pit lounge, interior render", kind: "render" },
];

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

  const first = specialist.name.split(" ")[0];

  return (
    <PageShell specialist={specialist}>
      {/* The homepage is pure narrative (R2): the hero, the ribbon sequence, then the footer. */}
      <main className="flex-1">
        <HeroSequence
          interiorImages={VISUALIZATION_SHOWCASE_IMAGES}
          exteriorImages={EXTERIOR_SHOWCASE_IMAGES}
          galleryHref={ROUTES.projects}
          hero={
            <section className="relative flex flex-1 items-center overflow-hidden pt-6 pb-[var(--ribbon-clear)] sm:min-h-[640px] sm:pt-10 sm:pb-[calc(var(--ribbon-clear)+1rem)]">
              {/* Background: looping rendering animation, muted, no controls */}
              <HeroBackgroundVideo />

              {/* Subtle architectural coordinate grid overlay */}
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] opacity-[0.03] [background-size:20px_20px]" />

              <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-4xl text-center">
                  {/* Disciplines — a plain line, not a row of chips competing with the headline */}
                  <p className="eyebrow text-outlined mb-3 sm:mb-7">
                    Virtual Design & Construction · Parametric Modeling · BIM to LOD 350 · Computational Analysis
                  </p>

                  {/* Editorial headline — the dominant element on first paint */}
                  <h1 className="font-display text-[clamp(1.75rem,min(9vw,4.6vh),3rem)] font-semibold leading-[1.05] tracking-tight text-neutral-100 sm:text-[clamp(2.75rem,min(7vw,8.5vh),6rem)]">
                    Computational Design,{" "}
                    <br className="hidden sm:block" />
                    Virtual Design & Construction.{" "}
                    <span className="text-amber-400">Delivered Globally.</span>
                  </h1>

                  <p className="text-outlined mx-auto mt-3 max-w-2xl text-small sm:mt-6 sm:text-body">
                    NCA-trained principal architect delivering code-compliant BIM production, parametric modeling
                    (LOD 100–350, LOD 400 by request) and full-scope construction documentation across IBC / IRC / CBC
                    jurisdictions — remotely, from concept to closeout.
                  </p>

                  {/* One primary action, one secondary, one text link (R2) */}
                  <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-3 sm:mt-8">
                    <Button href={ROUTES.scopeEstimator}>Start a Project</Button>
                    <Button href={ROUTES.services} variant="secondary">
                      View Services
                    </Button>
                    <Button href={ROUTES.lodGuide} variant="link" className="text-halo">
                      LOD Guide
                    </Button>
                  </div>

                  {/* Direct contact — present, but quieter than the actions above */}
                  <div className="text-outlined mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-label sm:mt-6">
                    <a
                      href={whatsappHref(specialist, `Hi ${first}, I'd like to discuss a project.`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 transition-colors hover:text-neutral-200"
                    >
                      <MessageSquare className="h-3.5 w-3.5" aria-hidden="true" />
                      WhatsApp
                    </a>
                    <a href={mailtoHref(specialist.email)} className="flex items-center gap-1.5 transition-colors hover:text-neutral-200">
                      <Mail className="h-3.5 w-3.5" aria-hidden="true" />
                      Email
                    </a>
                  </div>

                  {/* Credentials — only on screens tall enough to hold them without crowding */}
                  <dl className="mt-8 hidden grid-cols-4 gap-6 border-t border-neutral-800/60 pt-6 [@media(min-height:1000px)]:grid">
                    {[
                      ["AIA · NCS", "Layering standards"],
                      ["LOD 100–350", "BIM models, 400 by request"],
                      ["24–48 h", "Redline turnaround"],
                      ["IFC · DWG · PDF", "Native delivery"],
                    ].map(([value, label]) => (
                      <div key={value} className="flex flex-col">
                        <dt className="text-outlined text-label">{label}</dt>
                        <dd className="order-first font-mono text-small text-neutral-100">{value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            </section>
          }
          chapters={[
            (compact) => <SpecialistProfileCard specialist={specialist} compact={compact} />,
            (compact) => (
              <ChapterCard
                compact={compact}
                eyebrow="Why work with us"
                title="Principal-level architecture, delivered remotely."
                description="One accountable architect for homeowners planning a build — and senior production capacity for firms and contractors who have more work than hands."
                images={WHY_IMAGES}
                cta={{ label: "Why work with us", href: ROUTES.whyWorkWithUs }}
                secondary={{ label: "Design Philosophy", href: ROUTES.designPhilosophy }}
              />
            ),
            (compact) => (
              <ChapterCard
                compact={compact}
                eyebrow="BIM & construction documentation"
                title="High-precision deliverables, permit-ready."
                description="Code-compliant permit sets and BIM models — LOD 100–350, LOD 400 by request — delivered in the formats and layering standards your office already uses."
                images={BIM_IMAGES}
                cta={{ label: "See BIM / CAD services", href: ROUTES.bimCad }}
                secondary={{ label: "Project Library", href: `${ROUTES.projects}#drawing-sets` }}
              />
            ),
            (compact) => (
              <ChapterCard
                compact={compact}
                eyebrow="Architect consultant"
                title="A second set of expert eyes."
                description="Design coordination, code-compliance review, and computational or parametric consulting for studios and contractors — billed hourly at one flat worldwide rate."
                images={CONSULTANT_IMAGES}
                cta={{ label: "Explore consultancy", href: ROUTES.consultancy }}
              />
            ),
            (compact) => (
              <ChapterCard
                compact={compact}
                eyebrow="Photorealistic visualization"
                title="See it before it is built."
                description="Photorealistic interior and exterior renders in V-Ray, Lumion and Twinmotion — built from an existing model, CAD drawings, or sketches."
                images={VISUALIZATION_IMAGES}
                cta={{ label: "Explore visualization", href: ROUTES.visualization }}
                secondary={{ label: "Project Library", href: `${ROUTES.projects}#visualization` }}
              />
            ),
          ]}
        />
      </main>

      {/* Modals & Drawers */}
      {isSpecialistEditorOpen && (
        <SpecialistDataModal
          isOpen={isSpecialistEditorOpen}
          onClose={() => setIsSpecialistEditorOpen(false)}
          currentProfile={specialist}
          onSaveProfile={handleSaveSpecialistProfile}
        />
      )}
    </PageShell>
  );
}
