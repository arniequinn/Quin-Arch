import { ProjectTypeOption, ServiceOption, PortfolioItem, SpecialistProfile, TargetMarket, MarketBenchmarkRates, TrackImage } from "../types";
import { assetUrl } from "../utils/assetPath";

export const DEFAULT_SPECIALIST_PROFILE: SpecialistProfile = {
  name: "Arslan Qaiser",
  brandName: "Quintessential Architecture",
  title: "Principal Architect, BIM Technologist & Computational Specialist",
  tagline: "Quintessential Architecture: Maintaining harmony between person, place, and space over short-lived monetary or aesthetic trends.",
  email: "arslan.qaiser1991@gmail.com",
  phone: "+92 322 4316477",
  whatsapp: "+923224316477",
  location: "Lahore, Pakistan (Delivering to USA, UK, Canada, Australia & International)",
  registration: "PCATP-registered architect (A-07767)",
  education: "Bachelor of Architecture (B.Arch, Distinction in Design) — National College of Arts (NCA)",
  logoUrl: assetUrl("/portfolio/quin-arch-logo.png"),
  // 240px WebP (~7 KB): the avatar never renders above 80 CSS px. The full-size
  // arslan-profile.png stays in /portfolio for the Person structured data's `image`.
  avatarUrl: assetUrl("/portfolio/arslan-profile.webp"),
  socials: {
    linkedin: "https://www.linkedin.com/in/arslan-qaiser-947976188/",
    instagram: "https://instagram.com/quin_arch",
    instagramHandle: "@quin_arch",
    youtube: "https://www.youtube.com/@arslanqaiser6980",
    cadcrowd: "https://www.cadcrowd.com/profile/36968-quintessential-architecture",
    fiverr: "https://www.fiverr.com/s/X0R4azm",
    freelancer: "https://www.freelancer.com/u/arslanqaiser1991?frm=arslanqaiser1991&sb=t",
    upwork: "https://www.upwork.com/freelancers/~017cb25c6f0d1d2375?mp_source=share"
  },
  availableFor: [
    "Virtual Design & Construction (VDC) — Full Remote Production",
    "Construction Documentation Packages (IBC, IRC, Title 24, FBC)",
    "BIM Models (LOD 100–350; LOD 400 by request)",
    "Parametric & Computational Design (Rhino + Grasshopper, connected to Archicad through Tapir)",
    "Clash Detection & Coordination (Archicad Collision Detection; Navisworks Manage for large federated models)",
    "Millwork / Casework Documentation",
    "Architectural Visualization (Twinmotion live link, Coohom)",
    "Dedicated White-Label BIM/VDC Retainers for Architecture & Engineering Firms"
  ],
  softwareProficiencies: [
    "Archicad — BIM modeling, drafting & detailing (LOD 100–350)",
    "GDL — parametric objects",
    "Rhino + Grasshopper, connected to Archicad through Tapir",
    "Python — Archicad automation through Tapir",
    "Ladybug & Karamba 3D (Solar/Structural)",
    "Twinmotion (live link), Coohom",
    "BIMx — client model review"
  ],
  yearsExperience: 9,
  completedProjectsCount: 380,
  baseHourlyRate: 45,
  bio: "PCATP-registered architect (A-07767) and computational technologist with a B.Arch (Distinction in Design) from the prestigious National College of Arts (NCA). Backed by 9+ years of independent remote consulting and firm coordination across residential, commercial, and hospitality sectors. Specializing in code-compliant permit packages, high-detail 3D BIM models, parametric solar/wind analysis, and overflow production for architecture firms and builders in the US, UK, Canada and Australia — authored in Archicad, delivered in your standards."
};

export const PROJECT_TYPES: ProjectTypeOption[] = [
  {
    id: "residential_single",
    name: "Custom Single-Family Home",
    category: "Residential",
    defaultSqFt: 2800,
    baseComplexity: 1.0,
    description: "A new custom home, villa or vacation house that needs a complete permit set.",
  },
  {
    id: "residential_adu",
    name: "ADU & Guest House",
    category: "Residential",
    defaultSqFt: 850,
    baseComplexity: 0.85,
    description: "A detached or attached accessory dwelling unit, garage conversion or guest suite.",
  },
  {
    id: "renovation_addition",
    name: "Remodel & Addition",
    category: "Residential",
    defaultSqFt: 1800,
    baseComplexity: 1.1,
    description: "Second-storey additions, bump-outs and structural wall removals, drawn as existing vs. proposed.",
  },
  {
    id: "residential_multifamily",
    name: "Multi-Family & Townhomes",
    category: "Residential",
    defaultSqFt: 6500,
    baseComplexity: 1.25,
    description: "Duplex to mid-rise apartment buildings and townhouse rows with repeated unit plans.",
  },
  {
    id: "commercial_retail",
    name: "Retail & Office",
    category: "Commercial",
    defaultSqFt: 3500,
    baseComplexity: 1.15,
    description: "Storefronts, offices and tenant improvements, including accessibility compliance.",
  },
  {
    id: "commercial_hospitality",
    name: "Restaurant & Hospitality",
    category: "Commercial",
    defaultSqFt: 2600,
    baseComplexity: 1.3,
    description: "Dining rooms and commercial kitchens, with equipment layouts for health-department review.",
  },
  {
    id: "interior_fitout",
    name: "Interior Fit-Out & Millwork",
    category: "Specialized",
    defaultSqFt: 2000,
    baseComplexity: 0.95,
    description: "High-end interiors: ceilings and lighting, finishes, joinery and interior elevations.",
  },
  {
    id: "as_built_conversion",
    name: "As-Built CAD & BIM",
    category: "Specialized",
    defaultSqFt: 3000,
    baseComplexity: 0.75,
    description: "PDF scans and sketches redrawn as clean CAD and BIM files — from supplied records, not field-verified.",
  },
];

export const SERVICE_OPTIONS: ServiceOption[] = [
  {
    id: "permit_drawings",
    name: "Construction Documentation Package",
    shortName: "Construction documentation",
    description: "The permit submission: site plan, dimensioned floor plans, elevations, sections, door and window schedules, and code sheets where the project type needs them.",
    standardTurnaroundDays: 7,
    softwareUsed: ["Archicad", "DWG export", "Bluebeam Revu (client licence)"],
  },
  {
    id: "bim_modeling",
    name: "BIM Model (LOD 100–350)",
    shortName: "BIM model",
    description: "A coordinated Archicad model with parametric GDL objects, composites and schedules — delivered as the native file, IFC, and an .rvt export on request (geometry only, no editable families).",
    standardTurnaroundDays: 8,
    softwareUsed: ["Archicad", "GDL", "IFC", "BIMx"],
  },
  {
    id: "construction_docs",
    name: "Details & Working Drawings",
    shortName: "Details & working drawings",
    description: "Large-scale drawings for contractor pricing and construction: wall sections, envelope, foundation and stair details, enlarged plans.",
    standardTurnaroundDays: 7,
    softwareUsed: ["Archicad", "DWG export", "AIA CAD Standards"],
  },
  {
    id: "millwork_shop_drawings",
    name: "Millwork & Joinery Documentation",
    shortName: "Millwork documentation",
    description: "Interior elevations and joinery details for kitchens, vanities, counters and bespoke cabinetry, with materials and hardware.",
    standardTurnaroundDays: 5,
    softwareUsed: ["Archicad", "DWG export", "Cabinet Vision (client licence)"],
  },
  {
    id: "mep_structural_coordination",
    name: "Multi-Discipline Coordination",
    shortName: "Multi-discipline coordination",
    description: "Clash detection between the architectural, structural and MEP models, with an issues log — resolved on screen before anyone is on site.",
    standardTurnaroundDays: 5,
    softwareUsed: ["Archicad", "Navisworks Manage (client licence)", "IFC"],
  },
];

// ---------------------------------------------------------------------------------------------
// Images. `width`/`height` are the files' native pixel sizes: galleries never show an image wider
// than that, and screenshots and drawings are always shown whole (see ProjectGallery.tsx).
// ---------------------------------------------------------------------------------------------

const img = (
  path: string,
  width: number,
  height: number,
  title: string,
  caption: string,
  kind: TrackImage["kind"],
  lightPath?: string,
): TrackImage => ({
  src: assetUrl(path),
  width,
  height,
  title,
  caption,
  kind,
  ...(lightPath ? { lightSrc: assetUrl(lightPath) } : {}),
});

const sheet = (file: string, title: string, caption: string, width = 2000, height = 1415) =>
  img(`/portfolio/sheets/${file}`, width, height, title, caption, "drawing");

export const PORTFOLIO_SAMPLES: PortfolioItem[] = [
  {
    id: "sample-beach-house",
    title: "Texas Coastal Beach House Residence",
    category: "CAD Permit Sets",
    description: "Architectural permit drawing package for an elevated coastal residence in Texas. Designed for high-velocity coastal hurricane wind zones with deep piling foundation, wraparound cantilever sundeck, open cathedral living, and IRC storm compliance.",
    software: ["Archicad", "DWG export", "IRC / Coastal Code Standards"],
    sheetDetails: "Floor plans for every level and elevations",
    cover: sheet("beach-house-south-elevation.webp", "South elevation", "Sheet A.02.1 — south elevation", 1815, 723),
    images: [
      sheet("beach-house-a011-first-level.webp", "First level plan", "Sheet A.01.1 — first level, with the pool terrace"),
      sheet("beach-house-a012-second-level.webp", "Second level plan", "Sheet A.01.2 — second level, and the garage level of the detached outbuilding"),
      sheet("beach-house-a013-lofts.webp", "Lofts plan", "Sheet A.01.3 — lofts, and the apartment above the garage"),
      sheet("beach-house-a021-elevations.webp", "Elevations", "Sheet A.02.1 — south and north elevations"),
    ],
    // From the drawing set itself (title blocks and sheet list) — for the owner to confirm and add to.
    facts: {
      location: "Coastal Texas (Gulf Coast)",
      floors: "2 + loft, plus a detached garage with an apartment above",
      sheets: 4,
      drawings: "Plans for every level, south and north elevations",
      role: "Design consultant",
    },
    specs: [
      { label: "Foundation", value: "Heavy timber piling & braced posts" },
      { label: "Code basis", value: "IRC coastal high-wind / TDI" },
    ],
    tags: ["Beach House", "Coastal Architecture", "High Wind Zone", "IRC Permit"],
    clientReview: {
      quote: "Arslan delivered a flawless set of plans compliant with difficult coastal codes. Very responsive and polite.",
      platform: "Freelancer",
      rating: 5
    }
  },
  {
    id: "sample-slamburger",
    title: "Slamburger Commercial Fast-Food Restaurant & Kitchen",
    category: "CAD Permit Sets",
    description: "Complete commercial hospitality and food-service architectural documentation. Produced front-of-house customer dining layout, commercial kitchen hood chases, grease trap routing, ADA compliant restrooms, and branded exterior facade elevations.",
    software: ["Archicad", "DWG export", "Health & Fire Code"],
    sheetDetails: "Plans, services layouts, kitchen elevations and renders",
    cover: img("/portfolio/sheets/slamburger-render-counter.webp", 1632, 1224, "Counter and booth seating", "Render from the drawing set", "render"),
    images: [
      img("/portfolio/sheets/slamburger-render-dining.webp", 1632, 1224, "Service counter", "Render — the counter and open kitchen from the dining room", "render"),
      img("/portfolio/sheets/slamburger-render-seating.webp", 1632, 1224, "Dining room", "Render — booth and table seating", "render"),
      img("/portfolio/sheets/slamburger-render-kitchen.webp", 1632, 1224, "Commercial kitchen", "Render — cooking line and prep area", "render"),
      sheet("slamburger-a01-floor-plans.webp", "Floor plans", "Sheet A.01 — ground and first floor, with the 21-item kitchen equipment schedule"),
      sheet("slamburger-a02-hvac-ground.webp", "HVAC plan", "Sheet A.02 — ground floor HVAC: hood, air curtains, supply and exhaust"),
      sheet("slamburger-a04-lighting-electrical.webp", "Lighting & electrical", "Sheet A.04 — lighting and power layouts with the device legend"),
      sheet("slamburger-a05-plumbing.webp", "Plumbing", "Sheet A.05 — waste, grey-water and fresh-water runs"),
      sheet("slamburger-a06-kitchen-elevations.webp", "Kitchen elevations", "Sheet A.06 — the four kitchen elevations, keyed to a plan"),
    ],
    facts: {
      floors: "2 (ground and first)",
      sheets: 11,
      drawings: "Floor plans, HVAC, lighting & electrical, plumbing, kitchen elevations and 5 renders",
      role: "Architecture design consultant",
    },
    specs: [
      { label: "Scope", value: "Storefront, dining and commercial kitchen" },
      { label: "Compliance", value: "Accessibility, health and fire codes" },
    ],
    tags: ["Commercial", "Restaurant", "Commercial Kitchen", "Storefront"]
  },
  {
    id: "sample-cran-residence",
    title: "Cran Residence — Traditional Two-Story Home",
    category: "3D BIM",
    description: "Classic two-story red brick residence with a pitched roof, bay-fronted entry, and fenced front garden. Modeled from client sketches into a coordinated 3D BIM massing study for early design sign-off ahead of full construction documentation.",
    software: ["Archicad", "Twinmotion"],
    sheetDetails: "Working model: plans by discipline, sections",
    cover: img("/portfolio/cran-perspective.jpg", 1478, 754, "Perspective", "Sheet 01.1 — perspective from the working model", "drawing"),
    images: [
      sheet("cran-012-ground-floor.webp", "Ground floor", "Sheet 01.2 — ground floor, furniture layout"),
      sheet("cran-015-first-floor.webp", "First floor", "Sheet 01.5 — first floor, furniture layout"),
      sheet("cran-014-ground-floor-mep.webp", "Ground floor MEP", "Sheet 01.4 — ground floor services"),
      sheet("cran-016-first-floor-structure.webp", "First floor structure", "Sheet 01.6 — first floor joist layout"),
      sheet("cran-018-sections.webp", "Building sections", "Sheet 01.8 — building sections through both floors"),
    ],
    facts: {
      floors: "2",
      sheets: 9,
      drawings: "Perspective, furniture, structural and MEP plans for each floor, and building sections",
      role: "Design consultant",
    },
    specs: [
      { label: "Style", value: "Traditional brick residential" },
      { label: "Units", value: "Metric" },
    ],
    tags: ["Traditional Home", "Residential", "Brick Facade", "3D BIM"]
  },
  {
    id: "sample-urban-flats",
    title: "Urban Multi-Family Residential Flats & Layouts",
    category: "3D BIM",
    description: "Space-optimized multi-unit residential apartment layout and unit typologies, fire egress stairs, MEP shafts, and structural grid alignment for urban development.",
    software: ["Archicad", "DWG export", "IBC Code Standards"],
    sheetDetails: "Structural grid plan, building section and quantities",
    cover: sheet("flats-basement-plan-crop.webp", "Basement plan", "Basement plan on the structural grid", 2072, 1393),
    images: [
      sheet("flats-basement-plan.webp", "Basement plan", "Basement plan — structural grid A–F × 1–4, with dimension strings"),
      sheet("flats-section-quantities.webp", "Section and quantities", "Building section through five levels, with quantities by element (areas and volumes)"),
    ],
    facts: {
      floors: "Basement + 3 storeys",
      sheets: 2,
      drawings: "Basement structural plan, building section, quantity schedule",
      role: "Design consultant",
    },
    specs: [
      { label: "Typology", value: "Multi-family apartment flats" },
      { label: "Structural grid", value: "A–F × 1–4" },
      { label: "Key focus", value: "Egress, shafts, unit efficiency" },
    ],
    tags: ["Multi-Family", "Flats", "3D BIM", "Urban Architecture"],
    clientReview: {
      quote: "Delivered exactly what was required for our architectural competition. Highly recommended!",
      platform: "Fiverr",
      rating: 5
    }
  }
];

const wf = (file: string, width: number, height: number, title: string, caption: string) =>
  img(`/portfolio/bimcad-workflow/${file}`, width, height, title, caption, "screenshot");

// BIM production: real model views, sheets and schedules, each a single pane with a caption.
export const BIM_PRODUCTION_IMAGES: TrackImage[] = [
  wf("01a-floor-plan.webp", 438, 398, "Apartment floor plan", "BIM model — unit layouts with areas, in a 47-unit residential tower"),
  wf("01b-elevation.webp", 432, 398, "Front elevation", "BIM model — the same tower in elevation, generated from the model"),
  wf("01c-window-schedule.webp", 728, 330, "Window schedule", "BIM model — a model-driven schedule: sizes, sill and head heights, quantities and cost"),
  wf("05a-structural-model.webp", 800, 810, "Structural model", "BIM model — the tower's structural frame: columns, slabs and core"),
  wf("05b-slab-outlines.webp", 560, 850, "Slab outlines", "3D model — slab outlines taken from every level of the model"),
  wf("05c-quantity-script.webp", 960, 710, "Quantity take-off", "Visual script — wall and slab areas calculated straight from the model"),
  wf("10a-barndominium-plan.webp", 452, 766, "Barndominium floor plan", "BIM model — dimensioned ground-floor plan"),
  wf("10b-model-property-link.webp", 960, 690, "Model data in the script", "Visual script — curtain-wall properties read live from the BIM model"),
];

// Computational design: scripts, analysis and the geometry they drive.
export const COMPUTATIONAL_IMAGES: TrackImage[] = [
  wf("06-facade-paneling-script.jpg", 1920, 1042, "Façade paneling", "Parametric model — scripted panels on a curved tower"),
  wf("09-diagrid-pattern-script.jpg", 1920, 1041, "Diagrid pattern", "Visual script — a façade pattern generated from rules"),
  wf("11a-slat-wall-model.webp", 554, 820, "Slat wall model", "3D model — a wave-form slat wall, generated fin by fin"),
  wf("11b-slat-wall-script.webp", 510, 794, "Slat wall script", "Script — the depth function that shapes every fin"),
  wf("02b-twisted-column-model.webp", 497, 542, "Twisted column", "3D model — the form produced by the rolling-polygon script"),
  wf("02a-rolling-polygon-script.webp", 456, 542, "Rolling-polygon script", "Script — rotating and translating a polygon step by step"),
  wf("02c-visual-script.webp", 500, 542, "Visual script", "Visual script — the definition driving the twisted form"),
  wf("07-solar-wind-analysis.jpg", 1920, 1041, "Solar and wind analysis", "Environmental analysis — sun paths, radiation, direct sun hours and wind roses for a site"),
  wf("08-environmental-analysis.jpg", 1906, 1039, "Environmental analysis", "Environmental analysis — direct sun hours and a wind-speed profile around a building"),
  wf("04-gis-site-terrain.jpg", 1914, 1040, "Site terrain from GIS", "Parametric model — terrain and context buildings built from GIS data"),
  wf("03-nesting-optimization.jpg", 1920, 1038, "Nesting for fabrication", "Parametric model — parts nested onto sheets for cutting"),
];

export const BIMCAD_WORKFLOW_IMAGES: TrackImage[] = [...BIM_PRODUCTION_IMAGES, ...COMPUTATIONAL_IMAGES];

const render = (folder: string, file: string, width: number, height: number, title: string, caption: string, prefix: string) =>
  img(
    `/portfolio/${folder}/${file}`,
    width,
    height,
    title,
    caption,
    "render",
    `/portfolio/ribbon/${prefix}${file.replace(/[.](jpe?g|webp)$/i, ".webp")}`,
  );

const inProject = (project: string, image: TrackImage): TrackImage => ({ ...image, project });

// Finished interior renders, on the homepage ribbon. 06-teen-bedroom.jpg (1024 × 576) is left out
// here — at ribbon size it would be upscaled — and shown as a tile on the Kids Room project page.
export const VISUALIZATION_SHOWCASE_IMAGES: TrackImage[] = [
  inProject("classical-apartment", render("visualization-showcase", "01-home-office.webp", 3200, 2400, "Classical apartment — study", "Interior visualization", "int-")),
  inProject("dark-living-room", render("visualization-showcase", "02-dark-living-room.jpg", 1600, 1200, "Dark living room", "Interior visualization — a dark, warm palette", "int-")),
  inProject("bright-loft", render("visualization-showcase", "03-bright-loft.jpg", 1920, 1080, "Bright loft", "Interior visualization — daylight study", "int-")),
  render("visualization-showcase", "04-restaurant-interior.webp", 3840, 3454, "Restaurant — floral arches", "Interior visualization — hospitality", "int-"),
  render("visualization-showcase", "05-classical-dining.jpg", 1920, 1080, "Classical dining room", "Interior visualization", "int-"),
  render("visualization-showcase", "07-lobby-lounge.webp", 1200, 797, "Lobby lounge", "Interior visualization — hospitality", "int-"),
  inProject("tyler-home", render("visualization-showcase", "08-spiral-stair-library.webp", 1111, 896, "Tyler Home — library with spiral stair", "Interior visualization", "int-")),
  inProject("tyler-home", render("visualization-showcase", "09-black-wall-living-room.webp", 1109, 894, "Tyler Home — black feature wall", "Interior visualization", "int-")),
  inProject("tyler-home", render("visualization-showcase", "10-sunken-fire-pit-lounge.webp", 1103, 896, "Tyler Home — sunken fire-pit lounge", "Interior visualization", "int-")),
  inProject("master-bathroom", render("visualization-showcase", "11-bathroom-tub.jpg", 1600, 1200, "Master bathroom — freestanding tub", "Interior visualization", "int-")),
  inProject("master-bathroom", render("visualization-showcase", "12-bathroom-shower.jpg", 1600, 1200, "Master bathroom — walk-in shower", "Interior visualization", "int-")),
];

// Finished exterior renders and façade studies. barn-residence-render.jpg stays out of this set —
// it's the render in the Design Philosophy page's render-vs-wireframe comparison.
export const EXTERIOR_SHOWCASE_IMAGES: TrackImage[] = [
  render("exterior-showcase", "10-tower-render.jpg", 752, 1413, "High-rise tower", "Exterior visualization", "ext-"),
  render("exterior-showcase", "11-facade-closeup-render.webp", 2000, 1782, "Façade close-up", "Exterior visualization — façade detail", "ext-"),
  render("exterior-showcase", "12-cube-facade-render.webp", 2000, 1822, "Cubic façade study", "Exterior visualization — façade study", "ext-"),
  render("exterior-showcase", "01-office-building.webp", 901, 674, "Office building", "Exterior visualization", "ext-"),
  render("exterior-showcase", "02-gable-house.webp", 885, 669, "Gable house", "Exterior visualization — residential", "ext-"),
  render("exterior-showcase", "03-apartment-facade.webp", 899, 898, "Apartment façade", "Exterior visualization — residential", "ext-"),
];

export const JURISDICTIONS = [
  { id: "us_irc_ibc", name: "USA — International Building / Residential Code (IBC / IRC)", standard: "IBC 2024 / IRC 2024" },
  { id: "us_california", name: "California (CBC / CRC / Title 24 Energy / LADBS)", standard: "California Code of Regulations Title 24" },
  { id: "us_florida", name: "Florida (FBC Hurricane / High Velocity Wind Zone)", standard: "FBC 8th Edition (2023)" },
  { id: "us_new_york", name: "New York City (NYC Building Code / DOB Now)", standard: "2022 NYC Construction Codes" },
  { id: "uk_eurocode", name: "United Kingdom (Approved Documents Part A–S / RIBA)", standard: "UK Building Regs 2024 & RIBA Plan of Work" },
  { id: "canada_nbc", name: "Canada (National Building Code NBC / OBC)", standard: "NBC 2020 / Ontario Building Code" },
  { id: "australia_ncc", name: "Australia (National Construction Code NCC / BCA)", standard: "NCC 2022 / Australian Standards" },
  { id: "international_custom", name: "International / local municipality code", standard: "Universal Architectural Drafting Standards" }
];

// Where the project is now. Phase names only — LOD is set per element, not per phase (BIMForum
// 2025); see the LOD guide. The multiplier reflects how much of the production work is still ahead.
export const PROJECT_STAGES = [
  { id: "napkin_sketch", name: "Concept", desc: "A brief, sketches or massing studies — no production drawings yet.", priceMultiplier: 1.05 },
  { id: "schematic", name: "Schematic design", desc: "Plans and elevations are agreed and ready to be drawn up properly.", priceMultiplier: 1.0 },
  { id: "permit_ready", name: "Design development", desc: "The design is resolved; the permit set comes next.", priceMultiplier: 0.95 },
  { id: "construction_bidding", name: "Construction documents", desc: "Details, schedules and coordination for contractor pricing.", priceMultiplier: 1.0 },
  { id: "redlines_revisions", name: "Construction administration", desc: "Plan-check corrections, RFI answers and redlines on an existing set.", priceMultiplier: 0.35 }
];

// Shared by the BIM/CAD and visualization estimators (A.3: the same schedule premiums).
export const TIMELINE_OPTIONS = [
  { id: "standard", name: "Standard", multiplier: 1.0, note: "Standard rate" },
  { id: "expedited", name: "Expedited", multiplier: 1.25, note: "+25% · about a third faster" },
  { id: "urgent", name: "Rush", multiplier: 1.5, note: "+50% · about twice as fast" }
];

// ==========================================================================
// Geo-specific pricing. Client-facing rates stay flat worldwide (OFFERED_RATES,
// below) — that consistency IS the pitch. What changes per market is only the
// "what you'd typically pay locally" comparison, so a US or AU visitor sees a
// realistic onshore benchmark instead of a generic figure.
//
// Benchmarks are researched blended-market rates (Sept 2026):
//  - BIM/CAD technician: freelance/outsourced BIM drafting runs
//    ~$35-95/hr with US/EU clients (CAD-only $25-70/hr); North America &
//    Oceania sit at the top of that band (~$40-80/hr blended).
//  - Architect consultant: mid-level (3-7yr) freelance consulting runs
//    ~$70-110/hr US, £45-70/hr UK (~$58-90 USD), AUD 80-120/hr AU (~$52-78 USD).
// ==========================================================================

export const TARGET_MARKETS: TargetMarket[] = [
  { id: "us", name: "United States", shortName: "US" },
  { id: "uk", name: "United Kingdom", shortName: "UK" },
  { id: "au", name: "Australia", shortName: "AU" },
  { id: "ca", name: "Canada", shortName: "CA" },
  { id: "international", name: "International / Other", shortName: "Intl" }
];

/** For sentences: "Typical in-house cost of this scope in {the US}". */
export const MARKET_IN_PHRASE: Record<string, string> = {
  us: "the US",
  uk: "the UK",
  au: "Australia",
  ca: "Canada",
  international: "international markets",
};

export const MARKET_BENCHMARK_RATES: Record<string, MarketBenchmarkRates> = {
  us: { technicianHourly: 65, inHousePayrollHourly: 115, consultantHourly: 95 },
  uk: { technicianHourly: 58, inHousePayrollHourly: 95, consultantHourly: 80 },
  au: { technicianHourly: 68, inHousePayrollHourly: 105, consultantHourly: 85 },
  ca: { technicianHourly: 55, inHousePayrollHourly: 90, consultantHourly: 78 },
  international: { technicianHourly: 45, inHousePayrollHourly: 70, consultantHourly: 60 }
};

// Maps the building-code jurisdiction a visitor picks in the BIM/CAD estimator to a target
// market, so its comparison is geo-aware without a second dropdown.
export const JURISDICTION_TO_MARKET: Record<string, string> = {
  us_irc_ibc: "us",
  us_california: "us",
  us_florida: "us",
  us_new_york: "us",
  uk_eurocode: "uk",
  canada_nbc: "ca",
  australia_ncc: "au",
  international_custom: "international"
};

// What we actually charge — flat worldwide, a consistent 50-60% below the US benchmark
// (the highest-demand market researched above), which lands proportionally even deeper
// below UK/AU/CA/international benchmarks.
export const OFFERED_RATES = {
  // BIM/CAD Technician: effective hourly equivalent of the deliverable-driven sheet
  // pricing in calculator.ts, shown for comparison (~57% off the $65/hr US benchmark).
  technicianHourlyEquivalent: 28,
  // Architect Consultant: flat rate (~53% off the $95/hr US benchmark).
  consultantHourly: 45,
};

// ==========================================================================
// Visualization pricing (documentation/final-polish-v2.0.md, Appendix A.3 — for owner sign-off;
// every value can be tuned). Priced per view, like every studio in the research, not per square
// foot. Base prices sit at about 50% of the US "typical" tier midpoint, the same positioning as
// the BIM/CAD track.
// ==========================================================================

export type VizScene = "interior" | "exterior" | "aerial";
export type VizStage = "concept" | "schematic" | "modeled";
export type VizTier = "standard" | "high" | "hero";

export const VISUALIZATION_RATES = {
  basePerView: { interior: 495, exterior: 795, aerial: 895 } as Record<VizScene, number>,
  // Size factor = clamp(√(area / baseline), min, max) — aerial baselines are site area.
  baselineSqFt: { interior: 1200, exterior: 2500, aerial: 10000 } as Record<VizScene, number>,
  sizeFactor: { min: 0.8, max: 1.8 },
  stage: { concept: 1.35, schematic: 1.0, modeled: 0.55 } as Record<VizStage, number>,
  tier: { standard: 1.0, high: 1.2, hero: 1.5 } as Record<VizTier, number>,
  /** Price of the nth view of the same scene, relative to the first: 1, then 0.8, 0.8, then 0.7. */
  viewDiscount: (n: number) => (n <= 1 ? 1 : n <= 3 ? 0.8 : 0.7),
  panoramaPerView: 595,
  animationPerSecond: 65,
  animationMinSeconds: 20,
  includedRevisionRounds: 2,
  extraRevisionRound: 95,
  /** Shown as a range: fee × (1 ± spread). */
  rangeSpread: 0.1,
  turnaround: {
    firstViewDays: 5,
    /** One extra day per this many additional views (or panoramas). */
    viewsPerExtraDay: 2,
    stageDays: { concept: 3, schematic: 0, modeled: -2 } as Record<VizStage, number>,
    /** One extra day per this many seconds of animation. */
    animationSecondsPerDay: 10,
  },
};

// Typical-tier studio prices from Appendix A.1, in the source currency. Only markets with a real
// typical-tier range are listed; everything else is compared against the US.
export interface VizBenchmark {
  label: string;
  currency: "USD" | "CAD";
  source: string;
  perView: Partial<Record<VizScene, [number, number]>>;
  panoramaPerView?: [number, number];
  animationPerSecond?: [number, number];
}

export const VIZ_BENCHMARKS: Record<"us" | "ca", VizBenchmark> = {
  us: {
    label: "US",
    currency: "USD",
    source: "Visualizee, typical tier",
    perView: { interior: [600, 1500], exterior: [750, 2500], aerial: [1000, 2500] },
    panoramaPerView: [1500, 2500],
    // $4,000–12,000 per minute of animation.
    animationPerSecond: [67, 200],
  },
  ca: {
    label: "Canadian",
    currency: "CAD",
    source: "Pacific Render Studio",
    perView: { interior: [950, 2800], exterior: [900, 2500] },
  },
};

/** To convert benchmarks for display in USD. For the owner to confirm, with its date. */
export const FX_TO_USD = { USD: 1, CAD: 0.72, asOf: "Sept 2026" };
