import React, { useEffect, useState } from "react";
import { PageShell } from "./components/PageShell";
import { HERO_VIDEOS, HeroVideo } from "./components/HeroVideo";
import { SpecialistProfileCard } from "./components/SpecialistProfileCard";
import { SpecialistDataModal } from "./components/SpecialistDataModal";
import { RibbonSequence } from "./components/filmstrip/RibbonSequence";
import { ChapterCard, ChapterImage } from "./components/ChapterCard";
import { Button } from "./components/Button";
import { BIM_PRODUCTION_IMAGES, COMPUTATIONAL_IMAGES } from "./data/architecturalData";
import { FILMSTRIP_TEMPLATES } from "./data/filmstrips";
import { galleryImage, projectBySlug, thumbOf } from "./data/galleryProjects";
import { caseStudyHref, projectHref, ROUTES } from "./data/routes";
import { SpecialistProfile, TrackImage } from "./types";
import { isOwnerAuthorized } from "./services/ownerAuth";
import { SPECIALIST_PROFILE_STORAGE_KEY } from "./services/specialistProfile";
import { assetUrl } from "./utils/assetPath";

interface AppProps {
  /** Resolved by mountPage: the default profile, or the owner's locally saved edit. */
  initialSpecialist: SpecialistProfile;
}

/** A chapter tile from a gallery image: its thumbnail, its full image for dense screens, its link. */
function tile(img: TrackImage, href: string, alt = `${img.title} — ${img.caption}`): ChapterImage {
  const t = thumbOf(img);
  return {
    src: t.src,
    srcSet: t.width < img.width ? `${t.src} ${t.width}w, ${img.src} ${img.width}w` : undefined,
    alt,
    kind: img.kind,
    href,
  };
}

const cover = (slug: string) => {
  const project = projectBySlug(slug)!;
  return tile(project.cover, projectHref(slug), `${project.title} — ${project.cover.title}`);
};
const workflow = (file: string, href: string) =>
  tile([...BIM_PRODUCTION_IMAGES, ...COMPUTATIONAL_IMAGES].find((img) => img.src.endsWith(`/${file}`))!, href);

// v3.0 point 4: three larger tiles per chapter, all colour renders or black-on-white sheets, each
// linking to its project. The Cran Residence model view is gone.
const WHY_IMAGES: ChapterImage[] = [
  {
    src: assetUrl("/portfolio/thumbs/barn-residence-render.webp"),
    srcSet: `${assetUrl("/portfolio/thumbs/barn-residence-render.webp")} 640w, ${assetUrl("/portfolio/barn-residence-render.jpg")} 1109w`,
    alt: "Barn-style residence, finished render",
    kind: "render",
    href: ROUTES.designPhilosophy,
  },
  cover("dark-living-room"),
  cover("classical-apartment"),
];
const BIM_IMAGES: ChapterImage[] = [
  tile(
    galleryImage("sheets/13-coordinated-mep-overlay.webp", "Coordinated drawing set"),
    ROUTES.bimCad,
    "Plumbing, structure and electrical plans overlaid as one coordinated set"
  ),
  tile(
    galleryImage("sheets/beach-house-first-level-plan.webp", "First-level plan", { title: "Texas beach house" }),
    caseStudyHref("sample-beach-house"),
    "Texas beach house, first-level plan"
  ),
  tile(
    galleryImage("sheets/05-foster-home-australia-axonometrics.webp", "Axonometric views"),
    `${ROUTES.projects}#drawing-sets`,
    "Foster home, Australia — two axonometric views"
  ),
];
const CONSULTANT_IMAGES: ChapterImage[] = [
  workflow("05a-structural-model.webp", `${ROUTES.projects}#bim-workflow`),
  workflow("07-solar-wind-analysis.jpg", `${ROUTES.projects}#bim-workflow`),
  workflow("05c-quantity-script.webp", `${ROUTES.projects}#bim-workflow`),
];
const VISUALIZATION_IMAGES: ChapterImage[] = [
  tile(
    galleryImage("visualization-showcase/singles/04-arched-lounge-red-velvet-chairs.webp", "Interior visualization"),
    `${ROUTES.projects}#interior`
  ),
  cover("bright-loft"),
  cover("master-bathroom"),
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

  return (
    <PageShell specialist={specialist}>
      {/* The homepage is pure narrative (R2): the hero, the ribbon sequence, then the footer. */}
      <main className="flex-1">
        <RibbonSequence
          preset="full"
          top={FILMSTRIP_TEMPLATES.interior}
          bottom={FILMSTRIP_TEMPLATES.exterior}
          galleryHref={ROUTES.projects}
          hero={
            <section className="relative flex flex-1 items-center overflow-hidden pt-6 pb-[var(--ribbon-clear)] sm:min-h-[640px] sm:pt-10 sm:pb-[calc(var(--ribbon-clear)+1rem)]">
              {/* Background: the apartment walkthrough, muted and looping */}
              <HeroVideo {...HERO_VIDEOS.home} />

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

                  {/* One primary action, one secondary (v3.0 point 16: no LOD link on the landing page) */}
                  <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-3 sm:mt-8">
                    <Button href={ROUTES.scopeEstimator}>Start a Project</Button>
                    <Button href={ROUTES.services} variant="secondary">
                      View Services
                    </Button>
                  </div>

                  {/* Credentials — only on screens tall enough to hold them without crowding */}
                  <dl className="mt-8 hidden grid-cols-4 gap-6 border-t border-neutral-800/60 pt-6 [@media(min-height:1000px)]:grid">
                    {[
                      ["AIA · NCS", "Layering standards"],
                      ["LOD 100–350", "BIM models, 400 by request"],
                      ["24–48 h", "Redline turnaround"],
                      ["Archicad · IFC · RVT · DWG · PDF", "Delivery formats"],
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
          // v3.0 point 1: "Why work with us" takes the slot between the two takeovers; the profile
          // card comes last, so the principal's introduction leads straight into the footer.
          chapters={[
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
                description="Photorealistic interior and exterior renders in Twinmotion, live-linked to the Archicad model — built from an existing model, CAD drawings, or sketches."
                images={VISUALIZATION_IMAGES}
                cta={{ label: "Explore visualization", href: ROUTES.visualization }}
                secondary={{ label: "Project Library", href: `${ROUTES.projects}#visualization` }}
              />
            ),
            (compact) => <SpecialistProfileCard specialist={specialist} compact={compact} />,
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
