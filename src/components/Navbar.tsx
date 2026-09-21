import React from "react";
import { Compass, MessageSquare, Linkedin } from "lucide-react";
import { SpecialistProfile } from "../types";

interface NavbarProps {
  specialist: SpecialistProfile;
  onScrollToEstimator: () => void;
  /** False when rendered on a page other than the homepage — internal nav links then
   * point back to the homepage's anchors instead of same-page hashes. */
  isHomePage?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  specialist,
  onScrollToEstimator,
  isHomePage = true,
}) => {
  const homeAnchor = (hash: string) =>
    isHomePage ? hash : `${import.meta.env.BASE_URL}${hash}`;

  const scrollToTop = () => {
    if (isHomePage) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.location.href = import.meta.env.BASE_URL;
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-800/60 bg-neutral-950/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">

        {/* Brand */}
        <button
          type="button"
          onClick={scrollToTop}
          className="flex items-center space-x-3 min-w-0 bg-transparent border-0 p-0 m-0 cursor-pointer text-left"
          aria-label="Go to homepage"
        >
          {specialist.logoUrl ? (
            <div className="w-9 h-9 rounded-lg bg-neutral-900 border border-neutral-800 p-1 flex items-center justify-center shrink-0">
              <img
                src={specialist.logoUrl}
                alt={specialist.brandName || specialist.name}
                className="w-full h-full object-contain"
              />
            </div>
          ) : (
            <div className="w-9 h-9 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-amber-400 shrink-0">
              <Compass className="w-4 h-4 stroke-[1.5]" />
            </div>
          )}
          <div className="min-w-0">
            <span className="font-display font-semibold text-sm text-neutral-100 tracking-tight whitespace-nowrap">
              {specialist.brandName || specialist.name}
            </span>
          </div>
        </button>

        {/* Navigation */}
        <nav className="hidden xl:flex items-center space-x-7 text-xs font-medium text-neutral-400 shrink-0">
          <a href={`${import.meta.env.BASE_URL}services/`} className="hover:text-neutral-100 transition-colors tracking-wide">
            Services
          </a>
          <a href={`${import.meta.env.BASE_URL}case-studies/`} className="hover:text-neutral-100 transition-colors tracking-wide">
            Case Studies
          </a>
          <a
            href={homeAnchor("#estimator")}
            onClick={isHomePage ? (e) => { e.preventDefault(); onScrollToEstimator(); } : undefined}
            className="hover:text-neutral-100 transition-colors tracking-wide"
          >
            Scope Planner
          </a>
          <a href={homeAnchor("#deliverables")} className="hover:text-neutral-100 transition-colors tracking-wide">
            Construction Documentation
          </a>
          <a href={homeAnchor("#workflows")} className="hover:text-neutral-100 transition-colors tracking-wide">
            Delivery Process
          </a>
          <a href={homeAnchor("#specialist")} className="hover:text-neutral-100 transition-colors tracking-wide">
            Principal Architect
          </a>
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
          {specialist.whatsapp && (
            <a
              href={`https://wa.me/${specialist.whatsapp.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                "Hi Arslan, I found your architectural portfolio and would like to discuss a project."
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden 2xl:flex items-center space-x-1.5 px-3 py-1.5 rounded-md border border-neutral-700 text-neutral-400 text-xs hover:text-neutral-100 hover:border-neutral-500 transition-all"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>
          )}

          {(specialist.socials?.linkedin || "https://www.linkedin.com/in/arslan-qaiser-947976188/") && (
            <a
              href={specialist.socials?.linkedin || "https://www.linkedin.com/in/arslan-qaiser-947976188/"}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-md border border-neutral-700 text-neutral-400 text-xs hover:text-neutral-100 hover:border-neutral-500 transition-all"
            >
              <Linkedin className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">LinkedIn</span>
            </a>
          )}

          {/* Minimal Scope Planner CTA */}
          <button
            id="scope-planner-nav-btn"
            onClick={onScrollToEstimator}
            className="px-4 py-1.5 rounded-md border border-amber-500/40 text-amber-400 text-xs font-medium hover:bg-amber-500/10 hover:border-amber-500/70 transition-all cursor-pointer tracking-wide"
          >
            Scope Planner
          </button>
        </div>
      </div>
    </header>
  );
};
