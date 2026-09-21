import React, { useState, useMemo } from "react";
import {
  Check,
  Clock,
  FileText,
  Layers,
  MessageSquare,
  Mail,
  ShieldCheck,
  Lock,
  TrendingUp,
  Info,
  ChevronRight
} from "lucide-react";
import {
  PROJECT_TYPES,
  SERVICE_OPTIONS,
  JURISDICTIONS,
  TIMELINE_OPTIONS
} from "../data/architecturalData";
import { calculateScope, ScopeCalculationInput } from "../utils/calculator";
import { SpecialistProfile } from "../types";
import { EstimateDisclaimer } from "./EstimateDisclaimer";

interface ScopeEstimatorProps {
  specialist: SpecialistProfile;
}

// BIM Phase → project stage mapping
const BIM_PHASES = [
  { id: "napkin_sketch",       lodLabel: "LOD 100", name: "Concept Design",              desc: "Program brief, massing studies, site feasibility — no production drawings yet." },
  { id: "schematic",           lodLabel: "LOD 200", name: "Schematic Design",            desc: "Coordinated floor plans and elevations locked; ready for BIM production." },
  { id: "permit_ready",        lodLabel: "LOD 300", name: "Design Development",          desc: "Fully resolved geometry; proceeding to municipal submittal package." },
  { id: "construction_bidding",lodLabel: "LOD 350", name: "Construction Documentation",  desc: "Detail sheets, schedules, and coordination for contractor procurement." },
  { id: "redlines_revisions",  lodLabel: "LOD 400+", name: "Construction Administration", desc: "Plan-check response, RFI support, and as-built reconciliation." },
] as const;

// Complexity multipliers applied on top of calculator output
const COMPLEXITY_TIERS = [
  { id: "standard",  label: "Standard",  multiplier: 1.0,  desc: "Orthogonal geometry, conventional program, low site constraints." },
  { id: "complex",   label: "Complex",   multiplier: 1.25, desc: "Non-orthogonal forms, multi-system coordination, constrained site." },
  { id: "landmark",  label: "Landmark",  multiplier: 1.55, desc: "Bespoke parametric geometry, structural innovation, or heritage context." },
] as const;

export const ScopeEstimator: React.FC<ScopeEstimatorProps> = ({ specialist }) => {
  const [projectTypeId, setProjectTypeId] = useState<string>("residential_single");
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([
    "permit_drawings",
    "bim_modeling",
    "construction_docs",
  ]);
  const [areaSqFt, setAreaSqFt] = useState<number>(2800);
  const [jurisdictionId, setJurisdictionId] = useState<string>("us_irc_ibc");
  const [bimPhaseId, setBimPhaseId] = useState<string>("schematic");
  const [complexityId, setComplexityId] = useState<string>("standard");
  const [timelineId, setTimelineId] = useState<string>("standard");
  const [projectTitle, setProjectTitle] = useState<string>("");
  const [excludedSheetNumbers, setExcludedSheetNumbers] = useState<string[]>([]);
  const [feeUnlocked, setFeeUnlocked] = useState<boolean>(false);

  const currentProjectType = useMemo(() =>
    PROJECT_TYPES.find((p) => p.id === projectTypeId) || PROJECT_TYPES[0],
    [projectTypeId]
  );

  const complexityMultiplier = useMemo(() =>
    COMPLEXITY_TIERS.find((c) => c.id === complexityId)?.multiplier ?? 1.0,
    [complexityId]
  );

  const handleSelectProjectType = (id: string) => {
    setProjectTypeId(id);
    const p = PROJECT_TYPES.find((item) => item.id === id);
    if (p) setAreaSqFt(p.defaultSqFt);
  };

  const handleToggleService = (serviceId: string) => {
    setSelectedServiceIds((prev) => {
      if (prev.includes(serviceId)) {
        if (prev.length === 1) return prev;
        return prev.filter((id) => id !== serviceId);
      }
      return [...prev, serviceId];
    });
  };

  const handleToggleSheet = (sheetNumber: string) => {
    setExcludedSheetNumbers((prev) =>
      prev.includes(sheetNumber) ? prev.filter((n) => n !== sheetNumber) : [...prev, sheetNumber]
    );
  };

  const calculationInput: ScopeCalculationInput = useMemo(() => ({
    projectTypeId,
    selectedServiceIds,
    areaSqFt,
    jurisdictionId,
    currentStageId: bimPhaseId,
    timelineId,
    projectTitle,
    excludedSheetNumbers,
  }), [projectTypeId, selectedServiceIds, areaSqFt, jurisdictionId, bimPhaseId, timelineId, projectTitle, excludedSheetNumbers]);

  const baseCalc = useMemo(() => calculateScope(calculationInput), [calculationInput]);

  // Apply complexity multiplier to fee output only
  const calculation = useMemo(() => ({
    ...baseCalc,
    estimatedFeeMin: Math.round(baseCalc.estimatedFeeMin * complexityMultiplier),
    estimatedFeeMax: Math.round(baseCalc.estimatedFeeMax * complexityMultiplier),
    inHouseCostEstimate: Math.round(baseCalc.inHouseCostEstimate * complexityMultiplier),
    clientSavingsAmount: Math.round(baseCalc.clientSavingsAmount * complexityMultiplier),
  }), [baseCalc, complexityMultiplier]);

  const selectedServiceNames = selectedServiceIds
    .map((id) => SERVICE_OPTIONS.find((s) => s.id === id)?.shortName)
    .filter(Boolean)
    .join(", ");

  const selectedPhaseLabel = BIM_PHASES.find((p) => p.id === bimPhaseId)?.lodLabel ?? "LOD 300";

  const whatsappUrl = useMemo(() => {
    const text = encodeURIComponent(
      `Hi ${specialist.name},\n\nI've configured a BIM scope on your Scope Planner:\n\n` +
      `• Project: ${projectTitle || currentProjectType.name}\n` +
      `• Phase: ${BIM_PHASES.find((p) => p.id === bimPhaseId)?.name ?? ""} (${selectedPhaseLabel})\n` +
      `• Complexity: ${complexityId.charAt(0).toUpperCase() + complexityId.slice(1)}\n` +
      `• Services: ${selectedServiceNames}\n` +
      `• Drawing Set: ${calculation.recommendedSheetsCount} Sheets\n` +
      `• Timeline: ~${calculation.estimatedTurnaroundDays} days\n\n` +
      `I'd like to request a fee consultation.`
    );
    return `https://wa.me/${specialist.whatsapp.replace(/[^0-9]/g, "")}?text=${text}`;
  }, [specialist, projectTitle, currentProjectType, bimPhaseId, selectedPhaseLabel, complexityId, selectedServiceNames, calculation]);

  const mailtoUrl = useMemo(() => {
    const subject = encodeURIComponent(`BIM Scope Consultation: ${projectTitle || currentProjectType.name}`);
    const body = encodeURIComponent(
      `Hi ${specialist.name},\n\nI've configured a BIM scope on your Scope Planner:\n\n` +
      `Project: ${projectTitle || currentProjectType.name}\n` +
      `Phase: ${BIM_PHASES.find((p) => p.id === bimPhaseId)?.name ?? ""} (${selectedPhaseLabel})\n` +
      `Complexity: ${complexityId.charAt(0).toUpperCase() + complexityId.slice(1)}\n` +
      `Services: ${selectedServiceNames}\n` +
      `Drawing Set: ${calculation.recommendedSheetsCount} Sheets\n` +
      `Timeline: ~${calculation.estimatedTurnaroundDays} days\n\n` +
      `Please provide a fee proposal for this scope.`
    );
    return `mailto:${specialist.email}?subject=${subject}&body=${body}`;
  }, [specialist, projectTitle, currentProjectType, bimPhaseId, selectedPhaseLabel, complexityId, selectedServiceNames, calculation]);

  const quickAreaPresets = [850, 1500, 2800, 4500, 7500];

  return (
    <section id="estimator" className="relative py-16 lg:py-24 scroll-mt-16">
      <div className="absolute inset-0 opacity-[0.025] pointer-events-none bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:20px_20px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">

        {/* Section Header */}
        <div className="mb-14">
          <p className="text-[11px] font-mono text-neutral-500 tracking-widest uppercase mb-3">BIM/VDC Track</p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-neutral-100 tracking-tight">
            BIM Scope & Resource Estimator
          </h2>
          <p className="mt-3 text-neutral-400 leading-relaxed max-w-2xl">
            Define your project phase, delivery scope, and complexity parameters.
            Deliverables and timeline are generated in real time — fee estimate gated behind a consultation request.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Configuration Steps (8 cols) */}
          <div className="lg:col-span-8 space-y-8">

            {/* Step 1: Project Typology */}
            <div className="p-6 rounded-xl bg-neutral-900/70 border border-neutral-800">
              <div className="flex items-center space-x-3 mb-5">
                <span className="w-6 h-6 rounded bg-neutral-800 text-neutral-400 flex items-center justify-center font-mono text-[11px]">01</span>
                <h3 className="text-base font-semibold text-neutral-100">Project Typology</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PROJECT_TYPES.map((type) => {
                  const isSelected = projectTypeId === type.id;
                  return (
                    <button
                      key={type.id}
                      onClick={() => handleSelectProjectType(type.id)}
                      className={`text-left p-4 rounded-lg border transition-all flex flex-col ${
                        isSelected
                          ? "bg-neutral-800 border-amber-500/60 ring-1 ring-amber-500/20"
                          : "bg-neutral-950/50 border-neutral-800 hover:border-neutral-700"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-[10px] font-mono tracking-widest uppercase px-2 py-0.5 rounded ${
                          isSelected ? "bg-amber-500/20 text-amber-400" : "bg-neutral-800 text-neutral-500"
                        }`}>
                          {type.badge}
                        </span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-amber-400" />}
                      </div>
                      <h4 className="font-medium text-sm text-neutral-200 leading-snug">{type.name}</h4>
                      <p className="text-[11px] text-neutral-500 mt-1 leading-relaxed line-clamp-2">{type.description}</p>
                      <div className="mt-3 pt-2 border-t border-neutral-800/60 flex justify-between text-[10px] font-mono text-neutral-500">
                        <span>{type.baseSheets} base sheets</span>
                        <span>~{type.defaultSqFt.toLocaleString()} SF</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* GFA Input */}
              <div className="mt-6 pt-6 border-t border-neutral-800">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div>
                    <label className="text-sm font-medium text-neutral-200">Gross Floor Area</label>
                    <p className="text-[11px] text-neutral-500 mt-0.5">Enclosed conditioned building area</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number" min={200} max={50000} step={50}
                      value={areaSqFt}
                      onWheel={(e) => e.currentTarget.blur()}
                      onChange={(e) => setAreaSqFt(Math.max(200, Number(e.target.value) || 0))}
                      className="w-28 px-3 py-1.5 rounded bg-neutral-950 border border-neutral-700 text-right font-mono font-bold text-amber-400 text-sm focus:outline-none focus:border-amber-500/60"
                    />
                    <span className="text-[11px] font-mono text-neutral-500 tracking-widest">SF</span>
                  </div>
                </div>
                <input type="range" min={300} max={12000} step={50} value={areaSqFt}
                  onChange={(e) => setAreaSqFt(Number(e.target.value))}
                  className="w-full h-1.5 bg-neutral-800 rounded-full appearance-none cursor-pointer accent-amber-500"
                />
                <div className="flex items-center space-x-2 mt-3 overflow-x-auto pb-1">
                  <span className="text-[10px] font-mono text-neutral-600 shrink-0 tracking-widest">PRESETS</span>
                  {quickAreaPresets.map((preset) => (
                    <button key={preset} type="button" onClick={() => setAreaSqFt(preset)}
                      className={`px-2.5 py-1 rounded border font-mono text-[11px] transition-all shrink-0 ${
                        areaSqFt === preset
                          ? "bg-amber-500/10 border-amber-500/50 text-amber-400"
                          : "bg-neutral-950 border-neutral-800 text-neutral-500 hover:text-neutral-300 hover:border-neutral-700"
                      }`}>
                      {preset.toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Jurisdiction + Project Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 pt-6 border-t border-neutral-800">
                <div>
                  <label className="block text-[11px] font-mono text-neutral-400 mb-2 tracking-widest uppercase">
                    Target Jurisdiction
                  </label>
                  <select value={jurisdictionId} onChange={(e) => setJurisdictionId(e.target.value)}
                    className="w-full px-3 py-2 rounded bg-neutral-950 border border-neutral-700 text-xs text-neutral-200 focus:outline-none focus:border-amber-500/60">
                    {JURISDICTIONS.map((j) => (
                      <option key={j.id} value={j.id}>{j.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-neutral-400 mb-2 tracking-widest uppercase">
                    Project Reference
                  </label>
                  <input type="text" value={projectTitle}
                    onChange={(e) => setProjectTitle(e.target.value)}
                    placeholder="e.g. Hillside Villa — Phase 1"
                    className="w-full px-3 py-2 rounded bg-neutral-950 border border-neutral-700 text-xs text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-amber-500/60"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Scope of Work */}
            <div className="p-6 rounded-xl bg-neutral-900/70 border border-neutral-800">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center space-x-3">
                  <span className="w-6 h-6 rounded bg-neutral-800 text-neutral-400 flex items-center justify-center font-mono text-[11px]">02</span>
                  <h3 className="text-base font-semibold text-neutral-100">Scope of Work & Deliverables</h3>
                </div>
                <span className="text-[11px] font-mono text-amber-400">{selectedServiceIds.length} selected</span>
              </div>

              <div className="space-y-2.5">
                {SERVICE_OPTIONS.map((service) => {
                  const isChecked = selectedServiceIds.includes(service.id);
                  return (
                    <div key={service.id} onClick={() => handleToggleService(service.id)}
                      className={`p-4 rounded-lg border cursor-pointer transition-all ${
                        isChecked
                          ? "bg-neutral-800 border-amber-500/50 ring-1 ring-amber-500/10"
                          : "bg-neutral-950/50 border-neutral-800 hover:border-neutral-700"
                      }`}>
                      <div className="flex items-start gap-4">
                        <div className={`w-4 h-4 rounded border mt-0.5 flex items-center justify-center shrink-0 transition-all ${
                          isChecked ? "bg-amber-500 border-amber-500" : "border-neutral-700 bg-neutral-900"
                        }`}>
                          {isChecked && <Check className="w-2.5 h-2.5 text-neutral-950 stroke-[3]" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center flex-wrap gap-x-2 gap-y-1">
                            <span className="font-medium text-sm text-neutral-100">{service.name}</span>
                            {service.popular && (
                              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/25">
                                Standard Delivery
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-neutral-400 mt-1 leading-relaxed">{service.description}</p>
                          <div className="flex items-center flex-wrap gap-x-1.5 gap-y-1 mt-2">
                            <span className="text-[10px] font-mono text-neutral-600 tracking-widest">TECH</span>
                            {service.softwareUsed.map((sw) => (
                              <span key={sw} className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-400 font-mono">{sw}</span>
                            ))}
                          </div>
                        </div>
                        <span className="text-[11px] font-mono text-neutral-500 shrink-0">
                          ~{service.standardTurnaroundDays}d
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 flex items-start space-x-2.5 px-4 py-3 rounded-lg bg-neutral-950/50 border border-neutral-800">
                <Info className="w-3.5 h-3.5 text-neutral-500 shrink-0 mt-0.5" />
                <p className="text-[11px] text-neutral-500 leading-relaxed">
                  Services are not simply additive — bundled deliverables share model setup overhead.
                  The scope summary reflects combined production rather than stacked individual estimates.
                </p>
              </div>
            </div>

            {/* Step 3: BIM Phase & Complexity */}
            <div className="p-6 rounded-xl bg-neutral-900/70 border border-neutral-800">
              <div className="flex items-center space-x-3 mb-5">
                <span className="w-6 h-6 rounded bg-neutral-800 text-neutral-400 flex items-center justify-center font-mono text-[11px]">03</span>
                <div>
                  <h3 className="text-base font-semibold text-neutral-100">BIM Phase & Complexity Parameters</h3>
                  <p className="text-[11px] text-neutral-500 mt-0.5">Current design phase and program complexity drive resource allocation.</p>
                </div>
              </div>

              <div className="space-y-5">
                {/* BIM Phase (LOD) */}
                <div>
                  <label className="block text-[11px] font-mono text-neutral-400 mb-3 tracking-widest uppercase">
                    Current BIM Phase
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {BIM_PHASES.map((phase) => {
                      const isSelected = bimPhaseId === phase.id;
                      return (
                        <button key={phase.id} type="button" onClick={() => setBimPhaseId(phase.id)}
                          className={`p-3.5 rounded-lg border text-left transition-all ${
                            isSelected
                              ? "bg-neutral-800 border-amber-500/60 ring-1 ring-amber-500/15"
                              : "bg-neutral-950/50 border-neutral-800 hover:border-neutral-700"
                          }`}>
                          <div className="flex items-center justify-between mb-1">
                            <span className={`text-[10px] font-mono tracking-widest ${isSelected ? "text-amber-400" : "text-neutral-600"}`}>
                              {phase.lodLabel}
                            </span>
                            {isSelected && <Check className="w-3 h-3 text-amber-400" />}
                          </div>
                          <div className="font-medium text-xs text-neutral-200">{phase.name}</div>
                          <div className="text-[10px] text-neutral-500 mt-0.5 line-clamp-2 leading-relaxed">{phase.desc}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Complexity Multiplier */}
                <div>
                  <label className="block text-[11px] font-mono text-neutral-400 mb-3 tracking-widest uppercase">
                    Program Complexity
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {COMPLEXITY_TIERS.map((tier) => {
                      const isSelected = complexityId === tier.id;
                      return (
                        <button key={tier.id} type="button" onClick={() => setComplexityId(tier.id)}
                          className={`p-3.5 rounded-lg border text-left transition-all ${
                            isSelected
                              ? "bg-neutral-800 border-amber-500/60 ring-1 ring-amber-500/15"
                              : "bg-neutral-950/50 border-neutral-800 hover:border-neutral-700"
                          }`}>
                          <div className="font-medium text-xs text-neutral-200 mb-1">{tier.label}</div>
                          <p className="text-[10px] text-neutral-500 leading-relaxed line-clamp-2">{tier.desc}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Timeline Speed */}
                <div>
                  <label className="block text-[11px] font-mono text-neutral-400 mb-3 tracking-widest uppercase">
                    Delivery Schedule
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {TIMELINE_OPTIONS.map((time) => {
                      const isSelected = timelineId === time.id;
                      return (
                        <button key={time.id} type="button" onClick={() => setTimelineId(time.id)}
                          className={`p-3.5 rounded-lg border text-left transition-all ${
                            isSelected
                              ? "bg-neutral-800 border-amber-500/60 ring-1 ring-amber-500/15"
                              : "bg-neutral-950/50 border-neutral-800 hover:border-neutral-700"
                          }`}>
                          <div className="font-medium text-xs text-neutral-200">{time.name}</div>
                          <span className={`inline-block mt-1 text-[10px] font-mono px-1.5 py-0.5 rounded ${
                            isSelected ? "bg-amber-500/20 text-amber-400" : "bg-neutral-800 text-neutral-500"
                          }`}>
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

          {/* Sticky Results Panel (4 cols) */}
          <div className="lg:col-span-4 lg:sticky lg:top-20 space-y-4">
            <div className="p-6 rounded-xl bg-neutral-900 border border-neutral-800 shadow-2xl">

              {/* Panel Header */}
              <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
                <span className="text-[11px] font-mono text-neutral-400 tracking-widest uppercase flex items-center space-x-1.5">
                  <Layers className="w-3.5 h-3.5 text-amber-400" />
                  <span>Scope Output</span>
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-neutral-700 text-neutral-400">
                  {selectedPhaseLabel}
                </span>
              </div>

              {/* Timeline + Sheets — always visible */}
              <div className="grid grid-cols-2 gap-3 mt-5">
                <div className="p-3.5 rounded-lg bg-neutral-950 border border-neutral-800">
                  <div className="flex items-center space-x-1.5 text-neutral-500 text-[11px] mb-1">
                    <Clock className="w-3 h-3 text-amber-400" />
                    <span>Timeline</span>
                  </div>
                  <div className="text-xl font-bold font-mono text-neutral-100">
                    ~{calculation.estimatedTurnaroundDays}d
                  </div>
                  <span className="text-[10px] font-mono text-neutral-600">Milestone phased</span>
                </div>
                <div className="p-3.5 rounded-lg bg-neutral-950 border border-neutral-800">
                  <div className="flex items-center space-x-1.5 text-neutral-500 text-[11px] mb-1">
                    <FileText className="w-3 h-3 text-amber-400" />
                    <span>Drawing Set</span>
                  </div>
                  <div className="text-xl font-bold font-mono text-neutral-100">
                    {calculation.recommendedSheetsCount}
                  </div>
                  <span className="text-[10px] font-mono text-neutral-600">Sheets · G / A / M series</span>
                </div>
              </div>

              {/* Complexity tier badge */}
              <div className="mt-4 px-3.5 py-2.5 rounded-lg bg-neutral-950 border border-neutral-800">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono text-neutral-500 tracking-widest uppercase">Complexity</span>
                  <span className={`text-[11px] font-mono font-semibold ${
                    complexityId === "landmark" ? "text-amber-400" :
                    complexityId === "complex" ? "text-amber-300/80" :
                    "text-neutral-400"
                  }`}>
                    {COMPLEXITY_TIERS.find((c) => c.id === complexityId)?.label}
                    {complexityId !== "standard" && ` ×${COMPLEXITY_TIERS.find((c) => c.id === complexityId)?.multiplier}`}
                  </span>
                </div>
              </div>

              {/* Fee Gate */}
              <div className="mt-5">
                {!feeUnlocked ? (
                  <div className="p-4 rounded-lg border border-neutral-800 bg-neutral-950/60 text-center">
                    <Lock className="w-5 h-5 text-neutral-600 mx-auto mb-2" />
                    <p className="text-[11px] text-neutral-500 leading-relaxed mb-3">
                      Fee estimate is available upon consultation request — scope parameters are sent directly to {specialist.name.split(" ")[0]}.
                    </p>
                    <button
                      type="button"
                      onClick={() => setFeeUnlocked(true)}
                      className="w-full py-2.5 px-4 rounded-lg border border-amber-500/40 text-amber-400 text-xs font-medium hover:bg-amber-500/10 hover:border-amber-500/70 transition-all cursor-pointer flex items-center justify-center space-x-2"
                    >
                      <span>Request Consultation</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div>
                    <span className="text-[11px] font-mono text-neutral-500 tracking-widest uppercase block mb-2">
                      Indicative Fee Range
                    </span>
                    <div className="flex items-baseline space-x-2 mb-1">
                      <span className="text-2xl font-bold font-mono text-neutral-100">
                        ${calculation.estimatedFeeMin.toLocaleString()}
                      </span>
                      <span className="text-neutral-500 font-mono">–</span>
                      <span className="text-2xl font-bold font-mono text-amber-400">
                        ${calculation.estimatedFeeMax.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-[10px] font-mono text-neutral-600 mb-4">
                      Fixed-price turnkey delivery · Confirmed at brief sign-off
                    </p>

                    {/* Cost context */}
                    <div className="p-3 rounded-lg bg-neutral-950 border border-neutral-800 mb-4">
                      <div className="flex items-center space-x-1.5 mb-2">
                        <TrendingUp className="w-3.5 h-3.5 text-neutral-500" />
                        <span className="text-[10px] font-mono text-neutral-500 tracking-widest uppercase">Market Comparison</span>
                      </div>
                      <div className="text-[11px] text-neutral-400 space-y-1.5">
                        <div className="flex justify-between">
                          <span>Onshore equivalent</span>
                          <span className={`font-mono ${calculation.hasSavings ? "line-through text-neutral-600" : "text-neutral-400"}`}>
                            ${calculation.inHouseCostEstimate.toLocaleString()}
                          </span>
                        </div>
                        {calculation.hasSavings && (
                          <div className="flex justify-between font-semibold">
                            <span className="text-amber-300/80">Client advantage</span>
                            <span className="font-mono text-amber-400">
                              ~${calculation.clientSavingsAmount.toLocaleString()} ({calculation.savingsPercentage}%)
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Contact CTAs */}
                    <div className="grid grid-cols-2 gap-2.5">
                      <a href={whatsappUrl} target="_blank" rel="noopener noreferrer"
                        className="py-3 px-3 rounded-lg bg-emerald-900/50 hover:bg-emerald-900/80 border border-emerald-700/40 text-emerald-400 font-medium text-xs transition-all flex items-center justify-center space-x-1.5">
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>WhatsApp</span>
                      </a>
                      <a href={mailtoUrl}
                        className="py-3 px-3 rounded-lg bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-200 font-medium text-xs transition-all flex items-center justify-center space-x-1.5">
                        <Mail className="w-3.5 h-3.5 text-amber-400" />
                        <span>Email</span>
                      </a>
                    </div>

                    <div className="mt-3 text-center text-[10px] text-neutral-600 font-mono">
                      Sends scope parameters · No forms · No obligation
                    </div>
                  </div>
                )}
              </div>

              {/* Sheet Index */}
              <div className="mt-5 pt-5 border-t border-neutral-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono text-neutral-400 tracking-widest uppercase">
                    Sheet Index ({calculation.recommendedSheetsCount} active)
                  </span>
                  {excludedSheetNumbers.length > 0 && (
                    <button type="button" onClick={() => setExcludedSheetNumbers([])}
                      className="text-[10px] text-amber-400 hover:text-amber-300 font-mono cursor-pointer">
                      Reset
                    </button>
                  )}
                </div>
                <p className="text-[10px] text-neutral-600 font-mono mb-2">Click a sheet to remove it from scope.</p>
                <div className="space-y-1 max-h-52 overflow-y-auto pr-0.5 text-xs">
                  {calculation.recommendedSheets.map((sheet) => {
                    const isExcluded = excludedSheetNumbers.includes(sheet.sheetNumber);
                    return (
                      <div key={sheet.sheetNumber} onClick={() => handleToggleSheet(sheet.sheetNumber)}
                        className={`flex items-center justify-between text-[10px] py-1 px-2 rounded cursor-pointer transition-all ${
                          isExcluded ? "opacity-35" : "hover:bg-neutral-800/50"
                        }`}>
                        <div className="flex items-center space-x-1.5 min-w-0">
                          <div className={`w-3 h-3 rounded-sm flex items-center justify-center border shrink-0 ${
                            isExcluded ? "border-neutral-800 bg-transparent" : "bg-amber-500/80 border-amber-500"
                          }`}>
                            {!isExcluded && <Check className="w-2 h-2 text-neutral-950 stroke-[4]" />}
                          </div>
                          <span className={`font-mono shrink-0 ${isExcluded ? "text-neutral-600" : "text-amber-400"}`}>
                            {sheet.sheetNumber}
                          </span>
                          <span className={`truncate ${isExcluded ? "text-neutral-600 line-through" : "text-neutral-400"}`}>
                            {sheet.sheetTitle}
                          </span>
                        </div>
                        <span className="text-[9px] font-mono text-neutral-600 ml-1 shrink-0">
                          {sheet.bimLOD || "LOD 300"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <EstimateDisclaimer specialistFirstName={specialist.name.split(" ")[0]} className="mt-4" />
            </div>

            {/* Delivery Assurance */}
            <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 text-xs text-neutral-500 space-y-2">
              <div className="flex items-center space-x-2 text-neutral-300 font-medium">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Delivery Standards</span>
              </div>
              <ul className="text-[11px] leading-relaxed space-y-1">
                <li>Native BIM families & clean AutoCAD layer structure (AIA NCS)</li>
                <li>24–48h construction administration response window</li>
                <li>NDA-protected · IP assigned on final payment</li>
              </ul>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
