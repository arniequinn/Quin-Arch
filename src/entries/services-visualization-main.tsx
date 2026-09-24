import { PageShell } from "../components/PageShell";
import { VisualizationServicePage } from "../pages/VisualizationServicePage";
import { mountPage } from "./mountPage";

export const render = mountPage((specialist) => (
  <PageShell specialist={specialist}>
    <VisualizationServicePage specialist={specialist} />
  </PageShell>
));
