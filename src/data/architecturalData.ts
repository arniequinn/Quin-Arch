import { ProjectTypeOption, ServiceOption, PortfolioItem, SpecialistProfile } from "../types";
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
  avatarUrl: assetUrl("/portfolio/arslan-profile.png"),
  socials: {
    linkedin: "https://www.linkedin.com/in/arslan-qaiser-947976188/",
    instagram: "https://instagram.com/quin_arch",
    instagramHandle: "@quin_arch",
    cadcrowd: "https://www.cadcrowd.com/profile/36968-quintessential-architecture",
    fiverr: "https://www.fiverr.com/s/X0R4azm",
    freelancer: "https://www.freelancer.com/u/arslanqaiser1991?frm=arslanqaiser1991&sb=t",
    upwork: "https://www.upwork.com/freelancers/~017cb25c6f0d1d2375?mp_source=share",
    dropboxFolder: "https://www.dropbox.com/scl/fo/t7jqz170q5uytn782wenx/AKXLp72qWAXWdGh8EagvT88?rlkey=7y6i7voh4pn8qecicrfoa7xn1&st=mn4wh8ym&dl=0"
  },
  availableFor: [
    "Full-Service Remote Architectural CAD Drafting",
    "Municipal Permit Drawing Sets (IBC, IRC, Title 24, FBC)",
    "Revit 3D BIM Modeling (LOD 200 - 400)",
    "Parametric & Algorithmic Design (Rhino + Grasshopper)",
    "MEP & Structural Clash Detection (Navisworks)",
    "Millwork / Casework Fabrication Shop Drawings",
    "Photorealistic Architectural Visualization (V-Ray / Lumion / Twinmotion)",
    "Dedicated White-Label CAD/BIM Retainers for Architecture & Engineering Firms"
  ],
  softwareProficiencies: [
    "Autodesk Revit 2024 (BIM LOD 200-400)",
    "AutoCAD Architectural & Detailing",
    "Rhino 7 / Grasshopper Algorithmic",
    "Ladybug & Karamba 3D (Solar/Structural)",
    "Autodesk Navisworks (Clash Detection)",
    "V-Ray / Lumion / Twinmotion 4K",
    "ArchiCAD / GDL Scripting & Tapir API",
    "Bluebeam Revu (Plan Check QA/QC)"
  ],
  yearsExperience: 9,
  completedProjectsCount: 380,
  baseHourlyRate: 45,
  bio: "Senior Architect & Computational Technologist with a B.Arch (Distinction in Design) from the prestigious National College of Arts (NCA). Backed by 9+ years of independent remote consulting and firm coordination across residential, commercial, and hospitality sectors. Specializing in code-compliant permit packages, high-detail Revit BIM models, parametric solar/wind analysis, and zero-headache digital project delivery for international architects and builders."
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
    description: "Converting PDF scans, hand sketches, Matterport surveys, or 3D point-cloud files into clean, editable AutoCAD and Revit files.",
    badge: "Digital Twin",
    image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80"
  }
];

export const SERVICE_OPTIONS: ServiceOption[] = [
  {
    id: "permit_drawings",
    name: "2D Permit Drawing Sets (CAD / Revit)",
    shortName: "Permit Drawings",
    category: "Drafting",
    description: "Complete municipal permit submission package: Site plan, dimensioned floor plans, exterior elevations, building sections, window/door schedules, and life safety notes.",
    basePricePerSqFt: 0.65,
    minPrice: 950,
    standardTurnaroundDays: 7,
    sheetImpact: 10,
    softwareUsed: ["AutoCAD 2024", "Autodesk Revit", "Bluebeam Revu"],
    popular: true
  },
  {
    id: "bim_modeling",
    name: "3D BIM Modeling (Revit LOD 200 - 400)",
    shortName: "3D BIM (Revit)",
    category: "BIM",
    description: "Intelligent building information modeling in Revit with parametric families, wall assemblies, material takeoff schedules, and clash-ready geometry.",
    basePricePerSqFt: 0.75,
    minPrice: 1100,
    standardTurnaroundDays: 8,
    sheetImpact: 6,
    softwareUsed: ["Autodesk Revit", "Navisworks", "BIM 360", "IFC"],
    popular: true
  },
  {
    id: "construction_docs",
    name: "Construction Documentation & Detail Sets",
    shortName: "CD Sets & Details",
    category: "Documentation",
    description: "Heavy-duty working drawings for general contractors: 1/2\" to 3\" scale architectural details, wall waterproofing assemblies, foundation details, and structural callouts.",
    basePricePerSqFt: 0.55,
    minPrice: 850,
    standardTurnaroundDays: 7,
    sheetImpact: 8,
    softwareUsed: ["AutoCAD", "Revit", "AIA CAD Standards"],
    popular: true
  },
  {
    id: "millwork_shop_drawings",
    name: "Millwork & Casework Fabrication Drawings",
    shortName: "Millwork & Shop Drawings",
    category: "Documentation",
    description: "Millimeter-accurate shop drawings for custom cabinetry fabricators, staircases, reception desks, vanity units, and joinery details with hardware specs.",
    basePricePerSqFt: 0.40,
    minPrice: 650,
    standardTurnaroundDays: 5,
    sheetImpact: 5,
    softwareUsed: ["AutoCAD", "Cabinet Vision", "Revit"],
    popular: false
  },
  {
    id: "photoreal_rendering",
    name: "3D Photorealistic Exterior & Interior Renders",
    shortName: "3D Renders (4K)",
    category: "Visualization",
    description: "Ultra-high-definition 4K renderings with realistic sunlight, materials, landscape, and atmospheric lighting for marketing, client approvals, and zoning boards.",
    basePricePerSqFt: 0.45,
    minPrice: 700,
    standardTurnaroundDays: 4,
    sheetImpact: 4,
    softwareUsed: ["Lumion 2024", "3ds Max", "V-Ray / Enscape", "Photoshop"],
    popular: true
  },
  {
    id: "mep_structural_coordination",
    name: "Structural & MEP Coordination Overlay",
    shortName: "MEP/Structural Coordination",
    category: "Coordination",
    description: "Overlaying structural steel/timber and MEP ducts/plumbing runs to detect conflicts before breaking ground, saving tens of thousands in field change orders.",
    basePricePerSqFt: 0.35,
    minPrice: 600,
    standardTurnaroundDays: 5,
    sheetImpact: 4,
    softwareUsed: ["Navisworks Manage", "Revit MEP", "AutoCAD MEP"],
    popular: false
  },
  {
    id: "as_built_conversion_service",
    name: "Matterport / Scan to BIM / As-Built CAD",
    shortName: "As-Built Conversion",
    category: "Drafting",
    description: "Transforming 3D point clouds (E57, LAS), matterport virtual tours, or hand-measured redlines into clean, layered, editable 2D DWG and 3D Revit models.",
    basePricePerSqFt: 0.35,
    minPrice: 500,
    standardTurnaroundDays: 4,
    sheetImpact: 4,
    softwareUsed: ["Revit", "AutoCAD", "CloudCompare"],
    popular: false
  }
];

export const PORTFOLIO_SAMPLES: PortfolioItem[] = [
  {
    id: "sample-barndominium",
    title: "Barndominium Residence & Living Quarters",
    category: "CAD Permit Sets",
    description: "Full architectural working drawings for a custom steel/timber frame Barndominium. Delivered complete foundation plans, structural mezzanine layouts, code-compliant egress stairs, electrical schedules, and insulated wall envelope sections.",
    software: ["AutoCAD Architectural", "Revit BIM", "Bluebeam Revu"],
    sheetDetails: "Complete Permit Drawing Package • PDF Architectural Set",
    imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80",
    pdfUrl: assetUrl("/portfolio/docs/Barndominium.pdf"),
    dropboxUrl: "https://www.dropbox.com/scl/fo/t7jqz170q5uytn782wenx/AKXLp72qWAXWdGh8EagvT88?rlkey=7y6i7voh4pn8qecicrfoa7xn1&st=mn4wh8ym&dl=0",
    isRealClientWork: true,
    specs: [
      { label: "Typology", value: "Custom Barndominium & Residence" },
      { label: "Deliverable", value: "Full Construction Document Set" },
      { label: "Drawing Format", value: "24x36 Arch D + Scaled PDF" },
      { label: "Verification", value: "Authentic Client Work Sample" }
    ],
    tags: ["Barndominium", "Permit Set", "Steel/Timber Frame", "Residential CAD"],
    clientReview: {
      quote: "Outstanding drafting precision and fast response time. Understood the framing and mezzanine nuances right away.",
      platform: "Upwork",
      rating: 5
    }
  },
  {
    id: "sample-beach-house",
    title: "Texas Coastal Beach House Residence",
    category: "CAD Permit Sets",
    description: "Architectural permit drawing package for an elevated coastal residence in Texas. Designed for high-velocity coastal hurricane wind zones with deep piling foundation, wraparound cantilever sundeck, open cathedral living, and IRC storm compliance.",
    software: ["AutoCAD", "Revit", "IRC / Coastal Code Standards"],
    sheetDetails: "Elevated Structural Framing • Full Permitting Set",
    imageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=900&q=80",
    pdfUrl: assetUrl("/portfolio/docs/Beach House - Texas.pdf"),
    dropboxUrl: "https://www.dropbox.com/scl/fo/t7jqz170q5uytn782wenx/AKXLp72qWAXWdGh8EagvT88?rlkey=7y6i7voh4pn8qecicrfoa7xn1&st=mn4wh8ym&dl=0",
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
    software: ["Revit", "AutoCAD MEP", "Health & Fire Code"],
    sheetDetails: "Commercial Hospitality Set • Kitchen Equipment Plan",
    imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=900&q=80",
    pdfUrl: assetUrl("/portfolio/docs/Slamburger.pdf"),
    dropboxUrl: "https://www.dropbox.com/scl/fo/t7jqz170q5uytn782wenx/AKXLp72qWAXWdGh8EagvT88?rlkey=7y6i7voh4pn8qecicrfoa7xn1&st=mn4wh8ym&dl=0",
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
    id: "sample-barn-residence",
    title: "Barn & Luxury Rural Residence Estate",
    category: "3D Visualization",
    description: "High-end rural estate combining equestrian barn facilities with contemporary luxury residential quarters. Produced photorealistic exterior V-Ray visualization capturing natural timber siding, ambient lighting, and timber-truss ceiling geometry.",
    software: ["V-Ray", "3ds Max / SketchUp", "Revit", "Photoshop CC"],
    sheetDetails: "Photorealistic 3D Render + Architectural Layout",
    imageUrl: assetUrl("/portfolio/barn-residence-vray.jpg"),
    pdfUrl: assetUrl("/portfolio/docs/Barn & Residence.pdf"),
    dropboxUrl: "https://www.dropbox.com/scl/fo/t7jqz170q5uytn782wenx/AKXLp72qWAXWdGh8EagvT88?rlkey=7y6i7voh4pn8qecicrfoa7xn1&st=mn4wh8ym&dl=0",
    isRealClientWork: true,
    specs: [
      { label: "Typology", value: "Equestrian Barn & Estate" },
      { label: "Render Engine", value: "Chaos V-Ray Photorealistic" },
      { label: "Materiality", value: "Board & Batten, Heavy Timber" },
      { label: "Verification", value: "Authentic Client Work Sample" }
    ],
    tags: ["V-Ray Render", "Rural Estate", "Barn Residence", "3D Modeling"],
    clientReview: {
      quote: "The 3D render perfectly captured the client's dream vision. Superb lighting and materials.",
      platform: "Cad Crowd",
      rating: 5
    }
  },
  {
    id: "sample-cran-residence",
    title: "Cran Modern Cantilevered Residence",
    category: "3D Visualization",
    description: "Striking modernist architectural project featuring dramatic cantilevered concrete slabs, expansive floor-to-ceiling curtain wall glazing, and integrated passive solar overhangs with complete documentation sheets.",
    software: ["Revit", "V-Ray", "Rhino 3D", "Photoshop"],
    sheetDetails: "3D Perspective Render + Documentation Set",
    imageUrl: assetUrl("/portfolio/cran-perspective.jpg"),
    pdfUrl: assetUrl("/portfolio/docs/Cran.pdf"),
    dropboxUrl: "https://www.dropbox.com/scl/fo/t7jqz170q5uytn782wenx/AKXLp72qWAXWdGh8EagvT88?rlkey=7y6i7voh4pn8qecicrfoa7xn1&st=mn4wh8ym&dl=0",
    isRealClientWork: true,
    specs: [
      { label: "Design Style", value: "Modern Minimalist Cantilever" },
      { label: "Documentation", value: "Revit Model + Perspective Render" },
      { label: "Turnaround", value: "Rapid Asynchronous Delivery" },
      { label: "Verification", value: "Authentic Client Work Sample" }
    ],
    tags: ["Modern Villa", "Cantilever", "Curtain Wall", "V-Ray 3D"]
  },
  {
    id: "sample-urban-flats",
    title: "Urban Multi-Family Residential Flats & Layouts",
    category: "3D BIM & Revit",
    description: "Space-optimized multi-unit residential apartment layout and unit typologies, fire egress stairs, MEP shafts, and structural grid alignment for urban development.",
    software: ["Revit 2024", "AutoCAD", "IBC Code Standards"],
    sheetDetails: "Multi-Family Apartment Typologies & Plans",
    imageUrl: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=900&q=80",
    pdfUrl: assetUrl("/portfolio/docs/Flats.pdf"),
    dropboxUrl: "https://www.dropbox.com/scl/fo/t7jqz170q5uytn782wenx/AKXLp72qWAXWdGh8EagvT88?rlkey=7y6i7voh4pn8qecicrfoa7xn1&st=mn4wh8ym&dl=0",
    isRealClientWork: true,
    specs: [
      { label: "Typology", value: "Multi-Family Apartment Flats" },
      { label: "Key Focus", value: "Egress, Shafts, Unit Efficiency" },
      { label: "Standards", value: "IBC Multi-Family Residential" },
      { label: "Verification", value: "Authentic Client Work Sample" }
    ],
    tags: ["Multi-Family", "Flats", "BIM Revit", "Urban Architecture"],
    clientReview: {
      quote: "Delivered exactly what was required for our architectural competition. Highly recommended!",
      platform: "Fiverr",
      rating: 5
    }
  }
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
  { id: "napkin_sketch", name: "Concept / Hand Sketch / Idea", desc: "You have rough sketches, Pinterest references, or general floor plan goals." },
  { id: "schematic", name: "Schematic Design (In Progress)", desc: "Preliminary layouts are decided; you need them turned into professional CAD/BIM." },
  { id: "permit_ready", name: "Need Full Municipal Permit Set", desc: "Ready for formal city building permit submission with all required code sheets." },
  { id: "construction_bidding", name: "Ready for Contractor Bidding & CD Set", desc: "Need heavy-duty detail sheets, wall sections, and schedules for accurate sub bids." },
  { id: "redlines_revisions", name: "City Comments / Redline Revisions", desc: "Permit plan check comments or engineer redlines that need rapid 24-48hr turnaround." }
];

export const TIMELINE_OPTIONS = [
  { id: "standard", name: "Standard (2-3 Weeks)", multiplier: 1.0, badge: "Most Cost-Effective" },
  { id: "expedited", name: "Expedited (7-10 Days)", multiplier: 1.25, badge: "Popular for Permits" },
  { id: "urgent", name: "Rush / Rapid Turnaround (3-5 Days)", multiplier: 1.5, badge: "Priority Queue" }
];
