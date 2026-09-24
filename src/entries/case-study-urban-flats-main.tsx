import { PageShell } from "../components/PageShell";
import { CaseStudyPage } from "../pages/CaseStudyPage";
import { PORTFOLIO_SAMPLES } from "../data/architecturalData";
import { mountPage } from "./mountPage";

const sample = PORTFOLIO_SAMPLES.find((s) => s.id === "sample-urban-flats")!;

export const render = mountPage((specialist) => (
  <PageShell specialist={specialist}>
    <CaseStudyPage sample={sample} specialist={specialist} breadcrumbLabel="Urban Multi-Family Flats" />
  </PageShell>
));
