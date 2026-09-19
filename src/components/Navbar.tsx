import React from "react";
import { Compass, FileSpreadsheet, MessageSquare, UserCheck, Layers, Sparkles, FolderDown, ExternalLink, Bot, ShieldCheck, Share2, TrendingUp, Palette, Film, LogIn, LogOut, Cloud, Target, Mail, Lock, Linkedin } from "lucide-react";
import { SpecialistProfile } from "../types";
import { recordAnalyticsEvent } from "../services/trafficAnalytics";
import { isOwnerUser } from "../services/ownerAuth";
import { User } from "firebase/auth";

interface NavbarProps {
  specialist: SpecialistProfile;
  leadsCount: number;
  totalVisits?: number;
  user: User | null;
  onSignIn: () => void;
  onSignOut: () => void;
  onOpenLeadFinder: () => void;
  onOpenGmailBot: () => void;
  onOpenLeadsManager: () => void;
  onOpenSpecialistEditor: () => void;
  onScrollToEstimator: () => void;
  onOpenAgentAuditLab: () => void;
  onOpenPublishTraffic: () => void;
  onOpenTrafficGrowth: () => void;
  onOpenArchCopilot: () => void;
  onOpenRenderingStudio: () => void;
  onOpenVideoStudio: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  specialist,
  leadsCount,
  totalVisits = 0,
  user,
  onSignIn,
  onSignOut,
  onOpenLeadFinder,
  onOpenGmailBot,
  onOpenLeadsManager,
  onOpenSpecialistEditor,
  onScrollToEstimator,
  onOpenAgentAuditLab,
  onOpenPublishTraffic,
  onOpenTrafficGrowth,
  onOpenArchCopilot,
  onOpenRenderingStudio,
  onOpenVideoStudio,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-800/80 bg-neutral-950/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <div className="flex items-center space-x-3">
          {specialist.logoUrl ? (
            <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-700/80 p-1 flex items-center justify-center shrink-0 shadow-md">
              <img
                src={specialist.logoUrl}
                alt="Quintessential Architecture"
                className="w-full h-full object-contain filter brightness-110"
              />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-neutral-950 shadow-md shadow-amber-500/20">
              <Compass className="w-5 h-5 stroke-[2.5]" />
            </div>
          )}
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-base sm:text-lg text-neutral-100 tracking-tight">
                {specialist.brandName || specialist.name}
              </span>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                Remote Architecture & BIM
              </span>
            </div>
            <p className="text-xs text-neutral-400 hidden md:block">
              Arslan Qaiser • CAD Drafting • Revit BIM • Permit Sets • 3D V-Ray
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden xl:flex items-center space-x-5 text-xs font-medium text-neutral-300">
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
          <button
            onClick={onOpenArchCopilot}
            className="hover:text-amber-300 transition-colors flex items-center space-x-1 cursor-pointer text-amber-400 font-semibold"
          >
            <Bot className="w-3.5 h-3.5" />
            <span>AI BIM Copilot</span>
          </button>
          <button
            onClick={onOpenRenderingStudio}
            className="hover:text-amber-300 transition-colors flex items-center space-x-1 cursor-pointer"
          >
            <Palette className="w-3.5 h-3.5 text-purple-400" />
            <span>3D Render Studio</span>
          </button>
          <button
            onClick={onOpenVideoStudio}
            className="hover:text-amber-300 transition-colors flex items-center space-x-1 cursor-pointer"
          >
            <Film className="w-3.5 h-3.5 text-orange-400" />
            <span>Veo Video Walkthrough</span>
          </button>
          <a href="#deliverables" className="hover:text-amber-400 transition-colors">
            Drawing Sets & PDFs
          </a>
          <a href="#specialist" className="hover:text-amber-400 transition-colors">
            Specialist Profile
          </a>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center space-x-2 sm:space-x-2.5">
          {/* AI Copilot Quick Launch Button */}
          <button
            id="nav-ai-copilot-button"
            onClick={onOpenArchCopilot}
            className="px-2.5 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-sm cursor-pointer"
            title="Open ArchBot BIM & Municipal Permitting Copilot (Gemini with Search/Maps Grounding)"
          >
            <Bot className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">ArchBot AI</span>
          </button>

          {/* 3D Render Studio Button */}
          <button
            id="nav-render-studio-button"
            onClick={onOpenRenderingStudio}
            className="hidden md:flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-semibold transition-all shadow-sm cursor-pointer"
            title="Open Architectural 3D Rendering Studio (gemini-3.1-flash-image)"
          >
            <Palette className="w-3.5 h-3.5 text-purple-400" />
            <span>3D Studio</span>
          </button>

          {/* Veo Video Walkthrough Button */}
          <button
            id="nav-veo-video-button"
            onClick={onOpenVideoStudio}
            className="hidden md:flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 text-orange-300 text-xs font-semibold transition-all shadow-sm cursor-pointer"
            title="Generate Veo 3D Architectural Video Walkthroughs"
          >
            <Film className="w-3.5 h-3.5 text-orange-400" />
            <span>Veo Video</span>
          </button>
          {/* Direct Dropbox Work Vault Link */}
          {specialist.socials?.dropboxFolder && (
            <a
              href={specialist.socials.dropboxFolder}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 text-xs font-medium border border-neutral-800 transition-all hover:border-blue-500/40"
              title="Browse complete PDF drawing folder on Dropbox"
            >
              <FolderDown className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden md:inline">Work Vault</span>
              <ExternalLink className="w-3 h-3 text-neutral-500" />
            </a>
          )}

          {/* Direct WhatsApp Quick Connect */}
          {specialist.whatsapp && (
            <a
              href={`https://wa.me/${specialist.whatsapp.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                "Hi Arslan, I found your architectural portfolio and would like to discuss a project."
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => recordAnalyticsEvent("whatsapp_click")}
              className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-950/70 hover:bg-emerald-900/80 border border-emerald-500/30 text-emerald-400 text-xs font-mono transition-all hover:border-emerald-500/60"
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
              onClick={() => recordAnalyticsEvent("linkedin_click")}
              className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-sky-950/40 hover:bg-sky-900/50 text-sky-300 text-xs font-medium border border-sky-600/30 transition-all hover:border-sky-500/60"
              title="Connect with Arslan Qaiser on LinkedIn (Principal Architect & BIM Specialist)"
            >
              <Linkedin className="w-3.5 h-3.5 text-sky-400" />
              <span className="hidden xl:inline">LinkedIn</span>
            </a>
          )}

          {/* Dual-Agent Audit Lab Pill */}
          <button
            id="agent-audit-lab-button"
            onClick={onOpenAgentAuditLab}
            className="px-2.5 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 hover:border-amber-500/60 text-amber-300 text-xs font-mono font-medium flex items-center space-x-1.5 transition-all shadow-sm"
            title="Inspect Worker & Critic agent audit report (Rating: 9.4/10)"
          >
            <Bot className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Critic Audit</span>
            <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">
              9.4★
            </span>
          </button>

          {/* Real Traffic & Performance Monitor Pill */}
          <button
            id="traffic-growth-monitor-button"
            onClick={onOpenTrafficGrowth}
            className="px-2.5 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 hover:border-emerald-500/60 text-emerald-300 text-xs font-mono font-medium flex items-center space-x-1.5 transition-all shadow-sm cursor-pointer"
            title="Real-time page views, referral sources, and Worker-Checker progressive benchmarks"
          >
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Traffic</span>
            <span className="px-1.5 py-0.2 rounded bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 font-bold text-[10px]">
              {totalVisits} views
            </span>
          </button>

          {/* Share & Traffic Hub Pill */}
          <button
            id="publish-traffic-button"
            onClick={onOpenPublishTraffic}
            className="px-2.5 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 text-xs font-mono font-medium flex items-center space-x-1.5 transition-all shadow-sm cursor-pointer"
            title="Publish & Traffic Playbook: Live links, Upwork proposal hooks, QR code, and social sharing"
          >
            <Share2 className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline">Share Link</span>
          </button>

          {/* Client Lead Acquisition Engine Button */}
          <button
            id="nav-lead-finder-button"
            onClick={onOpenLeadFinder}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500/20 to-amber-600/10 hover:from-amber-500/30 hover:to-amber-600/20 border border-amber-500/40 text-amber-300 text-xs font-bold transition-all shadow-sm shadow-amber-500/10 cursor-pointer"
            title="Client Lead Acquisition & Outreach Engine (Pitch Generator, Permit Portals & LinkedIn Search)"
          >
            <Target className="w-3.5 h-3.5 text-amber-400" />
            <span>Find Clients</span>
            <span className="px-1.5 py-0.2 rounded bg-amber-500 text-neutral-950 font-bold text-[9px] uppercase tracking-wider">
              Playbook
            </span>
          </button>

          {/* Gmail Lead Bot & Proposal Generator Button */}
          <button
            id="nav-gmail-bot-button"
            onClick={onOpenGmailBot}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-red-500/20 to-amber-500/20 hover:from-red-500/30 hover:to-amber-500/30 border border-red-500/40 text-red-200 text-xs font-bold transition-all shadow-sm shadow-red-500/10 cursor-pointer"
            title="Gmail Lead Bot: Scans incoming emails, generates proposals, and alerts arslan.qaiser1991@gmail.com"
          >
            <Mail className="w-3.5 h-3.5 text-red-400" />
            <span>Gmail Lead Bot</span>
            <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
          </button>

          {/* Leads Inbox Pill */}
          <button
            id="leads-inbox-button"
            onClick={onOpenLeadsManager}
            className="relative px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 text-xs font-medium border border-neutral-800 flex items-center space-x-1.5 transition-all"
            title="View captured client inquiries and project scopes"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Captured Leads</span>
            {leadsCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-amber-500 text-neutral-950 font-bold text-[10px] flex items-center justify-center">
                {leadsCount}
              </span>
            )}
          </button>

          {/* Specialist Data Edit Pill */}
          <button
            id="edit-profile-button"
            onClick={onOpenSpecialistEditor}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border flex items-center space-x-1.5 transition-all cursor-pointer ${
              isOwnerUser(user)
                ? "bg-emerald-950/50 hover:bg-emerald-900/50 text-emerald-300 border-emerald-500/40 shadow-sm"
                : "bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200 border-neutral-800"
            }`}
            title={
              isOwnerUser(user)
                ? "Edit your contact details, rates, and bio (Verified Owner: Arslan Qaiser)"
                : "Specialist Profile (Protected: Owner Login Required to Modify)"
            }
          >
            {isOwnerUser(user) ? (
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

          {/* Firebase Authentication & Cloud Sync Pill */}
          {user ? (
            <div className="flex items-center space-x-1.5 pl-1 border-l border-neutral-800">
              <div
                className="flex items-center space-x-1.5 px-2 py-1 rounded-lg bg-neutral-900 border border-neutral-800 text-xs text-neutral-300"
                title={`Signed in as ${user.displayName || user.email} (Firebase Cloud Active)`}
              >
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || "User"}
                    className="w-5 h-5 rounded-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-amber-500 text-neutral-950 font-bold text-[10px] flex items-center justify-center">
                    {(user.displayName || user.email || "U").charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="hidden xl:inline text-neutral-300 max-w-[100px] truncate text-[11px]">
                  {user.displayName || user.email?.split("@")[0]}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" title="Firestore Connected" />
              </div>
              <button
                onClick={onSignOut}
                className="p-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-red-400 border border-neutral-800 text-xs transition-colors cursor-pointer"
                title="Sign out of Firebase"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onSignIn}
              className="px-2.5 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-700/80 hover:border-neutral-600 text-neutral-200 text-xs font-medium flex items-center space-x-1.5 transition-all shadow-sm cursor-pointer"
              title="Sign in with Google to enable real-time Firebase cloud synchronization"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.02h3.88c2.27-2.09 3.665-5.17 3.665-9.12z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.02c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.12C3.26 21.36 7.33 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.29c-.25-.72-.38-1.49-.38-2.29s.13-1.57.38-2.29V6.59H1.24C.45 8.17 0 9.99 0 12s.45 3.83 1.24 5.41l4.04-3.12z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.24 6.59l4.04 3.12c.95-2.83 3.6-4.96 6.72-4.96z"
                />
              </svg>
              <span className="hidden sm:inline">Google Sign-in</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
