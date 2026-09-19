import React, { useState } from "react";
import { 
  X, 
  Download, 
  Mail, 
  MessageSquare, 
  FileSpreadsheet, 
  Clock, 
  Calendar, 
  User, 
  DollarSign, 
  CheckCircle2, 
  Filter,
  ExternalLink,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  RefreshCw,
  Trash2,
  Bot,
  Globe,
  Phone,
  Sparkles,
  AlertCircle,
  Target,
  Link2
} from "lucide-react";
import { LeadSubmission, SpecialistProfile } from "../types";

interface LeadManagerDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  leads: LeadSubmission[];
  onUpdateLeadStatus: (leadId: string, status: LeadSubmission["status"]) => void;
  specialist: SpecialistProfile;
  onRefreshLeads?: () => void;
  onOpenLeadFinder?: () => void;
}

export const LeadManagerDrawer: React.FC<LeadManagerDrawerProps> = ({
  isOpen,
  onClose,
  leads: propLeads,
  onUpdateLeadStatus,
  specialist,
  onRefreshLeads,
  onOpenLeadFinder,
}) => {
  const [localLeads, setLocalLeads] = useState<LeadSubmission[]>(propLeads);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [isScanning, setIsScanning] = useState(false);
  const [isPurging, setIsPurging] = useState(false);
  const [botMessage, setBotMessage] = useState<string | null>(null);

  // Sync when prop updates
  React.useEffect(() => {
    setLocalLeads(propLeads);
  }, [propLeads]);

  if (!isOpen) return null;

  const fakeLeadsCount = localLeads.filter((l) => l.verification?.overallStatus === "fake").length;
  const verifiedLeadsCount = localLeads.filter((l) => l.verification?.overallStatus === "verified").length;
  const suspiciousLeadsCount = localLeads.filter((l) => l.verification?.overallStatus === "suspicious").length;

  const filteredLeads = localLeads.filter((lead) => {
    if (filterStatus === "all") return true;
    if (filterStatus === "flagged_fake") return lead.verification?.overallStatus === "fake";
    if (filterStatus === "verified_real") return lead.verification?.overallStatus === "verified";
    if (filterStatus === "suspicious") return lead.verification?.overallStatus === "suspicious";
    return lead.status === filterStatus;
  });

  // Run full bot audit across all leads
  const handleRunBotAudit = async () => {
    setIsScanning(true);
    setBotMessage(null);
    try {
      const res = await fetch("/api/leads/verify-all", { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        if (data.leads) {
          setLocalLeads(data.leads);
          setBotMessage(
            `Audit complete: ${data.summary.scannedCount} leads audited. ${data.summary.fakeCount} flagged as fake, ${data.summary.verifiedCount} verified real.`
          );
        }
      }
      if (onRefreshLeads) onRefreshLeads();
    } catch (err) {
      console.error("Bot audit error:", err);
      setBotMessage("Verification bot encountered an error during DNS MX scanning.");
    } finally {
      setIsScanning(false);
    }
  };

  // Purge all leads flagged as fake
  const handlePurgeFakeLeads = async () => {
    if (fakeLeadsCount === 0) return;
    setIsPurging(true);
    try {
      const res = await fetch("/api/leads/purge-fake", { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setLocalLeads(data.leads || []);
        setBotMessage(`Successfully purged ${data.purgedCount} fake/unverifiable lead(s).`);
        if (onRefreshLeads) onRefreshLeads();
      }
    } catch (err) {
      console.error("Purge fake error:", err);
    } finally {
      setIsPurging(false);
    }
  };

  // Delete a single lead
  const handleDeleteLead = async (leadId: string) => {
    try {
      const res = await fetch(`/api/leads/${leadId}`, { method: "DELETE" });
      if (res.ok) {
        setLocalLeads((prev) => prev.filter((l) => l.id !== leadId));
        if (onRefreshLeads) onRefreshLeads();
      }
    } catch (err) {
      console.error("Delete lead error:", err);
    }
  };

  // Single lead audit
  const handleVerifySingleLead = async (leadId: string) => {
    try {
      const res = await fetch(`/api/leads/verify/${leadId}`, { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        if (data.lead) {
          setLocalLeads((prev) => prev.map((l) => (l.id === leadId ? data.lead : l)));
        }
      }
    } catch (err) {
      console.error("Single lead audit error:", err);
    }
  };

  // Clear all leads
  const handleClearAllLeads = async () => {
    if (!window.confirm("Are you sure you want to clear all leads from CRM storage?")) return;
    try {
      const res = await fetch("/api/leads/clear-all", { method: "POST" });
      if (res.ok) {
        setLocalLeads([]);
        setBotMessage("All leads have been wiped clean. Database is at 0 inquiries.");
        if (onRefreshLeads) onRefreshLeads();
      }
    } catch (err) {
      console.error("Clear all error:", err);
    }
  };

  const exportToCSV = () => {
    const headers = [
      "ID,Date,Name,Email,Email_Status,Phone,Phone_Status,Reliability_Score,Verdict,Firm/Role,Project Title,Type,Area (sq ft),Services,Fee Min,Fee Max,Turnaround (days),Status"
    ];
    const rows = localLeads.map((l) => [
      `"${l.id}"`,
      `"${l.createdAt}"`,
      `"${l.clientName}"`,
      `"${l.email || "NO_EMAIL_FOUND"}"`,
      `"${l.verification?.emailCheck.status || "UNCHECKED"}"`,
      `"${l.phone || "NO_PHONE_FOUND"}"`,
      `"${l.verification?.phoneCheck.status || "UNCHECKED"}"`,
      l.verification?.reliabilityScore ?? "N/A",
      `"${l.verification?.overallStatus || "pending"}"`,
      `"${l.firmOrRole}"`,
      `"${l.projectTitle}"`,
      `"${l.projectType}"`,
      l.areaSqFt,
      `"${l.services.join("; ")}"`,
      l.estimatedFeeRange.min,
      l.estimatedFeeRange.max,
      l.estimatedTurnaroundDays,
      `"${l.status}"`
    ].join(","));

    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `archscope-verified-leads-${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const statusColors: Record<LeadSubmission["status"], { bg: string; text: string; label: string }> = {
    new: { bg: "bg-amber-500/20", text: "text-amber-400", label: "New Lead" },
    contacted: { bg: "bg-blue-500/20", text: "text-blue-400", label: "Contacted" },
    proposal_sent: { bg: "bg-purple-500/20", text: "text-purple-400", label: "Proposal Sent" },
    converted: { bg: "bg-emerald-500/20", text: "text-emerald-400", label: "Client Won" },
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-neutral-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-neutral-900 border-l border-neutral-800 shadow-2xl h-full flex flex-col text-neutral-100 overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-neutral-800 flex items-center justify-between bg-neutral-950">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-bold text-neutral-100">
                  Lead Magnet CRM & Inquiries
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-neutral-800 text-[11px] font-mono text-neutral-400 border border-neutral-700">
                  {localLeads.length} Total
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">
                Prospective client projects captured with automated LeadSentry verification
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {onOpenLeadFinder && (
              <button
                onClick={() => {
                  onClose();
                  onOpenLeadFinder();
                }}
                className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold flex items-center space-x-1.5 transition-all shadow-sm cursor-pointer"
                title="Open Client Lead Finder & Outreach Engine"
              >
                <Target className="w-3.5 h-3.5" />
                <span>Find Clients</span>
              </button>
            )}

            <button
              onClick={exportToCSV}
              className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold border border-neutral-700 flex items-center space-x-1.5 transition-colors"
              title="Export all leads and verification statuses"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* LeadSentry Verification Bot Status & Control Bar */}
        <div className="px-6 py-4 bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950 border-b border-neutral-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center space-x-2">
                <div className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <Bot className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold text-neutral-200">
                    LeadSentry Verification Bot (Active)
                  </span>
                </div>
                <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono">
                  DNS MX + E.164
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 mt-1">
                Continuous background surveillance audits email domain mail servers, detects fake 555 numbers, and flags non-existent data.
              </p>
            </div>

            {/* Bot Actions */}
            <div className="flex items-center space-x-2 shrink-0">
              <button
                onClick={handleRunBotAudit}
                disabled={isScanning}
                className="px-2.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold border border-neutral-700 flex items-center space-x-1.5 transition-colors disabled:opacity-50"
                title="Trigger immediate DNS MX & phone format verification scan on all records"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-neutral-400 ${isScanning ? "animate-spin" : ""}`} />
                <span>{isScanning ? "Auditing..." : "Bot Re-Scan"}</span>
              </button>

              {fakeLeadsCount > 0 && (
                <button
                  onClick={handlePurgeFakeLeads}
                  disabled={isPurging}
                  className="px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-semibold border border-rose-500/40 flex items-center space-x-1.5 transition-colors"
                  title="Purge all leads flagged as fake by the verification agent"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                  <span>Purge Fake ({fakeLeadsCount})</span>
                </button>
              )}

              {localLeads.length > 0 && (
                <button
                  onClick={handleClearAllLeads}
                  className="px-2 py-1.5 rounded-lg hover:bg-neutral-800 text-neutral-500 hover:text-neutral-300 text-xs transition-colors"
                  title="Wipe all lead entries to 0"
                >
                  Wipe Clean
                </button>
              )}
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-neutral-800/60 text-center">
            <div className="p-2 rounded-lg bg-neutral-950/70 border border-neutral-800/80">
              <span className="text-[10px] text-neutral-500 uppercase tracking-wider block">Verified Real</span>
              <span className="text-sm font-bold text-emerald-400 font-mono">{verifiedLeadsCount}</span>
            </div>
            <div className="p-2 rounded-lg bg-neutral-950/70 border border-neutral-800/80">
              <span className="text-[10px] text-neutral-500 uppercase tracking-wider block">Flagged Fake</span>
              <span className={`text-sm font-bold font-mono ${fakeLeadsCount > 0 ? "text-rose-400" : "text-neutral-400"}`}>
                {fakeLeadsCount}
              </span>
            </div>
            <div className="p-2 rounded-lg bg-neutral-950/70 border border-neutral-800/80">
              <span className="text-[10px] text-neutral-500 uppercase tracking-wider block">Incomplete / Missing</span>
              <span className="text-sm font-bold text-amber-400 font-mono">{suspiciousLeadsCount}</span>
            </div>
          </div>

          {botMessage && (
            <div className="mt-2.5 p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
              <span>{botMessage}</span>
            </div>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="px-6 py-2.5 border-b border-neutral-800 bg-neutral-950/50 flex items-center space-x-2 overflow-x-auto text-xs">
          <span className="text-neutral-500 font-medium shrink-0">Filter:</span>
          {[
            { id: "all", label: `All (${localLeads.length})` },
            { id: "flagged_fake", label: `Flagged Fake (${fakeLeadsCount})`, alert: fakeLeadsCount > 0 },
            { id: "verified_real", label: `Verified Real (${verifiedLeadsCount})` },
            { id: "new", label: "New Leads" },
            { id: "contacted", label: "Contacted" },
            { id: "converted", label: "Client Won" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={`px-3 py-1 rounded-lg capitalize whitespace-nowrap transition-all flex items-center space-x-1.5 ${
                filterStatus === tab.id
                  ? tab.alert
                    ? "bg-rose-500 text-white font-bold"
                    : "bg-amber-500 text-neutral-950 font-bold"
                  : tab.alert
                  ? "bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-rose-500/20"
                  : "bg-neutral-800/80 text-neutral-400 hover:text-neutral-200"
              }`}
            >
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Leads List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {filteredLeads.length === 0 ? (
            <div className="text-center py-16 text-neutral-500 text-sm space-y-2">
              <div className="w-12 h-12 rounded-full bg-neutral-800/50 border border-neutral-700 flex items-center justify-center mx-auto text-neutral-400">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <p className="font-medium text-neutral-300">No leads found under this filter.</p>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                {localLeads.length === 0 
                  ? "Your CRM database is clean. When potential clients complete the Scope Estimator, their inquiry will appear here and undergo immediate DNS mail verification."
                  : "Try selecting 'All' or running a bot scan to re-evaluate lead verification records."}
              </p>
              {localLeads.length === 0 && onOpenLeadFinder && (
                <div className="pt-3">
                  <button
                    onClick={() => {
                      onClose();
                      onOpenLeadFinder();
                    }}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-bold text-xs shadow-md shadow-amber-500/20 inline-flex items-center space-x-2 transition-all cursor-pointer"
                  >
                    <Target className="w-4 h-4" />
                    <span>Launch Lead Acquisition & Outreach Engine</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            filteredLeads.map((lead) => {
              const statusCfg = statusColors[lead.status] || statusColors.new;
              const verification = lead.verification;
              const isFake = verification?.overallStatus === "fake";
              const isVerified = verification?.overallStatus === "verified";
              const isSuspicious = verification?.overallStatus === "suspicious";

              return (
                <div
                  key={lead.id}
                  className={`p-5 rounded-2xl border transition-all space-y-3.5 ${
                    isFake
                      ? "bg-neutral-950/90 border-rose-500/40 hover:border-rose-500/70"
                      : isVerified
                      ? "bg-neutral-950/80 border-emerald-500/30 hover:border-emerald-500/60"
                      : "bg-neutral-950/70 border-neutral-800 hover:border-neutral-700"
                  }`}
                >
                  {/* Lead Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-base text-neutral-100">
                          {lead.clientName}
                        </span>
                        <span className="text-xs text-amber-400 font-medium">
                          • {lead.firmOrRole}
                        </span>
                      </div>
                      <span className="text-xs text-neutral-400 mt-0.5 block">
                        {lead.projectTitle} ({lead.areaSqFt.toLocaleString()} sq ft)
                      </span>
                    </div>

                    {/* Status & Verification Badges */}
                    <div className="flex items-center space-x-2 shrink-0">
                      {/* Reliability Badge */}
                      {isFake && (
                        <div className="px-2.5 py-1 rounded-lg bg-rose-500/20 border border-rose-500/50 text-rose-400 text-xs font-bold flex items-center space-x-1">
                          <ShieldAlert className="w-3.5 h-3.5" />
                          <span>FAKED / UNRELIABLE (0%)</span>
                        </div>
                      )}

                      {isVerified && (
                        <div className="px-2.5 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 text-xs font-bold flex items-center space-x-1">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>VERIFIED REAL ({verification?.reliabilityScore ?? 95}%)</span>
                        </div>
                      )}

                      {isSuspicious && (
                        <div className="px-2.5 py-1 rounded-lg bg-amber-500/20 border border-amber-500/50 text-amber-400 text-xs font-bold flex items-center space-x-1">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>PARTIAL / UNVERIFIED ({verification?.reliabilityScore ?? 50}%)</span>
                        </div>
                      )}

                      {/* Status Dropdown */}
                      <select
                        value={lead.status}
                        onChange={(e) => onUpdateLeadStatus(lead.id, e.target.value as LeadSubmission["status"])}
                        className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border border-neutral-700 focus:outline-none cursor-pointer ${statusCfg.bg} ${statusCfg.text}`}
                      >
                        <option value="new" className="bg-neutral-900 text-neutral-200">New Lead</option>
                        <option value="contacted" className="bg-neutral-900 text-neutral-200">Contacted</option>
                        <option value="proposal_sent" className="bg-neutral-900 text-neutral-200">Proposal Sent</option>
                        <option value="converted" className="bg-neutral-900 text-neutral-200">Client Won</option>
                      </select>

                      {/* Delete Lead Button */}
                      <button
                        onClick={() => handleDeleteLead(lead.id)}
                        className="p-1 rounded-lg text-neutral-500 hover:text-rose-400 hover:bg-neutral-800 transition-colors"
                        title="Delete lead from CRM"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* LeadSentry Verification Agent Audit Panel */}
                  <div className={`p-3.5 rounded-xl border text-xs space-y-2.5 ${
                    isFake 
                      ? "bg-rose-950/20 border-rose-500/30" 
                      : isVerified 
                      ? "bg-emerald-950/15 border-emerald-500/20" 
                      : "bg-neutral-900/80 border-neutral-800"
                  }`}>
                    <div className="flex items-center justify-between text-[11px] font-mono border-b border-neutral-800/60 pb-1.5">
                      <div className="flex items-center space-x-1.5 text-neutral-400">
                        <Bot className={`w-3.5 h-3.5 ${isFake ? "text-rose-400" : isVerified ? "text-emerald-400" : "text-amber-400"}`} />
                        <span>LeadSentry Diagnostic Audit</span>
                        {verification?.verifiedAt && (
                          <span className="text-neutral-500">
                            • Audited {new Date(verification.verifiedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => handleVerifySingleLead(lead.id)}
                        className="text-neutral-400 hover:text-neutral-200 flex items-center space-x-1 transition-colors"
                        title="Re-run DNS MX and phone check"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Re-Verify</span>
                      </button>
                    </div>

                    {/* Email Verification Row */}
                    <div className="flex items-start justify-between gap-3 text-xs">
                      <div className="space-y-0.5 flex-1">
                        <div className="flex items-center space-x-1.5">
                          <Mail className="w-3.5 h-3.5 text-neutral-400" />
                          <span className="font-semibold text-neutral-300">Email Address:</span>
                          <span className="font-mono text-neutral-200">
                            {lead.email || <span className="text-rose-400 font-bold">No Email Found</span>}
                          </span>
                        </div>
                        <p className={`text-[11px] leading-relaxed ${
                          isFake || verification?.emailCheck?.status === "invalid_domain" || verification?.emailCheck?.status === "no_mx"
                            ? "text-rose-300"
                            : verification?.emailCheck?.status === "valid_mx"
                            ? "text-emerald-400"
                            : "text-neutral-400"
                        }`}>
                          {verification?.emailCheck?.diagnosticMessage || (
                            lead.email 
                              ? `Checking domain '${lead.email.split("@")[1]}' via DNS MX records...` 
                              : "No email address found on lead record."
                          )}
                        </p>
                      </div>

                      <div className="shrink-0">
                        {verification?.emailCheck?.status === "valid_mx" && (
                          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-mono border border-emerald-500/30">
                            MX Verified
                          </span>
                        )}
                        {(verification?.emailCheck?.status === "invalid_domain" || verification?.emailCheck?.status === "no_mx") && (
                          <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[10px] font-mono border border-rose-500/30">
                            Non-Existent Mail Server
                          </span>
                        )}
                        {(!lead.email || verification?.emailCheck?.status === "missing") && (
                          <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[10px] font-mono border border-rose-500/30">
                            No Email Found
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Phone Verification Row */}
                    <div className="flex items-start justify-between gap-3 text-xs pt-1.5 border-t border-neutral-800/50">
                      <div className="space-y-0.5 flex-1">
                        <div className="flex items-center space-x-1.5">
                          <Phone className="w-3.5 h-3.5 text-neutral-400" />
                          <span className="font-semibold text-neutral-300">Phone / WhatsApp:</span>
                          <span className="font-mono text-neutral-200">
                            {lead.phone ? lead.phone : <span className="text-amber-400 font-bold">No Phone Number Found</span>}
                          </span>
                        </div>
                        <p className={`text-[11px] leading-relaxed ${
                          verification?.phoneCheck?.status === "fake_555" || verification?.phoneCheck?.status === "repeating_digits"
                            ? "text-rose-300"
                            : verification?.phoneCheck?.status === "valid"
                            ? "text-emerald-400"
                            : "text-amber-300/80"
                        }`}>
                          {verification?.phoneCheck?.diagnosticMessage || (
                            lead.phone 
                              ? `Checking phone format '${lead.phone}'...` 
                              : "No phone number found — client did not provide contact digits."
                          )}
                        </p>
                      </div>

                      <div className="shrink-0">
                        {verification?.phoneCheck?.status === "valid" && (
                          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-mono border border-emerald-500/30">
                            Valid E.164
                          </span>
                        )}
                        {verification?.phoneCheck?.status === "fake_555" && (
                          <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[10px] font-mono border border-rose-500/30">
                            Fake 555 Exchange
                          </span>
                        )}
                        {(!lead.phone || verification?.phoneCheck?.status === "missing") && (
                          <span className="px-2 py-0.5 rounded bg-neutral-800 text-neutral-400 text-[10px] font-mono border border-neutral-700">
                            No Phone Found
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Recommendation */}
                    {verification?.recommendation && (
                      <div className={`pt-1.5 border-t border-neutral-800/50 text-[11px] flex items-center space-x-1.5 ${
                        isFake ? "text-rose-300 font-medium" : "text-neutral-400"
                      }`}>
                        <span className="font-semibold text-neutral-300">Bot Advisory:</span>
                        <span>{verification.recommendation}</span>
                      </div>
                    )}
                  </div>

                  {/* Scope Badges */}
                  <div className="flex flex-wrap gap-1.5">
                    {lead.services.map((srv, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded bg-neutral-900 text-neutral-300 text-[10px] font-mono border border-neutral-800"
                      >
                        {srv}
                      </span>
                    ))}
                  </div>

                  {/* Pricing & Turnaround Info */}
                  <div className="p-3 rounded-xl bg-neutral-900/90 border border-neutral-800/60 flex items-center justify-between text-xs font-mono">
                    <div>
                      <span className="text-neutral-500 text-[10px] block">ESTIMATED FEE</span>
                      <span className="text-amber-400 font-bold">
                        ${lead.estimatedFeeRange.min} - ${lead.estimatedFeeRange.max}
                      </span>
                    </div>
                    <div>
                      <span className="text-neutral-500 text-[10px] block">DELIVERY</span>
                      <span className="text-neutral-200">
                        ~{lead.estimatedTurnaroundDays} Days ({lead.recommendedSheetsCount} Sheets)
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-neutral-500 text-[10px] block">DATE</span>
                      <span className="text-neutral-400">
                        {new Date(lead.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </span>
                    </div>
                  </div>

                  {/* Notes if any */}
                  {lead.customNotes && (
                    <div className="text-xs text-neutral-400 bg-neutral-900/50 p-2 rounded-lg border border-neutral-800/40">
                      <span className="font-semibold text-neutral-300">Client Note: </span>
                      {lead.customNotes}
                    </div>
                  )}

                  {/* Attached Project Files / Redlines Link */}
                  {lead.projectFilesLink && (
                    <div className="text-xs text-amber-300 bg-amber-950/20 p-2.5 rounded-lg border border-amber-500/30 flex items-center justify-between">
                      <div className="flex items-center space-x-2 truncate">
                        <Link2 className="w-4 h-4 text-amber-400 shrink-0" />
                        <span className="font-semibold text-neutral-200 shrink-0">Attached Project Files:</span>
                        <span className="truncate font-mono text-[11px] text-amber-300">{lead.projectFilesLink}</span>
                      </div>
                      <a
                        href={lead.projectFilesLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-2 px-2.5 py-1 rounded bg-amber-500 hover:bg-amber-400 text-neutral-950 text-[10px] font-bold flex items-center space-x-1 shrink-0 transition-colors"
                      >
                        <span>Open Files</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}

                  {/* Action Buttons to Contact */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    {lead.email && !isFake ? (
                      <a
                        href={`mailto:${lead.email}?subject=${encodeURIComponent(
                          `Architectural Proposal: ${lead.projectTitle} - ${specialist.name}`
                        )}`}
                        className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold flex items-center space-x-1.5 transition-colors"
                      >
                        <Mail className="w-3.5 h-3.5 text-amber-400" />
                        <span>Email {lead.email}</span>
                      </a>
                    ) : (
                      <div className="px-3 py-1.5 rounded-lg bg-neutral-900 text-neutral-500 text-xs border border-neutral-800 flex items-center space-x-1.5 cursor-not-allowed">
                        <Mail className="w-3.5 h-3.5 text-neutral-600" />
                        <span>
                          {!lead.email ? "No Email Found" : "Email Unreachable (Fake Domain)"}
                        </span>
                      </div>
                    )}

                    {lead.phone && verification?.phoneCheck?.status === "valid" ? (
                      <a
                        href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center space-x-1.5 transition-colors"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>WhatsApp ({lead.phone})</span>
                      </a>
                    ) : (
                      <div className="px-3 py-1.5 rounded-lg bg-neutral-900 text-neutral-500 text-xs border border-neutral-800 flex items-center space-x-1.5 cursor-not-allowed">
                        <MessageSquare className="w-3.5 h-3.5 text-neutral-600" />
                        <span>
                          {!lead.phone ? "No Phone Number Found" : "Fictional Phone (Cannot WhatsApp)"}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
};
