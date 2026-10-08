import { PageShell } from "../components/PageShell";
import { ArchicadDraftingPage } from "../pages/ArchicadDraftingPage";
import { mountPage } from "./mountPage";

export const render = mountPage((specialist) => (
  <PageShell specialist={specialist}>
    <ArchicadDraftingPage />
  </PageShell>
));
