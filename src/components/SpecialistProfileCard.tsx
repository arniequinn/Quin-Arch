import React from "react";
import {
  Compass,
  Mail,
  MapPin,
  MessageSquare,
  GraduationCap,
  FileText,
} from "lucide-react";
import { SpecialistProfile } from "../types";
import { assetUrl } from "../utils/assetPath";

interface SpecialistProfileCardProps {
  specialist: SpecialistProfile;
  onScrollToEstimator: () => void;
}

export const SpecialistProfileCard: React.FC<SpecialistProfileCardProps> = ({
  specialist,
  onScrollToEstimator,
}) => {
  const whatsappUrl = `https://wa.me/${specialist.whatsapp.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
    `Hi ${specialist.name}, I found your architectural portfolio via ArchScope and would like to discuss a project.`
  )}`;

  return (
    <section id="specialist" className="py-16 sm:py-24 bg-neutral-950 border-t border-neutral-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">

          {/* Left: Principal identity — sits directly on the page background, no card */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-start gap-4">
              {specialist.avatarUrl && (
                <img
                  src={specialist.avatarUrl}
                  alt={specialist.name}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover shadow-lg bg-neutral-900 shrink-0"
                />
              )}

              <div>
                <span className="text-[11px] font-mono text-neutral-500 tracking-widest uppercase">
                  Principal Architect
                </span>
                <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-neutral-100 tracking-tight mt-1">
                  {specialist.name}
                </h2>
                <p className="text-sm text-amber-400 font-medium mt-0.5">
                  {specialist.title}
                </p>

                {specialist.education && (
                  <div className="flex items-center space-x-1.5 text-xs text-neutral-300 mt-1.5 font-medium">
                    <GraduationCap className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>{specialist.education}</span>
                  </div>
                )}

                <div className="flex items-center space-x-1.5 text-xs text-neutral-400 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                  <span>{specialist.location}</span>
                </div>
              </div>
            </div>

            <p className="text-sm text-neutral-300 leading-relaxed max-w-xl">
              {specialist.bio}
            </p>

            {/* Stats — plain text, no bordered tiles */}
            <div className="flex items-center gap-8 pt-1">
              <div>
                <span className="text-2xl font-extrabold font-mono text-neutral-100 block">
                  {specialist.yearsExperience}+
                </span>
                <span className="text-[11px] text-neutral-500">Years Remote Exp.</span>
              </div>
              <div>
                <span className="text-2xl font-extrabold font-mono text-amber-400 block">
                  {specialist.completedProjectsCount}+
                </span>
                <span className="text-[11px] text-neutral-500">Projects Delivered</span>
              </div>
            </div>

            {/* Direct Connect Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm flex items-center space-x-2 transition-all cursor-pointer"
                title="Direct WhatsApp with Arslan Qaiser"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp</span>
              </a>

              <a
                href={`mailto:${specialist.email}`}
                className="px-5 py-3 rounded border border-neutral-700 text-neutral-300 font-semibold text-xs sm:text-sm flex items-center space-x-2 hover:text-neutral-100 hover:border-neutral-500 transition-all cursor-pointer"
              >
                <Mail className="w-4 h-4" />
                <span>Email</span>
              </a>

              <button
                onClick={onScrollToEstimator}
                className="px-5 py-3 rounded bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs sm:text-sm transition-all cursor-pointer"
              >
                <span>Launch Scope Estimator</span>
              </button>
            </div>
          </div>

          {/* Right: Technical capabilities — plain lists, no nested card */}
          <div className="lg:col-span-5 lg:pl-8 lg:border-l lg:border-neutral-900 space-y-6">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 font-mono flex items-center space-x-2">
                <Compass className="w-4 h-4" />
                <span>Technical Software & BIM Stack</span>
              </h3>
              <p className="mt-3 text-xs text-neutral-300 font-mono leading-relaxed">
                {specialist.softwareProficiencies.join(" · ")}
              </p>
            </div>

            <div className="pt-4 border-t border-neutral-900">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 font-mono mb-2">
                Specialized Digital Workflows
              </h3>
              <ul className="space-y-1.5 text-xs text-neutral-400">
                <li>Submission in client-native titleblocks, layers & pen weights</li>
                <li>Cloud BIM worksharing (BIM 360 / ACC)</li>
                <li>Parametric optimization (Grasshopper & Python scripts)</li>
                <li>Environmental solar radiation and wind rose microclimate analysis</li>
              </ul>
            </div>

            <div className="pt-4 border-t border-neutral-900">
              <a
                href={assetUrl("/portfolio/docs/AQ CV Minimal.pdf")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1.5 text-xs text-neutral-400 hover:text-neutral-100 transition-all"
              >
                <FileText className="w-3.5 h-3.5 text-amber-400" />
                <span>Download CV</span>
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
