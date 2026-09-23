import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { ProjectsPage } from "../pages/ProjectsPage";
import { loadSpecialistProfile } from "../services/specialistProfile";
import "../index.css";

const specialist = loadSpecialistProfile();
const base = import.meta.env.BASE_URL;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans selection:bg-amber-500 selection:text-neutral-950 flex flex-col justify-between">
      <Navbar
        specialist={specialist}
        isHomePage={false}
        onScrollToEstimator={() => { window.location.href = `${base}#estimator`; }}
      />
      <ProjectsPage specialist={specialist} />
      <Footer specialist={specialist} isHomePage={false} />
    </div>
  </StrictMode>,
);
