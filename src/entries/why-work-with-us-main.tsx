import { PageShell } from "../components/PageShell";
import { WhyWorkWithUsPage } from "../pages/WhyWorkWithUsPage";
import { mountPage } from "./mountPage";

export const render = mountPage((specialist) => (
  <PageShell specialist={specialist}>
    <WhyWorkWithUsPage specialist={specialist} />
  </PageShell>
));
