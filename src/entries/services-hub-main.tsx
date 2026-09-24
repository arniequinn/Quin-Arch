import { PageShell } from "../components/PageShell";
import { ServicesHubPage } from "../pages/ServicesHubPage";
import { mountPage } from "./mountPage";

export const render = mountPage((specialist) => (
  <PageShell specialist={specialist}>
    <ServicesHubPage specialist={specialist} />
  </PageShell>
));
