import { PageShell } from "../components/PageShell";
import { ForHomeownersPage } from "../pages/ForHomeownersPage";
import { mountPage } from "./mountPage";

export const render = mountPage((specialist) => (
  <PageShell specialist={specialist}>
    <ForHomeownersPage />
  </PageShell>
));
