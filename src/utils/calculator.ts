import { PROJECT_TYPES, SERVICE_OPTIONS } from "../data/architecturalData";
import { ArchitecturalBlueprint, DrawingSheet } from "../types";

export interface ScopeCalculationInput {
  projectTypeId: string;
  selectedServiceIds: string[];
  areaSqFt: number;
  jurisdictionId: string;
  currentStageId: string;
  timelineId: string;
  projectTitle?: string;
  customNotes?: string;
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

export function calculateScope(input: ScopeCalculationInput): ScopeCalculationResult {
  const projectType = PROJECT_TYPES.find((p) => p.id === input.projectTypeId) || PROJECT_TYPES[0];
  const selectedServices = SERVICE_OPTIONS.filter((s) => input.selectedServiceIds.includes(s.id));
  
  // Base area
  const area = Math.max(200, input.areaSqFt || 2000);
  const complexity = projectType.baseComplexity;

  // Calculate base service pricing
  let totalMin = 0;
  let totalMax = 0;
  let totalDays = 4;
  let totalSheets = projectType.baseSheets;

  if (selectedServices.length === 0) {
    // Default to at least permit drawings if none selected
    totalMin = 1200;
    totalMax = 2200;
    totalDays = 8;
  } else {
    selectedServices.forEach((service) => {
      // Area-based pricing scaled by complexity
      const calculatedServicePrice = area * service.basePricePerSqFt * complexity;
      const basePrice = Math.max(service.minPrice, calculatedServicePrice);
      
      totalMin += Math.round(basePrice * 0.85);
      totalMax += Math.round(basePrice * 1.25);
      totalDays = Math.max(totalDays, service.standardTurnaroundDays + Math.round(area / 3000));
      totalSheets += service.sheetImpact;
    });

    // Multi-service bundling discount (15% if 3+ services)
    if (selectedServices.length >= 3) {
      totalMin = Math.round(totalMin * 0.85);
      totalMax = Math.round(totalMax * 0.85);
    }
  }

  // Adjust for timeline
  let timelineMultiplier = 1.0;
  if (input.timelineId === "expedited") {
    timelineMultiplier = 1.25;
    totalDays = Math.max(4, Math.round(totalDays * 0.65));
  } else if (input.timelineId === "urgent") {
    timelineMultiplier = 1.5;
    totalDays = Math.max(3, Math.round(totalDays * 0.45));
  }

  const finalMin = Math.round(totalMin * timelineMultiplier);
  const finalMax = Math.round(totalMax * timelineMultiplier);

  // In-house comparison (Average US/UK Drafter/Architect billable rate is $90-$140/hr or $85k/yr + 30% overhead)
  // Typically an in-house firm spends 60-120 hours on a full permit/CD set
  const estimatedHours = Math.round((totalSheets * 4.5) + (area / 300));
  const inHouseCostEstimate = Math.round(estimatedHours * 115);
  const clientMidpoint = Math.round((finalMin + finalMax) / 2);
  const clientSavingsAmount = Math.max(1200, inHouseCostEstimate - clientMidpoint);
  const savingsPercentage = Math.min(78, Math.round((clientSavingsAmount / inHouseCostEstimate) * 100));

  // Determine drawing sheets
  const sheets: DrawingSheet[] = [
    { sheetNumber: "G-001", sheetTitle: "Cover Sheet, Project Directory & Code Data", description: "Zoning summary, building height, occupancy type, sheet index, vicinity map", revitLOD: "LOD 100" },
    { sheetNumber: "G-002", sheetTitle: "Life Safety & Egress Plan", description: "Exit access travel distances, occupant loads, illuminated exit signs, fire extinguisher tags", revitLOD: "LOD 200" },
    { sheetNumber: "C-101", sheetTitle: "Architectural Site Plan & Setbacks", description: "Property lines, setbacks, easement boundaries, parking layout, accessible route", revitLOD: "LOD 200" },
  ];

  if (input.projectTypeId.includes("renovation") || input.projectTypeId.includes("addition") || input.projectTypeId.includes("as_built")) {
    sheets.push({ sheetNumber: "A-100", sheetTitle: "Existing Conditions & Demolition Plan", description: "Existing partitions to remain, walls to be demolished, salvage schedules", revitLOD: "LOD 200" });
  }

  sheets.push(
    { sheetNumber: "A-101", sheetTitle: "Dimensioned Architectural Floor Plan", description: "Full interior partition layout, door/window callouts, room names, area calculations", revitLOD: "LOD 300" },
    { sheetNumber: "A-102", sheetTitle: "Reflected Ceiling Plan (RCP) & Lighting", description: "Ceiling grid, heights, soffits, recessed downlights, decorative fixture locations", revitLOD: "LOD 300" },
    { sheetNumber: "A-103", sheetTitle: "Roof Plan & Drainage Callouts", description: "Roof pitch, valley flashing, scuppers, gutters, roof access, equipment curbs", revitLOD: "LOD 300" },
    { sheetNumber: "A-201", sheetTitle: "Exterior Building Elevations (North & South)", description: "Exterior cladding finishes, vertical datum lines, window head/sill heights", revitLOD: "LOD 300" },
    { sheetNumber: "A-202", sheetTitle: "Exterior Building Elevations (East & West)", description: "Finished grades, chimney clearances, exterior lighting fixtures, material tags", revitLOD: "LOD 300" },
    { sheetNumber: "A-301", sheetTitle: "Longitudinal & Transverse Building Sections", description: "Full-height vertical cuts, floor-to-floor heights, structural header callouts", revitLOD: "LOD 300" }
  );

  if (input.selectedServiceIds.includes("construction_docs") || input.selectedServiceIds.includes("permit_drawings")) {
    sheets.push(
      { sheetNumber: "A-401", sheetTitle: "Wall Assemblies & Envelope Details", description: "R-value thermal specs, rainscreen details, continuous insulation, vapor retarder", revitLOD: "LOD 400" },
      { sheetNumber: "A-402", sheetTitle: "Foundation & Sill Plate Details", description: "Anchor bolt spacing, capillary break, perimeter insulation, crawlspace/slab tie-in", revitLOD: "LOD 400" },
      { sheetNumber: "A-403", sheetTitle: "Stair, Guardrail & Handrail Sections", description: "Tread/riser geometry, 4\" sphere code clearance, baluster anchorage details", revitLOD: "LOD 350" }
    );
  }

  if (input.selectedServiceIds.includes("millwork_shop_drawings") || input.projectTypeId.includes("interior") || input.projectTypeId.includes("hospitality")) {
    sheets.push(
      { sheetNumber: "A-501", sheetTitle: "Interior Kitchen & Cabinetry Elevations", description: "Millwork construction details, Blum hardware callouts, quartz countertop miters", revitLOD: "LOD 350" },
      { sheetNumber: "A-502", sheetTitle: "Interior Bathroom & Custom Joinery Details", description: "Vanity fabrication, mirror backlighting, plumbing rough-in locations", revitLOD: "LOD 350" }
    );
  }

  sheets.push({ sheetNumber: "A-601", sheetTitle: "Door, Window & Hardware Schedules", description: "Manufacturer sizes, U-factors, SHGC solar heat gain, tempered glazing, egress marks", revitLOD: "LOD 300" });

  if (input.selectedServiceIds.includes("mep_structural_coordination") || input.selectedServiceIds.includes("bim_modeling")) {
    sheets.push({ sheetNumber: "M-101", sheetTitle: "MEP & Structural Coordination Sheet", description: "Clash-detected composite overlay showing HVAC trunk lines, plumbing stacks & steel beams", revitLOD: "LOD 350" });
  }

  // Collect tech stack
  const techSet = new Set<string>();
  techSet.add("Autodesk Revit 2024 (.RVT)");
  techSet.add("AutoCAD Architectural (.DWG)");
  techSet.add("Print-Ready Vector PDF (Arch D 24x36)");
  techSet.add("BIMx / IFC 3D Digital Model");

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
    recommendedSheetsCount: sheets.length,
    inHouseCostEstimate,
    clientSavingsAmount,
    savingsPercentage,
    recommendedSheets: sheets,
    techStack: Array.from(techSet),
    permitNotes,
  };
}

export function buildCompleteBlueprint(
  input: ScopeCalculationInput,
  result: ScopeCalculationResult
): ArchitecturalBlueprint {
  const projectType = PROJECT_TYPES.find((p) => p.id === input.projectTypeId) || PROJECT_TYPES[0];

  return {
    executiveSummary: `Tailored architectural delivery roadmap for ${input.projectTitle || projectType.name} (${input.areaSqFt} sq ft). Prepared for turn-key remote execution utilizing cloud-coordinated BIM (Revit/CAD). Designed to streamline municipal plan-check review and provide clear, error-free documentation for bidding and construction.`,
    recommendedDrawingSet: result.recommendedSheets,
    bimAndTechnicalSpecs: {
      recommendedSoftware: "Autodesk Revit 2024 • AutoCAD Architectural Desktop • Bluebeam Revu",
      bimStandard: "AIA CAD Layering Guidelines • US National CAD Standard (NCS) • Revit LOD 300",
      deliveryFormats: result.techStack,
    },
    permitAndCodeChecklist: result.permitNotes,
    phasingMilestones: [
      {
        phase: "Phase 1: Project Kickoff & Base Modeling",
        durationDays: Math.max(2, Math.round(result.estimatedTurnaroundDays * 0.3)),
        deliverables: "Revit model setup, site plan orientation, grid line layout, primary partition & structural core.",
      },
      {
        phase: "Phase 2: Working Drawings & Redline Review",
        durationDays: Math.max(2, Math.round(result.estimatedTurnaroundDays * 0.4)),
        deliverables: "Exterior elevations, building sections, door/window schedules, ceiling & roof plans sent for client markup.",
      },
      {
        phase: "Phase 3: Detailing & Code Coordination",
        durationDays: Math.max(2, Math.round(result.estimatedTurnaroundDays * 0.3)),
        deliverables: "Enclosure assemblies, waterproofing details, millwork sheets, final vector PDF release and native DWG/RVT files.",
      },
    ],
    costSavingsInsight: `Partnering with a remote architecture specialist saves your firm approximately $${result.clientSavingsAmount.toLocaleString()} (${result.savingsPercentage}% savings) compared to hiring an in-house drafter, with zero recruitment lag and immediate turnaround.`,
    specialistRecommendedAddons: [
      "4K Photorealistic Exterior & Interior Twilight Renders for client presentation",
      "Full Millwork Shop Drawings with cut-lists for custom cabinetry fabricators",
      "Expedited 24-48 Hour Turnaround for Municipal Plan-Check Redline Corrections",
    ],
  };
}
