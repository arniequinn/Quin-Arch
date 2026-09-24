import { EstimatorService } from "./routes";

// What each service does not cover (point 7 of documentation/final-polish-v2.0.md). Shown on each
// service page and, in short, in the matching estimator tab's result panel.
//
// DRAFT — for the owner to confirm or edit, especially the licensing line. Hidden on the deployed
// site until OWNER_CONFIRMED.exclusions is set in ownerSignoff.ts.
export interface ExclusionList {
  /** Every line, for the service page. */
  items: string[];
  /** The few lines that matter most while scoping, for the estimator's result panel. */
  estimatorItems: string[];
}

export const EXCLUSIONS: Record<EstimatorService, ExclusionList> = {
  bim: {
    items: [
      "Structural, MEP, civil and geotechnical engineering design and calculations.",
      "Professional seals or stamps: drawings are prepared for your architect of record or engineer to review and stamp.",
      "Filing and expediting the permit application with the authority.",
      "Site surveys, measured surveys and field verification — as-built work is drawn from the records you supply.",
      "Energy-compliance reports (such as Title 24 calculations), unless quoted.",
      "Fabrication-level (LOD 400) shop drawings, unless quoted.",
      "Construction administration beyond the stated redline turnaround.",
    ],
    estimatorItems: [
      "Engineering design and calculations (structural, MEP, civil)",
      "Stamps or seals — prepared for your architect of record or engineer",
      "Permit filing and expediting",
      "Site surveys and field verification",
    ],
  },
  visualization: {
    items: [
      "Design work: renders show the design you supply (unless the Concept stage is chosen).",
      "Modelling beyond the agreed brief.",
      "More than 2 revision rounds (extra rounds are charged per round).",
      "Animation, 360° or VR, unless selected.",
      "Premium stock (branded furniture, licensed people or cars) beyond standard libraries.",
      "Print production.",
    ],
    estimatorItems: [
      "Design work beyond the supplied design",
      "More than 2 revision rounds",
      "Premium or licensed stock assets",
      "Print production",
    ],
  },
  consultancy: {
    items: [
      "Design responsibility or liability for your project.",
      "Signed or stamped deliverables.",
      "Site visits.",
      "Production drafting (billed under BIM / CAD).",
    ],
    estimatorItems: [
      "Design responsibility or liability",
      "Signed or stamped deliverables",
      "Site visits",
      "Production drafting (see BIM / CAD)",
    ],
  },
};
