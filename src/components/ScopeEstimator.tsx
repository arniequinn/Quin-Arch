import React, { useState, useMemo } from "react";
import {
  Check,
  Clock,
  FileText,
  Layers,
  MessageSquare,
  Mail,
  ShieldAlert,
  Sparkles,
  TrendingUp
} from "lucide-react";
import {
  PROJECT_TYPES,
  SERVICE_OPTIONS,
  JURISDICTIONS,
  PROJECT_STAGES,
  TIMELINE_OPTIONS
} from "../data/architecturalData";
import { calculateScope, ScopeCalculationInput } from "../utils/calculator";
import { SpecialistProfile } from "../types";

interface ScopeEstimatorProps {
  specialist: SpecialistProfile;
}

export const ScopeEstimator: React.FC<ScopeEstimatorProps> = ({
  specialist,
}) => {
  // Estimator States
  const [projectTypeId, setProjectTypeId] = useState<string>("residential_single");
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([
    "permit_drawings",
    "bim_modeling",
    "construction_docs",
  ]);
  const [areaSqFt, setAreaSqFt] = useState<number>(2800);
  const [jurisdictionId, setJurisdictionId] = useState<string>("us_irc_ibc");
  const [currentStageId, setCurrentStageId] = useState<string>("schematic");
  const [timelineId, setTimelineId] = useState<string>("standard");
  const [projectTitle, setProjectTitle] = useState<string>("Modern Residence Project");

  // Selected project type object
  const currentProjectType = useMemo(() => {
    return PROJECT_TYPES.find((p) => p.id === projectTypeId) || PROJECT_TYPES[0];
  }, [projectTypeId]);

  // When project type changes, optionally adapt area
  const handleSelectProjectType = (id: string) => {
    setProjectTypeId(id);
    const p = PROJECT_TYPES.find((item) => item.id === id);
    if (p) {
      setAreaSqFt(p.defaultSqFt);
    }
  };

  // Toggle service selection
  const handleToggleService = (serviceId: string) => {
    setSelectedServiceIds((prev) => {
      if (prev.includes(serviceId)) {
        // Prevent deselecting everything
        if (prev.length === 1) return prev;
        return prev.filter((id) => id !== serviceId);
      } else {
        return [...prev, serviceId];
      }
    });
  };

  // Build calculation input
  const calculationInput: ScopeCalculationInput = useMemo(() => ({
    projectTypeId,
    selectedServiceIds,
    areaSqFt,
    jurisdictionId,
    currentStageId,
    timelineId,
    projectTitle,
  }), [projectTypeId, selectedServiceIds, areaSqFt, jurisdictionId, currentStageId, timelineId, projectTitle]);

  // Calculated results in real-time
  const calculation = useMemo(() => {
    return calculateScope(calculationInput);
  }, [calculationInput]);

  // Pre-filled contact messages so a visitor can send this exact configuration directly —
  // no form, no gate, since everything is already visible on screen.
  const selectedServiceNames = selectedServiceIds
    .map((id) => SERVICE_OPTIONS.find((s) => s.id === id)?.shortName)
    .filter(Boolean)
    .join(", ");

  const whatsappUrl = useMemo(() => {
    const text = encodeURIComponent(
      `Hi ${specialist.name}, I just configured a project scope on ArchScope!\n\n` +
      `• Project: ${projectTitle || "Architecture Project"} (${areaSqFt.toLocaleString()} sq ft)\n` +
      `• Type: ${currentProjectType.name}\n` +
      `• Services: ${selectedServiceNames}\n` +
      `• Drawing Set: ${calculation.recommendedSheetsCount} Sheets\n` +
      `• Turnaround: ~${calculation.estimatedTurnaroundDays} Days\n` +
      `• Estimated Fee: $${calculation.estimatedFeeMin.toLocaleString()} - $${calculation.estimatedFeeMax.toLocaleString()}\n\n` +
      `I'd like to discuss this project.`
    );
    return `https://wa.me/${specialist.whatsapp.replace(/[^0-9]/g, "")}?text=${text}`;
  }, [specialist, projectTitle, areaSqFt, currentProjectType, selectedServiceNames, calculation]);

  const mailtoUrl = useMemo(() => {
    const subject = encodeURIComponent(`Architectural Project Scope: ${projectTitle || "New Project"}`);
    const body = encodeURIComponent(
      `Hi ${specialist.name},\n\nI just configured a project scope on ArchScope:\n\n` +
      `Project: ${projectTitle || "Architecture Project"}\n` +
      `Area: ${areaSqFt.toLocaleString()} sq ft\n` +
      `Type: ${currentProjectType.name}\n` +
      `Services: ${selectedServiceNames}\n` +
      `Drawing Set: ${calculation.recommendedSheetsCount} Sheets\n` +
      `Turnaround: ~${calculation.estimatedTurnaroundDays} Days\n` +
      `Estimated Fee: $${calculation.estimatedFeeMin.toLocaleString()} - $${calculation.estimatedFeeMax.toLocaleString()}\n\n` +
      `Please let me know your availability for a kick-off review.`
    );
    return `mailto:${specialist.email}?subject=${subject}&body=${body}`;
  }, [specialist, projectTitle, areaSqFt, currentProjectType, selectedServiceNames, calculation]);

  const quickAreaPresets = [850, 1500, 2800, 4500, 7500];

  return (
    <section id="estimator" className="relative py-12 lg:py-16 scroll-mt-16">
      {/* Background architectural grid pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:16px_16px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header / Intro */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Architectural Scope & Fee Diagnostic</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-100 tracking-tight">
            Estimate Your Project Scope, Permit Drawing Set & Fees
          </h2>
          <p className="mt-3 text-base text-neutral-400 leading-relaxed">
            Select your project typology and desired digital deliverables. Instantly configure a
            custom drawing schedule, turnaround timeline, and turnkey remote fee estimate.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Configuration Steps (8 cols) */}
          <div className="lg:col-span-8 space-y-10">
            
            {/* Step 1: Project Typology */}
            <div className="p-6 rounded-2xl bg-neutral-900/90 border border-neutral-800 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs">
                    1
                  </div>
                  <h3 className="text-lg font-semibold text-neutral-100">
                    Select Project Typology
                  </h3>
                </div>
                <span className="text-xs text-neutral-400">
                  {PROJECT_TYPES.length} Typologies Available
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PROJECT_TYPES.map((type) => {
                  const isSelected = projectTypeId === type.id;
                  return (
                    <button
                      key={type.id}
                      id={`project-type-${type.id}`}
                      onClick={() => handleSelectProjectType(type.id)}
                      className={`group relative text-left p-3.5 rounded-xl border transition-all flex flex-col justify-between ${
                        isSelected
                          ? "bg-amber-500/10 border-amber-500/80 ring-1 ring-amber-500/30"
                          : "bg-neutral-950/60 border-neutral-800/80 hover:border-neutral-700 hover:bg-neutral-950"
                      }`}
                    >
                      <div className="flex items-start justify-between w-full">
                        <div className="flex items-center space-x-2">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                              isSelected
                                ? "bg-amber-500 text-neutral-950"
                                : "bg-neutral-800 text-neutral-400"
                            }`}
                          >
                            {type.badge}
                          </span>
                        </div>
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-amber-500 text-neutral-950 flex items-center justify-center">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                      </div>

                      <div className="mt-3">
                        <h4 className="font-semibold text-sm text-neutral-200 group-hover:text-amber-400 transition-colors">
                          {type.name}
                        </h4>
                        <p className="text-xs text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
                          {type.description}
                        </p>
                      </div>

                      <div className="mt-3 pt-2 border-t border-neutral-800/60 flex items-center justify-between text-[11px] text-neutral-400">
                        <span>Base: ~{type.baseSheets} Sheets</span>
                        <span>Typical: {type.defaultSqFt.toLocaleString()} sq ft</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Area (Square Footage) & Presets */}
              <div className="mt-6 pt-6 border-t border-neutral-800/80">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div>
                    <label className="text-sm font-semibold text-neutral-200">
                      Total Project Area
                    </label>
                    <p className="text-xs text-neutral-400">
                      Conditioned or enclosed gross building area
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      min={200}
                      max={50000}
                      step={50}
                      value={areaSqFt}
                      onChange={(e) => setAreaSqFt(Math.max(200, Number(e.target.value) || 0))}
                      className="w-28 px-3 py-1.5 rounded-lg bg-neutral-950 border border-neutral-700 text-right font-mono font-bold text-amber-400 text-sm focus:outline-none focus:border-amber-500"
                    />
                    <span className="text-xs font-medium text-neutral-400">SQ FT</span>
                  </div>
                </div>

                {/* Slider */}
                <input
                  type="range"
                  min={300}
                  max={12000}
                  step={50}
                  value={areaSqFt}
                  onChange={(e) => setAreaSqFt(Number(e.target.value))}
                  className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />

                {/* Quick Presets */}
                <div className="flex items-center space-x-2 mt-3 overflow-x-auto pb-1 text-xs">
                  <span className="text-neutral-500 shrink-0">Quick presets:</span>
                  {quickAreaPresets.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setAreaSqFt(preset)}
                      className={`px-2.5 py-1 rounded-md border font-mono transition-all shrink-0 ${
                        areaSqFt === preset
                          ? "bg-amber-500/20 border-amber-500/60 text-amber-400 font-semibold"
                          : "bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-neutral-200 hover:border-neutral-700"
                      }`}
                    >
                      {preset.toLocaleString()} sq ft
                    </button>
                  ))}
                </div>
              </div>

              {/* Jurisdiction & Project Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 pt-6 border-t border-neutral-800/80">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Target Municipal Building Code / Jurisdiction
                  </label>
                  <select
                    value={jurisdictionId}
                    onChange={(e) => setJurisdictionId(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-700 text-xs text-neutral-200 focus:outline-none focus:border-amber-500"
                  >
                    {JURISDICTIONS.map((j) => (
                      <option key={j.id} value={j.id}>
                        {j.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Project Reference Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={projectTitle}
                    onChange={(e) => setProjectTitle(e.target.value)}
                    placeholder="e.g. Modern Hillside Villa, Oak Street ADU"
                    className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-700 text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Scope of Work / Services Selection */}
            <div className="p-6 rounded-2xl bg-neutral-900/90 border border-neutral-800 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs">
                    2
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-100">
                      Select Required Services & Deliverables
                    </h3>
                    <p className="text-xs text-neutral-400">
                      Choose all remote services needed. Bundle 3+ for combined production efficiency.
                    </p>
                  </div>
                </div>
                <span className="text-xs text-amber-400 font-medium">
                  {selectedServiceIds.length} Selected
                </span>
              </div>

              <div className="space-y-3">
                {SERVICE_OPTIONS.map((service) => {
                  const isChecked = selectedServiceIds.includes(service.id);
                  return (
                    <div
                      key={service.id}
                      onClick={() => handleToggleService(service.id)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        isChecked
                          ? "bg-amber-500/10 border-amber-500/60 ring-1 ring-amber-500/20"
                          : "bg-neutral-950/60 border-neutral-800/80 hover:border-neutral-700 hover:bg-neutral-950"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start space-x-3">
                          <div
                            className={`w-5 h-5 rounded mt-0.5 flex items-center justify-center border transition-all ${
                              isChecked
                                ? "bg-amber-500 border-amber-500 text-neutral-950"
                                : "border-neutral-700 bg-neutral-900"
                            }`}
                          >
                            {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-semibold text-sm text-neutral-100">
                                {service.name}
                              </span>
                              {service.popular && (
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                                  Standard Delivery
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                              {service.description}
                            </p>
                            {/* Software badges */}
                            <div className="flex items-center space-x-2 mt-2">
                              <span className="text-[11px] text-neutral-500">Tech:</span>
                              {service.softwareUsed.map((sw) => (
                                <span
                                  key={sw}
                                  className="text-[10px] px-2 py-0.5 rounded bg-neutral-800 text-neutral-300 font-mono"
                                >
                                  {sw}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-xs font-mono font-semibold text-neutral-300">
                            ~{service.standardTurnaroundDays}d turnaround
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Current Stage & Timeline Speed */}
            <div className="p-6 rounded-2xl bg-neutral-900/90 border border-neutral-800 shadow-sm">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs">
                  3
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-neutral-100">
                    Project Stage & Production Speed
                  </h3>
                  <p className="text-xs text-neutral-400">
                    What materials do you have ready, and how urgently do you need this submitted?
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Stage options */}
                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-2">
                    Current Project Stage / Input Material
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {PROJECT_STAGES.map((stage) => {
                      const isSelected = currentStageId === stage.id;
                      return (
                        <button
                          key={stage.id}
                          type="button"
                          onClick={() => setCurrentStageId(stage.id)}
                          className={`p-3 rounded-lg border text-left transition-all ${
                            isSelected
                              ? "bg-amber-500/10 border-amber-500/80 text-neutral-100 ring-1 ring-amber-500/30"
                              : "bg-neutral-950/60 border-neutral-800/80 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-950"
                          }`}
                        >
                          <div className="font-semibold text-xs text-neutral-200">
                            {stage.name}
                          </div>
                          <div className="text-[11px] text-neutral-400 mt-0.5 line-clamp-1">
                            {stage.desc}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Timeline Speed */}
                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-2">
                    Target Completion Urgency
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {TIMELINE_OPTIONS.map((time) => {
                      const isSelected = timelineId === time.id;
                      return (
                        <button
                          key={time.id}
                          type="button"
                          onClick={() => setTimelineId(time.id)}
                          className={`p-3 rounded-lg border text-left transition-all ${
                            isSelected
                              ? "bg-amber-500/10 border-amber-500/80 text-neutral-100 ring-1 ring-amber-500/30"
                              : "bg-neutral-950/60 border-neutral-800/80 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-950"
                          }`}
                        >
                          <div className="font-semibold text-xs text-neutral-200">
                            {time.name}
                          </div>
                          <span
                            className={`inline-block mt-1 text-[10px] px-1.5 py-0.5 rounded font-mono ${
                              isSelected
                                ? "bg-amber-500/30 text-amber-300"
                                : "bg-neutral-800 text-neutral-400"
                            }`}
                          >
                            {time.badge}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Sticky Scope & Feasibility Summary Dock (4 cols) */}
          <div className="lg:col-span-4 lg:sticky lg:top-20 space-y-5">
            <div className="p-6 rounded-2xl bg-gradient-to-b from-neutral-900 to-neutral-950 border border-amber-500/30 shadow-xl relative overflow-hidden">
              {/* Highlight accent */}
              <div className="absolute top-0 right-0 w-36 h-36 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-400 flex items-center space-x-1.5">
                  <Layers className="w-4 h-4" />
                  <span>Scope Calculation</span>
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-neutral-800 text-neutral-300 border border-neutral-700">
                  LIVE ESTIMATE
                </span>
              </div>

              {/* Fee Range */}
              <div className="mt-5">
                <span className="text-xs text-neutral-400 font-medium block">
                  Estimated Remote Production Fee
                </span>
                <div className="mt-1 flex items-baseline space-x-2">
                  <span className="text-3xl font-extrabold text-neutral-100 font-mono tracking-tight">
                    ${calculation.estimatedFeeMin.toLocaleString()}
                  </span>
                  <span className="text-neutral-400 font-mono">-</span>
                  <span className="text-3xl font-extrabold text-amber-400 font-mono tracking-tight">
                    ${calculation.estimatedFeeMax.toLocaleString()}
                  </span>
                </div>
                <p className="text-[11px] text-neutral-500 mt-1">
                  Fixed-price turnkey delivery • Zero overtime charges
                </p>
              </div>

              {/* Key Deliverable Metrics */}
              <div className="grid grid-cols-2 gap-3 mt-6 pt-5 border-t border-neutral-800">
                <div className="p-3 rounded-xl bg-neutral-950/80 border border-neutral-800/80">
                  <div className="flex items-center space-x-1.5 text-neutral-400 text-xs">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>Turnaround</span>
                  </div>
                  <div className="mt-1 text-lg font-bold font-mono text-neutral-100">
                    ~{calculation.estimatedTurnaroundDays} Days
                  </div>
                  <span className="text-[10px] text-neutral-500">Milestone phased</span>
                </div>

                <div className="p-3 rounded-xl bg-neutral-950/80 border border-neutral-800/80">
                  <div className="flex items-center space-x-1.5 text-neutral-400 text-xs">
                    <FileText className="w-3.5 h-3.5 text-amber-400" />
                    <span>Drawing Set</span>
                  </div>
                  <div className="mt-1 text-lg font-bold font-mono text-neutral-100">
                    {calculation.recommendedSheetsCount} Sheets
                  </div>
                  <span className="text-[10px] text-neutral-500">A-001 through A-601</span>
                </div>
              </div>

              {/* In-House Cost Comparison & Savings */}
              <div className="mt-5 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold text-amber-300">
                    Client Value vs In-House Drafter
                  </span>
                </div>
                <div className="mt-2 text-xs text-neutral-300 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Typical in-house firm cost:</span>
                    <span className="font-mono line-through text-neutral-500">
                      ${calculation.inHouseCostEstimate.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span className="text-amber-200">Your Estimated Savings:</span>
                    <span className="font-mono text-amber-400">
                      ~${calculation.clientSavingsAmount.toLocaleString()} ({calculation.savingsPercentage}%)
                    </span>
                  </div>
                </div>
              </div>

              {/* Full Drawing Sheet Index */}
              <div className="mt-5">
                <span className="text-xs font-semibold text-neutral-300 block mb-2">
                  Included Sheet Index ({calculation.recommendedSheets.length} Sheets):
                </span>
                <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1 text-xs">
                  {calculation.recommendedSheets.map((sheet) => (
                    <div
                      key={sheet.sheetNumber}
                      className="flex items-center justify-between text-[11px] text-neutral-300 py-1 px-2 rounded bg-neutral-950/60"
                    >
                      <span className="font-mono text-amber-400 font-semibold shrink-0 mr-2">
                        {sheet.sheetNumber}
                      </span>
                      <span className="truncate text-neutral-300">{sheet.sheetTitle}</span>
                      <span className="text-[10px] text-neutral-500 ml-1 shrink-0 font-mono">
                        {sheet.bimLOD || "LOD 300"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Direct Contact CTAs — no form, no gate; everything above is already visible */}
              <div className="mt-6 grid grid-cols-2 gap-2.5">
                <a
                  id="whatsapp-estimate-cta-btn"
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold text-sm shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>WhatsApp</span>
                </a>
                <a
                  id="email-estimate-cta-btn"
                  href={mailtoUrl}
                  className="py-3.5 px-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-100 font-bold text-sm border border-neutral-700 transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <Mail className="w-4 h-4 text-amber-400" />
                  <span>Email</span>
                </a>
              </div>

              <div className="mt-3 flex items-center justify-center space-x-2 text-[11px] text-neutral-400">
                <Check className="w-3.5 h-3.5 text-amber-400" />
                <span>Sends this exact scope directly to {specialist.name.split(" ")[0]} • No forms</span>
              </div>
            </div>

            {/* Quick Guarantees Card */}
            <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 text-xs text-neutral-400 space-y-2">
              <div className="flex items-center space-x-2 text-neutral-300 font-semibold">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                <span>Specialist Delivery Guarantee</span>
              </div>
              <p className="leading-relaxed text-[11px]">
                • 100% Native Files: Full access to clean BIM families & AutoCAD (.DWG) layers.
                <br />
                • Fast Redlines: 24 to 48-hour turnarounds on city plan-check corrections.
                <br />
                • NDA Protected: Strict intellectual property and confidentiality assurance.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
