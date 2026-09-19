import React, { useState } from "react";
import {
  X,
  Target,
  Mail,
  Send,
  Copy,
  Check,
  Building2,
  ExternalLink,
  Search,
  Sparkles,
  ShieldCheck,
  FileText,
  Briefcase,
  Layers,
  ArrowRight,
  MessageSquare,
  Globe,
  MapPin,
  Flame,
  HelpCircle,
  Linkedin,
  Clock,
  Compass,
  CheckCircle2,
  Share2
} from "lucide-react";
import { SpecialistProfile } from "../types";

interface LeadFinderModalProps {
  isOpen: boolean;
  onClose: () => void;
  specialist: SpecialistProfile;
}

type OutreachPersona = "architecture_firm" | "general_contractor" | "interior_designer" | "permit_corrections" | "upwork_proposal";

interface MunicipalPortal {
  city: string;
  state: string;
  name: string;
  url: string;
  planCheckKeyword: string;
  notes: string;
}

const MUNICIPAL_PORTALS: MunicipalPortal[] = [
  {
    city: "Austin",
    state: "TX",
    name: "Austin Build + Connect (ABC)",
    url: "https://abc.austintexas.gov/web/permit/public-search-other",
    planCheckKeyword: "Revisions Required",
    notes: "Filter by 'Building Permit' and search for 'Corrections Required' or 'Plan Check Revisions'. Check Applicant/Architect contact info."
  },
  {
    city: "Los Angeles",
    state: "CA",
    name: "LADBS ePermit & PCIS System",
    url: "https://www.ladbs.org/services/check-status/online-building-records",
    planCheckKeyword: "Corrections / Plan Check",
    notes: "Inspect Building Plan Check records. High concentration of seismic, Title 24, and ADU redline backlog."
  },
  {
    city: "Miami-Dade",
    state: "FL",
    name: "MDC Regulatory & Economic Resources",
    url: "https://www.miamidade.gov/Apps/RER/EPSPortal",
    planCheckKeyword: "Disapproved / Resubmit",
    notes: "High residential renovation and condo remodel volume. High demand for fast CAD elevation & life safety sheet revisions."
  },
  {
    city: "New York City",
    state: "NY",
    name: "DOB NOW: Build Public Portal",
    url: "https://a810-dobnow.nyc.gov/publish/Index.html#!",
    planCheckKeyword: "Objections Raised",
    notes: "Click 'Public Portal' -> Search Filings with 'Plan Exam Objections'. Identify filing architects in Brooklyn, Queens & Manhattan."
  },
  {
    city: "Chicago",
    state: "IL",
    name: "Chicago Dept. of Buildings Portal",
    url: "https://www.chicago.gov/city/en/depts/bldgs.html",
    planCheckKeyword: "Plan Review Corrections",
    notes: "Browse standard plan review permits. Look for multi-unit interior alterations and commercial buildouts."
  },
  {
    city: "Dallas",
    state: "TX",
    name: "Dallas Building Inspection Portal",
    url: "https://dallascityhall.com/departments/sustainabledevelopment/buildinginspection",
    planCheckKeyword: "Pending Revisions",
    notes: "Massive residential development corridor. Contractors frequently outsource permit drafting to meet aggressive builder schedules."
  },
  {
    city: "Seattle",
    state: "WA",
    name: "Seattle Services Portal (SDCI)",
    url: "https://cosaccela.seattle.gov/Portal/welcome.aspx",
    planCheckKeyword: "Correction Notice Sent",
    notes: "Complex energy code and zoning requirements. Search for 'Correction Notice Issued' on DADU and townhome permits."
  },
  {
    city: "London",
    state: "UK",
    name: "Planning Portal UK",
    url: "https://www.planningportal.co.uk/",
    planCheckKeyword: "Awaiting Additional Drawings",
    notes: "Target RIBA chartered architects who need drawing revisions or measured building CAD elevations for UK planning applications."
  },
  {
    city: "Toronto",
    state: "Canada",
    name: "Toronto Building Application Status",
    url: "https://www.toronto.ca/services-payments/building-construction/search-the-status-of-a-building-permit-application/",
    planCheckKeyword: "Notice of Refusal / Deficiency",
    notes: "Search zoning and building review deficiency notices. Perfect for fast turnaround CAD drawing support."
  }
];

export const LeadFinderModal: React.FC<LeadFinderModalProps> = ({
  isOpen,
  onClose,
  specialist,
}) => {
  const [activeTab, setActiveTab] = useState<"pitch_generator" | "permit_portals" | "linkedin_finder" | "pilot_agreement">("pitch_generator");

  // Pitch Generator States
  const [persona, setPersona] = useState<OutreachPersona>("architecture_firm");
  const [prospectFirm, setProspectFirm] = useState("Studio Collective Architects");
  const [prospectContact, setProspectContact] = useState("Sarah");
  const [prospectLocation, setProspectLocation] = useState("Austin, TX");
  const [prospectProject, setProspectProject] = useState("Modern Residence / Permit Set");
  const [includeFreeTrial, setIncludeFreeTrial] = useState(true);
  const [includeCalculatorLink, setIncludeCalculatorLink] = useState(true);
  const [copiedSubjectIndex, setCopiedSubjectIndex] = useState<number | null>(null);
  const [copiedBody, setCopiedBody] = useState(false);
  const [copiedAgreement, setCopiedAgreement] = useState(false);

  // LinkedIn Search States
  const [linkedinRole, setLinkedinRole] = useState('"Principal Architect" OR "Studio Director"');
  const [linkedinRegion, setLinkedinRegion] = useState("United States");
  const [linkedinIndustry, setLinkedinIndustry] = useState("Architecture & Planning");

  if (!isOpen) return null;

  const liveAppUrl =
    window.location.origin.includes("localhost") || window.location.origin.includes("3000")
      ? "https://ais-pre-6j6p4r7c3aelnybx2twern-259039156788.asia-southeast1.run.app"
      : window.location.href;

  // Generate Subject Lines based on selected persona
  const getSubjectLines = (): string[] => {
    switch (persona) {
      case "architecture_firm":
        return [
          `Quick question re: drafting overflow at ${prospectFirm}`,
          `Overflow CAD / Revit support for ${prospectFirm}`,
          `Need on-demand CD & permit drawing backup at ${prospectFirm}?`
        ];
      case "general_contractor":
        return [
          `Permit drawing turnaround for ${prospectFirm} projects`,
          `Fast CAD permit sets & plan check corrections in ${prospectLocation}`,
          `Quick question re: architectural plans for ${prospectFirm}`
        ];
      case "interior_designer":
        return [
          `CAD base plans & Revit 3D models for ${prospectFirm}`,
          `Drafting support for interior elevations & millwork (${prospectFirm})`,
          `Converting sketches to clean permit & construction drawings`
        ];
      case "permit_corrections":
        return [
          `Assistance clearing plan check corrections in ${prospectLocation}`,
          `Emergency redline revisions for ${prospectProject}`,
          `Need quick turnaround on building permit revisions?`
        ];
      case "upwork_proposal":
        return [
          `Proposal: Remote Architectural BIM & Permit Drawing Services`,
          `Revit 3D / CAD Permit Specialist (LOD 200-400) + Instant Scope Calc`,
          `Fast Turnaround Permit Sets & Code Compliance`
        ];
    }
  };

  // Generate Body Text based on selected inputs
  const getPitchBody = (): string => {
    const greeting = prospectContact ? `Hi ${prospectContact},` : `Hi there,`;
    const calculatorPitch = includeCalculatorLink
      ? `\n\nTo make scoping completely transparent, I created an interactive scope & fee estimator with verified drawing sheet schedules and turnaround benchmarks: ${liveAppUrl}`
      : "";

    const freeTrialText = includeFreeTrial
      ? `\n\nI know file standards and layer hygiene are crucial for your studio. To remove all risk, I’d be glad to model or draft one initial test sheet (or complete a redline revision batch) at no charge so your team can inspect our work before committing.`
      : "";

    switch (persona) {
      case "architecture_firm":
        return `${greeting}

I've been following ${prospectFirm}'s work—love the attention to detail on your projects.

I run Quintessential Architecture, a dedicated remote BIM and CAD production studio specializing in construction documentation sets, Revit 3D modeling (LOD 200–400), and code-compliant permit packages (IBC, IRC, Title 24).

Many boutique studios with 3–15 designers get bottlenecked when several projects hit the Construction Documentation or plan review stage simultaneously. We act as your on-demand overflow wing—delivering clean sheets, redline markups, and drawing sets overnight so your in-house team can stay focused on high-margin design and client presentations.${freeTrialText}${calculatorPitch}

Would you be open to a 5-minute chat this Thursday afternoon to see if overflow drafting support could save your studio time on upcoming deadlines?

Best regards,

${specialist.name}
${specialist.title} | Quintessential Architecture
Direct Phone / WhatsApp: ${specialist.whatsapp || specialist.phone || "+92 322 4316477"}
LinkedIn: ${specialist.socials?.linkedin || "https://www.linkedin.com/in/arslan-qaiser-947976188/"}
Portfolio & Scope Estimator: ${liveAppUrl}`;

      case "general_contractor":
        return `${greeting}

I'm reaching out because I work with residential builders and remodelers across ${prospectLocation} who need permit drawings turned around quickly to pull city building permits without delays.

I specialize in building department-ready CAD & Revit drawing packages—including site plans, life safety notes, wall assemblies, structural layouts, and MEP coordination that pass plan check on the first or second cycle.

If you have an active project like ${prospectProject} or are tired of waiting weeks on unresponsive drafting services, we can turn around your drawing sets in days.${freeTrialText}${calculatorPitch}

Do you have 5 minutes this week to discuss any upcoming projects in your pipeline?

Best regards,

${specialist.name}
Lead Architectural BIM Specialist
Phone / WhatsApp: ${specialist.whatsapp || specialist.phone || "+92 322 4316477"}
LinkedIn: ${specialist.socials?.linkedin || "https://www.linkedin.com/in/arslan-qaiser-947976188/"}`;

      case "interior_designer":
        return `${greeting}

I'm a huge fan of ${prospectFirm}'s aesthetic and interior detailing.

I partner with interior design studios to convert concept sketches, Pinterest boards, and rough PDFs into millimeter-accurate AutoCAD permit sets, Revit 3D models, and detailed interior millwork/elevation schedules.

If your team focuses primarily on FF&E, finishes, and client presentations, we take care of the technical drawing packages, demolition plans, lighting/switching schedules, and MEP coordination sheets.${freeTrialText}${calculatorPitch}

I'd love to show you a sample set or discuss supporting your next interior buildout. Would you be free for a brief call this week?

Warm regards,

${specialist.name}
Quintessential Architecture
WhatsApp: ${specialist.whatsapp || specialist.phone || "+92 322 4316477"}
LinkedIn: ${specialist.socials?.linkedin || "https://www.linkedin.com/in/arslan-qaiser-947976188/"}`;

      case "permit_corrections":
        return `${greeting}

I noticed the plan review status for ${prospectProject || "your recent project"} in ${prospectLocation} requires corrections or plan check revisions.

City plan check comments can be a headache and stall project schedules. I specialize in rapid redline pick-ups, building code comment resolution (IBC/IRC/Title 24/ADA), and drawing set updates. We regularly deliver revised sheet sets within 24 to 48 hours so you can resubmit immediately.

If you're jammed on time or want someone to tackle the revision checklist immediately, I can jump on this today.${freeTrialText}${calculatorPitch}

Shoot me a reply or text on WhatsApp at ${specialist.whatsapp || "+92 322 4316477"} and we can review your plan check comments right away.

Best regards,

${specialist.name}
Architectural BIM & Code Documentation Specialist
LinkedIn: ${specialist.socials?.linkedin || "https://www.linkedin.com/in/arslan-qaiser-947976188/"}`;

      case "upwork_proposal":
        return `Hi ${prospectContact || "there"},

I saw your job post regarding ${prospectProject || "architectural drafting & BIM support"}. As an architectural graduate (NCA Distinction) with specialized expertise in Autodesk Revit (LOD 200–400) and CAD construction documentation, this aligns exactly with what I do daily.

Rather than rough guesswork, I built an interactive scope calculator specifically for clients needing remote architectural BIM and permit sets:
👉 ${liveAppUrl}

Key Capabilities I Bring:
1. Complete Code-Compliant Sheet Sets: Plans, sections, exterior elevations, Title 24/energy notes, structural layouts, and window/door schedules.
2. Fast Turnaround & Daily Updates: Clean layer standards, verified scales, and overnight redline pick-ups.
3. Zero-Risk Pilot: Happy to draft a sample test sheet or review your redlines at no charge so you can verify my modeling standards before hiring.

Are you available for a brief chat to review your project files?
LinkedIn: ${specialist.socials?.linkedin || "https://www.linkedin.com/in/arslan-qaiser-947976188/"}

Best regards,
${specialist.name}`;
    }
  };

  const currentSubjects = getSubjectLines();
  const currentBody = getPitchBody();

  const handleCopySubject = (subject: string, index: number) => {
    navigator.clipboard.writeText(subject);
    setCopiedSubjectIndex(index);
    setTimeout(() => setCopiedSubjectIndex(null), 2500);
  };

  const handleCopyBody = () => {
    navigator.clipboard.writeText(currentBody);
    setCopiedBody(true);
    setTimeout(() => setCopiedBody(false), 2500);
  };

  const handleOpenMailto = () => {
    const subject = encodeURIComponent(currentSubjects[0]);
    const body = encodeURIComponent(currentBody);
    window.open(`mailto:?subject=${subject}&body=${body}`, "_blank");
  };

  const handleOpenWhatsApp = () => {
    const text = encodeURIComponent(currentBody);
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  const buildLinkedInUrl = () => {
    const query = `${linkedinRole} "${linkedinRegion}"`;
    return `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(query)}`;
  };

  const pilotAgreementText = `ZERO-RISK PILOT DRAFTING & BIM SCOPE AGREEMENT

Service Provider: Quintessential Architecture (Arslan Qaiser)
Client / Firm: [Insert Firm Name]
Project Reference: [Insert Project / Street Name]
Date: ${new Date().toLocaleDateString()}

1. PURPOSE OF PILOT
Quintessential Architecture agrees to provide up to 1 (one) complete architectural drawing sheet or 1 (one) redline revision set (up to 8 drafting hours) at ZERO FINANCIAL CHARGE to the Client. This pilot allows the Client to verify layer hygiene, Revit families, code compliance, and drafting speed before entering a paid agreement.

2. SPECIFICATIONS & SOFTWARE
- Software Platform: Autodesk Revit 2022-2025 / AutoCAD 2024 (.rvt / .dwg)
- Model LOD: LOD 200 - 350 as requested
- Target Codes: IBC / IRC / Title 24 / Local Municipal Amendments
- Turnaround: Delivered within 24-48 business hours from receipt of base survey or hand-markups.

3. INTELLECTUAL PROPERTY & CONFIDENTIALITY
All CAD files, 3D models, and drawings produced during this pilot remain 100% the exclusive intellectual property of the Client. Quintessential Architecture agrees to strict confidentiality and will never share or publish drawings without written consent.

4. SUBSEQUENT WORK RATE
Should the Client choose to proceed with full permit documentation or ongoing overflow services following successful review of the pilot sheet:
- Standard Hourly Rate: $38.00 / hour (or agreed fixed lump-sum per sheet set)
- Revisions: Standard redline pick-ups turnaround within 24 hours.

Agreed & Initiated by:
Service Provider: Arslan Qaiser (Quintessential Architecture)
Phone / WhatsApp: +92 322 4316477 | Email: arslan.qaiser1991@gmail.com`;

  const handleCopyAgreement = () => {
    navigator.clipboard.writeText(pilotAgreementText);
    setCopiedAgreement(true);
    setTimeout(() => setCopiedAgreement(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-neutral-950/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl max-h-[92vh] bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-neutral-100">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-neutral-800 bg-neutral-950 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base sm:text-lg font-bold text-neutral-100 tracking-tight">
                  Client Lead Acquisition & Outreach Engine
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-mono text-[10px] font-bold uppercase tracking-wider">
                  HIGH-INTENT CLIENTS
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">
                Target architects & builders who are actively overloaded with permit deadlines and plan revisions.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-neutral-800 bg-neutral-950/50 px-4 sm:px-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab("pitch_generator")}
            className={`py-3 px-3 sm:px-4 text-xs font-semibold flex items-center space-x-2 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === "pitch_generator"
                ? "border-amber-500 text-amber-400"
                : "border-transparent text-neutral-400 hover:text-neutral-200"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Cold Pitch Generator</span>
          </button>

          <button
            onClick={() => setActiveTab("permit_portals")}
            className={`py-3 px-3 sm:px-4 text-xs font-semibold flex items-center space-x-2 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === "permit_portals"
                ? "border-amber-500 text-amber-400"
                : "border-transparent text-neutral-400 hover:text-neutral-200"
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-rose-400" />
            <span>Permit Portals (Live Leads)</span>
          </button>

          <button
            onClick={() => setActiveTab("linkedin_finder")}
            className={`py-3 px-3 sm:px-4 text-xs font-semibold flex items-center space-x-2 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === "linkedin_finder"
                ? "border-amber-500 text-amber-400"
                : "border-transparent text-neutral-400 hover:text-neutral-200"
            }`}
          >
            <Linkedin className="w-3.5 h-3.5 text-sky-400" />
            <span>LinkedIn Prospect Search</span>
          </button>

          <button
            onClick={() => setActiveTab("pilot_agreement")}
            className={`py-3 px-3 sm:px-4 text-xs font-semibold flex items-center space-x-2 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === "pilot_agreement"
                ? "border-amber-500 text-amber-400"
                : "border-transparent text-neutral-400 hover:text-neutral-200"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Zero-Risk Pilot Agreement</span>
          </button>
        </div>

        {/* Modal Scroll Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* TAB 1: COLD PITCH GENERATOR */}
          {activeTab === "pitch_generator" && (
            <div className="space-y-6">
              
              {/* Instructions Callout */}
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-neutral-300 flex items-start space-x-3">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-1 leading-relaxed">
                  <p className="font-semibold text-amber-300">
                    Why this converts at 18-25% response rates:
                  </p>
                  <p className="text-neutral-400">
                    Architects ignore generic resumes. This pitch presents you as an <strong className="text-neutral-200">on-demand overflow wing</strong> with an irresistible <strong className="text-amber-400">free 1-sheet test trial</strong> and provides your live interactive scope calculator to eliminate estimating friction.
                  </p>
                </div>
              </div>

              {/* Persona Selector Grid */}
              <div>
                <label className="block text-xs font-mono font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                  1. Select Target Client Persona
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                  {[
                    { id: "architecture_firm", title: "Boutique Architecture Firm", sub: "3-15 Staff • Overflow Work" },
                    { id: "general_contractor", title: "Design-Build Contractor", sub: "Permit Speed & Revisions" },
                    { id: "permit_corrections", title: "Plan Check Emergency", sub: "Active City Revisions" },
                    { id: "interior_designer", title: "Interior Design Studio", sub: "CAD & Revit 3D Base Plans" },
                    { id: "upwork_proposal", title: "Upwork / Freelance Bid", sub: "Proposal with Calculator" },
                  ].map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setPersona(p.id as OutreachPersona)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        persona === p.id
                          ? "bg-amber-500/15 border-amber-500/60 text-neutral-100 shadow-sm shadow-amber-500/10"
                          : "bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-neutral-200 hover:border-neutral-700"
                      }`}
                    >
                      <span className="block font-bold text-xs text-neutral-100">{p.title}</span>
                      <span className="block text-[11px] text-neutral-400 mt-0.5">{p.sub}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Customizer Inputs */}
              <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-4">
                <span className="block text-xs font-mono font-semibold text-amber-400 uppercase tracking-wider">
                  2. Customize Lead Details
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-neutral-400 mb-1">
                      Prospect Firm / Company
                    </label>
                    <input
                      type="text"
                      value={prospectFirm}
                      onChange={(e) => setProspectFirm(e.target.value)}
                      placeholder="e.g. Studio Metro Architects"
                      className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-neutral-200 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-neutral-400 mb-1">
                      Contact Name (Optional)
                    </label>
                    <input
                      type="text"
                      value={prospectContact}
                      onChange={(e) => setProspectContact(e.target.value)}
                      placeholder="e.g. David / Marcus"
                      className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-neutral-200 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-neutral-400 mb-1">
                      City / State Jurisdiction
                    </label>
                    <input
                      type="text"
                      value={prospectLocation}
                      onChange={(e) => setProspectLocation(e.target.value)}
                      placeholder="e.g. Austin, TX or London"
                      className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-neutral-200 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-neutral-400 mb-1">
                      Target Project / Focus
                    </label>
                    <input
                      type="text"
                      value={prospectProject}
                      onChange={(e) => setProspectProject(e.target.value)}
                      placeholder="e.g. Oak Hill Permit Set"
                      className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-neutral-200 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                {/* Conversion Boost Toggles */}
                <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-neutral-800/80 text-xs">
                  <label className="flex items-center space-x-2 cursor-pointer text-neutral-300 hover:text-neutral-100">
                    <input
                      type="checkbox"
                      checked={includeFreeTrial}
                      onChange={(e) => setIncludeFreeTrial(e.target.checked)}
                      className="rounded accent-amber-500 w-3.5 h-3.5"
                    />
                    <span>Include "Free 1-Sheet Test Draft" clause (Recommended)</span>
                  </label>

                  <label className="flex items-center space-x-2 cursor-pointer text-neutral-300 hover:text-neutral-100">
                    <input
                      type="checkbox"
                      checked={includeCalculatorLink}
                      onChange={(e) => setIncludeCalculatorLink(e.target.checked)}
                      className="rounded accent-amber-500 w-3.5 h-3.5"
                    />
                    <span>Include live ArchScope Calculator link</span>
                  </label>
                </div>
              </div>

              {/* Subject Lines Selector */}
              <div className="space-y-2">
                <span className="block text-xs font-mono font-semibold text-neutral-400 uppercase tracking-wider">
                  3. High-Open-Rate Subject Lines (Click to copy)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {currentSubjects.map((subj, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleCopySubject(subj, idx)}
                      className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 hover:border-amber-500/50 text-left transition-all flex items-center justify-between group cursor-pointer"
                    >
                      <span className="text-xs text-neutral-300 group-hover:text-amber-300 pr-2 truncate">
                        "{subj}"
                      </span>
                      {copiedSubjectIndex === idx ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 text-neutral-600 group-hover:text-neutral-400 shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Generated Pitch Box */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="block text-xs font-mono font-semibold text-neutral-400 uppercase tracking-wider">
                    4. Generated Outreach Message
                  </span>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleCopyBody}
                      className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold flex items-center space-x-1.5 transition-all shadow-sm cursor-pointer"
                    >
                      {copiedBody ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Copied Message!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Message</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={handleOpenMailto}
                      className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium flex items-center space-x-1.5 transition-all cursor-pointer"
                      title="Open in your default email client with pre-filled subject and body"
                    >
                      <Mail className="w-3.5 h-3.5 text-amber-400" />
                      <span className="hidden sm:inline">Send via Email</span>
                    </button>

                    <button
                      onClick={handleOpenWhatsApp}
                      className="px-3 py-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/30 text-emerald-400 text-xs font-medium flex items-center space-x-1.5 transition-all cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">WhatsApp</span>
                    </button>
                  </div>
                </div>

                <div className="p-4 sm:p-5 rounded-2xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-200 font-mono leading-relaxed whitespace-pre-wrap select-all">
                  {currentBody}
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: MUNICIPAL PERMIT PORTALS */}
          {activeTab === "permit_portals" && (
            <div className="space-y-6">
              
              {/* How it works banner */}
              <div className="p-5 rounded-2xl bg-neutral-950 border border-amber-500/30 shadow-xl space-y-3">
                <div className="flex items-center space-x-2 text-amber-400 font-mono text-xs font-bold uppercase tracking-wider">
                  <Flame className="w-4 h-4 text-rose-400" />
                  <span>The "Permit Portal" Secret: Instant Urgent Clients</span>
                </div>
                <h3 className="text-base font-bold text-neutral-100">
                  How to find architects actively desperate for drawing support right now:
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs text-neutral-300">
                  <div className="p-3 rounded-xl bg-neutral-900/80 border border-neutral-800">
                    <span className="font-mono text-amber-400 font-bold block mb-1">STEP 1</span>
                    Click on any municipal building department below (e.g. Austin, LA, Miami).
                  </div>
                  <div className="p-3 rounded-xl bg-neutral-900/80 border border-neutral-800">
                    <span className="font-mono text-amber-400 font-bold block mb-1">STEP 2</span>
                    Filter permits by status: <strong>"Corrections Required"</strong> or <strong>"Plan Check Revision"</strong>.
                  </div>
                  <div className="p-3 rounded-xl bg-neutral-900/80 border border-neutral-800">
                    <span className="font-mono text-amber-400 font-bold block mb-1">STEP 3</span>
                    Open the permit record and look up the <strong>Applicant / Architect</strong> contact.
                  </div>
                  <div className="p-3 rounded-xl bg-neutral-900/80 border border-neutral-800">
                    <span className="font-mono text-amber-400 font-bold block mb-1">STEP 4</span>
                    Switch to Tab 1, select <strong>"Plan Check Emergency"</strong>, and send your offer to fix their redlines!
                  </div>
                </div>
              </div>

              {/* Portals Directory */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {MUNICIPAL_PORTALS.map((portal, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 hover:border-neutral-700 transition-all flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                          {portal.city}, {portal.state}
                        </span>
                        <span className="text-[10px] font-mono text-neutral-500">
                          Live Portal
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-neutral-100">
                        {portal.name}
                      </h4>
                      <div className="inline-flex items-center space-x-1 px-2 py-1 rounded bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[11px] font-mono">
                        <span>Search filter: </span>
                        <span className="font-bold">"{portal.planCheckKeyword}"</span>
                      </div>
                      <p className="text-xs text-neutral-400 leading-relaxed">
                        {portal.notes}
                      </p>
                    </div>

                    <a
                      href={portal.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-200 text-xs font-semibold flex items-center justify-center space-x-1.5 border border-neutral-800 transition-all group cursor-pointer"
                    >
                      <span>Open City Portal</span>
                      <ExternalLink className="w-3.5 h-3.5 text-neutral-400 group-hover:text-amber-400 transition-colors" />
                    </a>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* TAB 3: LINKEDIN PROSPECT SEARCH BUILDER */}
          {activeTab === "linkedin_finder" && (
            <div className="space-y-6">
              
              <div className="p-5 rounded-2xl bg-gradient-to-r from-sky-950/40 to-neutral-950 border border-sky-500/30 space-y-2">
                <div className="flex items-center space-x-2 text-sky-400 font-mono text-xs font-bold uppercase tracking-wider">
                  <Linkedin className="w-4 h-4" />
                  <span>Targeted Decision-Maker Search Strings</span>
                </div>
                <h3 className="text-base font-bold text-neutral-100">
                  Target Studio Directors & Production Principals on LinkedIn
                </h3>
                <p className="text-xs text-neutral-300 leading-relaxed max-w-2xl">
                  Junior architects can't hire contractors. You must message <strong className="text-white">Principals, Studio Directors, or BIM Managers</strong> at firms with 3 to 20 people who feel the daily pain of production bottlenecks.
                </p>
              </div>

              {/* Boolean Query Customizer */}
              <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-4">
                <span className="block text-xs font-mono font-semibold text-sky-400 uppercase tracking-wider">
                  Target Criteria
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-neutral-400 mb-1">
                      Job Titles (Boolean OR)
                    </label>
                    <select
                      value={linkedinRole}
                      onChange={(e) => setLinkedinRole(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-neutral-200 focus:outline-none focus:border-sky-500"
                    >
                      <option value='"Principal Architect" OR "Studio Director"'>
                        Principal Architect OR Studio Director
                      </option>
                      <option value='"BIM Manager" OR "Director of Production"'>
                        BIM Manager OR Director of Production
                      </option>
                      <option value='"Design-Build Contractor" OR "Custom Home Builder"'>
                        Design-Build Contractor OR Builder
                      </option>
                      <option value='"Project Architect" AND "Permit"'>
                        Project Architect (Permit sets)
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-neutral-400 mb-1">
                      Target Geography
                    </label>
                    <select
                      value={linkedinRegion}
                      onChange={(e) => setLinkedinRegion(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-neutral-200 focus:outline-none focus:border-sky-500"
                    >
                      <option value="United States">United States (National)</option>
                      <option value="Austin, Texas">Austin, Texas Area</option>
                      <option value="Los Angeles, California">Los Angeles, California</option>
                      <option value="Miami-Fort Lauderdale">Miami / South Florida</option>
                      <option value="London, United Kingdom">London, United Kingdom</option>
                      <option value="Toronto, Canada">Toronto, Canada Area</option>
                      <option value="Sydney, Australia">Sydney, Australia</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-neutral-400 mb-1">
                      Launch Search
                    </label>
                    <a
                      href={buildLinkedInUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2 px-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold flex items-center justify-center space-x-1.5 transition-all shadow-md shadow-sky-600/20 cursor-pointer"
                    >
                      <Linkedin className="w-3.5 h-3.5 fill-white" />
                      <span>Execute LinkedIn Search</span>
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                  </div>
                </div>

                {/* Query Preview & Specialist Profile */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-3 rounded-xl bg-neutral-900 border border-neutral-800">
                  <div className="font-mono text-xs text-sky-300">
                    Search Query: {linkedinRole} "{linkedinRegion}"
                  </div>
                  <a
                    href={specialist.socials?.linkedin || "https://www.linkedin.com/in/arslan-qaiser-947976188/"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-sky-400 hover:text-sky-300 flex items-center space-x-1 shrink-0"
                  >
                    <Linkedin className="w-3.5 h-3.5" />
                    <span>View Arslan Qaiser's LinkedIn</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Professional Directories */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3">
                  <div className="flex items-center space-x-2 text-amber-400">
                    <Building2 className="w-5 h-5" />
                    <h4 className="font-bold text-sm text-neutral-100">AIA Member Firm Finder</h4>
                  </div>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Search licensed American Institute of Architects (AIA) member practices by state and metro area. Small firms with 1 to 5 partners represent prime overflow candidates.
                  </p>
                  <a
                    href="https://www.aia.org/find-an-architect"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1.5 text-xs text-amber-400 hover:text-amber-300 font-semibold"
                  >
                    <span>Browse AIA Firm Directory</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3">
                  <div className="flex items-center space-x-2 text-emerald-400">
                    <Compass className="w-5 h-5" />
                    <h4 className="font-bold text-sm text-neutral-100">Houzz Pro Architects & Remodelers</h4>
                  </div>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    High-volume residential design-build contractors and architects who actively post ongoing projects. Find firms actively managing multiple active construction permits.
                  </p>
                  <a
                    href="https://www.houzz.com/professionals/architects-and-building-designers"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-semibold"
                  >
                    <span>Browse Houzz Architect Listings</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

            </div>
          )}

          {/* TAB 4: ZERO-RISK PILOT AGREEMENT */}
          {activeTab === "pilot_agreement" && (
            <div className="space-y-6">
              
              <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 to-neutral-950 border border-emerald-500/30 space-y-2">
                <div className="flex items-center space-x-2 text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4" />
                  <span>The Objection Eliminator: Zero-Risk Trial Document</span>
                </div>
                <h3 className="text-base font-bold text-neutral-100">
                  Ready-to-Send 1-Sheet Pilot Proposal Template
                </h3>
                <p className="text-xs text-neutral-300 leading-relaxed max-w-2xl">
                  When an architect says "We already have drafters" or "How do I know your quality?", send this 1-page terms sheet. It guarantees their IP rights, establishes your $38/hr baseline, and proves your speed before they spend a dollar.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="block text-xs font-mono font-semibold text-neutral-400 uppercase tracking-wider">
                    Pilot Scope Sheet (Copy & Paste into Email or PDF)
                  </span>

                  <button
                    onClick={handleCopyAgreement}
                    className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer shadow-sm shadow-emerald-600/20"
                  >
                    {copiedAgreement ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Copied Agreement!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Pilot Agreement</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="p-4 sm:p-6 rounded-2xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-300 font-mono leading-relaxed whitespace-pre-wrap select-all">
                  {pilotAgreementText}
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-neutral-800 bg-neutral-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          <div className="flex items-center space-x-2 text-xs text-neutral-400 font-mono">
            <CheckCircle2 className="w-4 h-4 text-amber-400" />
            <span>Quintessential Architecture Lead Acquisition Engine • Arslan Qaiser Active</span>
          </div>

          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold transition-all shadow-md shadow-amber-500/20 cursor-pointer"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
