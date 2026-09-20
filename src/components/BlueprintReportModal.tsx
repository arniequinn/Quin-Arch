import React, { useRef } from "react";
import { 
  X, 
  Printer, 
  Share2, 
  Download, 
  MessageSquare, 
  Mail, 
  CheckCircle2, 
  Clock, 
  Layers, 
  FileCheck, 
  Building, 
  Compass, 
  ArrowRight,
  ShieldCheck,
  Check
} from "lucide-react";
import { ArchitecturalBlueprint, SpecialistProfile } from "../types";
import { ScopeCalculationInput, ScopeCalculationResult } from "../utils/calculator";

interface BlueprintReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  blueprint: ArchitecturalBlueprint;
  input: ScopeCalculationInput;
  calculation: ScopeCalculationResult;
  leadData: { name: string; email: string; phone?: string; firmOrRole: string; customNotes?: string; projectFilesLink?: string };
  specialist: SpecialistProfile;
}

export const BlueprintReportModal: React.FC<BlueprintReportModalProps> = ({
  isOpen,
  onClose,
  blueprint,
  input,
  calculation,
  leadData,
  specialist,
}) => {
  const printRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  // Pre-formatted WhatsApp message
  const whatsappText = encodeURIComponent(
    `Hi ${specialist.name}, I just configured my project blueprint on ArchScope!\n\n` +
    `• Project: ${input.projectTitle || "Architecture Project"} (${input.areaSqFt} sq ft)\n` +
    `• Role: ${leadData.firmOrRole} (${leadData.name})\n` +
    `• Contact: ${leadData.email}${leadData.phone ? " / " + leadData.phone : ""}\n` +
    `• Estimated Scope: ${calculation.recommendedSheetsCount} Sheets (~${calculation.estimatedTurnaroundDays} Days)\n` +
    `• Estimated Fee: $${calculation.estimatedFeeMin} - $${calculation.estimatedFeeMax}\n` +
    (leadData.projectFilesLink ? `• Project Files: ${leadData.projectFilesLink}\n` : "") +
    (leadData.customNotes ? `• Notes: ${leadData.customNotes}\n` : "") +
    `\nI'd like to discuss kicking off remote drafting/BIM production with you!`
  );

  const whatsappUrl = `https://wa.me/${specialist.whatsapp.replace(/[^0-9]/g, "")}?text=${whatsappText}`;

  // Pre-formatted mailto link
  const mailtoUrl = `mailto:${specialist.email}?subject=${encodeURIComponent(
    `Architectural Project Scope: ${input.projectTitle || "New Project"} - ${leadData.name}`
  )}&body=${encodeURIComponent(
    `Hi ${specialist.name},\n\nI just generated an Architectural Scope & Blueprint for my project:\n\n` +
    `Project: ${input.projectTitle || "Architecture Project"}\n` +
    `Area: ${input.areaSqFt} sq ft\n` +
    `Services: ${input.selectedServiceIds.join(", ")}\n` +
    `Client: ${leadData.name} (${leadData.email}, ${leadData.firmOrRole})\n` +
    `Estimated Scope: ${calculation.recommendedSheetsCount} Sheets (~${calculation.estimatedTurnaroundDays} Days)\n` +
    (leadData.projectFilesLink ? `Project Files: ${leadData.projectFilesLink}\n` : "") +
    (leadData.customNotes ? `Notes: ${leadData.customNotes}\n` : "") +
    `\nPlease let me know your availability for a kick-off review.\n\nBest regards,\n${leadData.name}`
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-neutral-950/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div 
        ref={printRef}
        className="relative w-full max-w-4xl rounded-2xl bg-neutral-900 border border-neutral-800 shadow-2xl my-8 overflow-hidden text-neutral-100 print:bg-white print:text-black print:border-none print:shadow-none print:m-0 print:max-w-none"
      >
        {/* Top Control Bar (Hidden in Print) */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950 print:hidden">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold text-neutral-300 font-mono">
              SPECIFICATION GENERATED • REF #ARC-{Date.now().toString().slice(-6)}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium border border-neutral-700 flex items-center space-x-1.5 transition-all cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-amber-400" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Blueprint Container */}
        <div className="p-6 sm:p-8 space-y-8 max-h-[80vh] overflow-y-auto print:max-h-none print:overflow-visible">
          
          {/* Architectural Title Block Banner */}
          <div className="p-5 rounded-xl bg-neutral-950 border-2 border-neutral-800 print:border-black print:bg-transparent relative">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold shrink-0 print:border-black print:text-black">
                  <Compass className="w-7 h-7" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-mono tracking-widest text-amber-400 font-semibold print:text-neutral-600">
                    ARCHITECTURAL EXECUTION BLUEPRINT & SPECIFICATION
                  </span>
                  <h2 className="text-2xl font-extrabold text-neutral-100 print:text-black tracking-tight">
                    {input.projectTitle || "Custom Architectural Project"}
                  </h2>
                  <p className="text-xs text-neutral-400 print:text-neutral-700 mt-0.5">
                    Prepared for <span className="text-neutral-200 print:text-black font-semibold">{leadData.name}</span> • {leadData.firmOrRole} • {input.areaSqFt.toLocaleString()} SQ FT
                  </p>
                </div>
              </div>

              {/* Architectural Stamp Badge */}
              <div className="text-right border-l-2 md:border-l border-neutral-800 pl-4 print:border-black">
                <div className="inline-block border-2 border-amber-500/60 rounded px-3 py-1 font-mono text-center print:border-black">
                  <div className="text-[9px] uppercase tracking-wider text-amber-400 print:text-black font-bold">
                    DIGITAL SPECIFICATION
                  </div>
                  <div className="text-xs font-bold text-neutral-100 print:text-black">
                    LOD 300 / 400 READY
                  </div>
                  <div className="text-[8px] text-neutral-500 font-mono">
                    {new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Scope & Fee Snapshot */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-neutral-950/60 border border-neutral-800 print:border-neutral-300">
              <span className="text-[11px] text-neutral-400 block">Drawing Volume</span>
              <span className="text-xl font-mono font-bold text-neutral-100 print:text-black">
                {blueprint.recommendedDrawingSet?.length || calculation.recommendedSheetsCount} Sheets
              </span>
              <span className="text-[10px] text-neutral-500 block">A-001 through A-601</span>
            </div>

            <div className="p-3.5 rounded-xl bg-neutral-950/60 border border-neutral-800 print:border-neutral-300">
              <span className="text-[11px] text-neutral-400 block">Turnaround</span>
              <span className="text-xl font-mono font-bold text-neutral-100 print:text-black">
                ~{calculation.estimatedTurnaroundDays} Days
              </span>
              <span className="text-[10px] text-neutral-500 block">Milestone Delivery</span>
            </div>

            <div className="p-3.5 rounded-xl bg-neutral-950/60 border border-neutral-800 print:border-neutral-300">
              <span className="text-[11px] text-neutral-400 block">Remote Production Fee</span>
              <span className="text-xl font-mono font-bold text-amber-400 print:text-black">
                ${calculation.estimatedFeeMin} - ${calculation.estimatedFeeMax}
              </span>
              <span className="text-[10px] text-neutral-500 block">Fixed-fee Turnkey</span>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 print:border-neutral-300 print:bg-transparent">
              <span className="text-[11px] text-emerald-400 print:text-neutral-700 block">Client Savings</span>
              <span className="text-xl font-mono font-bold text-emerald-300 print:text-black">
                ~${calculation.clientSavingsAmount.toLocaleString()}
              </span>
              <span className="text-[10px] text-emerald-500/80 block">{calculation.savingsPercentage}% vs in-house staff</span>
            </div>
          </div>

          {/* Executive Summary */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 print:text-black mb-2 flex items-center space-x-1.5">
              <Building className="w-3.5 h-3.5" />
              <span>1. Executive Architectural Strategy</span>
            </h4>
            <p className="text-xs sm:text-sm text-neutral-300 print:text-black leading-relaxed p-4 rounded-xl bg-neutral-950/40 border border-neutral-800/80 print:border-neutral-200">
              {blueprint.executiveSummary}
            </p>
          </div>

          {/* Recommended Drawing Sheet Schedule (The Meat of the Blueprint!) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 print:text-black flex items-center space-x-1.5">
                <Layers className="w-3.5 h-3.5" />
                <span>2. Recommended Drawing Sheet Schedule ({blueprint.recommendedDrawingSet?.length || 0} Sheets)</span>
              </h4>
              <span className="text-[11px] text-neutral-500 font-mono hidden sm:inline">
                Standard Arch D (24&quot; x 36&quot;) / ANSI D Layout
              </span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-neutral-800 print:border-black">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-950 border-b border-neutral-800 text-neutral-400 font-mono print:bg-neutral-100 print:text-black">
                  <tr>
                    <th className="px-3 py-2.5 w-24">Sheet #</th>
                    <th className="px-3 py-2.5">Drawing Title</th>
                    <th className="px-3 py-2.5 hidden md:table-cell">Technical Scope & Details</th>
                    <th className="px-3 py-2.5 text-right w-24">BIM Level</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60 print:divide-neutral-300">
                  {blueprint.recommendedDrawingSet?.map((sheet) => (
                    <tr key={sheet.sheetNumber} className="hover:bg-neutral-950/40">
                      <td className="px-3 py-2 font-mono font-bold text-amber-400 print:text-black">
                        {sheet.sheetNumber}
                      </td>
                      <td className="px-3 py-2 font-semibold text-neutral-200 print:text-black">
                        {sheet.sheetTitle}
                      </td>
                      <td className="px-3 py-2 text-neutral-400 print:text-neutral-700 hidden md:table-cell text-[11px]">
                        {sheet.description}
                      </td>
                      <td className="px-3 py-2 text-right font-mono text-[11px] text-neutral-400 print:text-black">
                        {sheet.revitLOD || "LOD 300"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Technical Specs & Software Stack */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-neutral-950/40 border border-neutral-800/80 print:border-neutral-300">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 print:text-black mb-2 flex items-center space-x-1.5">
                <FileCheck className="w-3.5 h-3.5" />
                <span>3. CAD & BIM Delivery Formats</span>
              </h4>
              <div className="space-y-1.5 text-xs text-neutral-300 print:text-black">
                <div className="text-[11px] text-neutral-400">
                  <span className="font-semibold text-neutral-200 print:text-black">CAD/BIM Standard: </span>
                  {blueprint.bimAndTechnicalSpecs?.bimStandard || "AIA Layering Standard / US National CAD"}
                </div>
                <div className="text-[11px] text-neutral-400">
                  <span className="font-semibold text-neutral-200 print:text-black">Primary Software: </span>
                  {blueprint.bimAndTechnicalSpecs?.recommendedSoftware || "Autodesk Revit 2024 / AutoCAD"}
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {(blueprint.bimAndTechnicalSpecs?.deliveryFormats || calculation.techStack).map((fmt) => (
                    <span
                      key={fmt}
                      className="px-2 py-0.5 rounded bg-neutral-900 border border-neutral-700 text-[10px] font-mono text-neutral-300 print:border-black print:text-black"
                    >
                      {fmt}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Phased Milestone Schedule */}
            <div className="p-4 rounded-xl bg-neutral-950/40 border border-neutral-800/80 print:border-neutral-300">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 print:text-black mb-2 flex items-center space-x-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>4. Phased Milestone Execution</span>
              </h4>
              <div className="space-y-2 text-xs">
                {blueprint.phasingMilestones?.map((phase, idx) => (
                  <div key={idx} className="flex items-start space-x-2">
                    <span className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 print:border print:border-black print:text-black">
                      {idx + 1}
                    </span>
                    <div>
                      <span className="font-semibold text-neutral-200 print:text-black">
                        {phase.phase} (~{phase.durationDays} days)
                      </span>
                      <p className="text-[11px] text-neutral-400 print:text-neutral-700">
                        {phase.deliverables}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Municipal Code & Permit Compliance Checklist */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 print:text-black mb-2 flex items-center space-x-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>5. Building Code & Permit Compliance Considerations</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {(blueprint.permitAndCodeChecklist || calculation.permitNotes).map((item, i) => (
                <div
                  key={i}
                  className="p-2.5 rounded-lg bg-neutral-950/50 border border-neutral-800 flex items-start space-x-2 print:border-neutral-200"
                >
                  <Check className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5 print:text-black" />
                  <span className="text-neutral-300 print:text-black text-[11px] leading-relaxed">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Specialist Contact & Immediate Booking CTA Bar (Hidden in Print) */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-500/15 via-amber-500/5 to-transparent border border-amber-500/40 print:hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                  Ready to initiate drafting or modeling?
                </span>
                <h3 className="text-lg font-bold text-neutral-100 mt-0.5">
                  Book a 15-Min Scope Call with {specialist.name}
                </h3>
                <p className="text-xs text-neutral-400 mt-1 max-w-lg leading-relaxed">
                  Send your project sketches, CAD survey, or point-cloud file directly to get a finalized
                  firm-price agreement and kickoff within 24 hours.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                <a
                  id="whatsapp-proposal-cta"
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs sm:text-sm flex items-center space-x-1.5 shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>WhatsApp with this Scope</span>
                </a>

                <a
                  id="email-proposal-cta"
                  href={mailtoUrl}
                  className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-100 font-semibold text-xs sm:text-sm border border-neutral-700 flex items-center space-x-1.5 transition-all cursor-pointer"
                >
                  <Mail className="w-4 h-4 text-amber-400" />
                  <span>Email Direct Proposal</span>
                </a>
              </div>
            </div>
          </div>

          {/* Footer note */}
          <div className="text-center pt-2 text-[11px] text-neutral-500 print:text-neutral-600">
            ArchScope Specification Engine • Delivered by {specialist.name} ({specialist.title}) • {specialist.email}
          </div>

        </div>
      </div>
    </div>
  );
};
