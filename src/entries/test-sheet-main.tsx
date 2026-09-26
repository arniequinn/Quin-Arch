import { PageShell } from "../components/PageShell";
import { TestSheetPage } from "../pages/TestSheetPage";
import { mountPage } from "./mountPage";

export const render = mountPage((specialist) => (
  <PageShell specialist={specialist}>
    <TestSheetPage specialist={specialist} />
  </PageShell>
));
