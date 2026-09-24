import React from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { SpecialistProfile } from "../types";

interface PageShellProps {
  specialist: SpecialistProfile;
  children: React.ReactNode;
}

// Navbar + page + Footer for every standalone page. The homepage (App.tsx) renders its own, since
// its nav scrolls in place rather than linking back to the homepage.
export const PageShell: React.FC<PageShellProps> = ({ specialist, children }) => (
  <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans selection:bg-amber-500 selection:text-neutral-950 flex flex-col justify-between">
    <Navbar
      specialist={specialist}
      isHomePage={false}
      onScrollToEstimator={() => { window.location.href = `${import.meta.env.BASE_URL}#estimator`; }}
    />
    {children}
    <Footer specialist={specialist} isHomePage={false} />
  </div>
);
