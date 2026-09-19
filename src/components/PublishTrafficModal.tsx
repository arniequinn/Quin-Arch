import React, { useState } from "react";
import { 
  X, 
  Share2, 
  Copy, 
  Check, 
  ExternalLink, 
  Globe, 
  MessageSquare, 
  Send, 
  QrCode, 
  Sparkles, 
  ArrowRight,
  Instagram,
  Linkedin,
  Twitter,
  FileCheck2,
  TrendingUp,
  Award,
  Target
} from "lucide-react";
import { SpecialistProfile } from "../types";

interface PublishTrafficModalProps {
  isOpen: boolean;
  onClose: () => void;
  specialist: SpecialistProfile;
  onOpenLeadFinder?: () => void;
}

export const PublishTrafficModal: React.FC<PublishTrafficModalProps> = ({
  isOpen,
  onClose,
  specialist,
  onOpenLeadFinder,
}) => {
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);

  if (!isOpen) return null;

  // The published/shared app URL or current origin
  const liveAppUrl = 
    window.location.origin.includes("localhost") || window.location.origin.includes("3000")
      ? "https://ais-pre-6j6p4r7c3aelnybx2twern-259039156788.asia-southeast1.run.app"
      : window.location.href;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(liveAppUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2500);
  };

  const handleCopySnippet = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSnippet(id);
    setTimeout(() => setCopiedSnippet(null), 2500);
  };

  // Pre-formatted traffic hooks targeting remote architectural BIM services
  const upworkProposalSnippet = 
    `Rather than rough guesswork, I put together an interactive Scope & Fee Estimator for clients seeking remote architectural BIM services. ` +
    `You can calculate your exact municipal permit sheet counts (IBC/IRC/Title 24), Revit 3D BIM (LOD 200-400) turnaround times, and inspect my authentic drawing sets here: ${liveAppUrl}`;

  const instagramBioSnippet = 
    `🏛️ Remote Architectural BIM Services & CAD Permitting\n` +
    `📐 Autodesk Revit 3D Modeling (LOD 200-400) • NCA Distinction\n` +
    `⚡ Free ArchScope & Fee Estimator: ${liveAppUrl}`;

  const linkedinPostSnippet = 
    `Architects, Engineers & General Contractors: Need scalable remote architectural BIM services without the in-house payroll overhead?\n\n` +
    `I've launched the ArchScope Estimator at Quintessential Architecture. ` +
    `Input your project type and square footage to instantly compute recommended drawing sheet counts, Revit LOD 200–400 turnaround schedules, and code-compliance checklists (IBC/IRC/Title 24).\n\n` +
    `Explore the live estimator & client drawing vault: ${liveAppUrl}`;

  const whatsappShareText = encodeURIComponent(
    `Hi! Need professional remote architectural BIM services, code-compliant CAD permit sets, or Revit 3D modeling? ` +
    `Calculate your project scope in 60 seconds with our interactive ArchScope Estimator: ${liveAppUrl}`
  );

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(liveAppUrl)}&color=245-158-11&bgcolor=15-15-15`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-neutral-950/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-neutral-100">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-neutral-800 bg-neutral-950 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <Share2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base sm:text-lg font-bold text-neutral-100 tracking-tight">
                  Publish & Client Traffic Acquisition Hub
                </h2>
                <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[11px] font-bold">
                  LIVE READY
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">
                Share your interactive lead magnet to drive high-converting inquiries to WhatsApp and your inbox.
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

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-8">
          
          {/* Proactive Client Lead Finder Callout */}
          {onOpenLeadFinder && (
            <div className="p-5 rounded-2xl bg-gradient-to-r from-neutral-950 via-amber-950/30 to-neutral-950 border border-amber-500/40 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-mono text-[10px] font-bold uppercase tracking-wider">
                    NEW FEATURE
                  </span>
                  <h3 className="text-sm font-bold text-neutral-100">
                    Proactive Client Lead Finder & Outreach Engine
                  </h3>
                </div>
                <p className="text-xs text-neutral-400 max-w-xl">
                  Don't wait for clients to stumble upon your link. Generate tailored cold pitches, explore live municipal permit portals (Austin, LA, Miami, NYC), and search LinkedIn decision-makers.
                </p>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onOpenLeadFinder();
                }}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-bold text-xs shadow-lg shadow-amber-500/20 flex items-center justify-center space-x-2 shrink-0 transition-all cursor-pointer"
              >
                <Target className="w-4 h-4" />
                <span>Launch Lead Engine</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Live Link Callout Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-950/40 via-neutral-950 to-neutral-900 border border-amber-500/30 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-mono text-amber-400 font-bold uppercase tracking-wider block">
                  Public Live Destination URL
                </span>
                <p className="text-xs text-neutral-300 mt-0.5">
                  Anyone with this link can calculate project scopes, view your drawing sets, and book drafting jobs with you directly.
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <a
                  href={liveAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold flex items-center space-x-1.5 border border-neutral-700 transition-all"
                >
                  <span>Open Live Site</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  onClick={handleCopyUrl}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold flex items-center space-x-1.5 shadow-md shadow-amber-500/20 transition-all cursor-pointer"
                >
                  {copiedUrl ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Link</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* URL Display Bar */}
            <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 font-mono text-xs text-amber-300 break-all select-all flex items-center justify-between">
              <span>{liveAppUrl}</span>
            </div>
          </div>

          {/* Rapid Traffic Channels & Proposal Hooks */}
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400 font-mono flex items-center space-x-2">
                <TrendingUp className="w-4 h-4" />
                <span>Copy-and-Paste Traffic Acquisition Playbook</span>
              </h3>
              <p className="text-xs text-neutral-400 mt-1">
                Deploy these high-converting hooks across your platforms to channel warm clients into your pipeline:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Upwork / Freelancer Proposal Hook */}
              <div className="p-5 rounded-2xl bg-neutral-950/80 border border-neutral-800 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-500/10 text-blue-400 border border-blue-500/30">
                      Upwork & Freelancer Proposals
                    </span>
                    <button
                      onClick={() => handleCopySnippet(upworkProposalSnippet, "upwork")}
                      className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center space-x-1 cursor-pointer"
                    >
                      {copiedSnippet === "upwork" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedSnippet === "upwork" ? "Copied" : "Copy Snippet"}</span>
                    </button>
                  </div>
                  <p className="text-xs text-neutral-300 mt-2 bg-neutral-900 p-3 rounded-xl border border-neutral-800 italic leading-relaxed">
                    "{upworkProposalSnippet}"
                  </p>
                </div>
                <p className="text-[11px] text-neutral-500">
                  ⚡ Paste at the conclusion of your job bids. Dramatically increases response rates by showing tangible interactive tools.
                </p>
              </div>

              {/* Instagram @quin_arch Bio Hook */}
              <div className="p-5 rounded-2xl bg-neutral-950/80 border border-neutral-800 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/30">
                      Instagram Bio & Stories (@quin_arch)
                    </span>
                    <button
                      onClick={() => handleCopySnippet(instagramBioSnippet, "instagram")}
                      className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center space-x-1 cursor-pointer"
                    >
                      {copiedSnippet === "instagram" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedSnippet === "instagram" ? "Copied" : "Copy Bio"}</span>
                    </button>
                  </div>
                  <pre className="text-xs text-neutral-300 mt-2 bg-neutral-900 p-3 rounded-xl border border-neutral-800 whitespace-pre-wrap font-sans leading-relaxed">
                    {instagramBioSnippet}
                  </pre>
                </div>
                <p className="text-[11px] text-neutral-500">
                  ⚡ Direct your social followers directly to the calculator to generate instant WhatsApp leads.
                </p>
              </div>

              {/* LinkedIn Post Hook */}
              <div className="p-5 rounded-2xl bg-neutral-950/80 border border-neutral-800 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-sky-500/10 text-sky-400 border border-sky-500/30">
                      LinkedIn & Developer Outreach
                    </span>
                    <button
                      onClick={() => handleCopySnippet(linkedinPostSnippet, "linkedin")}
                      className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center space-x-1 cursor-pointer"
                    >
                      {copiedSnippet === "linkedin" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedSnippet === "linkedin" ? "Copied" : "Copy Post"}</span>
                    </button>
                  </div>
                  <p className="text-xs text-neutral-300 mt-2 bg-neutral-900 p-3 rounded-xl border border-neutral-800 italic leading-relaxed">
                    "{linkedinPostSnippet}"
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
                  <p className="text-[11px] text-neutral-500">
                    ⚡ Perfect for sharing with developers, general contractors, and design studios.
                  </p>
                  <a
                    href={specialist.socials?.linkedin || "https://www.linkedin.com/in/arslan-qaiser-947976188/"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-sky-400 hover:text-sky-300 flex items-center space-x-1.5 shrink-0"
                  >
                    <Linkedin className="w-3.5 h-3.5" />
                    <span>Arslan Qaiser LinkedIn Profile</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Direct WhatsApp Broadcast */}
              <div className="p-5 rounded-2xl bg-neutral-950/80 border border-neutral-800 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      Direct WhatsApp Broadcast
                    </span>
                    <a
                      href={`https://wa.me/?text=${whatsappShareText}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center space-x-1 cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Send to Contacts</span>
                    </a>
                  </div>
                  <p className="text-xs text-neutral-300 mt-2 bg-neutral-900 p-3 rounded-xl border border-neutral-800 leading-relaxed">
                    Broadcast your new interactive scope calculator directly to your contractor, engineer, and client network on WhatsApp.
                  </p>
                </div>
                <a
                  href={`https://wa.me/?text=${whatsappShareText}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center space-x-2 transition-all"
                >
                  <MessageSquare className="w-4 h-4 fill-white/20" />
                  <span>Open WhatsApp Broadcast</span>
                </a>
              </div>

            </div>
          </div>

          {/* Scannable Mobile QR Code Card */}
          <div className="p-6 rounded-2xl bg-neutral-950 border border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="text-[11px] font-mono text-amber-400 font-bold uppercase tracking-wider block">
                Field & In-Person Traffic: Instant QR Code
              </span>
              <h4 className="text-base font-bold text-neutral-100">
                Instant Mobile Scan for Site Visits & Meetings
              </h4>
              <p className="text-xs text-neutral-400 max-w-md leading-relaxed">
                Scan with any smartphone camera to open the ArchScope tool instantly. Add this QR code to your PDF drawing title blocks, email signature, or digital business cards.
              </p>
              <div className="pt-2 flex items-center space-x-2">
                <a
                  href={qrCodeUrl}
                  download="archscope-qr.png"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-200 text-xs font-semibold border border-neutral-800 flex items-center space-x-1.5 transition-all"
                >
                  <QrCode className="w-3.5 h-3.5 text-amber-400" />
                  <span>Download High-Res QR Code</span>
                </a>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-neutral-900 border border-neutral-800 shrink-0 shadow-lg">
              <img
                src={qrCodeUrl}
                alt="Scan to launch ArchScope"
                className="w-36 h-36 rounded-xl object-contain"
              />
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-neutral-800 bg-neutral-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          <div className="flex items-center space-x-2 text-xs text-neutral-400 font-mono">
            <Award className="w-4 h-4 text-emerald-400" />
            <span>Dual-Agent Verified (9.4/10) • WhatsApp: +92 322 4316477 Active</span>
          </div>

          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold transition-all shadow-md shadow-amber-500/20 cursor-pointer"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
