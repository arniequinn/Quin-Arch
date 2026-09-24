import React, { useState } from "react";
import { CheckCircle2, Loader2, Mail, Send } from "lucide-react";
import { trackEvent } from "../services/analytics";

interface EmailCaptureFormProps {
  /** What the visitor is signing up to receive, e.g. "the LOD cheat sheet". */
  resource: string;
  /** Tag sent along with the submission so inbound notifications say what triggered it. */
  source: string;
  specialistEmail: string;
  onSuccess?: () => void;
  className?: string;
}

// Posts to Web3Forms (a free, no-signup form-relay service — access key only, no password/account)
// when VITE_WEB3FORMS_ACCESS_KEY is configured. Until that's set, the form falls back to a plain
// mailto link so the page still works, just without a stored, contactable list.
const ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;

export const EmailCaptureForm: React.FC<EmailCaptureFormProps> = ({
  resource,
  source,
  specialistEmail,
  onSuccess,
  className = "",
}) => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  const mailtoFallback = `mailto:${specialistEmail}?subject=${encodeURIComponent(
    `Send me ${resource}`
  )}&body=${encodeURIComponent(`Hi, please send me ${resource}. My email: `)}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ACCESS_KEY) {
      window.location.href = mailtoFallback;
      return;
    }

    setStatus("loading");
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: ACCESS_KEY,
          email,
          subject: `New ${resource} request`,
          message: `Requested via: ${source}`,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus("done");
        trackEvent("generate_lead", { lead_source: source });
        onSuccess?.();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  if (status === "done") {
    return (
      <div className={`flex items-center space-x-2 text-sm text-emerald-400 ${className}`}>
        <CheckCircle2 className="w-4 h-4 shrink-0" />
        <span>You're on the list — check your inbox shortly.</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`flex flex-col sm:flex-row gap-2.5 ${className}`}>
      <div className="relative flex-1">
        <Mail className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com"
          className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-neutral-950 border border-neutral-700 text-sm text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-amber-500"
        />
      </div>
      <button
        type="submit"
        disabled={status === "loading"}
        className="flex items-center justify-center space-x-2 px-5 py-2.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-neutral-950 text-sm font-bold transition-all cursor-pointer disabled:opacity-60 disabled:cursor-wait shrink-0"
      >
        {status === "loading" ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Send className="w-4 h-4" />
        )}
        <span>Send it to me</span>
      </button>
      {status === "error" && (
        <p className="text-[11px] text-red-400 sm:basis-full">
          Something went wrong —{" "}
          <a href={mailtoFallback} className="underline hover:text-red-300">
            email {specialistEmail.split("@")[0]} directly instead
          </a>
          .
        </p>
      )}
    </form>
  );
};
