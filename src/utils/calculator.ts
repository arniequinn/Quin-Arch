import { PROJECT_TYPES, SERVICE_OPTIONS, PROJECT_STAGES } from "../data/architecturalData";
import { DrawingSheet } from "../types";

export interface ScopeCalculationInput {
  projectTypeId: string;
  selectedServiceIds: string[];
  areaSqFt: number;
  jurisdictionId: string;
  currentStageId: string;
  timelineId: string;
  projectTitle?: string;
  customNotes?: string;
  // Sheet numbers the visitor has manually removed from the recommended set.
  // Pricing and the active sheet count exclude these; recommendedSheets still
  // returns the full list so the UI can show them as unchecked/removable.
  excludedSheetNumbers?: string[];
}

export interface ScopeCalculationResult {
  estimatedFeeMin: number;
  estimatedFeeMax: number;
  estimatedTurnaroundDays: number;
  recommendedSheetsCount: number;
  inHouseCostEstimate: number; // cost of hiring local US/UK in-house architect/drafter for this scope
  clientSavingsAmount: number;
  savingsPercentage: number;
  recommendedSheets: DrawingSheet[];
  techStack: string[];
  permitNotes: string[];
}

// Base price per sheet at each LOD tier, calibrated against researched US remote/outsourced
// BIM & CAD drafting rates ($25-150/sheet outsourced; LOD 300 modeling ~$0.25-0.45/sqft; LOD 350
// coordination sheets command a premium over LOD 300 for multi-trade interface work). Applied at
// a reference project size — see areaFactor below for how it scales with actual building size.
const LOD_BASE_PRICE: Record<string, number> = {
  "LOD 100": 175,
  "LOD 200": 260,
  "LOD 300": 340,
  "LOD 350": 460,
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function calculateScope(input: ScopeCalculationInput): ScopeCalculationResult {
  const projectType = PROJECT_TYPES.find((p) => p.id === input.projectTypeId) || PROJECT_TYPES[0];
  const selectedServices = SERVICE_OPTIONS.filter((s) => input.selectedServiceIds.includes(s.id));

  const area = Math.max(200, input.areaSqFt || 2000);
  const complexity = projectType.baseComplexity;

  // ==========================================
  // Build the actual drawing sheet set. This is the single source of truth —
  // the price below is computed FROM this list, not a separate parallel estimate,
  // so the fee always reflects exactly what's being selected.
  // ==========================================
  const sheets: DrawingSheet[] = [
    { sheetNumber: "G-001", sheetTitle: "Cover Sheet, Project Directory & Code Data", description: "Zoning summary, building height, occupancy type, sheet index, vicinity map", bimLOD: "LOD 100" },
    { sheetNumber: "G-002", sheetTitle: "Life Safety & Egress Plan", description: "Exit access travel distances, occupant loads, illuminated exit signs, fire extinguisher tags", bimLOD: "LOD 200" },
    { sheetNumber: "C-101", sheetTitle: "Architectural Site Plan & Setbacks", description: "Property lines, setbacks, easement boundaries, parking layout, accessible route", bimLOD: "LOD 200" },
  ];

  if (input.projectTypeId.includes("renovation") || input.projectTypeId.includes("addition") || input.projectTypeId.includes("as_built")) {
    sheets.push({ sheetNumber: "A-100", sheetTitle: "Existing Conditions & Demolition Plan", description: "Existing partitions to remain, walls to be demolished, salvage schedules", bimLOD: "LOD 200" });
  }

  sheets.push(
    { sheetNumber: "A-101", sheetTitle: "Dimensioned Architectural Floor Plan", description: "Full interior partition layout, door/window callouts, room names, area calculations", bimLOD: "LOD 300" },
    { sheetNumber: "A-102", sheetTitle: "Reflected Ceiling Plan (RCP) & Lighting", description: "Ceiling grid, heights, soffits, recessed downlights, decorative fixture locations", bimLOD: "LOD 300" },
    { sheetNumber: "A-103", sheetTitle: "Roof Plan & Drainage Callouts", description: "Roof pitch, valley flashing, scuppers, gutters, roof access, equipment curbs", bimLOD: "LOD 300" },
    { sheetNumber: "A-201", sheetTitle: "Exterior Building Elevations (North & South)", description: "Exterior cladding finishes, vertical datum lines, window head/sill heights", bimLOD: "LOD 300" },
    { sheetNumber: "A-202", sheetTitle: "Exterior Building Elevations (East & West)", description: "Finished grades, chimney clearances, exterior lighting fixtures, material tags", bimLOD: "LOD 300" },
    { sheetNumber: "A-301", sheetTitle: "Longitudinal & Transverse Building Sections", description: "Full-height vertical cuts, floor-to-floor heights, structural header callouts", bimLOD: "LOD 300" }
  );

  if (input.selectedServiceIds.includes("construction_docs") || input.selectedServiceIds.includes("permit_drawings")) {
    sheets.push(
      { sheetNumber: "A-401", sheetTitle: "Wall Assemblies & Envelope Details", description: "R-value thermal specs, rainscreen details, continuous insulation, vapor retarder", bimLOD: "LOD 350" },
      { sheetNumber: "A-402", sheetTitle: "Foundation & Sill Plate Details", description: "Anchor bolt spacing, capillary break, perimeter insulation, crawlspace/slab tie-in", bimLOD: "LOD 350" },
      { sheetNumber: "A-403", sheetTitle: "Stair, Guardrail & Handrail Sections", description: "Tread/riser geometry, 4\" sphere code clearance, baluster anchorage details", bimLOD: "LOD 350" }
    );
  }

  if (input.selectedServiceIds.includes("millwork_shop_drawings") || input.projectTypeId.includes("interior") || input.projectTypeId.includes("hospitality")) {
    sheets.push(
      { sheetNumber: "A-501", sheetTitle: "Interior Kitchen & Cabinetry Elevations", description: "Millwork construction details, Blum hardware callouts, quartz countertop miters", bimLOD: "LOD 350" },
      { sheetNumber: "A-502", sheetTitle: "Interior Bathroom & Custom Joinery Details", description: "Vanity fabrication, mirror backlighting, plumbing rough-in locations", bimLOD: "LOD 350" }
    );
  }

  sheets.push({ sheetNumber: "A-601", sheetTitle: "Door, Window & Hardware Schedules", description: "Manufacturer sizes, U-factors, SHGC solar heat gain, tempered glazing, egress marks", bimLOD: "LOD 300" });

  if (input.selectedServiceIds.includes("mep_structural_coordination") || input.selectedServiceIds.includes("bim_modeling")) {
    sheets.push({ sheetNumber: "M-101", sheetTitle: "MEP & Structural Coordination Sheet", description: "Clash-detected composite overlay showing HVAC trunk lines, plumbing stacks & steel beams", bimLOD: "LOD 350" });
  }

  // The visitor may have manually unchecked specific sheets from the recommended set — those
  // are excluded from pricing and counts, but stay in `sheets` (returned below) so the UI can
  // still render and re-offer them.
  const excluded = new Set(input.excludedSheetNumbers || []);
  const activeSheets = excluded.size > 0 ? sheets.filter((s) => !excluded.has(s.sheetNumber)) : sheets;

  // ==========================================
  // Price: sum each active sheet's LOD-tier base rate, scaled by project-type complexity and a
  // sublinear area factor (a 6,500 sq ft floor plan takes more time than an 850 sq ft one,
  // but nowhere near 7.6x more — most of the added area is repetitive).
  // ==========================================
  const areaFactor = clamp(Math.sqrt(area / projectType.defaultSqFt), 0.5, 2.4);

  const sheetsSubtotal = activeSheets.reduce((sum, sheet) => {
    const baseRate = LOD_BASE_PRICE[sheet.bimLOD || "LOD 300"] ?? LOD_BASE_PRICE["LOD 300"];
    return sum + baseRate * complexity * areaFactor;
  }, 0);

  // Larger drawing sets amortize model setup/coordination overhead better per sheet.
  let volumeDiscount = 1;
  if (activeSheets.length >= 20) volumeDiscount = 0.90;
  else if (activeSheets.length >= 16) volumeDiscount = 0.95;

  // Project stage: how much of the LOD-350 production work is actually still ahead. Grounded in
  // industry fee-distribution research (Schematic Design is only ~15% of total effort; Design
  // Development + Construction Documents — the phases that turn a schematic into full
  // documentation — make up 50-75%), so only "redlines/corrections" (fixing an existing set
  // rather than producing one) gets a real discount.
  const stage = PROJECT_STAGES.find((s) => s.id === input.currentStageId);
  const stageMultiplier = stage?.priceMultiplier ?? 1.0;

  const discountedSubtotal = sheetsSubtotal * volumeDiscount * stageMultiplier;

  // Turnaround: driven by whichever selected service has the longest standard delivery time.
  let totalDays = 4;
  selectedServices.forEach((service) => {
    totalDays = Math.max(totalDays, service.standardTurnaroundDays + Math.round(area / 3000));
  });

  // Redline/plan-check corrections are explicitly a rapid, bounded task, not a full production run.
  if (input.currentStageId === "redlines_revisions") {
    totalDays = Math.min(totalDays, 2);
  }

  // Timeline urgency multiplier
  let timelineMultiplier = 1.0;
  if (input.timelineId === "expedited") {
    timelineMultiplier = 1.25;
    totalDays = Math.max(4, Math.round(totalDays * 0.65));
  } else if (input.timelineId === "urgent") {
    timelineMultiplier = 1.5;
    totalDays = Math.max(3, Math.round(totalDays * 0.45));
  }

  const finalMin = Math.round(discountedSubtotal * 0.90 * timelineMultiplier);
  const finalMax = Math.round(discountedSubtotal * 1.18 * timelineMultiplier);

  // In-house comparison: a US/UK in-house drafter juggling multiple projects (meetings,
  // context-switching, no dedicated production pipeline) typically runs ~8 hours/sheet for a
  // permit+BIM package this involved, billed around $100-130/hr onshore — consistent with the
  // "60-120 hours for a full permit/CD set" and "$100-250/hr" figures from current market research.
  // Scaled by the same project-stage factor so a redline-only job is compared against an
  // in-house redline-only effort, not a full from-scratch set.
  const estimatedHours = Math.round((activeSheets.length * 8 + area / 300) * stageMultiplier);
  const inHouseCostEstimate = Math.round(estimatedHours * 115);
  const clientMidpoint = Math.round((finalMin + finalMax) / 2);
  const clientSavingsAmount = Math.max(1200, inHouseCostEstimate - clientMidpoint);
  const savingsPercentage = Math.min(78, Math.round((clientSavingsAmount / inHouseCostEstimate) * 100));

  // Collect tech stack
  const techSet = new Set<string>();
  techSet.add("3D BIM Model (Native File)");
  techSet.add("AutoCAD Architectural (.DWG)");
  techSet.add("Print-Ready Vector PDF (Arch D 24x36)");
  techSet.add("IFC 3D Digital Model");

  if (input.selectedServiceIds.includes("photoreal_rendering")) {
    techSet.add("Lumion 2024 / 4K UHD Render Stills");
  }
  if (input.selectedServiceIds.includes("mep_structural_coordination")) {
    techSet.add("Navisworks Manage Clash Report (.NWC)");
  }

  // Permit notes based on jurisdiction
  const permitNotes = [
    "Strict compliance with 2024 International Building Code (IBC) / International Residential Code (IRC)",
    "Life safety emergency egress window opening minimum net clear area: 5.7 sq ft (5.0 sq ft at grade)",
    "Continuous building thermal envelope & air barrier continuity verified per Energy Code",
    "Fire-resistance ratings for exterior walls located within 5 feet of property lines (1-Hour rated assembly)",
    "Complete coordinated title block ready for Architect of Record (AOR) or Professional Engineer (PE) stamp",
  ];

  return {
    estimatedFeeMin: finalMin,
    estimatedFeeMax: finalMax,
    estimatedTurnaroundDays: totalDays,
    recommendedSheetsCount: activeSheets.length,
    inHouseCostEstimate,
    clientSavingsAmount,
    savingsPercentage,
    recommendedSheets: sheets,
    techStack: Array.from(techSet),
    permitNotes,
  };
}
