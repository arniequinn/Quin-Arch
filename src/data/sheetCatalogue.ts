import { ProjectCategory, ServiceId } from "../types";

// The BIM/CAD estimator's drawing-set catalogue (point 21 of documentation/final-polish-v2.0.md).
//
// Numbering follows the U.S. National CAD Standard's Uniform Drawing System: a discipline
// designator (G general, A architectural, AS architectural site, AD architectural demolition,
// Q equipment), then a sheet-type digit — 0 general, 1 plans, 2 elevations, 3 sections, 4 large-scale
// views (enlarged plans, interior elevations), 5 details, 6 schedules — then a two-digit sequence.
// Coordination output (clash detection) is a deliverable of its own, not an M-sheet.
//
// Which sheets start switched on is worked out from the project type and the selected services
// only, so the same inputs always give the same default set; the visitor's own toggles are kept
// separately as changes on top of it (see calculator.ts).
//
// To review before launch: the owner checks this catalogue for each project type.

export type SheetSeries =
  | "General"
  | "Site"
  | "Plans"
  | "Elevations"
  | "Sections"
  | "Enlarged / interior"
  | "Details"
  | "Schedules";

export const SHEET_SERIES_ORDER: SheetSeries[] = [
  "General",
  "Site",
  "Plans",
  "Elevations",
  "Sections",
  "Enlarged / interior",
  "Details",
  "Schedules",
];

export type TypicalLod = "LOD 100" | "LOD 200" | "LOD 300" | "LOD 350";

type TypeList = ProjectCategory[] | "all";

export interface SheetSpec {
  number: string;
  title: string;
  description: string;
  series: SheetSeries;
  /** The typical LOD of what's drawn on the sheet — it also sets the sheet's base price. */
  typicalLod: TypicalLod;
  /** Project types the sheet belongs to at all. Everything else never shows it. */
  appliesTo: TypeList;
  /** Project types where it starts switched on (whenever one of `addedBy` is selected). */
  defaultOn: TypeList;
  /** Also switched on by default whenever one of these services is selected. */
  defaultWith?: ServiceId[];
  /** Services that bring the sheet into scope — any one of them is enough. */
  addedBy: ServiceId[];
  /** Per-type title, e.g. existing-condition drawings for as-built work. */
  titleFor?: Partial<Record<ProjectCategory, string>>;
}

const PRODUCTION: ServiceId[] = ["permit_drawings", "bim_modeling", "construction_docs"];

const NEW_BUILD: ProjectCategory[] = [
  "residential_single",
  "residential_adu",
  "renovation_addition",
  "residential_multifamily",
  "commercial_retail",
  "commercial_hospitality",
];

export const SHEET_CATALOGUE: SheetSpec[] = [
  // General
  {
    number: "G-001",
    title: "Cover sheet, sheet index & project data",
    description: "Project data, zoning summary, code basis, sheet index and vicinity map.",
    series: "General",
    typicalLod: "LOD 100",
    appliesTo: "all",
    defaultOn: "all",
    addedBy: [...PRODUCTION, "millwork_shop_drawings"],
  },
  {
    number: "G-002",
    title: "Code analysis & life-safety plan",
    description: "Occupancy and construction type, occupant loads, exits, travel distances and fire separations.",
    series: "General",
    typicalLod: "LOD 200",
    appliesTo: ["residential_multifamily", "commercial_retail", "commercial_hospitality", "interior_fitout"],
    defaultOn: ["residential_multifamily", "commercial_retail", "commercial_hospitality"],
    addedBy: ["permit_drawings"],
  },

  // Site
  {
    number: "AS-101",
    title: "Architectural site plan",
    description: "Property lines, setbacks, easements, building footprint, parking and the accessible route.",
    series: "Site",
    typicalLod: "LOD 200",
    appliesTo: [...NEW_BUILD, "as_built_conversion"],
    defaultOn: NEW_BUILD,
    addedBy: PRODUCTION,
    titleFor: { as_built_conversion: "Site plan (existing)" },
  },

  // Plans
  {
    number: "AD-101",
    title: "Existing conditions & demolition plan",
    description: "Walls, fixtures and finishes to remain, to be removed and to be salvaged, keyed to demolition notes.",
    series: "Plans",
    typicalLod: "LOD 200",
    appliesTo: ["renovation_addition", "commercial_retail", "commercial_hospitality", "interior_fitout"],
    defaultOn: ["renovation_addition", "interior_fitout"],
    addedBy: PRODUCTION,
  },
  {
    number: "A-101",
    title: "Floor plans",
    description: "Dimensioned plans with walls, openings, room names and areas, and door and window tags.",
    series: "Plans",
    typicalLod: "LOD 300",
    appliesTo: "all",
    defaultOn: "all",
    addedBy: PRODUCTION,
    titleFor: {
      residential_multifamily: "Floor plans — ground level",
      as_built_conversion: "Floor plans (existing, from supplied records)",
    },
  },
  {
    number: "A-102",
    title: "Floor plans — upper levels",
    description: "Each upper storey, dimensioned, with stair and shaft alignment carried through from below.",
    series: "Plans",
    typicalLod: "LOD 300",
    appliesTo: [
      "residential_single",
      "renovation_addition",
      "residential_multifamily",
      "commercial_retail",
      "commercial_hospitality",
      "as_built_conversion",
    ],
    defaultOn: ["residential_single", "residential_multifamily"],
    addedBy: PRODUCTION,
    titleFor: {
      residential_multifamily: "Floor plans — typical upper levels",
      as_built_conversion: "Floor plans — upper levels (existing)",
    },
  },
  {
    number: "A-111",
    title: "Reflected ceiling plans",
    description: "Ceiling heights and materials, soffits, light fixtures, diffusers and access panels.",
    series: "Plans",
    typicalLod: "LOD 300",
    appliesTo: [...NEW_BUILD, "interior_fitout"],
    defaultOn: ["commercial_retail", "commercial_hospitality", "interior_fitout"],
    addedBy: PRODUCTION,
  },
  {
    number: "A-121",
    title: "Roof plan",
    description: "Roof slopes and drainage, gutters and downpipes, overflows, rooftop equipment and access.",
    series: "Plans",
    typicalLod: "LOD 300",
    appliesTo: [...NEW_BUILD, "as_built_conversion"],
    defaultOn: ["residential_single", "residential_adu", "renovation_addition", "residential_multifamily"],
    addedBy: PRODUCTION,
  },
  {
    number: "Q-101",
    title: "Food-service equipment plan & schedule",
    description: "Kitchen equipment layout keyed to an equipment schedule, with hood, grease-trap and utility connections.",
    series: "Plans",
    typicalLod: "LOD 300",
    appliesTo: ["commercial_hospitality"],
    defaultOn: ["commercial_hospitality"],
    addedBy: PRODUCTION,
  },

  // Elevations
  {
    number: "A-201",
    title: "Exterior elevations",
    description: "Building faces with finishes, openings, floor and roof heights, and finished grades.",
    series: "Elevations",
    typicalLod: "LOD 300",
    appliesTo: [...NEW_BUILD, "as_built_conversion"],
    defaultOn: [...NEW_BUILD, "as_built_conversion"],
    addedBy: PRODUCTION,
    titleFor: { as_built_conversion: "Exterior elevations (existing)" },
  },
  {
    number: "A-202",
    title: "Exterior elevations (continued)",
    description: "The remaining building faces, with material changes and datum heights.",
    series: "Elevations",
    typicalLod: "LOD 300",
    appliesTo: ["residential_single", "residential_multifamily", "commercial_hospitality", "commercial_retail"],
    defaultOn: ["residential_single", "residential_multifamily"],
    addedBy: PRODUCTION,
  },

  // Sections
  {
    number: "A-301",
    title: "Building sections",
    description: "Full-height cuts through the building: floor-to-floor heights, structure and assemblies.",
    series: "Sections",
    typicalLod: "LOD 300",
    appliesTo: [...NEW_BUILD, "as_built_conversion"],
    defaultOn: [...NEW_BUILD, "as_built_conversion"],
    addedBy: PRODUCTION,
    titleFor: { as_built_conversion: "Building sections (existing)" },
  },
  {
    number: "A-311",
    title: "Wall sections",
    description: "Wall cuts from foundation to roof: assemblies, insulation, air and water barriers.",
    series: "Sections",
    typicalLod: "LOD 350",
    appliesTo: NEW_BUILD,
    defaultOn: NEW_BUILD,
    addedBy: ["construction_docs"],
  },

  // Enlarged plans and interior elevations
  {
    number: "A-401",
    title: "Enlarged plans — kitchens, baths & restrooms",
    description: "Wet rooms at large scale: fixtures, clearances, dimensions and finishes.",
    series: "Enlarged / interior",
    typicalLod: "LOD 350",
    appliesTo: [...NEW_BUILD, "interior_fitout"],
    defaultOn: ["residential_multifamily", "commercial_retail", "commercial_hospitality", "interior_fitout"],
    addedBy: ["construction_docs", "millwork_shop_drawings"],
  },
  {
    number: "A-411",
    title: "Enlarged unit plans",
    description: "Each unit type at larger scale, with dimensions, fixtures and unit areas.",
    series: "Enlarged / interior",
    typicalLod: "LOD 300",
    appliesTo: ["residential_multifamily"],
    defaultOn: ["residential_multifamily"],
    addedBy: PRODUCTION,
  },
  {
    number: "A-421",
    title: "Interior elevations — kitchens & millwork",
    description: "Cabinet runs, appliances, countertops and finishes, dimensioned for pricing and install.",
    series: "Enlarged / interior",
    typicalLod: "LOD 350",
    appliesTo: [...NEW_BUILD, "interior_fitout"],
    defaultOn: ["commercial_hospitality", "interior_fitout"],
    defaultWith: ["millwork_shop_drawings"],
    addedBy: ["construction_docs", "millwork_shop_drawings"],
  },
  {
    number: "A-422",
    title: "Interior elevations — bathrooms & joinery",
    description: "Vanities, tiling, mirrors, accessories and fixture heights.",
    series: "Enlarged / interior",
    typicalLod: "LOD 350",
    appliesTo: [...NEW_BUILD, "interior_fitout"],
    defaultOn: ["interior_fitout"],
    defaultWith: ["millwork_shop_drawings"],
    addedBy: ["construction_docs", "millwork_shop_drawings"],
  },

  // Details
  {
    number: "A-501",
    title: "Envelope details",
    description: "Wall, roof and opening details at large scale: insulation, air and water barriers, flashing.",
    series: "Details",
    typicalLod: "LOD 350",
    appliesTo: NEW_BUILD,
    defaultOn: NEW_BUILD,
    addedBy: ["construction_docs"],
  },
  {
    number: "A-502",
    title: "Foundation & slab-edge details",
    description: "Footing and slab-edge conditions, anchorage, perimeter insulation and moisture protection.",
    series: "Details",
    typicalLod: "LOD 350",
    appliesTo: NEW_BUILD,
    defaultOn: ["residential_single", "residential_adu", "renovation_addition", "residential_multifamily"],
    addedBy: ["construction_docs"],
  },
  {
    number: "A-503",
    title: "Stair, guard & handrail details",
    description: "Riser and tread geometry, guard heights and openings, handrail profiles and fixings.",
    series: "Details",
    typicalLod: "LOD 350",
    appliesTo: ["residential_single", "renovation_addition", "residential_multifamily", "commercial_retail", "commercial_hospitality"],
    defaultOn: ["residential_single", "residential_multifamily"],
    addedBy: ["construction_docs"],
  },
  {
    number: "A-504",
    title: "Millwork & casework details",
    description: "Cabinet and joinery sections, materials, edge profiles, hardware and fixing details.",
    series: "Details",
    typicalLod: "LOD 350",
    appliesTo: [...NEW_BUILD, "interior_fitout"],
    defaultOn: [],
    defaultWith: ["millwork_shop_drawings"],
    addedBy: ["millwork_shop_drawings"],
  },
  {
    number: "A-505",
    title: "Accessibility details",
    description: "Accessible restroom layouts, clear floor spaces, grab bars, reach ranges and counter heights.",
    series: "Details",
    typicalLod: "LOD 300",
    appliesTo: ["residential_multifamily", "commercial_retail", "commercial_hospitality", "interior_fitout"],
    defaultOn: ["commercial_retail", "commercial_hospitality"],
    addedBy: ["permit_drawings", "construction_docs"],
  },

  // Schedules
  {
    number: "A-601",
    title: "Door & window schedules",
    description: "Sizes and types, fire ratings, glazing, hardware sets and energy values (U-factor, SHGC).",
    series: "Schedules",
    typicalLod: "LOD 300",
    appliesTo: [...NEW_BUILD, "interior_fitout"],
    defaultOn: [...NEW_BUILD, "interior_fitout"],
    addedBy: PRODUCTION,
  },
  {
    number: "A-602",
    title: "Room finish schedule",
    description: "Floor, base, wall and ceiling finishes, room by room.",
    series: "Schedules",
    typicalLod: "LOD 300",
    appliesTo: ["residential_single", "residential_multifamily", "commercial_retail", "commercial_hospitality", "interior_fitout"],
    defaultOn: ["commercial_retail", "commercial_hospitality", "interior_fitout"],
    addedBy: [...PRODUCTION, "millwork_shop_drawings"],
  },
];

/** Deliverables that aren't drawing sheets, priced like sheets of the given LOD. */
export interface DeliverableSpec {
  id: string;
  title: string;
  addedBy: ServiceId[];
  /** Priced as this many sheets at this LOD; 0 = included at no extra cost. */
  priceAs: { lod: TypicalLod; sheets: number };
}

export const OTHER_DELIVERABLES: DeliverableSpec[] = [
  {
    id: "drawing-files",
    title: "Print-ready PDF set (ARCH D, 24 × 36 in) and DWG files on your layer standard",
    addedBy: [...PRODUCTION, "millwork_shop_drawings"],
    priceAs: { lod: "LOD 100", sheets: 0 },
  },
  {
    id: "bim-model",
    title: "BIM model — native Archicad file, IFC, and .rvt export (no editable families)",
    addedBy: ["bim_modeling"],
    priceAs: { lod: "LOD 350", sheets: 1 },
  },
  {
    id: "clash-report",
    title: "Clash-detection report and coordination issues log (Navisworks Manage or Archicad, depending on model size)",
    addedBy: ["mep_structural_coordination"],
    priceAs: { lod: "LOD 350", sheets: 1 },
  },
];

const inList = (list: TypeList, type: ProjectCategory) => list === "all" || list.includes(type);
const anySelected = (services: ServiceId[], selected: ServiceId[]) => services.some((s) => selected.includes(s));

export interface CatalogueSheet {
  number: string;
  title: string;
  description: string;
  series: SheetSeries;
  typicalLod: TypicalLod;
  /** Switched on by default for this project type and these services. */
  defaultOn: boolean;
}

/** Every sheet that belongs to this project type with these services, in catalogue order. */
export function sheetsFor(projectType: ProjectCategory, services: ServiceId[]): CatalogueSheet[] {
  return SHEET_CATALOGUE.filter((s) => inList(s.appliesTo, projectType) && anySelected(s.addedBy, services)).map(
    (s) => ({
      number: s.number,
      title: s.titleFor?.[projectType] ?? s.title,
      description: s.description,
      series: s.series,
      typicalLod: s.typicalLod,
      defaultOn: inList(s.defaultOn, projectType) || anySelected(s.defaultWith ?? [], services),
    })
  );
}

export function deliverablesFor(services: ServiceId[]): DeliverableSpec[] {
  return OTHER_DELIVERABLES.filter((d) => anySelected(d.addedBy, services));
}
