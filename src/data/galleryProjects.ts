import { TrackImage } from "../types";
import { assetUrl } from "../utils/assetPath";
import { BIM_PRODUCTION_IMAGES, COMPUTATIONAL_IMAGES, EXTERIOR_SHOWCASE_IMAGES } from "./architecturalData";
import { GALLERY_ASSETS, GalleryAsset } from "./galleryAssets";
import PROJECT_PAGES from "./projectPages.json";
import { EstimatorService } from "./routes";
import { Testimonial, TESTIMONIALS } from "./testimonials";

// The v3.0 gallery (documentation/v3.0-gallery-expansion.md §4 and §7): every project with three
// or more items gets its own page, and the Project Library shows project cards first, then the
// remaining items in a justified grid. Image sizes, thumbnails and titles come from
// galleryAssets.ts, which the asset pipeline generates.

export type GalleryCategory = "interior" | "exterior" | "furniture" | "drawings";

export interface GalleryProject {
  slug: string;
  title: string;
  /** What kind of work it is, e.g. "Interior visualization" — the card's and page's eyebrow. */
  kind: string;
  /** One line, for the card. */
  summary: string;
  /** The page's text, one paragraph per entry. */
  description: string[];
  /** Only facts the owner has given; nothing is estimated. */
  facts?: Array<{ label: string; value: string }>;
  category: GalleryCategory;
  cover: TrackImage;
  items: TrackImage[];
  /** "Pieces in this room": the furniture shown on its own. */
  pieces?: TrackImage[];
  services: EstimatorService[];
}

const FILE_KIND: Record<string, TrackImage["kind"]> = {
  sheets: "drawing",
  "bimcad-workflow": "screenshot",
};

/** The published file's path under public/portfolio/, e.g. "sheets/02-kids-room-elevation-a.webp". */
export const portfolioPath = (src: string) => src.slice(src.indexOf("portfolio/") + "portfolio/".length);

/** Size and thumbnail of a published image, looked up by its src. */
export function assetOf(img: TrackImage): GalleryAsset | undefined {
  return GALLERY_ASSETS[portfolioPath(img.src)];
}

/** The ≤ 800 px WebP thumbnail beside every gallery image, or the image itself if it has none. */
export function thumbOf(img: TrackImage): { src: string; width: number; height: number } {
  const asset = assetOf(img);
  if (!asset) return { src: img.src, width: img.width, height: img.height };
  return {
    src: assetUrl(`/portfolio/thumbs/${portfolioPath(img.src).replace(/\.(jpe?g|png|webp)$/i, ".webp")}`),
    width: asset.tw,
    height: asset.th,
  };
}

interface ImageOptions {
  title?: string;
  caption?: string;
  kind?: TrackImage["kind"];
  project?: string;
}

/** A gallery image by its path under public/portfolio/. Fails the build if the file isn't in the asset table. */
export function galleryImage(path: string, caption: string, options: Omit<ImageOptions, "caption"> = {}): TrackImage {
  const asset = GALLERY_ASSETS[path];
  if (!asset) throw new Error(`galleryProjects: ${path} isn't in galleryAssets.ts — run the asset pipeline`);
  const title = options.title ?? asset.title;
  if (!title) throw new Error(`galleryProjects: ${path} needs a title`);
  return {
    src: assetUrl(`/portfolio/${path}`),
    width: asset.w,
    height: asset.h,
    title,
    caption,
    kind: options.kind ?? FILE_KIND[path.split("/")[0]] ?? "render",
    ...(options.project ? { project: options.project } : {}),
    ...(asset.crop ? { crop: asset.crop } : {}),
  };
}

const INTERIOR = "Interior visualization";
const EXTERIOR = "Exterior visualization";
const inProject = (project: string) => (path: string, caption = INTERIOR, options: Omit<ImageOptions, "caption"> = {}) =>
  galleryImage(path, caption, { ...options, project });

// ---------------------------------------------------------------------------------------------
// Furniture & Virtual Staging (P14): the owner's 1–9 order, the stand-out pieces leading each
// category (§3). Captions describe the piece only — nothing about where a model came from (D2).
// ---------------------------------------------------------------------------------------------

export const FURNITURE_CATEGORIES: Array<{ folder: string; label: string }> = [
  { folder: "1-chairs", label: "Chairs" },
  { folder: "2-sofas", label: "Sofas and lounge seating" },
  { folder: "3-beds", label: "Beds" },
  { folder: "4-consoles", label: "Consoles and sideboards" },
  { folder: "5-dining-tables", label: "Dining" },
  { folder: "6-side-tables", label: "Side tables" },
  { folder: "7-desks", label: "Desks" },
  { folder: "8-coffee-tables", label: "Coffee tables" },
  { folder: "9-benches", label: "Benches" },
];

const STANDOUT_PIECES = new Set([
  "1-chairs/03-wave-lounge-chair-burgundy-velvet.webp",
  "2-sofas/01-curved-modular-sofa-chocolate.webp",
  "2-sofas/03-serpentine-sofa-with-drum-table.webp",
  "2-sofas/05-channel-tufted-corner-sofa-with-console.webp",
  "2-sofas/09-swivel-lounge-chair-moss-velvet.webp",
  "2-sofas/10-bubble-armchair-rust.webp",
  "3-beds/12-oak-bed-with-cane-nightstands.webp",
  "3-beds/15-walnut-panel-bed-suite.webp",
  "4-consoles/01-cane-front-sideboard-arched-doors.webp",
  "4-consoles/07-half-moon-console-fan-front.webp",
  "4-consoles/14-fluted-console-white.webp",
  "5-dining-tables/04-round-dining-set-curved-chairs.webp",
  "5-dining-tables/09-round-oak-dining-set-fluted-pedestal.webp",
  "5-dining-tables/10-classic-round-dining-set.webp",
  "6-side-tables/02-patterned-side-tables-with-globe-lamp.webp",
]);

const piece = (file: string) => {
  const folder = file.split("/")[0];
  const label = FURNITURE_CATEGORIES.find((c) => c.folder === folder)?.label ?? "Furniture";
  return galleryImage(`furniture-showcase/${file}`, label, { project: "furniture" });
};

export const FURNITURE_BY_CATEGORY: Array<{ label: string; items: TrackImage[] }> = FURNITURE_CATEGORIES.map(({ folder, label }) => {
  const files = Object.keys(GALLERY_ASSETS)
    .filter((k) => k.startsWith(`furniture-showcase/${folder}/`))
    .map((k) => k.slice("furniture-showcase/".length))
    .sort((a, b) => Number(STANDOUT_PIECES.has(b)) - Number(STANDOUT_PIECES.has(a)) || a.localeCompare(b));
  return { label, items: files.map(piece) };
});

export const FURNITURE: TrackImage[] = FURNITURE_BY_CATEGORY.flatMap((c) => c.items);
/** The stand-out pieces, shown before "Show all". */
export const FURNITURE_HIGHLIGHTS: TrackImage[] = FURNITURE.filter((img) => STANDOUT_PIECES.has(portfolioPath(img.src).slice("furniture-showcase/".length)));

const pieces = (...files: string[]) => files.map(piece);

// ---------------------------------------------------------------------------------------------
// Projects (§4). Titles and card lines live in projectPages.json, which also generates each
// page's HTML (scripts/generate-project-pages.mjs).
// ---------------------------------------------------------------------------------------------

type ProjectContent = Omit<GalleryProject, "slug" | "title" | "kind" | "summary" | "cover"> & { cover?: TrackImage };

const dark = inProject("dark-living-room");
const loft = inProject("bright-loft");
const classical = inProject("classical-apartment");
const grey = inProject("grey-residence");
const sand = inProject("sand-living-room");
const tyler = inProject("tyler-home");
const arched = inProject("arched-living-room");
const kids = inProject("kids-room");
const bath = inProject("master-bathroom");
const apartment = inProject("apartment-interiors");
const serene = inProject("serene-suites");
const vip = inProject("vip-lounge-dubai");
const barndo = inProject("barndo-florida");

const CONTENT: Record<string, ProjectContent> = {
  "dark-living-room": {
    category: "interior",
    description: [
      "A living room in a dark, warm palette: deep upholstery, low evening light and timber, seen from the sofa, the lounge chair and the coffee table.",
      "Below the room, each piece in it is shown on its own: the sofa, the lounge chair, the coffee table and the side tables.",
    ],
    items: [
      dark("visualization-showcase/02-dark-living-room.jpg"),
      dark("visualization-showcase/s1-dark-living-room/01-sofa-and-lamp.webp"),
      dark("visualization-showcase/s1-dark-living-room/02-evening-corner.webp"),
      dark("visualization-showcase/s1-dark-living-room/03-lounge-chair.webp"),
      dark("visualization-showcase/s1-dark-living-room/04-coffee-table.webp"),
    ],
    pieces: pieces(
      "2-sofas/08-pillow-back-sofa-dove-grey.webp",
      "1-chairs/06-low-lounge-chair-chocolate-velvet.webp",
      "8-coffee-tables/01-oval-coffee-table-patterned-base.webp",
      "6-side-tables/01-marble-bowl-side-table.webp",
      "6-side-tables/02-patterned-side-tables-with-globe-lamp.webp"
    ),
    services: ["visualization"],
  },
  "bright-loft": {
    category: "interior",
    description: [
      "An open loft in daylight: a channel-tufted corner sofa, a sculptural wave chair by the glazing, a lounge set and a dining table under the high ceiling.",
      "Below the room, each piece in it is shown on its own.",
    ],
    items: [
      loft("visualization-showcase/03-bright-loft.jpg"),
      loft("visualization-showcase/s2-bright-loft/01-dining.webp"),
      loft("visualization-showcase/s2-bright-loft/02-corner-sofa.webp"),
      loft("visualization-showcase/s2-bright-loft/03-wave-chair-by-the-glazing.webp"),
      loft("visualization-showcase/s2-bright-loft/04-dining-chair.webp"),
    ],
    pieces: pieces(
      "2-sofas/05-channel-tufted-corner-sofa-with-console.webp",
      "1-chairs/03-wave-lounge-chair-burgundy-velvet.webp",
      "2-sofas/17-lounge-set-two-armchairs-and-nesting-tables.webp",
      "5-dining-tables/01-oval-dining-set-charcoal.webp",
      "4-consoles/17-console-table-brass-and-black-glass.webp"
    ),
    services: ["visualization"],
  },
  "classical-apartment": {
    category: "interior",
    description: [
      "A whole apartment in a classical register: panelled walls, turned walnut and warm light, from the study and the living room to the dining room and two bedrooms.",
      "Below the rooms, the nine pieces that furnish them are shown on their own.",
    ],
    items: [
      classical("visualization-showcase/01-home-office.webp"),
      classical("visualization-showcase/s3-classical-apartment/02-living-room.webp"),
      classical("visualization-showcase/s3-classical-apartment/05-dining-room.webp"),
      classical("visualization-showcase/s3-classical-apartment/01-bedroom.webp"),
      classical("visualization-showcase/s3-classical-apartment/04-guest-bedroom.webp"),
      classical("visualization-showcase/s3-classical-apartment/03-display-niche.webp"),
    ],
    pieces: pieces(
      "2-sofas/06-chesterfield-sofa-tan-leather.webp",
      "1-chairs/04-armchair-floral-linen-turned-walnut.webp",
      "5-dining-tables/10-classic-round-dining-set.webp",
      "7-desks/02-writing-desk-and-chair-walnut.webp",
      "3-beds/07-scalloped-headboard-bed.webp",
      "3-beds/08-walnut-bed-spindle-posts.webp",
      "4-consoles/04-walnut-chest-of-drawers.webp",
      "4-consoles/05-walnut-media-console.webp",
      "9-benches/01-tufted-bench-turned-walnut-legs.webp"
    ),
    services: ["visualization"],
  },
  "grey-residence": {
    category: "interior",
    description: [
      "A grey neoclassical living and dining suite, taken close: velvet poufs, a curved sofa, marble, bouclé and the detailing around the fireplace.",
    ],
    items: [
      grey("visualization-showcase/s4-grey-neoclassical/08-living-room.webp"),
      grey("visualization-showcase/s4-grey-neoclassical/05-living-by-the-fire.webp"),
      grey("visualization-showcase/s4-grey-neoclassical/01-curved-sofa.webp"),
      grey("visualization-showcase/s4-grey-neoclassical/02-sofa-and-sculpture.webp"),
      grey("visualization-showcase/s4-grey-neoclassical/03-fireplace.webp"),
      grey("visualization-showcase/s4-grey-neoclassical/04-velvet-poufs.webp"),
      grey("visualization-showcase/s4-grey-neoclassical/06-sofa-detail.webp"),
      grey("visualization-showcase/s4-grey-neoclassical/07-dining-room.webp"),
      grey("visualization-showcase/s4-grey-neoclassical/09-dining-by-the-window.webp"),
      grey("visualization-showcase/s4-grey-neoclassical/10-entry.webp"),
    ],
    services: ["visualization"],
  },
  "sand-living-room": {
    category: "interior",
    description: [
      "A warm-neutral living room in sand, oak and linen, from the wide shot to the vignette: the timber wall, the shelving, the reading chair and the coffee table.",
    ],
    items: [
      sand("visualization-showcase/sand-living-room/03-sand-living-room.webp"),
      sand("visualization-showcase/sand-living-room/04-timber-wall.webp"),
      sand("visualization-showcase/sand-living-room/05-shelving.webp"),
      sand("visualization-showcase/sand-living-room/06-shelving-corner.webp"),
      sand("visualization-showcase/sand-living-room/08-shelving-and-sofa.webp"),
      sand("visualization-showcase/sand-living-room/09-sofa-and-chaise.webp"),
      sand("visualization-showcase/sand-living-room/07-reading-chair.webp"),
      sand("visualization-showcase/sand-living-room/01-coffee-table.webp"),
      sand("visualization-showcase/sand-living-room/02-table-detail.webp"),
    ],
    pieces: pieces("2-sofas/13-chaise-sofa-ivory-linen-brass-feet.webp", "1-chairs/10-club-armchair-taupe-leather.webp"),
    services: ["visualization"],
  },
  "tyler-home": {
    category: "interior",
    description: ["Three rooms of one home: a library around a spiral stair, a living room with a black feature wall, and a sunken fire-pit lounge."],
    items: [
      tyler("visualization-showcase/08-spiral-stair-library.webp"),
      tyler("visualization-showcase/09-black-wall-living-room.webp"),
      tyler("visualization-showcase/10-sunken-fire-pit-lounge.webp"),
    ],
    services: ["visualization"],
  },
  "arched-living-room": {
    category: "interior",
    description: ["One living room under a run of arches, seen from three angles."],
    items: [
      arched("visualization-showcase/arched-living-room/02-arched-living-room.webp"),
      arched("visualization-showcase/arched-living-room/01-portrait-view.webp"),
      arched("visualization-showcase/arched-living-room/03-velvet-sofa.webp"),
    ],
    services: ["visualization"],
  },
  "kids-room": {
    category: "interior",
    description: [
      "A child's bedroom, shown three ways: the whole layout at once in one isometric view, the room as rendered, and the two elevations drawn for the joiner — dimensions and levels included.",
    ],
    items: [
      kids("visualization-showcase/kids-room/01-isometric-view.webp"),
      kids("visualization-showcase/06-teen-bedroom.jpg"),
      kids("sheets/02-kids-room-elevation-a.webp", "Interior elevation"),
      kids("sheets/03-kids-room-elevation-b.webp", "Interior elevation"),
    ],
    services: ["visualization", "bim"],
  },
  "master-bathroom": {
    category: "interior",
    description: ["The whole bathroom at a glance in one isometric view — vanity, walk-in shower and freestanding tub — then the finished views."],
    items: [
      bath("visualization-showcase/master-bathroom/01-isometric-view.webp"),
      bath("visualization-showcase/11-bathroom-tub.jpg"),
      bath("visualization-showcase/12-bathroom-shower.jpg"),
    ],
    services: ["visualization"],
  },
  "apartment-interiors": {
    category: "interior",
    description: ["One apartment, room by room: built-in joinery, ceiling details, TV walls and a dressing niche."],
    items: [
      apartment("visualization-showcase/apartment-interiors/05-living-and-dining.webp"),
      apartment("visualization-showcase/apartment-interiors/06-dining.webp"),
      apartment("visualization-showcase/apartment-interiors/03-bedroom.webp"),
      apartment("visualization-showcase/apartment-interiors/04-bedroom-with-tv-wall.webp"),
      apartment("visualization-showcase/apartment-interiors/02-wardrobe-and-desk.webp"),
      apartment("visualization-showcase/apartment-interiors/01-dressing-niche.webp"),
    ],
    services: ["visualization"],
  },
  furniture: {
    category: "furniture",
    description: [
      "A large library of industry-standard, manufacturer-specified furniture, placed into your design with a designer's eye. Want to see your new room with that exact chair? It can be done.",
    ],
    items: FURNITURE,
    services: ["visualization"],
  },
  "serene-suites": {
    category: "interior",
    description: [
      "Architecture rarely survives the move from page to reality unchanged. Abstract lines collide with outside capital, and risk-averse stakeholders try to dilute the core design intent. Where the architect isn't the owner, necessary site adaptations are seen through a lens of fear.",
      "The strategy here was twofold: anticipate structural and material realities ahead of time, and stay open to adaptation without sacrificing the underlying spatial logic. The built result shows that when you can navigate the gap between drawing and reality yourself, a design survives construction exactly as intended.",
    ],
    facts: [
      { label: "Location", value: "Lahore" },
      { label: "Status", value: "Built" },
    ],
    items: [
      serene("visualization-showcase/serene-suites/01-living-room.webp"),
      serene("sheets/08-serene-suites-one-bed-apartment-plan.webp", "Apartment plan"),
      serene("visualization-showcase/serene-suites/02-bedroom.webp"),
      serene("visualization-showcase/serene-suites/03-kitchen-and-dining.webp"),
      serene("visualization-showcase/serene-suites/04-bathroom.webp"),
    ],
    services: ["visualization", "bim"],
  },
  "vip-lounge-dubai": {
    category: "interior",
    description: [
      "When design meets an external brief, the work becomes an exercise in translation: balancing the client's explicit requirements with spatial flow, and turning tight parameters into a functional, shared vision.",
      "The client first wanted a maximum occupancy of 50 in the main suite, which I strongly advised against. It was reduced to 30.",
    ],
    facts: [{ label: "Location", value: "Dubai" }],
    items: [
      vip("visualization-showcase/vip-lounge-dubai/01-main-suite.webp"),
      vip("sheets/09-vip-lounge-dubai-suites-plan.webp", "Space plan — three suites, with occupancy"),
      vip("visualization-showcase/vip-lounge-dubai/02-seating.webp"),
      vip("visualization-showcase/vip-lounge-dubai/03-lounge.webp"),
    ],
    services: ["consultancy", "visualization"],
  },
  "barndo-florida": {
    category: "exterior",
    description: [
      "The objective was clear: maximize the spatial experience while minimizing the ecological footprint. That meant offsite fabrication and as few wet trades on site as possible. Modular steel-frame manufacturers were ready to collaborate, provided they were supplied with detailed plans, elevations and sections to their specifications.",
      "Solar radiation and wind-rose analyses set the building's massing and axis. Rotating the main volume optimizes the roof pitch for photovoltaic yield and channels the prevailing breezes, and it aligns the living zone west, to frame sunset views over the lake without unwanted solar gain.",
      "The structure was designed for disassembly, recyclable materials and minimal site scarring. Earth-filled tyre footings failed development approval over rubber degradation, so insulated concrete forms replaced them.",
    ],
    facts: [{ label: "Location", value: "Near Lake Pasadena, Florida" }],
    items: [
      barndo("exterior-showcase/barndo-florida/01-exterior-at-dusk.webp", EXTERIOR),
      barndo("exterior-showcase/barndo-florida/05-living-room-and-kitchen.webp"),
      barndo("exterior-showcase/barndo-florida/02-site-aerial.webp", "Site, from the air"),
      barndo("exterior-showcase/barndo-florida/03-solar-study.webp", "Solar radiation study", { kind: "drawing" }),
      barndo("exterior-showcase/barndo-florida/04-wind-rose.webp", "Wind rose for the site", { kind: "drawing" }),
      barndo("sheets/11-barndo-florida-floor-plans.webp", "Main and mezzanine floor plans"),
      barndo("sheets/12-barndo-florida-wall-section.webp", "Wall section"),
      barndo("bimcad-workflow/10a-barndominium-plan.webp", "Dimensioned ground-floor plan", { title: "Barndo, Florida — ground-floor plan" }),
    ],
    services: ["bim"],
  },
};

export const GALLERY_PROJECTS: GalleryProject[] = PROJECT_PAGES.map((page) => {
  const content = CONTENT[page.slug];
  if (!content) throw new Error(`galleryProjects: no content for ${page.slug}`);
  const cover = content.cover ?? content.items.find((i) => portfolioPath(i.src) === page.cover);
  if (!cover) throw new Error(`galleryProjects: ${page.slug}'s cover ${page.cover} isn't one of its items`);
  return { ...content, slug: page.slug, title: page.title, kind: page.kind, summary: page.summary, cover };
});

export const projectBySlug = (slug: string) => GALLERY_PROJECTS.find((p) => p.slug === slug);
export const projectsIn = (category: GalleryCategory) => GALLERY_PROJECTS.filter((p) => p.category === category);

// ---------------------------------------------------------------------------------------------
// The Project Library's grids: everything that isn't inside a project card.
// ---------------------------------------------------------------------------------------------

/** Pairs sit next to each other (plan → render, model → render, two schemes): §4 P11–P13, §8. */
export const INTERIOR_GRID: TrackImage[] = [
  galleryImage("visualization-showcase/singles/04-arched-lounge-red-velvet-chairs.webp", INTERIOR),
  galleryImage("visualization-showcase/04-restaurant-interior.webp", "Interior visualization — hospitality"),
  galleryImage("visualization-showcase/singles/03-open-kitchen-and-living.webp", INTERIOR),
  galleryImage("sheets/01-three-bed-apartment-furnished-plan.webp", "Furnished plan — net floor area 134.71 m²", {
    title: "Three-bed apartment — furnished plan",
  }),
  galleryImage("visualization-showcase/singles/01-three-bed-apartment-living-room.webp", "Interior visualization — the same apartment"),
  galleryImage("visualization-showcase/05-classical-dining.jpg", INTERIOR),
  galleryImage("visualization-showcase/singles/06-classical-dining-white-scheme.webp", "The same room in a white scheme"),
  galleryImage("visualization-showcase/07-lobby-lounge.webp", "Interior visualization — hospitality"),
  galleryImage("visualization-showcase/singles/05-living-room-city-view.webp", INTERIOR),
  galleryImage("visualization-showcase/singles/02-living-room-sectional-and-gallery-wall.webp", INTERIOR),
  galleryImage("visualization-showcase/bedrooms/03-bedroom-arched-niches.webp", "Bedrooms"),
  galleryImage("visualization-showcase/bedrooms/01-bedroom-layered-headboard.webp", "Bedrooms"),
  galleryImage("visualization-showcase/bedrooms/02-bedroom-layered-headboard-second-view.webp", "Bedrooms"),
  galleryImage("visualization-showcase/bedrooms/04-bedroom-green-accents.webp", "Bedrooms"),
  galleryImage("visualization-showcase/bedrooms/05-girls-bedroom-raised-bed-and-desk.webp", "Bedrooms — built-in joinery"),
  galleryImage("visualization-showcase/bedrooms/06-girls-bedroom-second-view.webp", "Bedrooms — built-in joinery"),
];

const exteriorExisting = (file: string) => {
  const img = EXTERIOR_SHOWCASE_IMAGES.find((i) => i.src.endsWith(`/${file}`));
  if (!img) throw new Error(`galleryProjects: exterior ${file} not found`);
  return img;
};

export const EXTERIOR_GRID: TrackImage[] = [
  galleryImage("exterior-showcase/timber-cabin/01-timber-cabin-at-dusk.webp", EXTERIOR),
  galleryImage("exterior-showcase/timber-cabin/02-3d-model.webp", "3D model of the same cabin", { kind: "model" }),
  galleryImage("exterior-showcase/pavilion-restaurant/01-pavilion-restaurant-at-night.webp", "Exterior visualization — hospitality"),
  galleryImage("exterior-showcase/pavilion-restaurant/02-3d-model.webp", "3D model of the same pavilion", { kind: "model" }),
  exteriorExisting("11-facade-closeup-render.webp"),
  exteriorExisting("12-cube-facade-render.webp"),
  exteriorExisting("10-tower-render.jpg"),
  exteriorExisting("01-office-building.webp"),
  exteriorExisting("02-gable-house.webp"),
  exteriorExisting("03-apartment-facade.webp"),
];

export const DRAWING_GRID: TrackImage[] = [
  galleryImage("sheets/02-kids-room-elevation-a.webp", "Interior elevation", { project: "kids-room" }),
  galleryImage("sheets/03-kids-room-elevation-b.webp", "Interior elevation", { project: "kids-room" }),
  galleryImage("sheets/10-fd1-jamb-detail.webp", "Construction detail"),
  galleryImage("sheets/12-barndo-florida-wall-section.webp", "Wall section", { project: "barndo-florida" }),
];

export interface ClientStory {
  title: string;
  image: TrackImage;
  quote: Testimonial;
}

/** The client's drawings, then the client's own words (§9, D5). */
export const CLIENT_STORIES: ClientStory[] = [
  {
    title: "Foxhole House, Wealden",
    image: galleryImage("sheets/06-foxhole-house-wealden-elevation-and-plan.webp", "Elevation and ground-floor plan"),
    quote: TESTIMONIALS.q2,
  },
  {
    title: "California summer home",
    image: galleryImage("sheets/04-california-summer-home-section-and-plan.webp", "Section and plan"),
    quote: TESTIMONIALS.q1,
  },
  {
    title: "Foster home, Australia",
    image: galleryImage("sheets/05-foster-home-australia-axonometrics.webp", "Two axonometric views"),
    quote: TESTIMONIALS.q3,
  },
];

/** The BIM / CAD workflow screens, in the grid rather than a carousel. */
export const WORKFLOW_GROUPS: Array<{ label: string; items: TrackImage[] }> = [
  { label: "BIM production", items: BIM_PRODUCTION_IMAGES },
  { label: "Computational design", items: COMPUTATIONAL_IMAGES },
];

export const SERVICE_LINKS: Record<EstimatorService, { label: string; description: string }> = {
  visualization: {
    label: "Architectural visualization",
    description: "Interior and exterior renders, priced per view — from an existing model, CAD drawings or sketches.",
  },
  bim: {
    label: "BIM / CAD drafting",
    description: "Permit sets, BIM models and working drawings, priced by the drawing set.",
  },
  consultancy: {
    label: "Architect consultant",
    description: "Design review, code strategy and coordination — a principal architect's judgment, billed hourly.",
  },
};
