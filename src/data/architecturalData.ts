import { ProjectTypeOption, ServiceOption, PortfolioItem, SpecialistProfile, TargetMarket, MarketBenchmarkRates, TrackImage, ServiceRateInfo } from "../types";
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
    "BIM Federated Models (LOD 100–400)",
    "Parametric & Computational Design (Rhino + Grasshopper)",
    "MEP & Structural Clash Detection (Navisworks Manage)",
    "Millwork / Casework Fabrication Documentation",
    "Photorealistic Architectural Visualization (V-Ray / Lumion / Twinmotion)",
    "Dedicated White-Label BIM/VDC Retainers for Architecture & Engineering Firms"
  ],
  softwareProficiencies: [
    "3D BIM Modeling Software (LOD 200-350)",
    "AutoCAD Architectural & Detailing",
    "Rhino 7 / Grasshopper Algorithmic",
    "Ladybug & Karamba 3D (Solar/Structural)",
    "Autodesk Navisworks (Clash Detection)",
    "V-Ray / Lumion / Twinmotion 4K",
    "Bluebeam Revu (Plan Check QA/QC)"
  ],
  yearsExperience: 9,
  completedProjectsCount: 380,
  baseHourlyRate: 45,
  bio: "Senior Architect & Computational Technologist with a B.Arch (Distinction in Design) from the prestigious National College of Arts (NCA). Backed by 9+ years of independent remote consulting and firm coordination across residential, commercial, and hospitality sectors. Specializing in code-compliant permit packages, high-detail 3D BIM models, parametric solar/wind analysis, and zero-headache digital project delivery for international architects and builders."
};

export const PROJECT_TYPES: ProjectTypeOption[] = [
  {
    id: "residential_single",
    name: "Custom Single-Family Home",
    category: "Residential",
    defaultSqFt: 2800,
    baseComplexity: 1.0,
    baseSheets: 14,
    description: "New ground-up custom luxury residence, modern villa, or vacation home requiring complete municipal permit sets.",
    badge: "Most Popular",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "residential_adu",
    name: "ADU & Guest House Conversion",
    category: "Residential",
    defaultSqFt: 850,
    baseComplexity: 0.85,
    baseSheets: 10,
    description: "Detached or attached Accessory Dwelling Unit (ADU), garage conversion, or guest suite with rapid city permit turnaround.",
    badge: "High Demand",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "renovation_addition",
    name: "Residential Remodel & Addition",
    category: "Residential",
    defaultSqFt: 1800,
    baseComplexity: 1.1,
    baseSheets: 12,
    description: "Second-story additions, kitchen/master suite bump-outs, and structural wall removals requiring existing vs. proposed plans.",
    badge: "Renovation",
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "residential_multifamily",
    name: "Multi-Family & Townhomes",
    category: "Residential",
    defaultSqFt: 6500,
    baseComplexity: 1.25,
    baseSheets: 24,
    description: "Multi-unit residential buildings, duplex/triplex developments, and townhouse complexes with repeated typical unit plans.",
    badge: "Commercial Res.",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "commercial_retail",
    name: "Commercial Retail / Office Space",
    category: "Commercial",
    defaultSqFt: 3500,
    baseComplexity: 1.15,
    baseSheets: 16,
    description: "Storefronts, boutique offices, corporate headquarters, and tenant improvements (TI) requiring ADA accessibility compliance.",
    badge: "Commercial",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "commercial_hospitality",
    name: "Restaurant, Cafe & Hospitality",
    category: "Commercial",
    defaultSqFt: 2600,
    baseComplexity: 1.3,
    baseSheets: 18,
    description: "Full food-service layouts, health department coordination, commercial kitchen equipment schedules, and dining ambiance.",
    badge: "Hospitality",
    image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "interior_fitout",
    name: "High-End Interior Fit-Out & Millwork",
    category: "Specialized",
    defaultSqFt: 2000,
    baseComplexity: 0.95,
    baseSheets: 12,
    description: "Custom cabinetry, architectural finishes, lighting & reflected ceiling plans, stone detailing, and millwork shop drawings.",
    badge: "Interior Detail",
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "as_built_conversion",
    name: "As-Built CAD & BIM Digitization",
    category: "Specialized",
    defaultSqFt: 3000,
    baseComplexity: 0.75,
    baseSheets: 8,
    description: "Converting PDF scans and hand sketches into clean, editable AutoCAD and BIM files.",
    badge: "Digital Twin",
    image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80"
  }
];

export const SERVICE_OPTIONS: ServiceOption[] = [
  {
    id: "permit_drawings",
    name: "Construction Documentation Package",
    shortName: "Construction Documentation",
    category: "Virtual Design & Construction",
    description: "Complete municipal submittal package: site plan, dimensioned floor plans, exterior elevations, building sections, window/door schedules, and life-safety compliance notes.",
    standardTurnaroundDays: 7,
    softwareUsed: ["AutoCAD 2024", "3D BIM Software", "Bluebeam Revu"],
    popular: true
  },
  {
    id: "bim_modeling",
    name: "BIM Federated Model (LOD 100–400)",
    shortName: "BIM Federated Model",
    category: "Virtual Design & Construction",
    description: "Intelligent building information model with parametric families, wall assemblies, material takeoff schedules, and clash-ready geometry for federated coordination.",
    standardTurnaroundDays: 8,
    softwareUsed: ["3D BIM Software", "Navisworks", "BIM 360", "IFC"],
    popular: true
  },
  {
    id: "construction_docs",
    name: "Architectural Detail & Working Drawings",
    shortName: "Detail & Working Drawings",
    category: "Virtual Design & Construction",
    description: "High-LOD working drawings for contractor procurement: 1/2\"–3\" scale architectural details, envelope assemblies, foundation sections, and structural callouts.",
    standardTurnaroundDays: 7,
    softwareUsed: ["AutoCAD", "3D BIM Software", "AIA CAD Standards"],
    popular: true
  },
  {
    id: "millwork_shop_drawings",
    name: "Millwork & Fabrication Documentation",
    shortName: "Millwork Documentation",
    category: "Virtual Design & Construction",
    description: "Millimeter-accurate fabrication documentation for custom joinery, staircases, reception counters, vanity units, and bespoke cabinetry with hardware specifications.",
    standardTurnaroundDays: 5,
    softwareUsed: ["AutoCAD", "Cabinet Vision", "3D BIM Software"],
    popular: false
  },
  {
    id: "mep_structural_coordination",
    name: "Multi-Discipline Coordination (MDC)",
    shortName: "Multi-Discipline Coordination",
    category: "Virtual Design & Construction",
    description: "Federated clash detection overlaying structural steel/timber and MEP routing — resolving conflicts before site mobilization and eliminating field change orders.",
    standardTurnaroundDays: 5,
    softwareUsed: ["Navisworks Manage", "3D BIM Software", "AutoCAD MEP"],
    popular: false
  }
];

// Reference per-sq-ft rates shown next to each service in Step 2 of the estimator — informational
// only, not editable, and not simply additive (selecting three services doesn't cost 3x the rate;
// the live estimate above already accounts for the overlap between bundled deliverables).
//
// Derived from the same LOD-tier base pricing calculator.ts uses (LOD_BASE_PRICE), at the
// reference project (Custom Single-Family Home: 2,800 sq ft / 14 sheets = 200 sq ft per sheet,
// so $/sq ft for a tier = LOD_BASE_PRICE / 200):
//   LOD 100 -> $0.88/sq ft   LOD 200 -> $1.30/sq ft   LOD 300 -> $1.70/sq ft   LOD 350 -> $2.30/sq ft
// Each service is mapped to the LOD tier(s) its sheets fall under: permit drawings blend LOD
// 200-300 (site/floor/elevation work), BIM modeling blends the full LOD 200-350 range, and
// construction docs / millwork / MEP coordination are LOD 350 detail-and-coordination work, with
// MEP coordination priced lighter since it's an overlay/review pass rather than full sheet
// production. marketPerSqFt is the researched industry-standard rate these are discounted off —
// consistently in the same ~53-55% range as every other track on this site.
export const SERVICE_RATE_PER_SQFT: Record<string, ServiceRateInfo> = {
  permit_drawings: { offeredPerSqFt: 1.50, marketPerSqFt: 3.25 },
  bim_modeling: { offeredPerSqFt: 1.75, marketPerSqFt: 3.75 },
  construction_docs: { offeredPerSqFt: 2.25, marketPerSqFt: 5.00 },
  millwork_shop_drawings: { offeredPerSqFt: 2.00, marketPerSqFt: 4.25 },
  mep_structural_coordination: { offeredPerSqFt: 1.25, marketPerSqFt: 2.75 }
};

export const PORTFOLIO_SAMPLES: PortfolioItem[] = [
  {
    id: "sample-beach-house",
    title: "Texas Coastal Beach House Residence",
    category: "CAD Permit Sets",
    description: "Architectural permit drawing package for an elevated coastal residence in Texas. Designed for high-velocity coastal hurricane wind zones with deep piling foundation, wraparound cantilever sundeck, open cathedral living, and IRC storm compliance.",
    software: ["AutoCAD", "3D BIM", "IRC / Coastal Code Standards"],
    sheetDetails: "Elevated Structural Framing • Full Permitting Set",
    imageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=900&q=80",
    isRealClientWork: true,
    specs: [
      { label: "Location", value: "Coastal Texas (Gulf Coast)" },
      { label: "Foundation", value: "Heavy Timber Piling & Braced Posts" },
      { label: "Code Adherence", value: "IRC Coastal High Wind / TDI" },
      { label: "Verification", value: "Authentic Client Work Sample" }
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
    software: ["3D BIM", "AutoCAD MEP", "Health & Fire Code"],
    sheetDetails: "Commercial Hospitality Set • Kitchen Equipment Plan",
    imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=900&q=80",
    isRealClientWork: true,
    specs: [
      { label: "Sector", value: "Commercial Hospitality / Food Service" },
      { label: "Scope", value: "Full Storefront + Commercial Kitchen" },
      { label: "Compliance", value: "ADA & Health Department Standards" },
      { label: "Verification", value: "Authentic Client Work Sample" }
    ],
    tags: ["Commercial", "Restaurant", "Commercial Kitchen", "Storefront"]
  },
  {
    id: "sample-cran-residence",
    title: "Cran Residence — Traditional Two-Story Home",
    category: "3D BIM",
    description: "Classic two-story red brick residence with a pitched roof, bay-fronted entry, and fenced front garden. Modeled from client sketches into a coordinated 3D BIM massing study for early design sign-off ahead of full construction documentation.",
    software: ["3D BIM Software", "AutoCAD"],
    sheetDetails: "3D BIM Massing Study + Elevation Set",
    imageUrl: assetUrl("/portfolio/cran-perspective.jpg"),
    isRealClientWork: true,
    specs: [
      { label: "Design Style", value: "Traditional Brick Residential" },
      { label: "Documentation", value: "3D BIM Massing Model" },
      { label: "Turnaround", value: "Rapid Asynchronous Delivery" },
      { label: "Verification", value: "Authentic Client Work Sample" }
    ],
    tags: ["Traditional Home", "Residential Massing", "Brick Facade", "3D BIM"]
  },
  {
    id: "sample-urban-flats",
    title: "Urban Multi-Family Residential Flats & Layouts",
    category: "3D BIM",
    description: "Space-optimized multi-unit residential apartment layout and unit typologies, fire egress stairs, MEP shafts, and structural grid alignment for urban development.",
    software: ["3D BIM Software", "AutoCAD", "IBC Code Standards"],
    sheetDetails: "Multi-Family Apartment Typologies & Plans",
    imageUrl: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=900&q=80",
    isRealClientWork: true,
    specs: [
      { label: "Typology", value: "Multi-Family Apartment Flats" },
      { label: "Key Focus", value: "Egress, Shafts, Unit Efficiency" },
      { label: "Standards", value: "IBC Multi-Family Residential" },
      { label: "Verification", value: "Authentic Client Work Sample" }
    ],
    tags: ["Multi-Family", "Flats", "3D BIM", "Urban Architecture"],
    clientReview: {
      quote: "Delivered exactly what was required for our architectural competition. Highly recommended!",
      platform: "Fiverr",
      rating: 5
    }
  }
];

// Real production screenshots (ArchiCAD schedules, Rhino/Grasshopper scripting, environmental
// analysis, facade scripting) plus finished renders — used as the moving background collage
// behind the BIM/CAD Technician section. "wide" images get a full-width row; "tall" ones are
// slim enough to pair up two-across in the same row (see TrackImageBackdrop).
export const BIMCAD_WORKFLOW_IMAGES: TrackImage[] = [
  { src: assetUrl("/portfolio/bimcad-workflow/01-window-schedule.jpg"), aspect: "wide" },
  { src: assetUrl("/portfolio/bimcad-workflow/02-grasshopper-rolling-polygon.jpg"), aspect: "wide" },
  { src: assetUrl("/portfolio/bimcad-workflow/03-nesting-optimization.jpg"), aspect: "wide" },
  { src: assetUrl("/portfolio/bimcad-workflow/04-gis-site-terrain.jpg"), aspect: "wide" },
  { src: assetUrl("/portfolio/bimcad-workflow/05-structural-model-calc.jpg"), aspect: "wide" },
  { src: assetUrl("/portfolio/bimcad-workflow/06-facade-paneling-script.jpg"), aspect: "wide" },
  { src: assetUrl("/portfolio/bimcad-workflow/07-solar-wind-analysis.jpg"), aspect: "wide" },
  { src: assetUrl("/portfolio/bimcad-workflow/08-environmental-analysis.jpg"), aspect: "wide" },
  { src: assetUrl("/portfolio/bimcad-workflow/09-diagrid-pattern-script.jpg"), aspect: "wide" }
  // The 3 finished tower renders (10-12) are intentionally excluded here — this set is kept to
  // production screenshots only, for visual consistency across the paired-up slideshow cards.
];

// Finished interior/exterior renders — the slideshow band between the Consultancy and
// Visualization sections, leading into the Visualization track.
export const VISUALIZATION_SHOWCASE_IMAGES: TrackImage[] = [
  { src: assetUrl("/portfolio/visualization-showcase/01-home-office.jpg"), aspect: "wide" },
  { src: assetUrl("/portfolio/visualization-showcase/02-dark-living-room.jpg"), aspect: "wide" },
  { src: assetUrl("/portfolio/visualization-showcase/03-bright-loft.jpg"), aspect: "wide" },
  { src: assetUrl("/portfolio/visualization-showcase/04-restaurant-interior.jpg"), aspect: "wide" },
  { src: assetUrl("/portfolio/visualization-showcase/05-classical-dining.jpg"), aspect: "wide" },
  { src: assetUrl("/portfolio/visualization-showcase/06-teen-bedroom.jpg"), aspect: "wide" },
  { src: assetUrl("/portfolio/visualization-showcase/07-lobby-lounge.webp"), aspect: "wide" },
  { src: assetUrl("/portfolio/visualization-showcase/08-spiral-stair-library.webp"), aspect: "wide" },
  { src: assetUrl("/portfolio/visualization-showcase/09-black-wall-living-room.webp"), aspect: "wide" },
  { src: assetUrl("/portfolio/visualization-showcase/10-sunken-fire-pit-lounge.webp"), aspect: "wide" },
  { src: assetUrl("/portfolio/visualization-showcase/11-bathroom-tub.jpg"), aspect: "wide" },
  { src: assetUrl("/portfolio/visualization-showcase/12-bathroom-shower.jpg"), aspect: "wide" }
];

// Finished exterior renders and facade studies — a distinct slideshow band from the interior
// showcase above, surfacing massing/facade work that isn't shown anywhere else on the site.
// Deliberately excludes barn-residence-vray.jpg — that render is reserved as the standalone
// hero image for the PracticeNote section further down the homepage, so it isn't duplicated.
export const EXTERIOR_SHOWCASE_IMAGES: TrackImage[] = [
  { src: assetUrl("/portfolio/exterior-showcase/10-tower-render.jpg"), aspect: "wide" },
  { src: assetUrl("/portfolio/exterior-showcase/11-facade-closeup-render.webp"), aspect: "wide" },
  { src: assetUrl("/portfolio/exterior-showcase/12-cube-facade-render.webp"), aspect: "wide" },
  { src: assetUrl("/portfolio/exterior-showcase/01-office-building.webp"), aspect: "wide" },
  { src: assetUrl("/portfolio/exterior-showcase/02-gable-house.webp"), aspect: "wide" },
  { src: assetUrl("/portfolio/exterior-showcase/03-apartment-facade.webp"), aspect: "wide" }
];

export const LOD_LEVELS = [
  {
    level: "LOD 100",
    name: "Conceptual",
    description: "Overall building massing — approximate volume, area, height, and orientation. Used for early feasibility and massing studies.",
    included: true,
  },
  {
    level: "LOD 200",
    name: "Approximate Geometry",
    description: "Generalized systems and assemblies with approximate quantity, size, shape, and location. Suitable for early design coordination.",
    included: true,
  },
  {
    level: "LOD 300",
    name: "Precise Geometry",
    description: "Accurate quantity, size, shape, and location — the standard level for construction documents and permit submission.",
    included: true,
  },
  {
    level: "LOD 350",
    name: "Coordination-Ready",
    description: "Precise geometry plus interfaces with other building systems (structural, MEP), enabling clash detection and multi-trade coordination.",
    included: true,
  },
  {
    level: "LOD 400",
    name: "Fabrication-Ready",
    description: "Complete fabrication, assembly, and installation detail — precise enough for a manufacturer to build directly from the model.",
    included: false,
  },
  {
    level: "LOD 500",
    name: "As-Built / Verified",
    description: "Field-verified model matching the completed, constructed building — used for facility maintenance and operations.",
    included: false,
  },
];

export const JURISDICTIONS = [
  { id: "us_irc_ibc", name: "USA - International Building / Residential Code (IBC / IRC)", standard: "IBC 2024 / IRC 2024" },
  { id: "us_california", name: "California (CBC / CRC / Title 24 Energy / LADBS)", standard: "California Code of Regulations Title 24" },
  { id: "us_florida", name: "Florida (FBC Hurricane / High Velocity Wind Zone)", standard: "FBC 8th Edition (2023)" },
  { id: "us_new_york", name: "New York City (NYC Building Code / DOB Now)", standard: "2022 NYC Construction Codes" },
  { id: "uk_eurocode", name: "United Kingdom (Approved Documents Part A-S / RIBA)", standard: "UK Building Regs 2024 & RIBA Plan of Work" },
  { id: "canada_nbc", name: "Canada (National Building Code NBC / OBC)", standard: "NBC 2020 / Ontario Building Code" },
  { id: "australia_ncc", name: "Australia (National Construction Code NCC / BCA)", standard: "NCC 2022 / Australian Standards" },
  { id: "international_custom", name: "International / Local Municipality Custom Code", standard: "Universal Architectural Drafting Standards" }
];

export const PROJECT_STAGES = [
  { id: "napkin_sketch", name: "Concept / Hand Sketch / Idea", desc: "You have rough sketches, Pinterest references, or general floor plan goals.", priceMultiplier: 1.05 },
  { id: "schematic", name: "Schematic Design (In Progress)", desc: "Preliminary layouts are decided; you need them turned into professional CAD/BIM.", priceMultiplier: 1.0 },
  { id: "permit_ready", name: "Need Full Municipal Permit Set", desc: "Ready for formal city building permit submission with all required code sheets.", priceMultiplier: 0.95 },
  { id: "construction_bidding", name: "Ready for Contractor Bidding & CD Set", desc: "Need heavy-duty detail sheets, wall sections, and schedules for accurate sub bids.", priceMultiplier: 1.0 },
  { id: "redlines_revisions", name: "City Comments / Redline Revisions", desc: "Permit plan check comments or engineer redlines that need rapid 24-48hr turnaround.", priceMultiplier: 0.35 }
];

export const TIMELINE_OPTIONS = [
  { id: "standard", name: "Standard (2-3 Weeks)", multiplier: 1.0, badge: "Most Cost-Effective" },
  { id: "expedited", name: "Expedited (7-10 Days)", multiplier: 1.25, badge: "Popular for Permits" },
  { id: "urgent", name: "Rush / Rapid Turnaround (3-5 Days)", multiplier: 1.5, badge: "Priority Queue" }
];

// ==========================================================================
// Geo-specific pricing. Client-facing rates stay flat worldwide (OFFERED_RATES,
// below) — that consistency IS the pitch. What changes per market is only the
// "what you'd typically pay locally" comparison, so a US or AU visitor sees a
// realistic onshore benchmark instead of a generic figure.
//
// Benchmarks are researched blended-market rates (Sept 2026):
//  - BIM/CAD technician: freelance/outsourced Revit & BIM drafting runs
//    ~$35-95/hr with US/EU clients (CAD-only $25-70/hr); North America &
//    Oceania sit at the top of that band (~$40-80/hr blended).
//  - Architect consultant: mid-level (3-7yr) freelance consulting runs
//    ~$70-110/hr US, £45-70/hr UK (~$58-90 USD), AUD 80-120/hr AU (~$52-78 USD).
//  - Rendering: exterior/full-scene visualization commonly runs $2-5/sq ft;
//    interior visualization runs $0.50-2.00/sq ft, with UK/AU/CA running
//    modestly below US list rates and non-tier-1 markets lower still.
// ==========================================================================

export const TARGET_MARKETS: TargetMarket[] = [
  { id: "us", name: "United States", shortName: "US" },
  { id: "uk", name: "United Kingdom", shortName: "UK" },
  { id: "au", name: "Australia", shortName: "AU" },
  { id: "ca", name: "Canada", shortName: "CA" },
  { id: "international", name: "International / Other", shortName: "Intl" }
];

export const MARKET_BENCHMARK_RATES: Record<string, MarketBenchmarkRates> = {
  us: { technicianHourly: 65, inHousePayrollHourly: 115, consultantHourly: 95, exteriorRenderPerSqFt: 4.0, interiorRenderPerSqFt: 1.75 },
  uk: { technicianHourly: 58, inHousePayrollHourly: 95, consultantHourly: 80, exteriorRenderPerSqFt: 3.5, interiorRenderPerSqFt: 1.5 },
  au: { technicianHourly: 68, inHousePayrollHourly: 105, consultantHourly: 85, exteriorRenderPerSqFt: 3.75, interiorRenderPerSqFt: 1.6 },
  ca: { technicianHourly: 55, inHousePayrollHourly: 90, consultantHourly: 78, exteriorRenderPerSqFt: 3.25, interiorRenderPerSqFt: 1.4 },
  international: { technicianHourly: 45, inHousePayrollHourly: 70, consultantHourly: 60, exteriorRenderPerSqFt: 2.5, interiorRenderPerSqFt: 1.1 }
};

// Maps the building-code jurisdiction a visitor picks in the Scope Estimator to a target
// market, so the estimator's savings comparison is geo-aware without a second dropdown.
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
  // Visualization / Rendering, priced per sq ft of the visualized area.
  exteriorRenderPerSqFt: 1.75, // ~56% off the $4.00/sq ft US benchmark
  interiorRenderPerSqFt: 0.75, // ~57% off the $1.75/sq ft US benchmark
  minExteriorRenderFee: 350,
  minInteriorRenderFee: 200
};
