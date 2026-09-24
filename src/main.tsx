import App from "./App.tsx";
import { mountPage } from "./entries/mountPage";

export const render = mountPage((specialist) => <App initialSpecialist={specialist} />);
