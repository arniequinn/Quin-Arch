import { PageShell } from "../components/PageShell";
import { ProjectsPage } from "../pages/ProjectsPage";
import { mountPage } from "./mountPage";

export const render = mountPage((specialist) => (
  <PageShell specialist={specialist}>
    <ProjectsPage specialist={specialist} />
  </PageShell>
));
