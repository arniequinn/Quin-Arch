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
  basePricePerSqFt: number;
  minPrice: number;
  standardTurnaroundDays: number;
  sheetImpact: number;
  softwareUsed: string[];
  popular?: boolean;
}

export interface LeadVerificationResult {
  verifiedAt: string;
  overallStatus: "verified" | "suspicious" | "fake" | "pending";
  reliabilityScore: number; // 0 - 100
  emailCheck: {
    status: "valid_mx" | "no_mx" | "invalid_domain" | "disposable" | "syntax_error" | "missing";
    emailProvided: string;
    domain: string;
    mxRecords: string[];
    isDisposable: boolean;
    diagnosticMessage: string;
  };
  phoneCheck: {
    status: "valid" | "fake_555" | "invalid_format" | "repeating_digits" | "missing";
    phoneProvided: string;
    formattedNumber?: string;
    countryCode?: string;
    diagnosticMessage: string;
  };
  summaryBadge: string;
  recommendation: string;
  checkedByBot: string;
}

export interface LeadSubmission {
  id: string;
  createdAt: string;
  submittedAt?: string;
  clientName: string;
  email: string;
  phone?: string;
  firmOrRole: string;
  projectTitle: string;
  projectType: string;
  services: string[];
  areaSqFt: number;
  locationJurisdiction: string;
  currentStage: string;
  timeline: string;
  budgetTier?: string;
  customNotes?: string;
  projectFilesLink?: string;
  estimatedFeeRange: { min: number; max: number };
  estimatedTurnaroundDays: number;
  recommendedSheetsCount: number;
  generatedBlueprint?: ArchitecturalBlueprint;
  status: "new" | "contacted" | "proposal_sent" | "converted";
  verification?: LeadVerificationResult;
}

export interface DrawingSheet {
  sheetNumber: string;
  sheetTitle: string;
  description: string;
  revitLOD?: string;
}

export interface PhasingMilestone {
  phase: string;
  durationDays: number;
  deliverables: string;
}

export interface ArchitecturalBlueprint {
  executiveSummary: string;
  recommendedDrawingSet: DrawingSheet[];
  bimAndTechnicalSpecs: {
    recommendedSoftware: string;
    bimStandard: string;
    deliveryFormats: string[];
  };
  permitAndCodeChecklist: string[];
  phasingMilestones: PhasingMilestone[];
  costSavingsInsight: string;
  specialistRecommendedAddons: string[];
}

export interface SpecialistSocials {
  instagram: string;
  instagramHandle: string;
  linkedin?: string;
  cadcrowd: string;
  fiverr: string;
  freelancer: string;
  upwork: string;
  dropboxFolder: string;
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
  category: "CAD Permit Sets" | "3D BIM & Revit" | "3D Visualization" | "Millwork & Detailing" | "Before & After Conversion";
  description: string;
  software: string[];
  sheetDetails: string;
  imageUrl: string;
  cadPreviewUrl?: string;
  pdfUrl?: string;
  dropboxUrl?: string;
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

export interface AgentAuditRound {
  roundNumber: number;
  timestamp: string;
  workerSubmission: {
    focusArea: string;
    summary: string;
    changesApplied: string[];
    verifiedArtifacts: string[];
  };
  criticReview: {
    leadGenScore: number; // out of 10 (Benchmark 1)
    skillPresentationScore: number; // out of 10 (Benchmark 2)
    overallScore: number; // out of 10
    isApproved: boolean; // true if >= 8.5
    verdict: string;
    whatWorks: string[];
    whatNeedsImprovement: string[];
    constructiveGuidance: string;
  };
}

export interface DualAgentAuditResult {
  status: "approved_live" | "evaluating" | "revisions_needed";
  finalScore: number;
  benchmarkThreshold: number; // 8.5
  activeRound: number;
  rounds: AgentAuditRound[];
  benchmarkDefinitions: {
    benchmark1: {
      name: string;
      goal: string;
      criteria: string[];
    };
    benchmark2: {
      name: string;
      goal: string;
      criteria: string[];
    };
  };
}

// Real Traffic & Visit Analytics Types (Strictly authentic, 0 fake data)
export type TrafficSource = 
  | "Direct"
  | "Upwork"
  | "Instagram"
  | "LinkedIn"
  | "WhatsApp"
  | "Fiverr"
  | "Freelancer"
  | "Google"
  | "Cad Crowd"
  | "Other";

export interface PageVisit {
  id: string;
  timestamp: string;
  referrer: string;
  sourceCategory: TrafficSource;
  path: string;
  deviceType: "Desktop" | "Mobile" | "Tablet";
  screenWidth?: number;
  language?: string;
  timezone?: string;
  country?: string;
  sessionId: string;
}

export interface TrafficAnalyticsSummary {
  totalVisits: number;
  uniqueVisitors: number;
  scopeCalculationsCount: number;
  leadsCapturedCount: number;
  whatsappClicksCount: number;
  conversionRate: number; // percentage
  visitsBySource: Record<TrafficSource, number>;
  visitsByDevice: {
    Desktop: number;
    Mobile: number;
    Tablet: number;
  };
  visitsByTimezone: Record<string, number>;
  recentVisits: PageVisit[];
}

export interface TrafficBenchmark {
  level: number;
  name: string;
  description: string;
  targetVisits: number;
  targetCalculations: number;
  targetLeadsOrClicks: number;
  requiredChannels: number;
  achieved: boolean;
  achievedAt?: string;
}

export interface TrafficAuditReport {
  activeBenchmark: TrafficBenchmark;
  benchmarkLevel: number;
  benchmarkAchieved: boolean;
  benchmarkProgressPct: number;
  unlockedBenchmarks: TrafficBenchmark[];
  nextBenchmark: TrafficBenchmark | null;
  checkerAgentVerdict: {
    score: number; // out of 10
    assessment: string;
    trafficHealth: "Nascent" | "Gaining Traction" | "Channel Diversified" | "High Converting";
    missingSignals: string[];
    benchmarkStatus: "IN_PROGRESS" | "BAR_RAISED";
    nextBarThreshold: string;
  };
  workerAgentActions: {
    id: string;
    title: string;
    channel: TrafficSource;
    priority: "High" | "Medium" | "Low";
    description: string;
    copySnippet?: string;
    actionType: "copy_hook" | "open_whatsapp" | "open_instagram" | "open_upwork";
  }[];
}
