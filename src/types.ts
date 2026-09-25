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
  description: string;
}

export type ServiceId =
  | "permit_drawings"
  | "bim_modeling"
  | "construction_docs"
  | "millwork_shop_drawings"
  | "mep_structural_coordination";

export interface ServiceOption {
  id: ServiceId;
  name: string;
  shortName: string;
  description: string;
  standardTurnaroundDays: number;
  softwareUsed: string[];
}

/** One image with what's needed to show it honestly: native size (so it's never upscaled), a
 *  title and caption (for visitors and alt text), and what kind of image it is — renders may be
 *  cropped to fill a frame, screenshots and drawings are always shown whole. */
export interface TrackImage {
  src: string;
  width: number;
  height: number;
  title: string;
  caption: string;
  kind: "render" | "screenshot" | "drawing" | "model";
  /** Lighter copy (WebP, at most 1600 px wide) for the homepage ribbons and small previews. */
  lightSrc?: string;
  /** Slug of the gallery project the image belongs to (src/data/galleryProjects.ts), if any. */
  project?: string;
  /** Where the published file was cut from its source, [x, y, w, h] in source pixels (v3.0 §6). */
  crop?: [number, number, number, number];
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
  // Freelance/outsourced BIM-CAD technician market rate.
  technicianHourly: number;
  // Fully-loaded in-house/onshore drafter payroll cost (salary + overhead, no dedicated
  // production pipeline) — used for the "in-house cost" comparison in the BIM estimator.
  inHousePayrollHourly: number;
  consultantHourly: number;
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

/** Structured project facts (point 17). Only facts the owner has supplied, or that the drawings
 *  themselves state, are filled in — nothing is estimated, and an unknown fact is left out. */
export interface ProjectFacts {
  location?: string;
  areaSqFt?: number;
  bedrooms?: number;
  bathrooms?: number;
  floors?: string;
  year?: number;
  designDuration?: string;
  constructionStatus?: "Built" | "Under construction" | "Unbuilt";
  constructionDuration?: string;
  role?: string;
  /** Number of sheets in the drawing set shown. */
  sheets?: number;
  drawings?: string;
  clientType?: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  category: "CAD Permit Sets" | "3D BIM" | "3D Visualization" | "Millwork & Detailing" | "Before & After Conversion";
  description: string;
  software: string[];
  sheetDetails: string;
  /** Cover image for cards and the case-study hero. */
  cover: TrackImage;
  /** Sheets and renders from the project itself, for the floating window and case-study page. */
  images: TrackImage[];
  facts: ProjectFacts;
  /** Further project-specific facts, e.g. foundation type or code basis. */
  specs: { label: string; value: string }[];
  tags: string[];
  clientReview?: {
    quote: string;
    platform: "Upwork" | "Fiverr" | "Freelancer" | "Cad Crowd" | "Direct";
    clientName?: string;
    rating?: number;
  };
}
