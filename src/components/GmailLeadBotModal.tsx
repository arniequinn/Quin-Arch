import React, { useState, useEffect } from "react";
import {
  Mail,
  RefreshCw,
  Sparkles,
  Send,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Bot,
  Inbox,
  Filter,
  ArrowRight,
  UserCheck,
  Clock,
  DollarSign,
  FileText,
  Copy,
  Check,
  X,
  Lock
} from "lucide-react";
import {
  getStoredGmailAccessToken,
  requestGmailAccessToken,
  clearGmailAccessToken
} from "../services/gmailAuth";
import { SpecialistProfile } from "../types";

interface GmailMessage {
  id: string;
  threadId: string;
  from: string;
  to: string;
  subject: string;
  date: string;
  snippet: string;
  bodyText: string;
  leadScore: number;
  matchReasons: string[];
  isArchitecturalLead: boolean;
}

interface ProposalData {
  detectedClientName: string;
  detectedSenderEmail: string;
  projectSummary: string;
  recommendedServices: string[];
  suggestedTurnaround: string;
  proposedFeeEstimate: string;
  customProposalDraft: string;
  followupSubject: string;
}

interface GmailLeadBotModalProps {
  isOpen: boolean;
  onClose: () => void;
  specialist: SpecialistProfile;
}

export const GmailLeadBotModal: React.FC<GmailLeadBotModalProps> = ({
  isOpen,
  onClose,
  specialist,
}) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSendingAlert, setIsSendingAlert] = useState(false);
  const [messages, setMessages] = useState<GmailMessage[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<GmailMessage | null>(null);
  const [proposal, setProposal] = useState<ProposalData | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedProposal, setCopiedProposal] = useState(false);
  const [sentAlertSuccess, setSentAlertSuccess] = useState(false);
  const [filterOnlyLeads, setFilterOnlyLeads] = useState(true);

  // Auto-check stored token on mount
  useEffect(() => {
    if (isOpen) {
      const token = getStoredGmailAccessToken();
      if (token) {
        setAccessToken(token);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleConnectGmail = async () => {
    setIsAuthenticating(true);
    setErrorMessage(null);
    try {
      const token = await requestGmailAccessToken();
      setAccessToken(token);
      setStatusMessage("Gmail connected successfully! You can now scan your inbox.");
      // Automatically scan after connect
      scanInbox(token);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "Failed to connect Gmail. Please try again.");
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleDisconnect = () => {
    clearGmailAccessToken();
    setAccessToken(null);
    setMessages([]);
    setSelectedMessage(null);
    setProposal(null);
    setStatusMessage("Disconnected from Gmail.");
  };

  const scanInbox = async (tokenToUse?: string) => {
    const token = tokenToUse || accessToken;
    if (!token) {
      setErrorMessage("Please connect your Gmail account first.");
      return;
    }

    setIsScanning(true);
    setErrorMessage(null);
    setStatusMessage("Scanning inbox for design briefs, RFP emails, and architectural keywords...");
    try {
      const res = await fetch("/api/gmail/scan-inbox", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        if (res.status === 401) {
          clearGmailAccessToken();
          setAccessToken(null);
          throw new Error("Gmail session expired. Please reconnect your account.");
        }
        throw new Error(errorData.error || `Scan failed with status ${res.status}`);
      }

      const data = await res.json();
      setMessages(data.messages || []);
      setStatusMessage(`Scan complete: Analyzed ${data.scannedCount} emails. Found ${data.leadsCount} architectural opportunities!`);
      
      if (data.messages && data.messages.length > 0) {
        // Auto-select top lead
        setSelectedMessage(data.messages[0]);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "Unable to scan inbox. Please verify your permissions.");
    } finally {
      setIsScanning(false);
    }
  };

  const handleGenerateProposal = async (msg: GmailMessage) => {
    setIsGenerating(true);
    setErrorMessage(null);
    setSentAlertSuccess(false);
    try {
      const res = await fetch("/api/gmail/generate-proposal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          emailSubject: msg.subject,
          emailSnippet: msg.snippet,
          emailBody: msg.bodyText,
          sender: msg.from,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to generate architectural proposal draft.");
      }

      const propData = await res.json();
      setProposal(propData);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to generate proposal.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSendNotificationToArslan = async () => {
    if (!proposal || !selectedMessage || !accessToken) {
      setErrorMessage("Please ensure Gmail is connected and a proposal is generated.");
      return;
    }

    setIsSendingAlert(true);
    setErrorMessage(null);
    try {
      const res = await fetch("/api/gmail/send-notification", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recipientEmail: "arslan.qaiser1991@gmail.com",
          originalSender: selectedMessage.from,
          originalSubject: selectedMessage.subject,
          proposalText: proposal.customProposalDraft,
          feeEstimate: proposal.proposedFeeEstimate,
          turnaround: proposal.suggestedTurnaround,
          projectSummary: proposal.projectSummary,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to dispatch email notification.");
      }

      setSentAlertSuccess(true);
      setStatusMessage("Proposal dispatched! Check arslan.qaiser1991@gmail.com for the alert.");
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to send notification email.");
    } finally {
      setIsSendingAlert(false);
    }
  };

  const handleCopyProposal = () => {
    if (!proposal) return;
    navigator.clipboard.writeText(proposal.customProposalDraft);
    setCopiedProposal(true);
    setTimeout(() => setCopiedProposal(false), 2000);
  };

  const displayedMessages = filterOnlyLeads
    ? messages.filter((m) => m.isArchitecturalLead)
    : messages;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-neutral-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950/60">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-bold text-neutral-100">
                  Gmail Inbox Lead Monitor & Proposal Bot
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono">
                  Autonomous AI
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                Scans incoming emails for architecture & drafting inquiries, drafts tailored proposals, and alerts <span className="text-amber-300 font-mono">arslan.qaiser1991@gmail.com</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Status / Alerts Banner */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-800/60 text-red-300 text-xs flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{errorMessage}</span>
              </div>
              <button onClick={() => setErrorMessage(null)} className="text-red-400 hover:text-red-200">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {statusMessage && !errorMessage && (
            <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-800/50 text-amber-300 text-xs flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{statusMessage}</span>
              </div>
              <button onClick={() => setStatusMessage(null)} className="text-amber-400 hover:text-amber-200">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Connection Bar */}
          <div className="p-4 rounded-xl bg-neutral-950/50 border border-neutral-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${accessToken ? "bg-emerald-500 shadow-sm shadow-emerald-500" : "bg-neutral-600"}`} />
              <div>
                <div className="text-sm font-semibold text-neutral-200">
                  {accessToken ? "Gmail Connected & Authorized" : "Gmail Disconnected"}
                </div>
                <div className="text-xs text-neutral-400">
                  {accessToken
                    ? "Read access for architectural emails & send permission for instant self-notification alerts"
                    : "Authorize Google OAuth to permit the bot to read your incoming project emails"}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {!accessToken ? (
                <button
                  onClick={handleConnectGmail}
                  disabled={isAuthenticating}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-bold text-xs flex items-center space-x-2 shadow-md shadow-amber-500/20 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isAuthenticating ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5" />
                      <span>Connect Gmail Inbox</span>
                    </>
                  )}
                </button>
              ) : (
                <>
                  <button
                    onClick={() => scanInbox()}
                    disabled={isScanning}
                    className="px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center space-x-2 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? "animate-spin" : ""}`} />
                    <span>{isScanning ? "Scanning..." : "Scan Inbox Now"}</span>
                  </button>
                  <button
                    onClick={handleDisconnect}
                    className="px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-neutral-200 text-xs font-mono transition-colors"
                  >
                    Disconnect
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Main Two-Column View: Inbox Scanner + AI Proposal Engine */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Email Messages List (5 cols) */}
            <div className="lg:col-span-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Inbox className="w-4 h-4 text-neutral-400" />
                  <span className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
                    Detected Opportunities ({displayedMessages.length})
                  </span>
                </div>
                <button
                  onClick={() => setFilterOnlyLeads(!filterOnlyLeads)}
                  className={`text-xs px-2.5 py-1 rounded-lg border transition-all flex items-center space-x-1 ${
                    filterOnlyLeads
                      ? "bg-amber-500/20 border-amber-500/40 text-amber-300"
                      : "bg-neutral-800 border-neutral-700 text-neutral-400"
                  }`}
                >
                  <Filter className="w-3 h-3" />
                  <span>{filterOnlyLeads ? "Arch Leads Only" : "All Scanned"}</span>
                </button>
              </div>

              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                {displayedMessages.length === 0 ? (
                  <div className="p-8 text-center border border-dashed border-neutral-800 rounded-xl bg-neutral-950/30">
                    <Mail className="w-8 h-8 text-neutral-600 mx-auto mb-2" />
                    <p className="text-xs text-neutral-400">
                      {!accessToken
                        ? "Connect your Gmail account above to begin scanning for architectural leads."
                        : isScanning
                        ? "Scanning incoming emails..."
                        : "No recent messages matched architectural keywords. Click 'Scan Inbox Now' to re-query."}
                    </p>
                  </div>
                ) : (
                  displayedMessages.map((msg) => {
                    const isSelected = selectedMessage?.id === msg.id;
                    return (
                      <div
                        key={msg.id}
                        onClick={() => setSelectedMessage(msg)}
                        className={`p-3.5 rounded-xl border transition-all cursor-pointer text-left ${
                          isSelected
                            ? "bg-amber-500/10 border-amber-500/50 shadow-sm"
                            : "bg-neutral-950/40 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-950/70"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-semibold text-neutral-200 truncate max-w-[200px]">
                            {msg.from.replace(/<.*>/, "").trim() || msg.from}
                          </span>
                          <span
                            className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                              msg.leadScore >= 60
                                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                                : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                            }`}
                          >
                            Score: {msg.leadScore}%
                          </span>
                        </div>

                        <div className="text-xs font-medium text-neutral-300 line-clamp-1 mb-1">
                          {msg.subject || "No Subject"}
                        </div>

                        <p className="text-[11px] text-neutral-400 line-clamp-2 mb-2 leading-relaxed">
                          {msg.snippet}
                        </p>

                        <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-neutral-800/60">
                          {msg.matchReasons.slice(0, 3).map((reason, idx) => (
                            <span
                              key={idx}
                              className="text-[9px] px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-300 font-mono"
                            >
                              #{reason}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Right Column: Selected Email Details + Proposal Draft (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              {selectedMessage ? (
                <div className="p-4 rounded-xl bg-neutral-950/60 border border-neutral-800 space-y-4">
                  {/* Message Header */}
                  <div className="border-b border-neutral-800 pb-3">
                    <div className="flex items-center justify-between text-xs text-neutral-400 mb-1">
                      <span>From: <strong className="text-neutral-200">{selectedMessage.from}</strong></span>
                      <span className="font-mono">{selectedMessage.date || "Recent"}</span>
                    </div>
                    <h3 className="text-sm font-bold text-neutral-100">
                      {selectedMessage.subject}
                    </h3>
                  </div>

                  {/* Generate Button Bar */}
                  <div className="flex items-center justify-between bg-neutral-900 p-3 rounded-lg border border-neutral-800">
                    <div className="flex items-center space-x-2">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span className="text-xs font-medium text-neutral-200">
                        Generate Tailored Architectural Proposal
                      </span>
                    </div>
                    <button
                      onClick={() => handleGenerateProposal(selectedMessage)}
                      disabled={isGenerating}
                      className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-bold text-xs flex items-center space-x-1.5 transition-all shadow-sm cursor-pointer disabled:opacity-50"
                    >
                      {isGenerating ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Drafting with Gemini...</span>
                        </>
                      ) : (
                        <>
                          <Bot className="w-3.5 h-3.5" />
                          <span>Generate Proposal</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Generated Proposal Output */}
                  {proposal ? (
                    <div className="space-y-3 pt-2">
                      {/* Metric pills */}
                      <div className="grid grid-cols-3 gap-2 text-center font-mono">
                        <div className="p-2 rounded-lg bg-neutral-900 border border-neutral-800">
                          <div className="text-[10px] text-neutral-400">Estimated Fee</div>
                          <div className="text-xs font-bold text-amber-400">
                            {proposal.proposedFeeEstimate}
                          </div>
                        </div>
                        <div className="p-2 rounded-lg bg-neutral-900 border border-neutral-800">
                          <div className="text-[10px] text-neutral-400">Turnaround</div>
                          <div className="text-xs font-bold text-neutral-200">
                            {proposal.suggestedTurnaround}
                          </div>
                        </div>
                        <div className="p-2 rounded-lg bg-neutral-900 border border-neutral-800">
                          <div className="text-[10px] text-neutral-400">Recommended LOD</div>
                          <div className="text-xs font-bold text-emerald-400">
                            LOD 300 - 350
                          </div>
                        </div>
                      </div>

                      {/* Pitch Draft View */}
                      <div className="relative">
                        <div className="text-xs font-bold text-neutral-300 mb-1 flex items-center justify-between">
                          <span>Subject: {proposal.followupSubject}</span>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={handleCopyProposal}
                              className="text-xs text-neutral-400 hover:text-amber-300 flex items-center space-x-1"
                            >
                              {copiedProposal ? (
                                <>
                                  <Check className="w-3 h-3 text-emerald-400" />
                                  <span className="text-emerald-400">Copied</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  <span>Copy Draft</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>

                        <textarea
                          readOnly
                          value={proposal.customProposalDraft}
                          rows={11}
                          className="w-full text-xs font-mono bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-neutral-300 leading-relaxed focus:outline-none resize-none"
                        />
                      </div>

                      {/* Dispatch Notification Button */}
                      <div className="p-3 rounded-xl bg-gradient-to-r from-amber-500/10 to-amber-600/10 border border-amber-500/30 flex items-center justify-between">
                        <div className="flex items-center space-x-2.5">
                          <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                            <Send className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-neutral-100">
                              Send Alert to arslan.qaiser1991@gmail.com
                            </div>
                            <div className="text-[11px] text-neutral-400">
                              Dispatches this full proposal draft & lead details directly to your personal inbox
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={handleSendNotificationToArslan}
                          disabled={isSendingAlert || sentAlertSuccess}
                          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all shadow-sm ${
                            sentAlertSuccess
                              ? "bg-emerald-600 text-white cursor-default"
                              : "bg-amber-500 hover:bg-amber-400 text-neutral-950 cursor-pointer"
                          }`}
                        >
                          {isSendingAlert ? (
                            <>
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                              <span>Sending...</span>
                            </>
                          ) : sentAlertSuccess ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Alert Sent!</span>
                            </>
                          ) : (
                            <>
                              <Send className="w-3.5 h-3.5" />
                              <span>Notify Me Now</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 text-center border border-dashed border-neutral-800 rounded-xl bg-neutral-950/20">
                      <p className="text-xs text-neutral-400">
                        Click <strong className="text-amber-300">Generate Proposal</strong> above to analyze the sender&apos;s request and produce an architectural proposal with scope and fee estimates.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-12 text-center border border-dashed border-neutral-800 rounded-xl bg-neutral-950/40">
                  <Mail className="w-10 h-10 text-neutral-600 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-neutral-300">No Email Selected</p>
                  <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
                    Select a detected message from the left list to review the inquiry and generate a tailored proposal.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-neutral-800 bg-neutral-950/60 flex items-center justify-between text-xs text-neutral-400">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Authenticated securely via Google Identity Services (GSI) & Official Gmail API</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
