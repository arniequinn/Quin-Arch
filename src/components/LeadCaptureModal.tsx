import React, { useState } from "react";
import { X, Lock, Sparkles, CheckCircle2, ArrowRight, ShieldCheck, Loader2, Link2, FolderUp } from "lucide-react";
import { ScopeCalculationInput, ScopeCalculationResult } from "../utils/calculator";
import { ArchitecturalBlueprint } from "../types";
import { saveLeadToFirestore } from "../lib/firebase";

interface LeadCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  input: ScopeCalculationInput;
  calculation: ScopeCalculationResult;
  onBlueprintGenerated: (blueprint: ArchitecturalBlueprint, leadData: { name: string; email: string; phone?: string; firmOrRole: string }) => void;
}

export const LeadCaptureModal: React.FC<LeadCaptureModalProps> = ({
  isOpen,
  onClose,
  input,
  calculation,
  onBlueprintGenerated,
}) => {
  const [clientName, setClientName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [firmOrRole, setFirmOrRole] = useState("Architectural Firm / Drafter");
  const [customNotes, setCustomNotes] = useState("");
  const [projectFilesLink, setProjectFilesLink] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !email.trim()) {
      setErrorMessage("Please enter both your name and email to receive the blueprint.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      // 1. Call AI Analysis Endpoint
      let generatedBlueprint: ArchitecturalBlueprint | null = null;
      try {
        const response = await fetch("/api/ai/analyze-project", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            projectTitle: input.projectTitle,
            projectType: input.projectTypeId,
            services: input.selectedServiceIds,
            areaSqFt: input.areaSqFt,
            locationJurisdiction: input.jurisdictionId,
            currentStage: input.currentStageId,
            timeline: input.timelineId,
            customNotes,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.blueprint) {
            generatedBlueprint = data.blueprint;
          }
        }
      } catch (aiErr) {
        console.warn("AI generation fallback to algorithmic blueprint:", aiErr);
      }

      // If AI didn't return (e.g. offline), synthesize from calculation
      if (!generatedBlueprint) {
        const { buildCompleteBlueprint } = await import("../utils/calculator");
        generatedBlueprint = buildCompleteBlueprint(input, calculation);
      }

      // 2. Store the captured lead in server database & Firebase Firestore
      const leadId = "lead_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7);
      const leadPayload = {
        id: leadId,
        createdAt: new Date().toISOString(),
        clientName,
        email,
        phone,
        firmOrRole,
        projectTitle: input.projectTitle || "Architectural Project",
        projectType: input.projectTypeId,
        services: input.selectedServiceIds,
        areaSqFt: input.areaSqFt,
        locationJurisdiction: input.jurisdictionId,
        currentStage: input.currentStageId,
        timeline: input.timelineId,
        customNotes,
        projectFilesLink: projectFilesLink.trim() || undefined,
        estimatedFeeRange: {
          min: calculation.estimatedFeeMin,
          max: calculation.estimatedFeeMax,
        },
        estimatedTurnaroundDays: calculation.estimatedTurnaroundDays,
        recommendedSheetsCount: calculation.recommendedSheetsCount,
        generatedBlueprint,
        status: "new" as const,
      };

      // Save to Firebase Firestore
      try {
        await saveLeadToFirestore(leadPayload);
      } catch (firestoreErr) {
        console.warn("Firestore lead direct save note:", firestoreErr);
      }

      // Store in Express server database
      try {
        await fetch("/api/leads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(leadPayload),
        });
      } catch (leadSaveErr) {
        console.warn("Lead save error:", leadSaveErr);
      }

      // 3. Callback to show the unlocked Blueprint
      onBlueprintGenerated(generatedBlueprint, {
        name: clientName,
        email,
        phone,
        firmOrRole,
      });

    } catch (err: any) {
      console.error("Submission error:", err);
      setErrorMessage("Something went wrong while generating the blueprint. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl bg-neutral-900 border border-neutral-800 shadow-2xl p-6 sm:p-8 text-neutral-100 overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ready for Instant Generation</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-100">
            Unlock Your Project Blueprint & Stamped Specification
          </h3>
          <p className="text-xs text-neutral-400 mt-1.5 leading-relaxed">
            Where should we deliver your custom drawing sheet list ({calculation.recommendedSheetsCount} sheets), 
            estimated turnaround schedule, and turnkey remote quote?
          </p>
        </div>

        {/* Value Highlights */}
        <div className="grid grid-cols-2 gap-2 mb-6 p-3 rounded-xl bg-neutral-950/80 border border-neutral-800/80 text-[11px] text-neutral-300">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Full Sheet Schedule (A-001 - A-601)</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Code & Permit Checklist</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Revit/CAD Tech Delivery Spec</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Printable Stamped PDF Report</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMessage && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium">
              {errorMessage}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1">
              Your Name *
            </label>
            <input
              type="text"
              required
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="e.g. Marcus Vance"
              className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-700 text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1">
              Work Email Address *
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-700 text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                Your Role / Firm Type
              </label>
              <select
                value={firmOrRole}
                onChange={(e) => setFirmOrRole(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-neutral-950 border border-neutral-700 text-xs text-neutral-100 focus:outline-none focus:border-amber-500"
              >
                <option value="Architectural Firm / Drafter">Architectural Firm / Drafter</option>
                <option value="General Contractor / Builder">General Contractor / Builder</option>
                <option value="Property Developer">Real Estate Developer</option>
                <option value="Interior Designer">Interior Design Studio</option>
                <option value="Homeowner / Property Owner">Homeowner / Owner-Builder</option>
                <option value="Engineer / Consultant">Structural / MEP Consultant</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                Phone / WhatsApp (Optional)
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. +1 (415) 890-4122"
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-700 text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1">
              Specific Project Notes (Optional)
            </label>
            <textarea
              rows={2}
              value={customNotes}
              onChange={(e) => setCustomNotes(e.target.value)}
              placeholder="e.g., Need 2nd story addition with structural beam callouts, fast permit filing..."
              className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1 flex items-center justify-between">
              <span className="flex items-center space-x-1.5">
                <Link2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Project Files / Redlines / Survey Link (Optional)</span>
              </span>
              <span className="text-[10px] text-neutral-400">Dropbox, Drive, OneDrive, WeTransfer</span>
            </label>
            <input
              type="url"
              value={projectFilesLink}
              onChange={(e) => setProjectFilesLink(e.target.value)}
              placeholder="https://drive.google.com/... or https://dropbox.com/..."
              className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-amber-500 font-mono"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Synthesizing Architectural Blueprint...</span>
              </>
            ) : (
              <>
                <span>Generate & View Specification Now</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Security / Privacy badge */}
        <div className="mt-4 flex items-center justify-center space-x-2 text-[11px] text-neutral-500">
          <ShieldCheck className="w-3.5 h-3.5 text-neutral-400" />
          <span>Zero spam. Strict client privacy & Non-Disclosure (NDA) guaranteed.</span>
        </div>
      </div>
    </div>
  );
};
