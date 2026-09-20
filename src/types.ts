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
