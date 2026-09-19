import React, { useState, useEffect } from "react";
import {
  X,
  TrendingUp,
  Users,
  Compass,
  ArrowUpRight,
  Globe,
  Smartphone,
  Laptop,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  Bot,
  Copy,
  Check,
  RefreshCw,
  Award,
  Layers,
  Share2,
  Trash2,
  Activity,
} from "lucide-react";
import {
  TrafficAnalyticsSummary,
  TrafficAuditReport,
  TrafficSource,
  SpecialistProfile,
} from "../types";
import {
  fetchAnalyticsSummary,
  fetchTrafficAudit,
  recordTestVisit,
  resetAnalyticsVisits,
} from "../services/trafficAnalytics";

interface TrafficGrowthDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  specialist: SpecialistProfile;
}

export const TrafficGrowthDashboardModal: React.FC<TrafficGrowthDashboardModalProps> = ({
  isOpen,
  onClose,
  specialist,
}) => {
  const [activeTab, setActiveTab] = useState<"telemetry" | "agents">("telemetry");
  const [summary, setSummary] = useState<TrafficAnalyticsSummary | null>(null);
  const [audit, setAudit] = useState<TrafficAuditReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedActionId, setCopiedActionId] = useState<string | null>(null);
  const [isPinging, setIsPinging] = useState(false);
  const [pingMessage, setPingMessage] = useState<string | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [sumData, auditData] = await Promise.all([
        fetchAnalyticsSummary(),
        fetchTrafficAudit(),
      ]);
      if (sumData) setSummary(sumData);
      if (auditData) setAudit(auditData);
    } catch (e) {
      console.error("Failed to load traffic data:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedActionId(id);
    setTimeout(() => setCopiedActionId(null), 2500);
  };

  const handleManualTestPing = async () => {
    setIsPinging(true);
    setPingMessage(null);
    try {
      const res = await recordTestVisit();
      if (res && res.success) {
        setPingMessage(`Success! Logged test visit #${res.totalVisits}. Counter updated.`);
        await loadData();
      }
    } catch {
      setPingMessage("Failed to log ping.");
    } finally {
      setIsPinging(false);
      setTimeout(() => setPingMessage(null), 4000);
    }
  };

  const handleResetToZero = async () => {
    const success = await resetAnalyticsVisits();
    if (success) {
      setShowResetConfirm(false);
      await loadData();
    }
  };

  const totalVisits = summary?.totalVisits || 0;
  const uniqueVisitors = summary?.uniqueVisitors || 0;
  const calcsCount = summary?.scopeCalculationsCount || 0;
  const leadsCount = summary?.leadsCapturedCount || 0;
  const convRate = summary?.conversionRate || 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-neutral-950/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl max-h-[92vh] bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-neutral-100">
        
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-neutral-800 bg-neutral-950 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-bold tracking-tight text-neutral-100">
                  Traffic & Growth Intelligence Hub
                </h2>
                <span className="hidden sm:inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-mono font-medium">
                  <Activity className="w-3 h-3 animate-pulse" />
                  <span>100% Authentic Data</span>
                </span>
              </div>
              <p className="text-xs sm:text-sm text-neutral-400 mt-0.5">
                Real-time page visits, traffic referrers, and the dual-agent progressive benchmark engine
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={loadData}
              disabled={isLoading}
              className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-all cursor-pointer"
              title="Refresh real-time data"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin text-amber-400" : ""}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-neutral-800 bg-neutral-950/60 px-6 pt-3 shrink-0 gap-6">
          <button
            onClick={() => setActiveTab("telemetry")}
            className={`pb-3 text-sm font-semibold flex items-center space-x-2 border-b-2 transition-all cursor-pointer ${
              activeTab === "telemetry"
                ? "border-amber-500 text-amber-400"
                : "border-transparent text-neutral-400 hover:text-neutral-200"
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>Real Traffic Telemetry</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-neutral-800 font-mono text-neutral-300">
              {totalVisits} views
            </span>
          </button>

          <button
            onClick={() => setActiveTab("agents")}
            className={`pb-3 text-sm font-semibold flex items-center space-x-2 border-b-2 transition-all cursor-pointer ${
              activeTab === "agents"
                ? "border-amber-500 text-amber-400"
                : "border-transparent text-neutral-400 hover:text-neutral-200"
            }`}
          >
            <Bot className="w-4 h-4" />
            <span>Worker & Checker Agents</span>
            {audit?.activeBenchmark && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono">
                Level {audit.benchmarkLevel}
              </span>
            )}
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* TAB 1: REAL TELEMETRY & VISIT ANALYTICS */}
          {activeTab === "telemetry" && (
            <div className="space-y-6">
              
              {/* Authenticity Guarantee Banner */}
              <div className="p-4 rounded-2xl bg-neutral-950/80 border border-neutral-800 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-neutral-200 block">
                      Strict Authenticity Guarantee
                    </span>
                    <span className="text-xs text-neutral-400">
                      No simulated hits or fake charts. If views are 0, it reads 0. Every hit is logged with referrer & device headers.
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleManualTestPing}
                    disabled={isPinging}
                    className="px-3.5 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-mono font-semibold transition-all flex items-center space-x-1.5 cursor-pointer"
                    title="Logs 1 genuine ping to verify live telemetry works"
                  >
                    <Activity className={`w-3.5 h-3.5 ${isPinging ? "animate-spin" : ""}`} />
                    <span>{isPinging ? "Logging Ping..." : "Log Test Visit Ping"}</span>
                  </button>

                  <button
                    onClick={() => setShowResetConfirm(!showResetConfirm)}
                    className="p-1.5 rounded-xl hover:bg-red-500/10 text-neutral-500 hover:text-red-400 transition-all cursor-pointer"
                    title="Reset visits back to zero"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {pingMessage && (
                <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs font-mono animate-in fade-in">
                  {pingMessage}
                </div>
              )}

              {showResetConfirm && (
                <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/30 text-xs space-y-2">
                  <span className="text-red-300 font-semibold block">
                    Confirm reset all traffic analytics back to 0?
                  </span>
                  <div className="flex space-x-2">
                    <button
                      onClick={handleResetToZero}
                      className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white rounded-lg font-semibold"
                    >
                      Yes, reset to 0
                    </button>
                    <button
                      onClick={() => setShowResetConfirm(false)}
                      className="px-3 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-lg"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Core Scorecard */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-neutral-950/60 border border-neutral-800">
                  <span className="text-xs text-neutral-400 font-medium block">Total Page Views</span>
                  <div className="mt-2 flex items-baseline space-x-2">
                    <span className="text-3xl font-extrabold text-neutral-100 font-mono">
                      {totalVisits}
                    </span>
                    <span className="text-xs text-neutral-500">genuine</span>
                  </div>
                  <span className="text-[11px] text-neutral-400 mt-1 block">
                    {totalVisits === 0 ? "Awaiting first visitor" : "Logged in database"}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-neutral-950/60 border border-neutral-800">
                  <span className="text-xs text-neutral-400 font-medium block">Unique Visitors</span>
                  <div className="mt-2 flex items-baseline space-x-2">
                    <span className="text-3xl font-extrabold text-amber-400 font-mono">
                      {uniqueVisitors}
                    </span>
                    <span className="text-xs text-neutral-500">sessions</span>
                  </div>
                  <span className="text-[11px] text-neutral-400 mt-1 block">
                    Distinct browser instances
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-neutral-950/60 border border-neutral-800">
                  <span className="text-xs text-neutral-400 font-medium block">Scope Calculations</span>
                  <div className="mt-2 flex items-baseline space-x-2">
                    <span className="text-3xl font-extrabold text-emerald-400 font-mono">
                      {calcsCount}
                    </span>
                    <span className="text-xs text-neutral-500">completed</span>
                  </div>
                  <span className="text-[11px] text-neutral-400 mt-1 block">
                    Interactive estimator runs
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-neutral-950/60 border border-neutral-800">
                  <span className="text-xs text-neutral-400 font-medium block">Calculations Conversion</span>
                  <div className="mt-2 flex items-baseline space-x-2">
                    <span className="text-3xl font-extrabold text-neutral-100 font-mono">
                      {convRate}%
                    </span>
                  </div>
                  <span className="text-[11px] text-neutral-400 mt-1 block">
                    {leadsCount} inquiries captured
                  </span>
                </div>
              </div>

              {/* Traffic Channels Breakdown */}
              <div className="p-5 rounded-2xl bg-neutral-950/40 border border-neutral-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-neutral-200 flex items-center space-x-2">
                    <Layers className="w-4 h-4 text-amber-400" />
                    <span>Traffic Sources & Referrers</span>
                  </h3>
                  <span className="text-xs font-mono text-neutral-400">
                    {Object.values(summary?.visitsBySource || {}).filter((v) => (Number(v) || 0) > 0).length} active channels
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {(
                    [
                      { key: "Upwork", label: "Upwork Proposals", icon: "💼" },
                      { key: "Instagram", label: "Instagram (@quin_arch)", icon: "📸" },
                      { key: "LinkedIn", label: "LinkedIn Posts", icon: "💼" },
                      { key: "WhatsApp", label: "WhatsApp Direct", icon: "💬" },
                      { key: "Google", label: "Google Search (SEO)", icon: "🔍" },
                      { key: "Direct", label: "Direct URL / QR Entry", icon: "🔗" },
                    ] as const
                  ).map((chan) => {
                    const count = summary?.visitsBySource?.[chan.key as TrafficSource] || 0;
                    const pct = totalVisits > 0 ? Math.round((count / totalVisits) * 100) : 0;
                    return (
                      <div
                        key={chan.key}
                        className={`p-3 rounded-xl border transition-all ${
                          count > 0
                            ? "bg-amber-500/5 border-amber-500/30"
                            : "bg-neutral-900/40 border-neutral-800/60 opacity-60"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-neutral-300 flex items-center space-x-1.5">
                            <span>{chan.icon}</span>
                            <span>{chan.label}</span>
                          </span>
                          <span className="text-xs font-mono font-bold text-amber-400">{count}</span>
                        </div>
                        <div className="mt-2 w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-neutral-500 mt-1 block text-right font-mono">
                          {pct}% of traffic
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Devices & Geographical Reach */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Devices */}
                <div className="p-4 rounded-2xl bg-neutral-950/40 border border-neutral-800 space-y-3">
                  <h4 className="text-xs font-bold text-neutral-300 flex items-center space-x-2">
                    <Laptop className="w-4 h-4 text-neutral-400" />
                    <span>Device Split</span>
                  </h4>
                  <div className="space-y-2 text-xs font-mono">
                    <div className="flex justify-between items-center">
                      <span className="text-neutral-400 flex items-center space-x-1.5">
                        <Laptop className="w-3.5 h-3.5" />
                        <span>Desktop</span>
                      </span>
                      <span className="font-bold text-neutral-200">
                        {summary?.visitsByDevice?.Desktop || 0} visits
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-neutral-400 flex items-center space-x-1.5">
                        <Smartphone className="w-3.5 h-3.5" />
                        <span>Mobile</span>
                      </span>
                      <span className="font-bold text-neutral-200">
                        {summary?.visitsByDevice?.Mobile || 0} visits
                      </span>
                    </div>
                  </div>
                </div>

                {/* Timezones */}
                <div className="p-4 rounded-2xl bg-neutral-950/40 border border-neutral-800 space-y-3">
                  <h4 className="text-xs font-bold text-neutral-300 flex items-center space-x-2">
                    <Globe className="w-4 h-4 text-neutral-400" />
                    <span>Top Visitor Timezones</span>
                  </h4>
                  <div className="space-y-1.5 text-xs font-mono max-h-24 overflow-y-auto">
                    {Object.entries(summary?.visitsByTimezone || {}).length === 0 ? (
                      <span className="text-neutral-500 italic block">No timezone data yet</span>
                    ) : (
                      Object.entries(summary?.visitsByTimezone || {}).map(([tz, count]) => (
                        <div key={tz} className="flex justify-between items-center">
                          <span className="text-neutral-400 truncate max-w-[180px]">{tz}</span>
                          <span className="font-bold text-amber-400">{count} hits</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Real-time Visit Activity Feed */}
              <div className="p-5 rounded-2xl bg-neutral-950/60 border border-neutral-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-neutral-200 flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-amber-400" />
                    <span>Live Visitor Activity Log</span>
                  </h3>
                  <span className="text-xs font-mono text-neutral-500">Last 25 Events</span>
                </div>

                {(!summary?.recentVisits || summary.recentVisits.length === 0) ? (
                  <div className="py-8 text-center border border-dashed border-neutral-800 rounded-xl space-y-2">
                    <Globe className="w-8 h-8 text-neutral-600 mx-auto" />
                    <p className="text-xs text-neutral-400">
                      Zero visits logged so far. Share your link or click "Log Test Visit Ping" to test.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-mono">
                      <thead>
                        <tr className="border-b border-neutral-800 text-neutral-400">
                          <th className="pb-2">Time</th>
                          <th className="pb-2">Channel</th>
                          <th className="pb-2">Device</th>
                          <th className="pb-2">Location / Timezone</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-900 text-neutral-300">
                        {summary.recentVisits.map((v) => (
                          <tr key={v.id} className="hover:bg-neutral-900/40">
                            <td className="py-2 text-neutral-400">
                              {new Date(v.timestamp).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                                second: "2-digit",
                              })}
                            </td>
                            <td className="py-2">
                              <span className="px-2 py-0.5 rounded-full bg-neutral-800 text-amber-300 text-[11px]">
                                {v.sourceCategory}
                              </span>
                            </td>
                            <td className="py-2 text-neutral-400">{v.deviceType}</td>
                            <td className="py-2 text-neutral-400 truncate max-w-[200px]">
                              {v.timezone || "UTC"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* TAB 2: WORKER & CHECKER AGENT BENCHMARK SYSTEM */}
          {activeTab === "agents" && (
            <div className="space-y-6">

              {/* Checker Agent Benchmark Header */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 border border-amber-500/30 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                      <Bot className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs uppercase font-mono font-bold tracking-wider text-amber-400">
                          The Checker Agent • Active Performance Benchmark
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 text-xs font-mono font-bold border border-amber-500/30">
                          Stage {audit?.benchmarkLevel || 1}
                        </span>
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-neutral-100 mt-0.5">
                        {audit?.activeBenchmark?.name || "Stage 1: Launch & Verification"}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 bg-neutral-900/80 px-3.5 py-1.5 rounded-xl border border-neutral-800">
                    <Award className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-mono font-semibold text-neutral-300">
                      Score: <span className="text-amber-400 font-bold">{audit?.checkerAgentVerdict?.score || "2.5"}</span> / 10
                    </span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                  {audit?.activeBenchmark?.description}
                </p>

                {/* Progress Towards Raising the Bar */}
                <div className="space-y-2 pt-2 border-t border-neutral-800/80">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-neutral-400">
                      Progress Towards Clearing Benchmark:
                    </span>
                    <span className="text-amber-400 font-bold">
                      {audit?.benchmarkProgressPct || 0}% Complete
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-neutral-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-emerald-400 rounded-full transition-all duration-700"
                      style={{ width: `${audit?.benchmarkProgressPct || 0}%` }}
                    />
                  </div>
                  <div className="flex flex-wrap items-center justify-between text-[11px] font-mono text-neutral-400 pt-1">
                    <span>
                      Target: {audit?.activeBenchmark?.targetVisits} visits ({totalVisits} achieved)
                    </span>
                    <span>
                      {audit?.activeBenchmark?.targetCalculations} calculations ({calcsCount} achieved)
                    </span>
                    <span>
                      {audit?.activeBenchmark?.requiredChannels} channels (
                      {Object.values(summary?.visitsBySource || {}).filter((v) => (Number(v) || 0) > 0).length} active)
                    </span>
                  </div>
                </div>

                {/* Auto Bar-Raising Rule Explanation */}
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200/90 flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>
                    <strong>Dynamic Progression:</strong> Once you meet all criteria for this stage, the Checker Agent automatically raises the bar to the next stage to systematically drive more client conversions.
                  </span>
                </div>
              </div>

              {/* Checker Agent Diagnostic Assessment */}
              <div className="p-5 rounded-2xl bg-neutral-950/60 border border-neutral-800 space-y-3">
                <h4 className="text-xs font-bold uppercase font-mono tracking-wider text-neutral-400">
                  Checker Agent Diagnostic Assessment
                </h4>
                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-sans">
                  {audit?.checkerAgentVerdict?.assessment}
                </p>

                {audit?.checkerAgentVerdict?.missingSignals && audit.checkerAgentVerdict.missingSignals.length > 0 && (
                  <div className="space-y-1.5 pt-2">
                    <span className="text-xs font-mono font-semibold text-neutral-400 block">
                      Signals currently missing to clear this bar:
                    </span>
                    {audit.checkerAgentVerdict.missingSignals.map((sig, idx) => (
                      <div key={idx} className="flex items-start space-x-2 text-xs text-amber-300/80">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <span>{sig}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Worker Agent Tactical Sprints */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase font-mono tracking-wider text-neutral-400 flex items-center space-x-2">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Worker Agent Targeted Actions to Clear the Benchmark</span>
                  </h4>
                  <span className="text-xs text-neutral-500 font-mono">
                    {audit?.workerAgentActions?.length || 0} Action Items
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {audit?.workerAgentActions?.map((act) => (
                    <div
                      key={act.id}
                      className="p-4 rounded-2xl bg-neutral-950/60 border border-neutral-800 space-y-3 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-0.5 rounded-full bg-neutral-800 text-[11px] font-mono text-amber-400 font-medium">
                            {act.channel}
                          </span>
                          <span
                            className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full ${
                              act.priority === "High"
                                ? "bg-red-500/10 text-red-400 border border-red-500/30"
                                : "bg-neutral-800 text-neutral-400"
                            }`}
                          >
                            {act.priority} Priority
                          </span>
                        </div>
                        <h5 className="text-sm font-bold text-neutral-200 mt-2">{act.title}</h5>
                        <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                          {act.description}
                        </p>
                      </div>

                      {/* Action Execution Button */}
                      <div className="pt-2 border-t border-neutral-900">
                        {act.copySnippet ? (
                          <button
                            onClick={() => handleCopy(act.copySnippet!, act.id)}
                            className="w-full py-2 px-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-xs font-mono font-semibold text-neutral-200 flex items-center justify-center space-x-2 border border-neutral-800 hover:border-neutral-700 transition-all cursor-pointer"
                          >
                            {copiedActionId === act.id ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                                <span className="text-emerald-400">Hook Copied to Clipboard!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5 text-amber-400" />
                                <span>Copy Hook for {act.channel}</span>
                              </>
                            )}
                          </button>
                        ) : act.actionType === "open_whatsapp" ? (
                          <a
                            href={`https://wa.me/?text=${encodeURIComponent(
                              `Hi! Need architectural CAD drawings or Revit 3D BIM modeling? Calculate scope & fees instantly with our new tool: ${window.location.origin}`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full py-2 px-3 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/60 text-xs font-mono font-semibold text-emerald-300 flex items-center justify-center space-x-2 border border-emerald-500/30 transition-all cursor-pointer"
                          >
                            <Share2 className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Share via WhatsApp</span>
                          </a>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* The Progressive Milestone Ladder (Stages 1 through 5) */}
              <div className="p-5 rounded-2xl bg-neutral-950/40 border border-neutral-800 space-y-3">
                <h4 className="text-xs font-bold uppercase font-mono tracking-wider text-neutral-400 flex items-center space-x-2">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>The Milestone Ladder — How the Bar Rises</span>
                </h4>
                
                <div className="space-y-2.5">
                  {[
                    { level: 1, name: "Stage 1: Launch & Verification", visits: 5, calcs: 1, channels: 1 },
                    { level: 2, name: "Stage 2: First External Channel Proof", visits: 15, calcs: 3, channels: 2 },
                    { level: 3, name: "Stage 3: Multi-Channel Lead Acquisition", visits: 35, calcs: 6, channels: 2 },
                    { level: 4, name: "Stage 4: Inbound Architectural Client Velocity", visits: 75, calcs: 12, channels: 3 },
                    { level: 5, name: "Stage 5: High-Converting Commercial Remote Pipeline", visits: 150, calcs: 25, channels: 4 },
                  ].map((stage) => {
                    const currentLvl = audit?.benchmarkLevel || 1;
                    const isPassed = currentLvl > stage.level;
                    const isCurrent = currentLvl === stage.level;

                    return (
                      <div
                        key={stage.level}
                        className={`p-3 rounded-xl border flex items-center justify-between text-xs font-mono transition-all ${
                          isPassed
                            ? "bg-emerald-950/30 border-emerald-500/30 text-emerald-300"
                            : isCurrent
                            ? "bg-amber-500/10 border-amber-500/50 text-amber-200 ring-1 ring-amber-500/30"
                            : "bg-neutral-900/30 border-neutral-800/60 text-neutral-500"
                        }`}
                      >
                        <div className="flex items-center space-x-2.5">
                          {isPassed ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          ) : isCurrent ? (
                            <div className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                          ) : (
                            <div className="w-2 h-2 rounded-full bg-neutral-700" />
                          )}
                          <span className="font-bold">{stage.name}</span>
                        </div>

                        <div className="flex items-center space-x-3 text-[11px]">
                          <span>
                            {stage.visits} views • {stage.calcs} calcs • {stage.channels} ch
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-md font-bold uppercase text-[10px] ${
                              isPassed
                                ? "bg-emerald-500/20 text-emerald-300"
                                : isCurrent
                                ? "bg-amber-500/20 text-amber-300"
                                : "bg-neutral-800 text-neutral-600"
                            }`}
                          >
                            {isPassed ? "Cleared" : isCurrent ? "Active Target" : "Upcoming"}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-neutral-950 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-400 shrink-0">
          <span className="font-mono">
            Direct WhatsApp: <strong className="text-neutral-200">{specialist.whatsapp}</strong>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-semibold transition-all cursor-pointer"
          >
            Close Dashboard
          </button>
        </div>

      </div>
    </div>
  );
};
