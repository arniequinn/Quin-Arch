// Every internal destination in one place, so a page can't link to a stale anchor (the old
// homepage `#estimator` links broke once the estimator moved to its own page).
const base = import.meta.env.BASE_URL;

export const ROUTES = {
  home: base,
  services: `${base}services/`,
  bimCad: `${base}services/bim-cad-drafting/`,
  visualization: `${base}services/visualization/`,
  consultancy: `${base}services/consultancy/`,
  projects: `${base}projects/`,
  caseStudies: `${base}case-studies/`,
  whyWorkWithUs: `${base}why-work-with-us/`,
  designPhilosophy: `${base}design-philosophy/`,
  lodGuide: `${base}guides/lod-guide/`,
  scopeEstimator: `${base}scope-estimator/`,
  testSheet: `${base}test-sheet/`,
  forHomeowners: `${base}for-homeowners/`,
} as const;

/** The site's primary action (v3.3 Phase 2a): a 20-minute capacity call on Cal.com, opened in a
 *  new tab so no booking script loads on our pages. */
export const BOOKING_URL = "https://cal.com/arniequinn/capacity-call";

/** The three tabs of /scope-estimator/, chosen by its `?service=` query parameter. */
export type EstimatorService = "bim" | "visualization" | "consultancy";
export const ESTIMATOR_SERVICES: EstimatorService[] = ["bim", "visualization", "consultancy"];

/** "Price a single project" lands on the estimator; a service page can open its own tab. */
export function estimatorHref(service?: EstimatorService): string {
  return service ? `${ROUTES.scopeEstimator}?service=${service}` : ROUTES.scopeEstimator;
}

export const CASE_STUDY_SLUGS: Record<string, string> = {
  "sample-beach-house": "texas-coastal-beach-house",
  "sample-slamburger": "slamburger-restaurant",
  "sample-cran-residence": "cran-residence",
  "sample-urban-flats": "urban-multi-family-flats",
};

export const caseStudyHref = (sampleId: string) => `${ROUTES.caseStudies}${CASE_STUDY_SLUGS[sampleId]}/`;

/** A gallery project's own page (v3.0 §7), e.g. /projects/kids-room/. */
export const projectHref = (slug: string) => `${ROUTES.projects}${slug}/`;
