import React, { useState, useEffect } from "react";
import { 
  Building2, 
  Compass, 
  Layers, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  ShieldAlert, 
  Clock, 
  FileSpreadsheet, 
  MessageSquare, 
  Mail, 
  Phone, 
  ChevronRight,
  Bot,
  Award,
  ShieldCheck,
  Share2,
  TrendingUp,
  Target
} from "lucide-react";
import { Navbar } from "./components/Navbar";
import { ScopeEstimator } from "./components/ScopeEstimator";
import { DeliverablesGallery } from "./components/DeliverablesGallery";
import { WorkflowsSection } from "./components/WorkflowsSection";
import { SpecialistProfileCard } from "./components/SpecialistProfileCard";
import { LeadCaptureModal } from "./components/LeadCaptureModal";
import { BlueprintReportModal } from "./components/BlueprintReportModal";
import { SpecialistDataModal } from "./components/SpecialistDataModal";
import { LeadManagerDrawer } from "./components/LeadManagerDrawer";
import { AgentAuditLabModal } from "./components/AgentAuditLabModal";
import { PublishTrafficModal } from "./components/PublishTrafficModal";
import { TrafficGrowthDashboardModal } from "./components/TrafficGrowthDashboardModal";
import { ArchCopilotModal } from "./components/ArchCopilotModal";
import { RenderingStudioModal } from "./components/RenderingStudioModal";
import { VideoWalkthroughModal } from "./components/VideoWalkthroughModal";
import { LeadFinderModal } from "./components/LeadFinderModal";
import { GmailLeadBotModal } from "./components/GmailLeadBotModal";
import { DEFAULT_SPECIALIST_PROFILE } from "./data/architecturalData";
import { SpecialistProfile, LeadSubmission, ArchitecturalBlueprint } from "./types";
import { ScopeCalculationInput, ScopeCalculationResult } from "./utils/calculator";
import { recordPageVisit, recordAnalyticsEvent, fetchAnalyticsSummary } from "./services/trafficAnalytics";
import { isOwnerAuthorized } from "./services/ownerAuth";
import {
  signInWithGoogle,
  logOut,
  subscribeToAuth,
  updateLeadInFirestore,
  subscribeToFirestoreLeads,
  saveSpecialistToFirestore,
  fetchSpecialistFromFirestore
} from "./lib/firebase";
import { User } from "firebase/auth";

export default function App() {
  // Firebase Auth User
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Specialist Profile state (persisted in localStorage with fallback merge)
  const [specialist, setSpecialist] = useState<SpecialistProfile>(() => {
    const saved = localStorage.getItem("archscope_specialist_profile_v4");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_SPECIALIST_PROFILE,
          ...parsed,
          phone: "+92 322 4316477",
          whatsapp: "+923224316477",
          socials: {
            ...DEFAULT_SPECIALIST_PROFILE.socials,
            ...(parsed.socials || {}),
            linkedin: parsed.socials?.linkedin || DEFAULT_SPECIALIST_PROFILE.socials.linkedin
          }
        };
      } catch (e) {
        console.error("Failed to parse saved specialist profile:", e);
      }
    }
    return DEFAULT_SPECIALIST_PROFILE;
  });

  // Leads list state
  const [leads, setLeads] = useState<LeadSubmission[]>([]);
  
  // Modals state
  const [isLeadCaptureOpen, setIsLeadCaptureOpen] = useState(false);
  const [activeCalculationInput, setActiveCalculationInput] = useState<ScopeCalculationInput | null>(null);
  const [activeCalculationResult, setActiveCalculationResult] = useState<ScopeCalculationResult | null>(null);

  const [isBlueprintOpen, setIsBlueprintOpen] = useState(false);
  const [activeBlueprint, setActiveBlueprint] = useState<ArchitecturalBlueprint | null>(null);
  const [activeLeadData, setActiveLeadData] = useState<{ name: string; email: string; phone?: string; firmOrRole: string }>({
    name: "",
    email: "",
    firmOrRole: "",
  });

  const [isSpecialistEditorOpen, setIsSpecialistEditorOpen] = useState(false);
  const [isLeadsManagerOpen, setIsLeadsManagerOpen] = useState(false);
  const [isAgentAuditModalOpen, setIsAgentAuditModalOpen] = useState(false);
  const [isPublishTrafficOpen, setIsPublishTrafficOpen] = useState(false);
  const [isTrafficGrowthOpen, setIsTrafficGrowthOpen] = useState(false);
  const [isLeadFinderOpen, setIsLeadFinderOpen] = useState(false);
  const [isGmailBotOpen, setIsGmailBotOpen] = useState(false);
  const [totalVisits, setTotalVisits] = useState(0);

  // AI Studios Modal States
  const [isArchCopilotOpen, setIsArchCopilotOpen] = useState(false);
  const [isRenderingStudioOpen, setIsRenderingStudioOpen] = useState(false);
  const [isVideoStudioOpen, setIsVideoStudioOpen] = useState(false);
  const [videoStudioInitialImage, setVideoStudioInitialImage] = useState<string | null>(null);

  // Load leads from backend
  const fetchLeads = async () => {
    try {
      const res = await fetch("/api/leads");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.leads)) {
          setLeads(data.leads);
        }
      }
    } catch (e) {
      console.warn("Could not load backend leads:", e);
    }
  };

  // Refresh analytics numbers
  const refreshAnalytics = async () => {
    const summary = await fetchAnalyticsSummary();
    if (summary) {
      setTotalVisits(summary.totalVisits);
    }
  };

  useEffect(() => {
    fetchLeads();
    
    // Log authentic page visit and load real traffic count
    recordPageVisit().finally(() => {
      refreshAnalytics();
    });

    // Subscribe to Firebase Auth state changes
    const unsubAuth = subscribeToAuth((user) => {
      setCurrentUser(user);
    });

    // Real-time synchronization with Firebase Firestore leads collection
    const unsubLeads = subscribeToFirestoreLeads((remoteLeads) => {
      if (remoteLeads && remoteLeads.length > 0) {
        setLeads((prev) => {
          const map = new Map<string, LeadSubmission>();
          // Existing local leads
          prev.forEach((l) => map.set(l.id, l));
          // Remote Firestore leads override or append
          remoteLeads.forEach((l) => map.set(l.id, l));
          const merged = Array.from(map.values());
          merged.sort((a, b) => new Date(b.createdAt || (b as any).submittedAt || 0).getTime() - new Date(a.createdAt || (a as any).submittedAt || 0).getTime());
          return merged;
        });
      }
    });

    // Attempt to load cloud specialist profile from Firestore
    fetchSpecialistFromFirestore().then((remoteProfile) => {
      if (remoteProfile && remoteProfile.name) {
        setSpecialist((prev) => ({
          ...prev,
          ...remoteProfile,
          socials: {
            ...prev.socials,
            ...(remoteProfile.socials || {}),
          },
        }));
      }
    });

    // Ensure document title and meta description match target search query
    document.title = "Remote Architectural BIM Services & CAD Permit Sets | ArchScope Estimator";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        "content",
        "Calculate scope, sheet counts, and fees for remote architectural BIM services, Revit 3D modeling (LOD 200-400), and code-compliant permit drawing sets. Fast turnaround."
      );
    }

    return () => {
      unsubAuth();
      unsubLeads();
    };
  }, []);

  // Firebase Google Sign In
  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (err: any) {
      console.warn("Firebase Google Sign-In notice:", err.message);
    }
  };

  // Firebase Sign Out
  const handleSignOut = async () => {
    try {
      await logOut();
    } catch (err: any) {
      console.warn("Firebase sign-out notice:", err.message);
    }
  };

  // Update specialist profile (restricted to authorized owner)
  const handleSaveSpecialistProfile = (updated: SpecialistProfile) => {
    if (!isOwnerAuthorized(currentUser)) {
      console.warn("Unauthorized attempt to update specialist profile blocked.");
      return;
    }
    setSpecialist(updated);
    localStorage.setItem("archscope_specialist_profile_v4", JSON.stringify(updated));
    saveSpecialistToFirestore(updated);
  };

  // Update lead status (local + Firestore cloud sync + express backend)
  const handleUpdateLeadStatus = async (leadId: string, status: LeadSubmission["status"]) => {
    setLeads((prev) => prev.map((l) => (l.id === leadId ? { ...l, status } : l)));
    updateLeadInFirestore(leadId, { status });
    try {
      await fetch(`/api/leads/${leadId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
    } catch (e) {
      console.error("Failed to update lead status on server:", e);
    }
  };

  // Trigger Lead Capture from Estimator
  const handleProceedToLeadCapture = (input: ScopeCalculationInput, calculation: ScopeCalculationResult) => {
    setActiveCalculationInput(input);
    setActiveCalculationResult(calculation);
    setIsLeadCaptureOpen(true);
    recordAnalyticsEvent("scope_calculation");
  };

  // Blueprint generated callback
  const handleBlueprintGenerated = (
    blueprint: ArchitecturalBlueprint,
    leadData: { name: string; email: string; phone?: string; firmOrRole: string }
  ) => {
    setActiveBlueprint(blueprint);
    setActiveLeadData(leadData);
    setIsLeadCaptureOpen(false);
    setIsBlueprintOpen(true);
    fetchLeads(); // refresh leads count
  };

  // Smooth scroll to estimator
  const scrollToEstimator = () => {
    const el = document.getElementById("estimator");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans selection:bg-amber-500 selection:text-neutral-950 flex flex-col justify-between">
      
      {/* Navigation */}
      <Navbar
        specialist={specialist}
        leadsCount={leads.length}
        totalVisits={totalVisits}
        user={currentUser}
        onSignIn={handleSignIn}
        onSignOut={handleSignOut}
        onOpenLeadFinder={() => setIsLeadFinderOpen(true)}
        onOpenGmailBot={() => setIsGmailBotOpen(true)}
        onOpenLeadsManager={() => setIsLeadsManagerOpen(true)}
        onOpenSpecialistEditor={() => setIsSpecialistEditorOpen(true)}
        onScrollToEstimator={scrollToEstimator}
        onOpenAgentAuditLab={() => setIsAgentAuditModalOpen(true)}
        onOpenPublishTraffic={() => setIsPublishTrafficOpen(true)}
        onOpenTrafficGrowth={() => setIsTrafficGrowthOpen(true)}
        onOpenArchCopilot={() => setIsArchCopilotOpen(true)}
        onOpenRenderingStudio={() => setIsRenderingStudioOpen(true)}
        onOpenVideoStudio={() => setIsVideoStudioOpen(true)}
      />

      {/* Main Content */}
      <main className="flex-1">
        
        {/* Architectural Hero Banner */}
        <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 overflow-hidden">
          {/* Subtle architectural coordinate grid in background */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:20px_20px]" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="max-w-3xl">
              
              {/* Badges Bar: Service scope & Dual-Agent Quality Gate */}
              <div className="flex flex-wrap items-center gap-2.5 mb-6">
                <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
                  <Compass className="w-3.5 h-3.5" />
                  <span>Remote Architectural BIM Services • Revit LOD 200–400 • CAD Permitting</span>
                </div>

                <button
                  onClick={() => setIsAgentAuditModalOpen(true)}
                  className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold transition-all cursor-pointer shadow-sm hover:border-emerald-500/70"
                  title="Click to inspect Worker & Critic agent benchmarks and ratings"
                >
                  <Bot className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Critic Verdict: Approved (9.4 / 10 ★)</span>
                </button>
              </div>

              {/* Display Headline targeting long-tail search queries */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-neutral-100 tracking-tight leading-[1.12]">
                Remote Architectural BIM Services & Permit CAD Sets.{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500">
                  Delivered Globally.
                </span>
              </h1>

              {/* Sub-copy */}
              <p className="mt-5 text-base sm:text-lg text-neutral-300 leading-relaxed max-w-2xl">
                Partner with an NCA-trained senior architect for code-compliant 
                remote architectural BIM services, Autodesk Revit 3D modeling (LOD 200–400), and 
                millimeter-precise permit drawing sets (IBC/IRC/Title 24). Save 60-70% overhead 
                compared to in-house drafter payroll with 24-48h redline turnarounds.
              </p>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <button
                  id="hero-estimator-cta-btn"
                  onClick={scrollToEstimator}
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-bold text-sm shadow-xl shadow-amber-500/20 transition-all flex items-center space-x-2 group cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-neutral-950" />
                  <span>Estimate Project Scope & Fees</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <a
                  href={`https://wa.me/${specialist.whatsapp.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                    `Hi ${specialist.name}, I'm looking for a remote architecture and drafting specialist.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => recordAnalyticsEvent("whatsapp_click")}
                  className="px-5 py-3.5 rounded-xl bg-emerald-700/80 hover:bg-emerald-600/90 text-white font-semibold text-sm border border-emerald-500/40 flex items-center space-x-2 transition-all cursor-pointer shadow-md shadow-emerald-900/20"
                >
                  <MessageSquare className="w-4 h-4 fill-white/20" />
                  <span>WhatsApp: {specialist.phone || "+92 322 4316477"}</span>
                </a>

                <button
                  onClick={() => setIsAgentAuditModalOpen(true)}
                  className="px-4 py-3.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 text-sm font-mono border border-neutral-800 flex items-center space-x-2 transition-all cursor-pointer"
                >
                  <Bot className="w-4 h-4 text-amber-400" />
                  <span>Agent Audit (9.4★)</span>
                </button>

                <button
                  onClick={() => setIsPublishTrafficOpen(true)}
                  className="px-4 py-3.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 text-sm font-mono border border-neutral-800 flex items-center space-x-2 transition-all cursor-pointer"
                  title="Share platform link and copy proposal hooks"
                >
                  <Share2 className="w-4 h-4 text-amber-400" />
                  <span>Share Links</span>
                </button>

                <button
                  id="hero-lead-finder-btn"
                  onClick={() => setIsLeadFinderOpen(true)}
                  className="px-4 py-3.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-amber-600/10 hover:from-amber-500/30 text-amber-300 text-sm font-bold border border-amber-500/40 flex items-center space-x-2 transition-all cursor-pointer shadow-md shadow-amber-500/10"
                  title="Client Lead Acquisition Playbook: AI Pitch Generator, Municipal Portals & LinkedIn"
                >
                  <Target className="w-4 h-4 text-amber-400" />
                  <span>Find Clients Playbook</span>
                </button>

                <button
                  id="hero-gmail-bot-btn"
                  onClick={() => setIsGmailBotOpen(true)}
                  className="px-4 py-3.5 rounded-xl bg-gradient-to-r from-red-500/20 to-amber-500/20 hover:from-red-500/30 text-red-200 text-sm font-bold border border-red-500/40 flex items-center space-x-2 transition-all cursor-pointer shadow-md shadow-red-500/10"
                  title="Gmail Inbox Lead Bot: Scans incoming emails, auto-generates proposals, and alerts arslan.qaiser1991@gmail.com"
                >
                  <Mail className="w-4 h-4 text-red-400" />
                  <span>Gmail Inbox Bot</span>
                </button>

                <button
                  id="hero-traffic-growth-btn"
                  onClick={() => setIsTrafficGrowthOpen(true)}
                  className="px-4 py-3.5 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 text-sm font-mono border border-emerald-500/40 flex items-center space-x-2 transition-all cursor-pointer shadow-sm"
                  title="View real visitor telemetry and progressive benchmarks"
                >
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span>Traffic & Benchmarks ({totalVisits} views)</span>
                </button>
              </div>

              {/* Gemini AI Interactive Studios Quick Launch Row */}
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  onClick={() => setIsArchCopilotOpen(true)}
                  className="p-3.5 rounded-xl bg-neutral-900/90 hover:bg-neutral-800/90 border border-amber-500/30 hover:border-amber-500/60 text-left transition-all group cursor-pointer shadow-lg shadow-amber-500/5"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                      <Bot className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded">
                      Grounded AI
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-neutral-100 group-hover:text-amber-300 transition-colors">
                    ArchBot BIM Copilot
                  </h4>
                  <p className="text-[11px] text-neutral-400 mt-0.5 line-clamp-1">
                    Live Search & Maps code advisory
                  </p>
                </button>

                <button
                  onClick={() => setIsRenderingStudioOpen(true)}
                  className="p-3.5 rounded-xl bg-neutral-900/90 hover:bg-neutral-800/90 border border-purple-500/30 hover:border-purple-500/60 text-left transition-all group cursor-pointer shadow-lg shadow-purple-500/5"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="w-7 h-7 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-mono text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded">
                      Flash Image
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-neutral-100 group-hover:text-purple-300 transition-colors">
                    3D Render Studio
                  </h4>
                  <p className="text-[11px] text-neutral-400 mt-0.5 line-clamp-1">
                    Create & edit 3D concepts from text
                  </p>
                </button>

                <button
                  onClick={() => setIsVideoStudioOpen(true)}
                  className="p-3.5 rounded-xl bg-neutral-900/90 hover:bg-neutral-800/90 border border-orange-500/30 hover:border-orange-500/60 text-left transition-all group cursor-pointer shadow-lg shadow-orange-500/5"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="w-7 h-7 rounded-lg bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400">
                      <Compass className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-mono text-orange-400 bg-orange-500/10 px-1.5 py-0.5 rounded">
                      Veo 3.1
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-neutral-100 group-hover:text-orange-300 transition-colors">
                    Veo Walkthroughs
                  </h4>
                  <p className="text-[11px] text-neutral-400 mt-0.5 line-clamp-1">
                    Photo to 720p 3D camera orbit
                  </p>
                </button>
              </div>

              {/* Fast Trust Indicators */}
              <div className="mt-10 pt-8 border-t border-neutral-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
                <div>
                  <span className="text-amber-400 font-bold block text-sm">AIA & NCS</span>
                  <span className="text-neutral-400 text-[11px]">CAD Layering Standards</span>
                </div>
                <div>
                  <span className="text-neutral-100 font-bold block text-sm">LOD 200 - 400</span>
                  <span className="text-neutral-400 text-[11px]">Revit BIM Modeling</span>
                </div>
                <div>
                  <span className="text-amber-400 font-bold block text-sm">24-48h</span>
                  <span className="text-neutral-400 text-[11px]">Redline Turnaround</span>
                </div>
                <div>
                  <span className="text-emerald-400 font-bold block text-sm">100% Native</span>
                  <span className="text-neutral-400 text-[11px]">RVT, DWG & Arch D PDF</span>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* 1. Core Lead Magnet: The Interactive Scope & Fee Estimator */}
        <ScopeEstimator onProceedToLeadCapture={handleProceedToLeadCapture} />

        {/* 2. Concrete Proof: Technical Deliverables & Before/After Gallery */}
        <DeliverablesGallery />

        {/* 3. Value Proposition: Remote Delivery Advantage & Engagement Models */}
        <WorkflowsSection onScrollToEstimator={scrollToEstimator} />

        {/* 4. Specialist Identity & Direct Booking */}
        <SpecialistProfileCard
          specialist={specialist}
          onOpenEditor={() => setIsSpecialistEditorOpen(true)}
          onScrollToEstimator={scrollToEstimator}
          isOwner={isOwnerAuthorized(currentUser)}
        />

      </main>

      {/* Footer */}
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
              {specialist.socials?.dropboxFolder && (
                <a
                  href={specialist.socials.dropboxFolder}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-400 transition-colors underline underline-offset-4"
                >
                  Dropbox Work Vault (PDFs)
                </a>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-neutral-900">
            <div className="flex items-center space-x-6 text-neutral-400">
              <a href="#estimator" className="hover:text-amber-400 transition-colors">Scope Estimator</a>
              <a href="#deliverables" className="hover:text-amber-400 transition-colors">Drawing Sets & PDFs</a>
              <a href="#workflows" className="hover:text-amber-400 transition-colors">Delivery Process</a>
              <a href="#specialist" className="hover:text-amber-400 transition-colors">About Specialist</a>
              <button
                onClick={() => setIsSpecialistEditorOpen(true)}
                className="hover:text-amber-400 transition-colors cursor-pointer flex items-center space-x-1"
                title={isOwnerAuthorized(currentUser) ? "Edit profile settings (Owner)" : "Specialist Profile & Credentials (Protected)"}
              >
                <span>Profile & Links Settings</span>
                {!isOwnerAuthorized(currentUser) && (
                  <span className="text-[10px] text-neutral-500 font-mono">(Protected)</span>
                )}
              </button>
            </div>

            <div>
              © {new Date().getFullYear()} {specialist.brandName || "Quintessential Architecture"}. All drawings & BIM deliverables code-compliant.
            </div>
          </div>
        </div>
      </footer>

      {/* Modals & Drawers */}
      {isLeadCaptureOpen && activeCalculationInput && activeCalculationResult && (
        <LeadCaptureModal
          isOpen={isLeadCaptureOpen}
          onClose={() => setIsLeadCaptureOpen(false)}
          input={activeCalculationInput}
          calculation={activeCalculationResult}
          onBlueprintGenerated={handleBlueprintGenerated}
        />
      )}

      {isBlueprintOpen && activeBlueprint && activeCalculationInput && activeCalculationResult && (
        <BlueprintReportModal
          isOpen={isBlueprintOpen}
          onClose={() => setIsBlueprintOpen(false)}
          blueprint={activeBlueprint}
          input={activeCalculationInput}
          calculation={activeCalculationResult}
          leadData={activeLeadData}
          specialist={specialist}
        />
      )}

      {isSpecialistEditorOpen && (
        <SpecialistDataModal
          isOpen={isSpecialistEditorOpen}
          onClose={() => setIsSpecialistEditorOpen(false)}
          currentProfile={specialist}
          onSaveProfile={handleSaveSpecialistProfile}
          currentUser={currentUser}
          onSignIn={handleSignIn}
        />
      )}

      {isLeadsManagerOpen && (
        <LeadManagerDrawer
          isOpen={isLeadsManagerOpen}
          onClose={() => setIsLeadsManagerOpen(false)}
          leads={leads}
          onUpdateLeadStatus={handleUpdateLeadStatus}
          specialist={specialist}
          onRefreshLeads={fetchLeads}
          onOpenLeadFinder={() => setIsLeadFinderOpen(true)}
        />
      )}

      {/* Dual-Agent Worker & Critic Quality Gate Modal */}
      {isAgentAuditModalOpen && (
        <AgentAuditLabModal
          isOpen={isAgentAuditModalOpen}
          onClose={() => setIsAgentAuditModalOpen(false)}
          onOpenLeadManager={() => setIsLeadsManagerOpen(true)}
          onScrollToEstimator={scrollToEstimator}
        />
      )}

      {/* Publish & Traffic Acquisition Hub Modal */}
      {isPublishTrafficOpen && (
        <PublishTrafficModal
          isOpen={isPublishTrafficOpen}
          onClose={() => setIsPublishTrafficOpen(false)}
          specialist={specialist}
          onOpenLeadFinder={() => setIsLeadFinderOpen(true)}
        />
      )}

      {/* Real Traffic & Dual-Agent Growth Modal */}
      {isTrafficGrowthOpen && (
        <TrafficGrowthDashboardModal
          isOpen={isTrafficGrowthOpen}
          onClose={() => {
            setIsTrafficGrowthOpen(false);
            refreshAnalytics();
          }}
          specialist={specialist}
        />
      )}

      {/* ArchBot BIM & Permitting Copilot Modal */}
      {isArchCopilotOpen && (
        <ArchCopilotModal
          isOpen={isArchCopilotOpen}
          onClose={() => setIsArchCopilotOpen(false)}
          specialist={specialist}
        />
      )}

      {/* Architectural 3D Rendering Studio Modal */}
      {isRenderingStudioOpen && (
        <RenderingStudioModal
          isOpen={isRenderingStudioOpen}
          onClose={() => setIsRenderingStudioOpen(false)}
          onSendToVideoWalkthrough={(imgUrl) => {
            setVideoStudioInitialImage(imgUrl);
            setIsRenderingStudioOpen(false);
            setIsVideoStudioOpen(true);
          }}
        />
      )}

      {/* Veo 3D Architectural Walkthrough Studio Modal */}
      {isVideoStudioOpen && (
        <VideoWalkthroughModal
          isOpen={isVideoStudioOpen}
          onClose={() => {
            setIsVideoStudioOpen(false);
            setVideoStudioInitialImage(null);
          }}
          initialImage={videoStudioInitialImage}
        />
      )}

      {/* Client Lead Acquisition & Outreach Engine Modal */}
      {isLeadFinderOpen && (
        <LeadFinderModal
          isOpen={isLeadFinderOpen}
          onClose={() => setIsLeadFinderOpen(false)}
          specialist={specialist}
        />
      )}

      {/* Gmail Inbox Lead Bot & Proposal Generator Modal */}
      {isGmailBotOpen && (
        <GmailLeadBotModal
          isOpen={isGmailBotOpen}
          onClose={() => setIsGmailBotOpen(false)}
          specialist={specialist}
        />
      )}

    </div>
  );
}
