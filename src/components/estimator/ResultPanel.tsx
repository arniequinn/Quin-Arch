import React, { useState } from "react";
import { CheckCircle2, Loader2, Mail, MessageSquare } from "lucide-react";
import { Button } from "../Button";
import { SpecialistProfile } from "../../types";
import { EstimatorService } from "../../data/routes";
import { EXCLUSIONS } from "../../data/exclusions";
import { showDraft } from "../../data/ownerSignoff";
import { TARGET_MARKETS } from "../../data/architecturalData";
import { firstName, mailtoHref, whatsappHref } from "../../services/contact";
import { trackEvent } from "../../services/analytics";

// The one result panel every estimator tab uses (R5): fee, the single caveat line (point 8),
// turnaround and other facts, deliverables, one plain market-comparison line, "Send this scope"
// plus WhatsApp and Email, and what isn't included (point 7).

const ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;

const SERVICE_NAMES: Record<EstimatorService, string> = {
  bim: "BIM / CAD",
  visualization: "Visualization",
  consultancy: "Architect consultant",
};

/** The site's only estimate caveat — this sentence appears nowhere else. */
const CAVEAT: Record<EstimatorService, string> = {
  bim: "Indicative range — confirmed as a fixed fee once the brief is agreed.",
  visualization: "Indicative range — confirmed as a fixed fee once the brief is agreed.",
  consultancy: "Indicative — confirmed once the scope of the consultation is agreed.",
};

export interface ScopeMessage {
  /** Email subject, e.g. "BIM / CAD scope — Custom Single-Family Home". */
  subject: string;
  /** The scope as plain lines, without greeting or sign-off. */
  lines: string[];
}

interface ResultPanelProps {
  service: EstimatorService;
  specialist: SpecialistProfile;
  fee: string;
  feeNote?: string;
  rows: Array<{ label: string; value: React.ReactNode }>;
  deliverables: string[];
  comparison?: React.ReactNode;
  message: ScopeMessage;
}

export const ResultPanel: React.FC<ResultPanelProps> = ({
  service,
  specialist,
  fee,
  feeNote,
  rows,
  deliverables,
  comparison,
  message,
}) => {
  const name = firstName(specialist);
  const text = `Hi ${name},\n\nHere's a ${SERVICE_NAMES[service]} scope from the estimator on quinarch.design:\n\n${message.lines
    .map((l) => `• ${l}`)
    .join("\n")}\n\nI'd like to discuss it.`;
  const exclusions = EXCLUSIONS[service].estimatorItems;

  return (
    <div className="rounded border border-neutral-800 bg-neutral-900/50 p-6 sm:p-7">
      <p className="eyebrow text-neutral-400">Your estimate</p>
      <p className="mt-3 font-mono text-[2rem] leading-tight tracking-tight text-neutral-100" aria-live="polite">
        {fee}
      </p>
      {feeNote && <p className="mt-1 font-mono text-label text-neutral-400">{feeNote}</p>}
      <p className="mt-3 text-label text-neutral-400">{CAVEAT[service]}</p>

      <dl className="mt-6 divide-y divide-neutral-800 border-y border-neutral-800">
        {rows.map((row) => (
          <div key={row.label} className="flex items-baseline justify-between gap-4 py-2.5 text-small">
            <dt className="text-neutral-400">{row.label}</dt>
            <dd className="text-right text-neutral-100">{row.value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-6">
        <p className="eyebrow text-neutral-400">Deliverables</p>
        <ul className="mt-3 space-y-2 text-small text-neutral-300">
          {deliverables.map((d) => (
            <li key={d} className="flex gap-2.5">
              <span className="mt-[0.6rem] h-1 w-1 shrink-0 rounded-full bg-amber-400" aria-hidden="true" />
              <span>{d}</span>
            </li>
          ))}
        </ul>
      </div>

      {comparison && <div className="mt-6 text-small text-neutral-400">{comparison}</div>}

      <SendScope service={service} specialist={specialist} subject={message.subject} text={text} />

      {showDraft("exclusions") && (
        <details className="mt-6 border-t border-neutral-800 pt-4">
          <summary className="cursor-pointer text-small font-semibold text-neutral-300 hover:text-neutral-100">
            Not included
          </summary>
          <ul className="mt-3 space-y-1.5 text-label text-neutral-400">
            {exclusions.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        </details>
      )}
    </div>
  );
};

// "Send this scope": the scope goes straight to the principal through Web3Forms (the same relay
// as the LOD guide's email capture), with the visitor's address as the reply-to. Without an
// access key configured it falls back to the visitor's own email app.
const SendScope: React.FC<{ service: EstimatorService; specialist: SpecialistProfile; subject: string; text: string }> = ({
  service,
  specialist,
  subject,
  text,
}) => {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const mailto = mailtoHref(specialist.email, subject, text);
  const name = firstName(specialist);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ACCESS_KEY) {
      window.location.href = mailtoHref(specialist.email, subject, note ? `${text}\n\n${note}` : text);
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: ACCESS_KEY,
          subject: `New scope: ${subject}`,
          from_name: "Quin-Arch scope estimator",
          email,
          message: note ? `${text}\n\nNote from the visitor:\n${note}` : text,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus("sent");
        trackEvent("generate_lead", { lead_source: `Scope estimator — ${SERVICE_NAMES[service]}` });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="mt-7">
      {status === "sent" ? (
        <p className="flex items-start gap-2 text-small text-neutral-200" role="status">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" aria-hidden="true" />
          <span>Sent — {name} will reply to {email}.</span>
        </p>
      ) : open ? (
        <form onSubmit={submit} className="space-y-3">
          <label className="block">
            <span className="block text-label font-semibold text-neutral-300">Your email</span>
            <input
              type="email"
              required
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="mt-1.5 w-full rounded border border-neutral-700 bg-neutral-950 px-3 py-2.5 text-small text-neutral-100 placeholder:text-neutral-600 focus:border-amber-400 focus:outline-none"
            />
          </label>
          <label className="block">
            <span className="block text-label font-semibold text-neutral-300">Anything to add? (optional)</span>
            <textarea
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="mt-1.5 w-full resize-y rounded border border-neutral-700 bg-neutral-950 px-3 py-2 text-small text-neutral-100 focus:border-amber-400 focus:outline-none"
            />
          </label>
          <Button type="submit" fullWidth disabled={status === "sending"}>
            {status === "sending" ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Sending
              </span>
            ) : (
              "Send this scope"
            )}
          </Button>
          {status === "error" && (
            <p className="text-label text-red-300" role="alert">
              That didn't go through — send it by{" "}
              <a href={mailto} className="underline hover:text-red-200">
                email
              </a>{" "}
              or WhatsApp instead.
            </p>
          )}
        </form>
      ) : (
        <Button fullWidth onClick={() => setOpen(true)}>
          Send this scope
        </Button>
      )}
      <div className="mt-3 grid grid-cols-2 gap-3">
        <Button variant="secondary" size="sm" icon={MessageSquare} href={whatsappHref(specialist, text)} external>
          WhatsApp
        </Button>
        <Button variant="secondary" size="sm" icon={Mail} href={mailto}>
          Email
        </Button>
      </div>
    </div>
  );
};

/** The market-comparison line's market picker, for tabs that have no jurisdiction of their own. */
export const MarketSelect: React.FC<{ value: string; onChange: (v: string) => void; id: string }> = ({ value, onChange, id }) => (
  <label htmlFor={id} className="mb-2 flex items-center gap-2 text-label text-neutral-500">
    <span>Compare with</span>
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded border border-neutral-700 bg-neutral-950 px-2 py-1 text-label text-neutral-200 focus:border-amber-400 focus:outline-none"
    >
      {TARGET_MARKETS.map((m) => (
        <option key={m.id} value={m.id}>
          {m.name}
        </option>
      ))}
    </select>
  </label>
);
