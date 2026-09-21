export type ProjectCategory =
  | "residential_single"
  | "residential_adu"
  | "residential_multifamily"
  | "commercial_retail"
  | "commercial_hospitality"
  | "interior_fitout"
  | "renovation_addition"
  | "as_built_conversion";

export interface ProjectTypeOption {
  id: ProjectCategory;
  name: string;
  category: "Residential" | "Commercial" | "Specialized";
  defaultSqFt: number;
  baseComplexity: number; // multiplier
  baseSheets: number;
  description: string;
  badge: string;
  image: string;
}

export interface ServiceOption {
  id: string;
  name: string;
  shortName: string;
  category: "Drafting" | "BIM" | "Documentation" | "Visualization" | "Coordination";
  description: string;
  standardTurnaroundDays: number;
  softwareUsed: string[];
  popular?: boolean;
}

export interface DrawingSheet {
  sheetNumber: string;
  sheetTitle: string;
  description: string;
  bimLOD?: string;
}

// Reference per-sq-ft rate for one service line item in the estimator — display-only, not an
// editable input. offeredPerSqFt is derived from the same LOD-tier base pricing calculator.ts
// uses; marketPerSqFt is the researched industry-standard rate it's discounted against.
export interface ServiceRateInfo {
  offeredPerSqFt: number;
  marketPerSqFt: number;
}

// One image in a track's background collage. "wide" renders full-width in its own row;
// "tall" images are slim enough to pair up two-across with another "tall" image.
export interface TrackImage {
  src: string;
  aspect: "wide" | "tall";
}

export interface TargetMarket {
  id: string;
  name: string;
  shortName: string;
}

// Researched, undiscounted market-rate benchmarks per target market — used only to show
// visitors what they'd typically pay locally/onshore. The rates actually offered live in
// OFFERED_RATES (architecturalData.ts) and stay flat regardless of the visitor's market.
export interface MarketBenchmarkRates {
  // Freelance/outsourced BIM-CAD technician market rate — used to benchmark our flat
  // technician offering (OFFERED_RATES.technicianHourlyEquivalent) against.
  technicianHourly: number;
  // Fully-loaded in-house/onshore drafter payroll cost (salary + overhead, no dedicated
  // production pipeline) — used for the "vs in-house drafter" comparison in the estimator.
  // Meaningfully higher than technicianHourly, which is a freelance market rate, not payroll.
  inHousePayrollHourly: number;
  consultantHourly: number;
  exteriorRenderPerSqFt: number;
  interiorRenderPerSqFt: number;
}

export interface SpecialistSocials {
  instagram: string;
  instagramHandle: string;
  linkedin?: string;
  youtube?: string;
  cadcrowd: string;
  fiverr: string;
  freelancer: string;
  upwork: string;
}

export interface SpecialistProfile {
  name: string;
  brandName?: string;
  title: string;
  tagline: string;
  email: string;
  phone: string;
  whatsapp: string;
  location: string;
  education?: string;
  socials: SpecialistSocials;
  availableFor: string[];
  softwareProficiencies: string[];
  yearsExperience: number;
  completedProjectsCount: number;
  baseHourlyRate: number;
  bio: string;
  logoUrl?: string;
  avatarUrl?: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  category: "CAD Permit Sets" | "3D BIM" | "3D Visualization" | "Millwork & Detailing" | "Before & After Conversion";
  description: string;
  software: string[];
  sheetDetails: string;
  imageUrl: string;
  cadPreviewUrl?: string;
  pdfUrl?: string;
  isRealClientWork?: boolean;
  specs: { label: string; value: string }[];
  tags: string[];
  clientReview?: {
    quote: string;
    platform: "Upwork" | "Fiverr" | "Freelancer" | "Cad Crowd" | "Direct";
    clientName?: string;
    rating?: number;
  };
}
