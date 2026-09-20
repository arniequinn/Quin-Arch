import React from "react";
import { 
  Award, 
  CheckCircle2, 
  Compass, 
  Mail, 
  MapPin, 
  MessageSquare, 
  Phone, 
  Sparkles, 
  Briefcase, 
  UserCheck,
  ExternalLink,
  FolderDown,
  GraduationCap,
  Globe,
  Instagram,
  FileText,
  Lock,
  Linkedin
} from "lucide-react";
import { SpecialistProfile } from "../types";
import { assetUrl } from "../utils/assetPath";

interface SpecialistProfileCardProps {
  specialist: SpecialistProfile;
  onOpenEditor: () => void;
  onScrollToEstimator: () => void;
  isOwner?: boolean;
}

export const SpecialistProfileCard: React.FC<SpecialistProfileCardProps> = ({
  specialist,
  onOpenEditor,
  onScrollToEstimator,
  isOwner = false,
}) => {
  const whatsappUrl = `https://wa.me/${specialist.whatsapp.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
    `Hi ${specialist.name}, I found your architectural portfolio via ArchScope and would like to discuss a project.`
  )}`;

  const socials = specialist.socials;

  return (
    <section id="specialist" className="py-16 bg-neutral-950 border-t border-neutral-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="rounded-3xl bg-neutral-900/90 border border-neutral-800 p-6 sm:p-10 lg:p-12 shadow-2xl overflow-hidden relative">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top Brand Identity Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-neutral-800/80">
            <div className="flex items-center space-x-4">
              {specialist.logoUrl && (
                <div className="w-14 h-14 rounded-2xl bg-neutral-950 border border-neutral-700/80 p-2 flex items-center justify-center shrink-0 shadow-inner">
                  <img
                    src={specialist.logoUrl}
                    alt="Quintessential Architecture Logo"
                    className="w-full h-full object-contain filter brightness-110"
                  />
                </div>
              )}
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-extrabold text-neutral-100 tracking-tight">
                    {specialist.brandName || "Quintessential Architecture"}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                    Available for Remote Contracts
                  </span>
                </div>
                <p className="text-xs text-amber-400/90 font-medium">
                  {specialist.tagline}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <a
                href={socials?.linkedin || "https://www.linkedin.com/in/arslan-qaiser-947976188/"}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/30 transition-all flex items-center space-x-1.5"
                title="Connect with Arslan Qaiser on LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
                <span>LinkedIn</span>
                <ExternalLink className="w-3 h-3 ml-0.5 opacity-70" />
              </a>

              <button
                onClick={onOpenEditor}
                className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all flex items-center space-x-1.5 cursor-pointer ${
                  isOwner
                    ? "bg-emerald-950/40 hover:bg-emerald-900/40 text-emerald-300 border-emerald-500/40 shadow-sm"
                    : "bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border-neutral-700"
                }`}
                title={
                  isOwner
                    ? "Edit your contact details, rates, and bio (Verified Owner)"
                    : "Specialist Profile & Public Identity (Protected: Owner Login Required to Edit)"
                }
              >
                {isOwner ? (
                  <>
                    <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Edit Profile (Owner)</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5 text-amber-400/80" />
                    <span>Profile Credentials</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative">
            
            {/* Left: Specialist Profile Details (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="flex items-start gap-4">
                {specialist.avatarUrl && (
                  <div className="relative shrink-0">
                    <img
                      src={specialist.avatarUrl}
                      alt={specialist.name}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-amber-500/40 shadow-lg bg-neutral-950"
                    />
                    <div className="absolute -bottom-1.5 -right-1.5 w-5 h-5 rounded-full bg-emerald-500 border-2 border-neutral-900 flex items-center justify-center" title="Online & Accepting Projects">
                      <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    </div>
                  </div>
                )}

                <div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-100 tracking-tight">
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

              <p className="text-sm text-neutral-300 leading-relaxed">
                {specialist.bio}
              </p>

              {/* Stats Highlights */}
              <div className="grid grid-cols-3 gap-3 sm:gap-4 pt-1">
                <div className="p-3.5 rounded-xl bg-neutral-950/70 border border-neutral-800">
                  <span className="text-2xl font-extrabold font-mono text-neutral-100 block">
                    {specialist.yearsExperience}+
                  </span>
                  <span className="text-[11px] text-neutral-400">Years Remote Exp.</span>
                </div>

                <div className="p-3.5 rounded-xl bg-neutral-950/70 border border-neutral-800">
                  <span className="text-2xl font-extrabold font-mono text-amber-400 block">
                    {specialist.completedProjectsCount}+
                  </span>
                  <span className="text-[11px] text-neutral-400">Projects Delivered</span>
                </div>

                <div className="p-3.5 rounded-xl bg-neutral-950/70 border border-neutral-800">
                  <span className="text-2xl font-extrabold font-mono text-emerald-400 block">
                    100%
                  </span>
                  <span className="text-[11px] text-neutral-400">On-Time & Verified</span>
                </div>
              </div>

              {/* Verified Freelance Profiles & Social Links */}
              <div className="pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 font-mono mb-2.5 flex items-center space-x-1.5">
                  <Globe className="w-3.5 h-3.5 text-amber-400" />
                  <span>Verified Freelance Portals & Social Profiles</span>
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {/* LinkedIn */}
                  <a
                    href={socials?.linkedin || "https://www.linkedin.com/in/arslan-qaiser-947976188/"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-sky-950/40 hover:bg-sky-900/50 border border-sky-600/40 hover:border-sky-400 transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center space-x-2">
                      <Linkedin className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                      <div>
                        <div className="text-xs font-bold text-sky-200 group-hover:text-sky-300 transition-colors">
                          LinkedIn
                        </div>
                        <div className="text-[10px] text-sky-400/80">
                          Professional Profile
                        </div>
                      </div>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-sky-400/70 group-hover:text-sky-300 transition-colors" />
                  </a>

                  {/* Upwork */}
                  <a
                    href={socials?.upwork}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-neutral-950/80 hover:bg-neutral-800 border border-neutral-800 hover:border-emerald-500/50 transition-all flex items-center justify-between group"
                  >
                    <div>
                      <div className="text-xs font-bold text-neutral-200 group-hover:text-emerald-400 transition-colors">
                        Upwork
                      </div>
                      <div className="text-[10px] text-neutral-500">
                        Top Rated Specialist
                      </div>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-neutral-600 group-hover:text-emerald-400 transition-colors" />
                  </a>

                  {/* Fiverr */}
                  <a
                    href={socials?.fiverr}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-neutral-950/80 hover:bg-neutral-800 border border-neutral-800 hover:border-emerald-500/50 transition-all flex items-center justify-between group"
                  >
                    <div>
                      <div className="text-xs font-bold text-neutral-200 group-hover:text-emerald-400 transition-colors">
                        Fiverr
                      </div>
                      <div className="text-[10px] text-neutral-500">
                        Direct Gig Orders
                      </div>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-neutral-600 group-hover:text-emerald-400 transition-colors" />
                  </a>

                  {/* Freelancer */}
                  <a
                    href={socials?.freelancer}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-neutral-950/80 hover:bg-neutral-800 border border-neutral-800 hover:border-sky-500/50 transition-all flex items-center justify-between group"
                  >
                    <div>
                      <div className="text-xs font-bold text-neutral-200 group-hover:text-sky-400 transition-colors">
                        Freelancer.com
                      </div>
                      <div className="text-[10px] text-neutral-500">
                        5.0 ★ Client Rating
                      </div>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-neutral-600 group-hover:text-sky-400 transition-colors" />
                  </a>

                  {/* Cad Crowd */}
                  <a
                    href={socials?.cadcrowd}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-neutral-950/80 hover:bg-neutral-800 border border-neutral-800 hover:border-amber-500/50 transition-all flex items-center justify-between group"
                  >
                    <div>
                      <div className="text-xs font-bold text-neutral-200 group-hover:text-amber-400 transition-colors">
                        Cad Crowd
                      </div>
                      <div className="text-[10px] text-neutral-500">
                        CAD/BIM Specialist
                      </div>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-neutral-600 group-hover:text-amber-400 transition-colors" />
                  </a>

                  {/* Instagram */}
                  <a
                    href={socials?.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-neutral-950/80 hover:bg-neutral-800 border border-neutral-800 hover:border-pink-500/50 transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center space-x-2">
                      <Instagram className="w-3.5 h-3.5 text-pink-400 shrink-0" />
                      <div>
                        <div className="text-xs font-bold text-neutral-200 group-hover:text-pink-400 transition-colors">
                          Instagram
                        </div>
                        <div className="text-[10px] text-neutral-500">
                          {socials?.instagramHandle || "@quin_arch"}
                        </div>
                      </div>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-neutral-600 group-hover:text-pink-400 transition-colors" />
                  </a>

                  {/* Master Architecture Portfolio PDF */}
                  <a
                    href={assetUrl("/portfolio/docs/Architecture Portfolio - Arslan Qaiser_compressed.pdf")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition-all flex items-center justify-between group"
                  >
                    <div>
                      <div className="text-xs font-bold text-amber-300">
                        Portfolio PDF
                      </div>
                      <div className="text-[10px] text-neutral-400">
                        Comprehensive Work Set
                      </div>
                    </div>
                    <FileText className="w-3.5 h-3.5 text-amber-400" />
                  </a>
                </div>
              </div>

              {/* Direct Connect Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm flex items-center space-x-2 shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
                  title="Direct WhatsApp with Arslan Qaiser"
                >
                  <MessageSquare className="w-4 h-4 fill-white/20" />
                  <span>WhatsApp: {specialist.phone || "+92 322 4316477"}</span>
                </a>

                <a
                  href={`mailto:${specialist.email}`}
                  className="px-5 py-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-100 font-semibold text-xs sm:text-sm border border-neutral-700 flex items-center space-x-2 transition-all cursor-pointer shadow-sm"
                >
                  <Mail className="w-4 h-4 text-amber-400" />
                  <span>{specialist.email}</span>
                </a>

                <a
                  href={socials?.linkedin || "https://www.linkedin.com/in/arslan-qaiser-947976188/"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 rounded-xl bg-sky-700 hover:bg-sky-600 text-white font-semibold text-xs sm:text-sm flex items-center space-x-2 shadow-md shadow-sky-700/20 transition-all cursor-pointer"
                  title="Connect with Arslan Qaiser on LinkedIn"
                >
                  <Linkedin className="w-4 h-4 fill-white" />
                  <span>LinkedIn Profile</span>
                </a>

                <button
                  onClick={onScrollToEstimator}
                  className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs sm:text-sm shadow-md shadow-amber-500/20 transition-all cursor-pointer"
                >
                  <span>Launch Scope Estimator</span>
                </button>
              </div>

            </div>

            {/* Right: Technical Capabilities & Software Arsenal (5 cols) */}
            <div className="lg:col-span-5 p-6 rounded-2xl bg-neutral-950/90 border border-neutral-800 space-y-6">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 font-mono flex items-center space-x-2">
                  <Compass className="w-4 h-4" />
                  <span>Technical Software & BIM Stack</span>
                </h3>
                <div className="grid grid-cols-2 gap-2 mt-3">
                  {specialist.softwareProficiencies.map((sw) => (
                    <div
                      key={sw}
                      className="p-2.5 rounded-lg bg-neutral-900 border border-neutral-800/80 flex items-center space-x-2 text-xs text-neutral-200"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span className="font-mono text-[11px] truncate">{sw}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-800">
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-300 font-mono mb-2">
                  Specialized Digital Workflows
                </h3>
                <ul className="space-y-1.5 text-xs text-neutral-400">
                  <li className="flex items-start space-x-2">
                    <span className="text-amber-400 font-bold">•</span>
                    <span>Submission in client-native titleblocks, layers & pen weights</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-amber-400 font-bold">•</span>
                    <span>Cloud BIM worksharing (BIM 360 / ACC)</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-amber-400 font-bold">•</span>
                    <span>Parametric optimization (Grasshopper & Python scripts)</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-amber-400 font-bold">•</span>
                    <span>Environmental solar radiation and wind rose microclimate analysis</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-amber-400 font-bold">•</span>
                    <span>Zero billable risk: transparent scopes & agreed milestones</span>
                  </li>
                </ul>
              </div>

              {/* Direct Document Downloads */}
              <div className="pt-4 border-t border-neutral-800 space-y-2">
                <span className="text-[11px] font-mono text-neutral-500 uppercase tracking-wider block">
                  Official Credentials & Resumes
                </span>
                <div className="flex flex-wrap gap-2">
                  <a
                    href={assetUrl("/portfolio/docs/AQ CV Minimal.pdf")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-xs text-neutral-300 flex items-center space-x-1.5 transition-all"
                  >
                    <FileText className="w-3.5 h-3.5 text-amber-400" />
                    <span>Download CV (Minimal)</span>
                  </a>
                  <a
                    href={assetUrl("/portfolio/docs/Architecture Portfolio - Arslan Qaiser_compressed.pdf")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-xs text-neutral-300 flex items-center space-x-1.5 transition-all"
                  >
                    <FolderDown className="w-3.5 h-3.5 text-amber-400" />
                    <span>Master Portfolio (PDF)</span>
                  </a>
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
