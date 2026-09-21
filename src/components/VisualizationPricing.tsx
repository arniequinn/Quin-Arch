import React, { useMemo, useState } from "react";
import { Globe2, Image as ImageIcon, MessageSquare, Mail, TrendingDown } from "lucide-react";
import { TARGET_MARKETS, MARKET_BENCHMARK_RATES, OFFERED_RATES } from "../data/architecturalData";
import { calculateVisualizationFee, RenderType } from "../utils/pricingTracks";
import { SpecialistProfile } from "../types";
import { EstimateDisclaimer } from "./EstimateDisclaimer";

interface VisualizationPricingProps {
  specialist: SpecialistProfile;
}

export const VisualizationPricing: React.FC<VisualizationPricingProps> = ({ specialist }) => {
  const [targetMarketId, setTargetMarketId] = useState<string>("us");
  const [renderArea, setRenderArea] = useState<number>(1200);
  const [renderType, setRenderType] = useState<RenderType>("interior");

  const market = MARKET_BENCHMARK_RATES[targetMarketId] ?? MARKET_BENCHMARK_RATES.us;
  const marketLabel = TARGET_MARKETS.find((m) => m.id === targetMarketId)?.name ?? "United States";

  const visualization = useMemo(
    () => calculateVisualizationFee(renderArea, renderType, targetMarketId),
    [renderArea, renderType, targetMarketId]
  );

  const waLink = (text: string) =>
    `https://wa.me/${specialist.whatsapp.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(text)}`;
  const mailLink = (subject: string, body: string) =>
    `mailto:${specialist.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  const visualizationWaText =
    `Hi ${specialist.name}, I'm interested in ${renderType} Visualization/Rendering on ArchScope.\n\n` +
    `• Area: ${renderArea.toLocaleString()} sq ft (${renderType})\n` +
    `• Target market: ${marketLabel}\n` +
    `• Estimated fee: $${visualization.offeredFee.toLocaleString()}\n\n` +
    `I'd like to discuss this.`;

  return (
    <div>
      <div className="text-center max-w-md mx-auto mb-8">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold mb-4">
          <TrendingDown className="w-3.5 h-3.5" />
          <span>Visualization & Rendering</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-100 tracking-tight">
          Photorealistic Rendering & Animation
        </h2>
        <p className="mt-3 text-sm text-neutral-400 leading-relaxed">
          Priced per square foot of the visualized area, with separate rates for exterior and
          interior scenes.
        </p>
      </div>

      <div className="flex flex-col items-center mb-8">
        <div className="flex items-center space-x-2 text-xs font-semibold text-neutral-300 mb-2.5">
          <Globe2 className="w-4 h-4 text-amber-400" />
          <span>Compare against typical rates in:</span>
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          {TARGET_MARKETS.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setTargetMarketId(m.id)}
              className={`px-3.5 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                targetMarketId === m.id
                  ? "bg-amber-500/15 border-amber-500/70 text-amber-400"
                  : "bg-neutral-900/60 border-neutral-800 text-neutral-400 hover:text-neutral-200 hover:border-neutral-700"
              }`}
            >
              {m.name}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-md mx-auto p-6 rounded-2xl bg-neutral-900/90 border border-neutral-800 shadow-xl flex flex-col">
        <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center mb-4">
          <ImageIcon className="w-5 h-5" />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setRenderType("interior")}
            className={`py-2 rounded-lg border text-xs font-semibold transition-all ${
              renderType === "interior"
                ? "bg-amber-500/15 border-amber-500/70 text-amber-400"
                : "bg-neutral-950/60 border-neutral-800 text-neutral-400 hover:text-neutral-200"
            }`}
          >
            Interior
          </button>
          <button
            type="button"
            onClick={() => setRenderType("exterior")}
            className={`py-2 rounded-lg border text-xs font-semibold transition-all ${
              renderType === "exterior"
                ? "bg-amber-500/15 border-amber-500/70 text-amber-400"
                : "bg-neutral-950/60 border-neutral-800 text-neutral-400 hover:text-neutral-200"
            }`}
          >
            Exterior
          </button>
        </div>

        <div className="mt-3">
          <label className="text-xs font-semibold text-neutral-300 block mb-1.5">
            Visualized area (sq ft)
          </label>
          <input
            type="number"
            min={100}
            max={20000}
            step={50}
            value={renderArea}
            onWheel={(e) => e.currentTarget.blur()}
            onChange={(e) => setRenderArea(Math.max(100, Number(e.target.value) || 0))}
            className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-700 text-sm font-mono font-bold text-amber-400 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="mt-4 pt-4 border-t border-neutral-800">
          <span className="text-[11px] text-neutral-500 block">
            At ${renderType === "exterior" ? OFFERED_RATES.exteriorRenderPerSqFt : OFFERED_RATES.interiorRenderPerSqFt}/sq ft flat, worldwide
          </span>
          <div className="mt-1 flex items-baseline space-x-2">
            <span className="text-2xl font-extrabold text-neutral-100 font-mono">
              ${visualization.offeredFee.toLocaleString()}
            </span>
            <span className="text-xs text-neutral-500 font-mono line-through">
              ${visualization.marketFee.toLocaleString()}
            </span>
          </div>
          <p className="text-[11px] text-amber-400 font-semibold mt-1">
            Save ~{visualization.savingsPercentage}% vs typical {marketLabel} rate
          </p>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2">
          <a
            href={waLink(visualizationWaText)}
            target="_blank"
            rel="noopener noreferrer"
            className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>WhatsApp</span>
          </a>
          <a
            href={mailLink("Visualization / Rendering Inquiry", visualizationWaText)}
            className="py-2.5 px-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-100 font-bold text-xs border border-neutral-700 transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
          >
            <Mail className="w-3.5 h-3.5 text-amber-400" />
            <span>Email</span>
          </a>
        </div>
      </div>

      <EstimateDisclaimer specialistFirstName={specialist.name.split(" ")[0]} className="max-w-md mx-auto mt-5" />

      <p className="mt-3 text-center text-[10px] text-neutral-600 max-w-2xl mx-auto leading-relaxed">
        Market comparison rates are researched blended benchmarks (Sept 2026) — actual local rates
        vary by firm, city, and project complexity.
      </p>
    </div>
  );
};
