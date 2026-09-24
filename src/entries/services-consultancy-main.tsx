import { PageShell } from "../components/PageShell";
import { ConsultancyServicePage } from "../pages/ConsultancyServicePage";
import { mountPage } from "./mountPage";

export const render = mountPage((specialist) => (
  <PageShell specialist={specialist}>
    <ConsultancyServicePage specialist={specialist} />
  </PageShell>
));
