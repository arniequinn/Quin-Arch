import { PageShell } from "../components/PageShell";
import { ScopeEstimatorPage } from "../pages/ScopeEstimatorPage";
import { mountPage } from "./mountPage";

export const render = mountPage((specialist) => (
  <PageShell specialist={specialist}>
    <ScopeEstimatorPage specialist={specialist} />
  </PageShell>
));
