import { PageShell } from "../components/PageShell";
import { NotFoundPage } from "../pages/NotFoundPage";
import { mountPage } from "./mountPage";

export const render = mountPage((specialist) => (
  <PageShell specialist={specialist}>
    <NotFoundPage />
  </PageShell>
));
