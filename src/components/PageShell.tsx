import React from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { SpecialistProfile } from "../types";

interface PageShellProps {
  specialist: SpecialistProfile;
  children: React.ReactNode;
}

// Navbar + page + Footer, the same on every page including the homepage.
export const PageShell: React.FC<PageShellProps> = ({ specialist, children }) => (
  <div className="flex min-h-screen flex-col justify-between bg-neutral-950 font-sans text-neutral-100 selection:bg-amber-500 selection:text-neutral-950">
    <Navbar specialist={specialist} />
    {children}
    <Footer specialist={specialist} />
  </div>
);
