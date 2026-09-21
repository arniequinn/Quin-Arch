import React, { useState } from "react";
import {
  FileCheck2,
  Eye,
  ExternalLink,
  Layers,
  Check,
  Sliders,
  FileText,
  X,
  Download,
  Star,
  ShieldCheck
} from "lucide-react";
import { PORTFOLIO_SAMPLES } from "../data/architecturalData";
import { PortfolioItem } from "../types";
import { assetUrl } from "../utils/assetPath";

export const DeliverablesGallery: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);

  // Before & After comparison slider position (0-100%)
  const [sliderPosition, setSliderPosition] = useState<number>(50);

  const categories = [
    "All",
    "CAD Permit Sets",
    "3D BIM",
    "3D Visualization",
    "Millwork & Detailing",
    "Before & After Conversion",
  ];

  const filteredSamples = activeCategory === "All"
    ? PORTFOLIO_SAMPLES
    : PORTFOLIO_SAMPLES.filter((s) => s.category === activeCategory);

  return (
    <section id="deliverables" className="py-16 bg-neutral-950 border-t border-neutral-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold mb-3">
            <Layers className="w-3.5 h-3.5" />
            <span>Demonstrated Technical Craftsmanship</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-neutral-100 tracking-tight">
            High-Precision Architectural & BIM Deliverables
          </h2>
          <p className="mt-3 text-sm text-neutral-400 leading-relaxed">
            A sample of authentic drawing sets, permit packages, and photorealistic 3D visualizations executed for
            clients across North America, the UK, and internationally.
          </p>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            <a
              href={assetUrl("/portfolio/docs/Architecture Portfolio - Arslan Qaiser_compressed.pdf")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-xs text-amber-300 font-medium transition-all"
            >
              <FileText className="w-4 h-4 text-amber-400" />
              <span>Open Master Architectural Portfolio (PDF)</span>
            </a>
          </div>
        </div>

        {/* Interactive Before & After Highlight Feature */}
        <div className="mb-14 p-6 sm:p-8 rounded-2xl bg-neutral-900/90 border border-neutral-800 shadow-xl overflow-hidden relative">
          <div className="max-w-3xl mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 font-mono">
              INTERACTIVE COMPARISON WORKFLOW
            </span>
            <h3 className="text-xl font-bold text-neutral-100 mt-1">
              From Parametric Script to Photorealistic Render
            </h3>
            <p className="text-xs text-neutral-400 mt-1">
              Drag the slider below to see the Rhino + Grasshopper facade-pattern definition behind this tower
              transform into its finished architectural visualization.
            </p>
          </div>

          {/* Slider comparison viewport — both images render at the viewport's full, fixed size at
              all times; only a clip-path on the foreground wrapper changes as the slider moves, so
              neither image ever resizes or shifts, no matter where the handle is dragged. */}
          <div className="relative w-full h-72 sm:h-96 rounded-xl overflow-hidden select-none border border-neutral-700 bg-neutral-950">
            {/* Background: finished render, full-size, never clipped */}
            <img
              src={assetUrl("/portfolio/bimcad-workflow/12-cube-facade-render.webp")}
              alt="Finished photorealistic tower facade render"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4 z-10 px-3 py-1 rounded bg-neutral-950/80 backdrop-blur-md border border-amber-500/50 text-amber-400 text-xs font-mono font-bold">
              RENDER: Photorealistic Facade Visualization
            </div>

            {/* Foreground: Grasshopper parametric script, same full size, revealed via clip-path */}
            <div
              className="absolute inset-0 overflow-hidden pointer-events-none"
              style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
            >
              <img
                src={assetUrl("/portfolio/bimcad-workflow/09-diagrid-pattern-script.jpg")}
                alt="Rhino and Grasshopper parametric facade-pattern script"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded bg-neutral-950/80 backdrop-blur-md border border-neutral-700 text-neutral-300 text-xs font-mono">
                SCRIPT: Rhino + Grasshopper Facade Definition
              </div>
            </div>

            {/* Divider Line & Handle */}
            <div
              className="absolute inset-y-0 w-1 bg-amber-400 shadow-lg cursor-ew-resize flex items-center justify-center pointer-events-none"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="w-8 h-8 rounded-full bg-amber-500 text-neutral-950 flex items-center justify-center font-bold text-xs shadow-md border-2 border-neutral-950">
                <Sliders className="w-4 h-4" />
              </div>
            </div>

            {/* Invisible Range Input for Smooth Dragging */}
            <input
              type="range"
              min={0}
              max={100}
              value={sliderPosition}
              onChange={(e) => setSliderPosition(Number(e.target.value))}
              className="absolute inset-0 opacity-0 cursor-ew-resize w-full h-full z-20"
              aria-label="Parametric script to finished render transformation slider"
            />
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-neutral-400 font-mono">
            <span>◀ Drag Left: Reveal Finished Render</span>
            <span>Drag Right: Reveal Parametric Script ▶</span>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-3 mb-8 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeCategory === cat
                  ? "bg-amber-500 text-neutral-950 shadow-md shadow-amber-500/20"
                  : "bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200 border border-neutral-800"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSamples.map((sample) => (
            <div
              key={sample.id}
              className="group rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-amber-500/50 overflow-hidden transition-all duration-300 flex flex-col justify-between shadow-sm hover:shadow-amber-500/5"
            >
              {/* Image Preview Container */}
              <div 
                className="relative h-56 overflow-hidden bg-neutral-950 cursor-pointer"
                onClick={() => setSelectedItem(sample)}
              >
                <img
                  src={sample.imageUrl}
                  alt={sample.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent opacity-90" />

                {/* Top Badges */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                  <span className="px-2.5 py-1 rounded-md bg-neutral-950/80 backdrop-blur-md border border-neutral-700 text-[11px] font-mono text-amber-400 font-semibold">
                    {sample.category}
                  </span>

                  {sample.isRealClientWork && (
                    <span className="px-2 py-0.5 rounded-md bg-emerald-950/80 backdrop-blur-md border border-emerald-500/40 text-[10px] font-mono text-emerald-400 font-semibold flex items-center space-x-1">
                      <ShieldCheck className="w-3 h-3" />
                      <span>Verified Work</span>
                    </span>
                  )}
                </div>

                {/* Hover overlay hint */}
                <div className="absolute inset-0 bg-neutral-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="px-4 py-2 rounded-xl bg-amber-500 text-neutral-950 text-xs font-bold flex items-center space-x-2 shadow-lg">
                    <Eye className="w-4 h-4" />
                    <span>View Project Details</span>
                  </span>
                </div>

                {/* Sheet count */}
                <div className="absolute bottom-3 left-3 text-xs font-mono font-medium text-neutral-200 flex items-center space-x-1.5">
                  <FileCheck2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>{sample.sheetDetails}</span>
                </div>
              </div>

              {/* Content Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 
                    onClick={() => setSelectedItem(sample)}
                    className="text-base font-bold text-neutral-100 group-hover:text-amber-400 transition-colors cursor-pointer"
                  >
                    {sample.title}
                  </h3>
                  <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
                    {sample.description}
                  </p>

                  {/* Client Review Quote if present */}
                  {sample.clientReview && (
                    <div className="mt-3 p-2.5 rounded-lg bg-neutral-950/60 border border-neutral-800 text-[11px] text-neutral-300 flex items-start space-x-2">
                      <Star className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5 fill-amber-400" />
                      <div>
                        <p className="italic text-neutral-300">"{sample.clientReview.quote}"</p>
                        <span className="text-[10px] text-amber-400/80 font-mono mt-0.5 block">
                          Verified Client Review via {sample.clientReview.platform}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Specs List */}
                  <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-neutral-800/80 text-[11px]">
                    {sample.specs.map((sp, idx) => (
                      <div key={idx}>
                        <span className="text-neutral-500 block">{sp.label}:</span>
                        <span className="text-neutral-200 font-medium">{sp.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Actions & Software tags */}
                <div className="mt-4 pt-3 border-t border-neutral-800/80 space-y-3">
                  <div className="flex flex-wrap gap-1.5">
                    {sample.software.map((sw) => (
                      <span
                        key={sw}
                        className="px-2 py-0.5 rounded bg-neutral-950 border border-neutral-800 text-[10px] font-mono text-neutral-400"
                      >
                        {sw}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center space-x-2 pt-1">
                    {sample.pdfUrl ? (
                      <button
                        onClick={() => setSelectedItem(sample)}
                        className="flex-1 py-2 px-3 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Inspect PDF Drawings</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => setSelectedItem(sample)}
                        className="flex-1 py-2 px-3 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-medium flex items-center justify-center space-x-1.5 transition-all"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Project Details</span>
                      </button>
                    )}

                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>

      {/* PDF Drawing Inspector & Project Details Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-neutral-950/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-5xl max-h-[92vh] bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-neutral-800 flex items-center justify-between bg-neutral-950">
              <div className="flex items-center space-x-3">
                <span className="px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-semibold">
                  {selectedItem.category}
                </span>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-neutral-100">
                    {selectedItem.title}
                  </h3>
                  <p className="text-xs text-neutral-400 hidden sm:block">
                    {selectedItem.sheetDetails}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {selectedItem.pdfUrl && (
                  <a
                    href={selectedItem.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs flex items-center space-x-1.5 transition-all shadow-sm"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Open Fullscreen PDF</span>
                    <span className="sm:hidden">Open PDF</span>
                  </a>
                )}

                <button
                  onClick={() => setSelectedItem(null)}
                  className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-colors"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
              
              {/* PDF Viewer or High-Res Image Display */}
              {selectedItem.pdfUrl ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-neutral-400 font-mono">
                    <span className="flex items-center space-x-1.5 text-emerald-400 font-bold">
                      <Check className="w-4 h-4" />
                      <span>Original Architectural Deliverable Drawing Set (Interactive PDF View)</span>
                    </span>
                    <a
                      href={selectedItem.pdfUrl}
                      download
                      className="hover:text-amber-400 flex items-center space-x-1"
                    >
                      <Download className="w-3 h-3" />
                      <span>Download PDF</span>
                    </a>
                  </div>

                  <div className="w-full h-[480px] sm:h-[580px] rounded-xl overflow-hidden border border-neutral-700 bg-neutral-950 relative">
                    <iframe
                      src={`${selectedItem.pdfUrl}#toolbar=1&navpanes=1`}
                      title={selectedItem.title}
                      className="w-full h-full border-0"
                    />
                  </div>
                </div>
              ) : (
                <div className="w-full h-80 sm:h-[450px] rounded-xl overflow-hidden border border-neutral-800 bg-neutral-950">
                  <img
                    src={selectedItem.imageUrl}
                    alt={selectedItem.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Technical Description & Specs Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-neutral-950/80 p-5 rounded-xl border border-neutral-800">
                <div className="md:col-span-2 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 font-mono">
                    Project Scope & Execution Details
                  </h4>
                  <p className="text-sm text-neutral-300 leading-relaxed">
                    {selectedItem.description}
                  </p>

                  {selectedItem.clientReview && (
                    <div className="p-3 rounded-lg bg-neutral-900 border border-neutral-800 text-xs text-neutral-300 space-y-1">
                      <div className="flex items-center space-x-1 text-amber-400">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span className="font-bold text-neutral-200">
                          {selectedItem.clientReview.platform} Feedback
                        </span>
                      </div>
                      <p className="italic text-neutral-300">
                        "{selectedItem.clientReview.quote}"
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 font-mono">
                    Technical Specifications
                  </h4>
                  <div className="space-y-2 text-xs">
                    {selectedItem.specs.map((sp, idx) => (
                      <div key={idx} className="pb-1.5 border-b border-neutral-800/80">
                        <span className="text-neutral-500 block text-[11px]">{sp.label}</span>
                        <span className="text-neutral-200 font-semibold">{sp.value}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2">
                    <span className="text-[11px] text-neutral-500 block mb-1 font-mono">
                      Software & Frameworks:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {selectedItem.software.map((sw) => (
                        <span
                          key={sw}
                          className="px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-[10px] font-mono text-amber-400"
                        >
                          {sw}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-neutral-800 bg-neutral-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="text-xs text-neutral-400">
                Ready to execute drawings with this standard of precision?
              </span>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setSelectedItem(null)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-medium transition-colors"
                >
                  Close Preview
                </button>
                <a
                  href="#estimator"
                  onClick={() => setSelectedItem(null)}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold shadow-sm transition-all"
                >
                  Configure Estimate for This Project Type
                </a>
              </div>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};
