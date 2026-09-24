import { PageShell } from "../components/PageShell";
import { DesignPhilosophyPage } from "../pages/DesignPhilosophyPage";
import { mountPage } from "./mountPage";

export const render = mountPage((specialist) => (
  <PageShell specialist={specialist}>
    <DesignPhilosophyPage specialist={specialist} />
  </PageShell>
));
