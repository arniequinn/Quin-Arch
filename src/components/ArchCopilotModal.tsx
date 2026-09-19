import React, { useState, useRef, useEffect } from "react";
import {
  X,
  Send,
  Sparkles,
  Bot,
  Compass,
  Globe,
  MapPin,
  FileText,
  Copy,
  Check,
  RotateCcw,
  ExternalLink,
  Loader2,
  ShieldCheck,
  Building2,
  Layers,
  Search,
} from "lucide-react";
import {
  sendChatMessage,
  ChatMessage,
  ModelTier,
  GroundingMode,
  ArchitecturalRole,
} from "../services/geminiService";

interface ArchCopilotModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "welcome-1",
    role: "model",
    content: `Hello! I am **ArchBot**, your Senior Architectural BIM & Municipal Permitting Consultant powered by Gemini.

I can assist you with:
- **Code Compliance**: International Building Code (IBC 2024), IRC, California Title 24, ADA Chapter 11B.
- **BIM & CAD Documentation**: Autodesk Revit LOD 200–400 detailing, sheet indexing, partition schedules.
- **Grounding Intelligence**: Live Google Search for current municipal amendments & Google Maps for local Building & Safety departments.
- **Value Engineering**: Fee optimization and comparison with in-house architectural drafting overhead.

What project or code question can I solve for you today?`,
    timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    modelUsed: "gemini-3.5-flash",
  },
];

const SUGGESTIONS = [
  "California Title 24 ADU energy & solar compliance checklist",
  "Revit LOD 300 vs 400 permit deliverables for a 2-story residence",
  "Find building and safety permit offices in Los Angeles",
  "Calculate minimum corridor and egress door width for 150 occupant load",
];

export const ArchCopilotModal: React.FC<ArchCopilotModalProps> = ({
  isOpen,
  onClose,
  initialQuery,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState(initialQuery || "");
  const [isLoading, setIsLoading] = useState(false);
  const [modelTier, setModelTier] = useState<ModelTier>("flash");
  const [groundingMode, setGroundingMode] = useState<GroundingMode>("none");
  const [role, setRole] = useState<ArchitecturalRole>("architect");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      if (initialQuery && initialQuery !== input) {
        setInput(initialQuery);
      }
    }
  }, [isOpen, messages]);

  if (!isOpen) return null;

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isLoading) return;

    const userMsg: ChatMessage = {
      id: "user-" + Date.now(),
      role: "user",
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInput("");
    setIsLoading(true);

    try {
      const apiPayload = newHistory.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await sendChatMessage({
        messages: apiPayload,
        modelTier,
        groundingMode,
        role,
      });

      const modelMsg: ChatMessage = {
        id: "model-" + Date.now(),
        role: "model",
        content: res.text,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        modelUsed: res.modelUsed,
        groundingMetadata: res.groundingMetadata,
      };

      setMessages((prev) => [...prev, modelMsg]);
    } catch (err: any) {
      console.error("Chat failure:", err);
      const errorMsg: ChatMessage = {
        id: "error-" + Date.now(),
        role: "model",
        content: `⚠️ **Consultation Notice**: ${err.message || "Failed to reach Gemini consultation endpoint"}. Please ensure your GEMINI_API_KEY is active in AI Studio settings or try a different model tier.`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        modelUsed: "system_notice",
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearHistory = () => {
    setMessages(INITIAL_MESSAGES);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-4xl h-[92vh] max-h-[860px] bg-neutral-900 border border-neutral-800 rounded-2xl flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header Bar */}
        <div className="p-4 sm:px-6 border-b border-neutral-800 bg-neutral-950 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-inner">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base sm:text-lg font-bold text-neutral-100 flex items-center space-x-2">
                  <span>ArchBot</span>
                  <span className="text-amber-400 font-mono text-xs px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                    BIM & Permitting Copilot
                  </span>
                </h2>
              </div>
              <p className="text-xs text-neutral-400 hidden sm:block">
                Multi-turn Gemini intelligence with Search & Maps grounding for code, Revit & municipal permitting
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleClearHistory}
              title="Reset consultation thread"
              className="p-2 rounded-lg text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 transition-colors text-xs flex items-center space-x-1"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden md:inline">Reset</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Control Toolbar: Model Tiers, Roles, and Grounding Toggles */}
        <div className="px-4 py-3 bg-neutral-950/70 border-b border-neutral-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Model Tier Selector */}
          <div className="flex items-center space-x-1 bg-neutral-900 p-1 rounded-lg border border-neutral-800">
            <span className="text-neutral-400 px-2 font-mono">Model:</span>
            <button
              onClick={() => setModelTier("fast")}
              className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                modelTier === "fast"
                  ? "bg-amber-500 text-neutral-950 font-bold shadow-sm"
                  : "text-neutral-400 hover:text-neutral-200"
              }`}
              title="gemini-3.1-flash-lite (Ultra-fast responsive code advisory)"
            >
              Fast Lite
            </button>
            <button
              onClick={() => setModelTier("flash")}
              className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                modelTier === "flash"
                  ? "bg-amber-500 text-neutral-950 font-bold shadow-sm"
                  : "text-neutral-400 hover:text-neutral-200"
              }`}
              title="gemini-3.5-flash (Balanced multimodal & grounding specialist)"
            >
              Flash 3.5
            </button>
            <button
              onClick={() => setModelTier("pro")}
              className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                modelTier === "pro"
                  ? "bg-amber-500 text-neutral-950 font-bold shadow-sm"
                  : "text-neutral-400 hover:text-neutral-200"
              }`}
              title="gemini-3.1-pro-preview (Deep specification & engineering logic)"
            >
              Pro 3.1
            </button>
          </div>

          {/* Grounding Mode Toggle */}
          <div className="flex items-center space-x-1 bg-neutral-900 p-1 rounded-lg border border-neutral-800">
            <span className="text-neutral-400 px-2 font-mono">Grounding:</span>
            <button
              onClick={() => setGroundingMode("none")}
              className={`px-2.5 py-1 rounded-md transition-all ${
                groundingMode === "none"
                  ? "bg-neutral-800 text-neutral-200 font-semibold"
                  : "text-neutral-400 hover:text-neutral-200"
              }`}
            >
              Standard
            </button>
            <button
              onClick={() => setGroundingMode("search")}
              className={`px-2.5 py-1 rounded-md flex items-center space-x-1 transition-all ${
                groundingMode === "search"
                  ? "bg-blue-600/30 text-blue-300 border border-blue-500/40 font-semibold shadow-sm"
                  : "text-neutral-400 hover:text-neutral-200"
              }`}
              title="Live Google Search grounding for latest municipal building codes"
            >
              <Globe className="w-3.5 h-3.5 text-blue-400" />
              <span>Search Grounding</span>
            </button>
            <button
              onClick={() => setGroundingMode("maps")}
              className={`px-2.5 py-1 rounded-md flex items-center space-x-1 transition-all ${
                groundingMode === "maps"
                  ? "bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 font-semibold shadow-sm"
                  : "text-neutral-400 hover:text-neutral-200"
              }`}
              title="Google Maps grounding for city building & safety departments"
            >
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>Maps Grounding</span>
            </button>
          </div>

          {/* Architectural Persona Role */}
          <div className="flex items-center space-x-1.5 bg-neutral-900 px-2 py-1 rounded-lg border border-neutral-800">
            <span className="text-neutral-400 font-mono">Role:</span>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as ArchitecturalRole)}
              className="bg-transparent text-amber-300 font-medium focus:outline-none cursor-pointer"
            >
              <option value="architect" className="bg-neutral-900 text-neutral-100">
                Senior BIM Consultant (Revit/CAD)
              </option>
              <option value="code_specialist" className="bg-neutral-900 text-neutral-100">
                Building Code & Permitting Officer
              </option>
              <option value="cost_estimator" className="bg-neutral-900 text-neutral-100">
                Cost Estimator & Value Engineer
              </option>
            </select>
          </div>
        </div>

        {/* Conversation Thread */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-5">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${
                msg.role === "user" ? "items-end" : "items-start"
              }`}
            >
              <div className="flex items-center space-x-2 mb-1 px-1">
                {msg.role === "user" ? (
                  <span className="text-[11px] font-mono text-neutral-400">You</span>
                ) : (
                  <div className="flex items-center space-x-1.5">
                    <span className="text-[11px] font-mono text-amber-400 font-bold">ArchBot</span>
                    {msg.modelUsed && (
                      <span className="text-[10px] font-mono text-neutral-400 bg-neutral-800 px-1.5 py-0.2 rounded border border-neutral-700">
                        {msg.modelUsed}
                      </span>
                    )}
                  </div>
                )}
                <span className="text-[10px] text-neutral-500">{msg.timestamp}</span>
              </div>

              <div
                className={`relative group max-w-2xl rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-gradient-to-r from-amber-500 to-amber-600 text-neutral-950 font-medium"
                    : "bg-neutral-800/80 border border-neutral-700/80 text-neutral-200"
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>

                {/* Grounding Attribution & Sources if available */}
                {msg.groundingMetadata && (
                  <div className="mt-3 pt-3 border-t border-neutral-700/60 text-xs">
                    {msg.groundingMetadata.webSearchQueries && msg.groundingMetadata.webSearchQueries.length > 0 && (
                      <div className="mb-2">
                        <span className="text-neutral-400 text-[11px] font-mono block mb-1">
                          🔍 Grounded Google Search Queries:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {msg.groundingMetadata.webSearchQueries.map((q, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded bg-blue-950/60 border border-blue-500/30 text-blue-300 text-[11px]"
                            >
                              {q}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {msg.groundingMetadata.groundingChunks && msg.groundingMetadata.groundingChunks.length > 0 && (
                      <div>
                        <span className="text-neutral-400 text-[11px] font-mono block mb-1">
                          🌐 Verified Sources & References:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {msg.groundingMetadata.groundingChunks.map((chunk, idx) => {
                            const source = chunk.web || chunk.maps;
                            if (!source) return null;
                            return (
                              <a
                                key={idx}
                                href={source.uri}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-amber-300 hover:text-amber-200 text-[11px] transition-colors"
                              >
                                <span>{source.title || "Reference Source"}</span>
                                <ExternalLink className="w-3 h-3 text-neutral-400" />
                              </a>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Copy response action */}
                {msg.role === "model" && (
                  <button
                    onClick={() => copyToClipboard(msg.id, msg.content)}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 rounded bg-neutral-700/80 hover:bg-neutral-700 text-neutral-300 text-xs transition-all"
                    title="Copy response"
                  >
                    {copiedId === msg.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex flex-col items-start space-y-1">
              <span className="text-[11px] font-mono text-amber-400">ArchBot is drafting consultation...</span>
              <div className="bg-neutral-800/80 border border-neutral-700 rounded-2xl px-4 py-3 flex items-center space-x-3 text-sm text-neutral-400">
                <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                <span>
                  {groundingMode === "search"
                    ? "Searching municipal codes via Google Search grounding..."
                    : groundingMode === "maps"
                    ? "Looking up Building & Safety offices via Google Maps grounding..."
                    : "Synthesizing architectural specifications with Gemini..."}
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggestion Chips */}
        <div className="px-4 py-2 bg-neutral-950/60 border-t border-neutral-800/60 overflow-x-auto flex items-center space-x-2 text-xs scrollbar-none">
          <span className="text-neutral-400 text-[11px] shrink-0">Quick prompts:</span>
          {SUGGESTIONS.map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(item)}
              disabled={isLoading}
              className="px-2.5 py-1 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-neutral-100 border border-neutral-700 shrink-0 transition-colors cursor-pointer text-left"
            >
              {item}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-neutral-950 border-t border-neutral-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center space-x-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask an architectural code, Revit BIM, or municipal permit question..."
              disabled={isLoading}
              className="flex-1 bg-neutral-900 border border-neutral-700/80 rounded-xl px-4 py-3 text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-amber-500 transition-colors"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:hover:bg-amber-500 text-neutral-950 font-bold text-sm flex items-center space-x-2 transition-all cursor-pointer shrink-0 shadow-md shadow-amber-500/20"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-neutral-950" />
              ) : (
                <Send className="w-4 h-4 text-neutral-950" />
              )}
              <span className="hidden sm:inline">Consult</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
