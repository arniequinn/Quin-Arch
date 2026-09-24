import { PageShell } from "../components/PageShell";
import { CaseStudiesHubPage } from "../pages/CaseStudiesHubPage";
import { mountPage } from "./mountPage";

export const render = mountPage((specialist) => (
  <PageShell specialist={specialist}>
    <CaseStudiesHubPage />
  </PageShell>
));
