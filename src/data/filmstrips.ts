import { TrackImage } from "../types";
import { assetUrl } from "../utils/assetPath";
import { EXTERIOR_SHOWCASE_IMAGES, VISUALIZATION_SHOWCASE_IMAGES } from "./architecturalData";
import { FURNITURE, portfolioPath } from "./galleryProjects";
import { RIBBON_FILES, RIBBON_OF } from "./ribbonAssets";
import { projectHref, ROUTES } from "./routes";

// The filmstrip templates (documentation/v3.0-gallery-expansion.md §12): the ribbon mechanic fed
// with different image sets, so every page gets the strips that match its subject. Labels stay
// generic ("BIM modelling"), per the software-naming rule.
//
// Every image on a strip is its ribbon-size copy (scripts/build-ribbon-assets.mjs), at most 1200 px
// tall. A band never opens taller than the shortest image on its strip (`minHeight`), so nothing is
// upscaled: RibbonSequence works out each band's scale from it.

export type FilmstripId = "interior" | "exterior" | "drafting" | "bim" | "computational" | "furniture";

export interface FilmstripTemplate {
  id: string;
  /** What the strip shows, for the "View in the Project Library" link. */
  label: string;
  images: TrackImage[];
  /** The strip's look: dark renders, black line work on white paper, or studio-grey products. */
  paper: "dark" | "white" | "grey";
  /** The shortest image's height in px: the band never opens taller than this. */
  minHeight: number;
  /** An upper limit on the band's open height, as a share of the stage (the look, not a size limit). */
  maxScale: number;
  /** Where "View in the Project Library" leads. */
  href: string;
}

/** An image as its strip shows it: the ribbon file, at that file's size. */
export function ribbonImage(img: TrackImage): TrackImage {
  const light = img.lightSrc ? portfolioPath(img.lightSrc) : RIBBON_OF[portfolioPath(img.src)];
  const file = light && RIBBON_FILES[light];
  if (!file) throw new Error(`filmstrips: no ribbon copy for ${img.src} — run scripts/build-ribbon-assets.mjs`);
  const src = assetUrl(`/portfolio/${light}`);
  return { ...img, src, lightSrc: src, width: file.w, height: file.h };
}

/** A strip image straight from a ribbon file (the screen captures, which have no gallery entry). */
function ribbonFile(path: string, title: string, kind: TrackImage["kind"] = "screenshot"): TrackImage {
  const file = RIBBON_FILES[path];
  if (!file) throw new Error(`filmstrips: ${path} isn't a ribbon file`);
  const src = assetUrl(`/portfolio/${path}`);
  return { src, lightSrc: src, width: file.w, height: file.h, title, caption: title, kind };
}

const fromPath = (path: string, title: string, kind: TrackImage["kind"]): TrackImage => {
  const light = RIBBON_OF[path];
  if (!light) throw new Error(`filmstrips: ${path} has no ribbon copy`);
  return ribbonFile(light, title, kind);
};

function template(
  id: string,
  label: string,
  images: TrackImage[],
  options: { paper?: FilmstripTemplate["paper"]; maxScale?: number; href: string }
): FilmstripTemplate {
  const strip = images.map((img) => (img.lightSrc && img.lightSrc === img.src ? img : ribbonImage(img)));
  return {
    id,
    label,
    images: strip,
    paper: options.paper ?? "dark",
    minHeight: Math.min(...strip.map((img) => img.height)),
    maxScale: options.maxScale ?? 1,
    href: options.href,
  };
}

const sheet = (file: string, title: string) => fromPath(`sheets/${file}`, title, "drawing");

// T3: sheets from the drawing sets, trimmed to the drawing, alternating between projects.
const DRAFTING = [
  sheet("beach-house-a011-first-level.webp", "Texas beach house — first-level plan"),
  sheet("slamburger-a01-floor-plans.webp", "Slamburger restaurant — floor plans"),
  sheet("02-kids-room-elevation-a.webp", "Kids room — interior elevation"),
  sheet("flats-basement-plan.webp", "Urban flats — basement plan"),
  sheet("cran-015-first-floor.webp", "Cran Residence — first-floor plan"),
  sheet("beach-house-a021-elevations.webp", "Texas beach house — elevations"),
  sheet("05-foster-home-australia-axonometrics.webp", "Foster home, Australia — axonometric views"),
  sheet("slamburger-a06-kitchen-elevations.webp", "Slamburger restaurant — kitchen elevations"),
  sheet("flats-section-quantities.webp", "Urban flats — section and quantities"),
  sheet("03-kids-room-elevation-b.webp", "Kids room — interior elevation"),
  sheet("cran-018-sections.webp", "Cran Residence — sections"),
  sheet("beach-house-a012-second-level.webp", "Texas beach house — second-level plan"),
  sheet("slamburger-a04-lighting-electrical.webp", "Slamburger restaurant — lighting and electrical"),
];

// T4: whole screens as captured — model, sheet and schedule side by side — and model views. The two
// 543 px triple screens stay off the strip: they'd hold the whole band to a third of the stage.
const BIM = [
  ribbonFile("ribbon/screens/structural-and-analytical-model.webp", "Structural and analytical model, with its script"),
  fromPath("exterior-showcase/timber-cabin/02-3d-model.webp", "Timber cabin — 3D model", "model"),
  fromPath("bimcad-workflow/originals/03-barndominium-plan-and-script.webp", "Barndominium plan, linked to its script", "screenshot"),
  fromPath("visualization-showcase/master-bathroom/01-isometric-view.webp", "Master bathroom — isometric view", "model"),
  fromPath("exterior-showcase/pavilion-restaurant/02-3d-model.webp", "Pavilion restaurant — 3D model", "model"),
];

// T5: computational work, screens as captured (dark UI), and one parametric piece.
const COMPUTATIONAL = [
  ribbonFile("ribbon/screens/fractal-panel-script.webp", "Fractal panel script"),
  fromPath("bimcad-workflow/06-facade-paneling-script.jpg", "Façade paneling script", "screenshot"),
  ribbonFile("ribbon/screens/point-cloud-analysis.webp", "Point-cloud analysis"),
  fromPath("bimcad-workflow/07-solar-wind-analysis.jpg", "Solar and wind analysis", "screenshot"),
  fromPath("bimcad-workflow/originals/04-slat-wall-model-and-script.webp", "Slat wall model and script", "screenshot"),
  fromPath("parametric-furniture/2.png", "Ribbed seating", "render"),
  ribbonFile("ribbon/screens/point-pattern-script.webp", "Point pattern script"),
  fromPath("bimcad-workflow/09-diagrid-pattern-script.jpg", "Diagrid pattern", "screenshot"),
  fromPath("bimcad-workflow/04-gis-site-terrain.jpg", "Site terrain from GIS", "screenshot"),
  fromPath("bimcad-workflow/08-environmental-analysis.jpg", "Environmental analysis", "screenshot"),
  fromPath("bimcad-workflow/03-nesting-optimization.jpg", "Nesting for fabrication", "screenshot"),
];

// T6: the furniture renders tall enough for a band that opens to 700 px (about half the pieces).
const FURNITURE_STRIP = FURNITURE.filter((img) => img.height >= 700);

// Drawings, model views and screens open to about two thirds of what the renders do (owner,
// 2026-09-25): they're lower resolution than the renders, and line work and interface text show
// their pixels first.
const LINE_WORK = 0.65;

export const FILMSTRIP_TEMPLATES: Record<FilmstripId, FilmstripTemplate> = {
  // T1 and T2 are the homepage's ribbons, unchanged. The exterior band keeps its 0.75 look (it
  // leaves a little void around the façades), now as a cap rather than a fixed size.
  interior: template("interior", "interior renders", VISUALIZATION_SHOWCASE_IMAGES, { href: `${ROUTES.projects}#interior` }),
  exterior: template("exterior", "exterior renders", EXTERIOR_SHOWCASE_IMAGES, {
    maxScale: 0.75,
    href: `${ROUTES.projects}#exterior`,
  }),
  drafting: template("drafting", "drawing sets", DRAFTING, { paper: "white", maxScale: LINE_WORK, href: `${ROUTES.projects}#drawing-sets` }),
  bim: template("bim", "BIM modelling", BIM, { maxScale: LINE_WORK, href: `${ROUTES.projects}#bim-workflow` }),
  computational: template("computational", "computational design", COMPUTATIONAL, { maxScale: LINE_WORK, href: `${ROUTES.projects}#bim-workflow` }),
  furniture: template("furniture", "furniture", FURNITURE_STRIP, { paper: "grey", href: projectHref("furniture") }),
};

/** Which strips open and close each page with ribbons: [top band, bottom band]. Ribbons are for
 *  the homepage and the services only (owner, 2026-09-26). A change here is all a refinement needs. */
export const PAGE_FILMSTRIPS = {
  servicesHub: ["interior", "bim"],
  bimCad: ["drafting", "bim"],
  visualization: ["interior", "furniture"],
  consultancy: ["computational", "bim"],
} as const satisfies Record<string, readonly [FilmstripId, FilmstripId]>;

export const pageFilmstrips = (page: keyof typeof PAGE_FILMSTRIPS): [FilmstripTemplate, FilmstripTemplate] => {
  const [top, bottom] = PAGE_FILMSTRIPS[page];
  return [FILMSTRIP_TEMPLATES[top], FILMSTRIP_TEMPLATES[bottom]];
};
