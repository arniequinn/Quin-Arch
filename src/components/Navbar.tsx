import React from "react";
import { Compass, MessageSquare, UserCheck, Layers, Sparkles, Lock, Linkedin } from "lucide-react";
import { SpecialistProfile } from "../types";

interface NavbarProps {
  specialist: SpecialistProfile;
  isOwner: boolean;
  onOpenSpecialistEditor: () => void;
  onScrollToEstimator: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  specialist,
  isOwner,
  onOpenSpecialistEditor,
  onScrollToEstimator,
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-800/80 bg-neutral-950/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand / Logo — click to return to the top of the page */}
        <button
          type="button"
          onClick={scrollToTop}
          className="flex items-center space-x-3 shrink-0 min-w-0 bg-transparent border-0 p-0 m-0 cursor-pointer text-left"
          title="Go to homepage"
          aria-label="Go to homepage"
        >
          {specialist.logoUrl ? (
            <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-700/80 p-1 flex items-center justify-center shrink-0 shadow-md">
              <img
                src={specialist.logoUrl}
                alt="Quintessential Architecture"
                className="w-full h-full object-contain filter brightness-110"
              />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-neutral-950 shadow-md shadow-amber-500/20 shrink-0">
              <Compass className="w-5 h-5 stroke-[2.5]" />
            </div>
          )}
          <div className="min-w-0">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-base sm:text-lg text-neutral-100 tracking-tight whitespace-nowrap">
                {specialist.brandName || specialist.name}
              </span>
              <span className="hidden xl:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30 whitespace-nowrap">
                Remote Architecture & BIM
              </span>
            </div>
            <p className="text-xs text-neutral-400 hidden md:block whitespace-nowrap overflow-hidden text-ellipsis">
              Arslan Qaiser • CAD Drafting • Revit BIM • Permit Sets • 3D V-Ray
            </p>
          </div>
        </button>

        {/* Navigation Links */}
        <nav className="hidden xl:flex items-center space-x-5 text-xs font-medium text-neutral-300 shrink-0">
          <a
            href="#estimator"
            onClick={(e) => {
              e.preventDefault();
              onScrollToEstimator();
            }}
            className="hover:text-amber-400 transition-colors flex items-center space-x-1"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Scope Estimator</span>
          </a>
          <a href="#deliverables" className="hover:text-amber-400 transition-colors">
            Drawing Sets & PDFs
          </a>
          <a href="#workflows" className="hover:text-amber-400 transition-colors">
            Delivery Process
          </a>
          <a href="#specialist" className="hover:text-amber-400 transition-colors">
            Specialist Profile
          </a>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center space-x-2 sm:space-x-2.5">
          {/* Direct WhatsApp Quick Connect */}
          {specialist.whatsapp && (
            <a
              href={`https://wa.me/${specialist.whatsapp.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                "Hi Arslan, I found your architectural portfolio and would like to discuss a project."
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden 2xl:flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-950/70 hover:bg-emerald-900/80 border border-emerald-500/30 text-emerald-400 text-xs font-mono transition-all hover:border-emerald-500/60"
              title="Direct WhatsApp: +92 322 4316477"
            >
              <MessageSquare className="w-3.5 h-3.5 fill-emerald-500/20" />
              <span>WhatsApp</span>
            </a>
          )}

          {/* Direct LinkedIn Profile Link */}
          {(specialist.socials?.linkedin || "https://www.linkedin.com/in/arslan-qaiser-947976188/") && (
            <a
              href={specialist.socials?.linkedin || "https://www.linkedin.com/in/arslan-qaiser-947976188/"}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-sky-950/40 hover:bg-sky-900/50 text-sky-300 text-xs font-medium border border-sky-600/30 transition-all hover:border-sky-500/60"
              title="Connect with Arslan Qaiser on LinkedIn (Principal Architect & BIM Specialist)"
            >
              <Linkedin className="w-3.5 h-3.5 text-sky-400" />
              <span className="hidden xl:inline">LinkedIn</span>
            </a>
          )}

          {/* Specialist Data Edit Pill */}
          <button
            id="edit-profile-button"
            onClick={onOpenSpecialistEditor}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border flex items-center space-x-1.5 transition-all cursor-pointer ${
              isOwner
                ? "bg-emerald-950/50 hover:bg-emerald-900/50 text-emerald-300 border-emerald-500/40 shadow-sm"
                : "bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200 border-neutral-800"
            }`}
            title={
              isOwner
                ? "Edit your contact details, rates, and bio (Verified Owner: Arslan Qaiser)"
                : "Specialist Profile (Protected: Owner Passkey Required to Modify)"
            }
          >
            {isOwner ? (
              <>
                <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden md:inline">Edit Profile (Owner)</span>
              </>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5 text-neutral-400" />
                <span className="hidden md:inline">Specialist Profile</span>
              </>
            )}
          </button>

          {/* Primary Lead Magnet Button */}
          <button
            id="calculate-scope-nav-btn"
            onClick={onScrollToEstimator}
            className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs sm:text-sm font-semibold shadow-sm transition-all flex items-center space-x-1.5 cursor-pointer"
          >
            <Layers className="w-4 h-4" />
            <span>Calculate Scope</span>
          </button>
        </div>
      </div>
    </header>
  );
};
