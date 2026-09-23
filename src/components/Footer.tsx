import React from "react";
import { Compass } from "lucide-react";
import { SpecialistProfile } from "../types";

interface FooterProps {
  specialist: SpecialistProfile;
  /** False when rendered on a page other than the homepage — internal nav links then
   * point back to the homepage's anchors instead of same-page hashes. */
  isHomePage?: boolean;
}

export const Footer: React.FC<FooterProps> = ({ specialist, isHomePage = true }) => {
  const homeAnchor = (hash: string) =>
    isHomePage ? hash : `${import.meta.env.BASE_URL}${hash}`;

  return (
    <footer className="border-t border-neutral-900 bg-neutral-950 py-12 text-xs text-neutral-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-3">
            {specialist.logoUrl ? (
              <img
                src={specialist.logoUrl}
                alt={specialist.brandName || specialist.name}
                className="w-9 h-9 object-contain rounded-lg bg-neutral-900 p-1 border border-neutral-800"
              />
            ) : (
              <Compass className="w-5 h-5 text-amber-500" />
            )}
            <div>
              <span className="font-bold text-neutral-200 text-sm block">
                {specialist.brandName || specialist.name}
              </span>
              <span className="text-neutral-400 text-xs">
                {specialist.name} • {specialist.title}
              </span>
            </div>
          </div>

          {/* Social and freelance links in footer */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-neutral-400">
            <a
              href={`${import.meta.env.BASE_URL}design-philosophy/`}
              className="hover:text-amber-400 transition-colors"
            >
              Design Philosophy
            </a>
            <a
              href={specialist.socials?.linkedin || "https://www.linkedin.com/in/arslan-qaiser-947976188/"}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-sky-400 text-sky-400/90 font-semibold transition-colors flex items-center space-x-1"
            >
              <span>LinkedIn</span>
            </a>
            {specialist.socials?.instagram && (
              <a
                href={specialist.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-amber-400 transition-colors"
              >
                Instagram ({specialist.socials.instagramHandle || "@quin_arch"})
              </a>
            )}
            {specialist.socials?.youtube && (
              <a
                href={specialist.socials.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-red-400 transition-colors"
              >
                YouTube
              </a>
            )}
            {specialist.socials?.upwork && (
              <a
                href={specialist.socials.upwork}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-emerald-400 transition-colors"
              >
                Upwork
              </a>
            )}
            {specialist.socials?.fiverr && (
              <a
                href={specialist.socials.fiverr}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-emerald-400 transition-colors"
              >
                Fiverr
              </a>
            )}
            {specialist.socials?.freelancer && (
              <a
                href={specialist.socials.freelancer}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-400 transition-colors"
              >
                Freelancer
              </a>
            )}
            {specialist.socials?.cadcrowd && (
              <a
                href={specialist.socials.cadcrowd}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-sky-400 transition-colors"
              >
                Cad Crowd
              </a>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-neutral-900">
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-neutral-400">
            <a href={`${import.meta.env.BASE_URL}services/`} className="hover:text-amber-400 transition-colors">Services</a>
            <a href={`${import.meta.env.BASE_URL}case-studies/`} className="hover:text-amber-400 transition-colors">Case Studies</a>
            <a href={homeAnchor("#estimator")} className="hover:text-amber-400 transition-colors">Scope Estimator</a>
            <a href={`${import.meta.env.BASE_URL}services/`} className="hover:text-amber-400 transition-colors">Services &amp; Pricing</a>
            <a href={`${import.meta.env.BASE_URL}projects/#deliverables`} className="hover:text-amber-400 transition-colors">Construction Documentation</a>
            <a href={`${import.meta.env.BASE_URL}why-work-with-us/`} className="hover:text-amber-400 transition-colors">Why Work With Us</a>
            <a href={`${import.meta.env.BASE_URL}design-philosophy/`} className="hover:text-amber-400 transition-colors">Principal Architect</a>
          </div>

          <div>
            © {new Date().getFullYear()} {specialist.brandName || "Quintessential Architecture"}. All drawings & BIM deliverables code-compliant.
          </div>
        </div>
      </div>
    </footer>
  );
};
