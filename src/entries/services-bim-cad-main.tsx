import { PageShell } from "../components/PageShell";
import { BimCadServicePage } from "../pages/BimCadServicePage";
import { mountPage } from "./mountPage";

export const render = mountPage((specialist) => (
  <PageShell specialist={specialist}>
    <BimCadServicePage specialist={specialist} />
  </PageShell>
));
