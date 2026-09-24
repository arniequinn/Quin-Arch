// Level of Development (LOD): the site's single statement of which levels are covered (point 8 of
// documentation/final-polish-v2.0.md), plus the content of the LOD field guide (point 14,
// Appendix B). Every page that mentions LOD coverage reads it from here.
//
// The BIMForum specification is licensed CC BY-NC-ND, so nothing below reproduces its text or
// tables: the definitions are the site's own plain-language paraphrases, and the guide links to
// the official PDF for the exact wording.

export type LodStatus = "standard" | "by-request" | "not-offered";

export const LOD_STATUS_LABEL: Record<LodStatus, string> = {
  standard: "Standard",
  "by-request": "By request",
  "not-offered": "Not offered",
};

export interface LodLevel {
  level: string;
  name: string;
  status: LodStatus;
  /** One sentence for compact tables. */
  summary: string;
  /** Paraphrase of the official definition (BIMForum LOD Specification 2025, Part I). */
  definition: string;
  /** What it means in practice. */
  meaning: string;
  usedFor: string;
  /** The same element — one window — at every LOD. */
  windowExample: string;
  /** ISO 7817-1 "level of information need" geometry aspects. */
  informationNeed: { detail: string; dimensionality: string; location: string; appearance: string; parametric: string };
  modeledBy: string;
}

export const LOD_LEVELS: LodLevel[] = [
  {
    level: "LOD 100",
    name: "Concept",
    status: "standard",
    summary: "A symbol or placeholder: the element exists, but its size and position aren't committed.",
    definition:
      "The element may appear as a symbol or generic placeholder only. Figures such as cost per square foot or HVAC tonnage come from other elements, not from the element itself.",
    meaning: "“Something goes here.” Enough to test an idea, not enough to measure.",
    usedFor: "Feasibility, massing and area studies, early cost plans by area or volume.",
    windowExample: "No window object yet — at most a void in the massing, or a glazing ratio attached to the wall.",
    informationNeed: {
      detail: "None",
      dimensionality: "Symbol or zone",
      location: "Approximate",
      appearance: "None",
      parametric: "None",
    },
    modeledBy: "Design team",
  },
  {
    level: "LOD 200",
    name: "Approximate geometry",
    status: "standard",
    summary: "A generic object with approximate quantity, size, shape, location and orientation.",
    definition:
      "The element is modeled as a generic object whose quantity, size, shape, location and orientation are approximate.",
    meaning: "“Roughly this big, roughly here.” It can be measured, but the numbers are expected to move.",
    usedFor: "Schematic design, early coordination between disciplines, approximate quantities.",
    windowExample: "A generic window in roughly the right opening — about 3 ft × 5 ft — with no frame or glazing detail.",
    informationNeed: {
      detail: "Generic",
      dimensionality: "3D",
      location: "Approximate",
      appearance: "Generic",
      parametric: "Basic (resizable)",
    },
    modeledBy: "Design team",
  },
  {
    level: "LOD 300",
    name: "Precise geometry",
    status: "standard",
    summary: "The designed element at its real size and position — measurable straight off the model.",
    definition:
      "The element, as designed, is modeled so that its quantity, size, shape, location and orientation can be measured directly from the model.",
    meaning:
      "“Exactly this, exactly here, as designed.” Precise — but not yet checked against the other trades, so LOD 300 elements aren't guaranteed to be clash-free.",
    usedFor: "Construction documents, permit submissions, reliable quantities.",
    windowExample:
      "The specified window type at its actual rough-opening size, with head and sill heights and its exact position in the wall.",
    informationNeed: {
      detail: "Specific",
      dimensionality: "3D",
      location: "Precise",
      appearance: "Representative",
      parametric: "Type and size",
    },
    modeledBy: "Design team",
  },
  {
    level: "LOD 350",
    name: "Coordination-ready",
    status: "standard",
    summary: "LOD 300 plus the element's interfaces with the systems around it — what clash detection needs.",
    definition:
      "As LOD 300, and the element's interfaces with adjacent or dependent elements can be measured as well.",
    meaning:
      "“Exactly this, and exactly how it meets everything around it.” Getting the interfaces right often takes knowledge of how the trade actually builds it.",
    usedFor: "Construction-level coordination and clash detection between architecture, structure and MEP.",
    windowExample:
      "The LOD 300 window plus its header or lintel, sill and flashing zones, fixing to the wall assembly and clearances to structure.",
    informationNeed: {
      detail: "Specific, with interfaces",
      dimensionality: "3D",
      location: "Precise",
      appearance: "Representative",
      parametric: "Type, size and connections",
    },
    modeledBy: "Design team, with trade input",
  },
  {
    level: "LOD 400",
    name: "Fabrication-ready",
    status: "by-request",
    summary: "Detailed enough to fabricate, assemble and install from.",
    definition: "The element is modeled in enough detail for fabrication, assembly and installation.",
    meaning: "“Build it from this.” The level of a shop drawing, usually tied to one manufacturer's product.",
    usedFor: "Shop drawings, fabrication, prefabrication and installation.",
    windowExample:
      "The manufacturer's actual product: frame profiles, glazing build-up, fixings and installation details.",
    informationNeed: {
      detail: "Fabrication",
      dimensionality: "3D",
      location: "Precise",
      appearance: "Actual product",
      parametric: "Manufacturer-specific",
    },
    modeledBy: "Usually the trade or fabricator",
  },
  {
    level: "LOD 500",
    name: "Field-verified",
    status: "not-offered",
    summary: "An existing or as-built condition, verified in the field, with its accuracy stated.",
    definition:
      "The element represents an existing or as-constructed condition, developed through observation, field verification or interpolation, with its level of accuracy noted.",
    meaning:
      "“What's actually there, checked on site.” Not a step above LOD 400: a different kind of information, taken from something that exists rather than designed for something that will.",
    usedFor: "As-built records, facilities management, surveys of existing buildings.",
    windowExample:
      "The installed window as measured on site, with its surveyed position and a stated accuracy (for example, to the USIBD Level of Accuracy specification).",
    informationNeed: {
      detail: "As observed",
      dimensionality: "3D",
      location: "As measured, accuracy stated",
      appearance: "As found",
      parametric: "As recorded",
    },
    modeledBy: "Surveyor or contractor with site access",
  },
];

/** The single sentence of what's covered — used verbatim wherever the site states it. */
export const LOD_COVERAGE =
  "LOD 100–350 is standard, LOD 400 is available by request, and LOD 500 isn't offered.";

/** Short form for tight spaces (hero lines, meta descriptions). */
export const LOD_COVERAGE_SHORT = "LOD 100–350, LOD 400 by request";

/** Why LOD 500 isn't offered, and what as-built work is instead. */
export const LOD_500_NOTE =
  "As-built drawings and models are produced from the records you supply — they aren't field-verified, so they are not LOD 500.";

export const LOD_SOURCES = [
  {
    label: "BIMForum — Level of Development (LOD) Specification 2025, Part I",
    href: "https://bimforum.org/wp-content/uploads/2026/01/LOD-Spec-2025-Part-I-Official.pdf",
    note: "The reference for every level above. Licensed CC BY-NC-ND 4.0; the definitions here are paraphrased — see the specification for its exact wording.",
  },
  {
    label: "BIMForum — Official release of the 2025 LOD Specification",
    href: "https://bimforum.org/official-release-2025-lod-specification/",
  },
  {
    label: "ISO 7817-1 — Building information modelling: Level of information need",
    note: "The geometry aspects in the tables (detail, dimensionality, location, appearance, parametric behaviour).",
  },
  {
    label: "USIBD — Level of Accuracy (LOA) Specification",
    note: "How to state the accuracy of field-verified (LOD 500) work.",
  },
  {
    label: "U.S. National CAD Standard (NCS) and Uniform Drawing System (UDS)",
    note: "Sheet numbering and drawing-set organisation.",
  },
];

// The guide's sections, shared by its screen and print layouts (LodGuidePage.tsx).
export const LOD_PHASE_TEXT = [
  "LOD describes how far a single model element is developed — not how far along the project is. A schematic-design model can already hold LOD 300 elements where decisions have been made, and a construction set can still carry LOD 200 placeholders for items a trade will design later.",
  "The specification is explicit that the levels aren't defined by design phases, though a phase can be described in LOD terms. That's why a good proposal sets LOD element by element — and why the scope estimator here asks where your project is, and leaves LOD to be agreed per element.",
];

export const LOD_ISO_TEXT = [
  "LOD is the North American scale for how developed an element is. ISO 7817-1, used widely in the UK and Europe, describes the level of information need instead: for each purpose and milestone, the geometry a deliverable needs — its detail, dimensionality, location, appearance and parametric behaviour — plus the data and documents that go with it.",
  "The two map onto each other well; each level lists the geometry aspects it typically carries.",
];

export const LOD_PERMIT_SET_INTRO =
  "Sheets are numbered by the U.S. National CAD Standard: a discipline letter, then the sheet type — 0 general, 1 plans, 2 elevations, 3 sections, 4 enlarged views, 5 details, 6 schedules. A typical set draws from these series, depending on the project:";

export const LOD_HOW_TO_SPECIFY = [
  "Set LOD per element or system, not one number for the whole model — walls and openings at LOD 300, say, with MEP at LOD 200 until the engineers' design lands.",
  "Name the specification and its edition: “BIMForum LOD Specification 2025”.",
  "Tie each LOD to what the model is for and when — the permit set, trade coordination, fabrication.",
  "Say who models what: the design team usually to LOD 350, the trades for LOD 400 shop models.",
  "For existing buildings, state the accuracy you need (the USIBD Level of Accuracy specification is the usual reference) and who verifies it on site.",
  "Agree whether the drawings or the model govern if the two ever differ.",
];

export const LOD_DELIVER_TEXT = `LOD 350 coordination is part of every BIM model; fabrication-level LOD 400 modelling is quoted separately when a project genuinely needs it. ${LOD_500_NOTE}`;

export const LOD_GUIDE_VERSION = "v2.0 — September 2026";

export const LOD_GLOSSARY: Array<[term: string, meaning: string]> = [
  ["BIM", "Building Information Modeling — a model of the building whose elements carry data as well as geometry."],
  ["LOD", "Level of Development — how far a model element's geometry and information have been developed and can be relied on."],
  ["LOI / LOIN", "Level of Information / Level of Information Need (ISO 7817-1) — what information a deliverable must carry for a given purpose."],
  ["NCS", "U.S. National CAD Standard — layers, sheet numbering and drawing conventions."],
  ["UDS", "Uniform Drawing System — the part of the NCS that organises sheets by discipline and type (e.g. A-101)."],
  ["RFI", "Request for Information — a contractor's formal question about the drawings during construction."],
  ["CA", "Construction Administration — the architect's work during construction: RFIs, submittals, site questions and revisions."],
];
