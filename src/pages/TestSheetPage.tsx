import React, { useState } from "react";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { Container } from "../components/Container";
import { PageHeader, SectionHeader } from "../components/SectionHeader";
import { Button } from "../components/Button";
import { ItemList, Section } from "../components/PageSections";
import { BOOKING_URL, ROUTES } from "../data/routes";
import { trackEvent } from "../services/analytics";
import { SpecialistProfile } from "../types";

// v3.3 Phase 2b: the low-risk trial for a firm — one sheet, drawn free, in their own template.
// Files are shared as a link (Dropbox / Drive / WeTransfer); nothing is uploaded to this site.
// Posts to Web3Forms like EmailCaptureForm, with the same mailto fallback when no key is set.
const ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;

// Offer terms (D4).
const TERMS = [
  "One sheet, free — a floor plan or an elevation",
  "Drawn in your template, titleblock and layer standard",
  "Capped at about 4 hours of production",
  "Back within 2 working days, as native Archicad, DWG and PDF",
  "Happy to sign your NDA before you send files",
];

const PLATFORMS = ["Archicad", "Revit", "AutoCAD / DWG", "Other"];
const SHEET_TYPES = ["Floor plan", "Elevation"];

interface Fields {
  name: string;
  firm: string;
  email: string;
  platform: string;
  sheetType: string;
  fileLink: string;
  notes: string;
}

const EMPTY: Fields = { name: "", firm: "", email: "", platform: PLATFORMS[0], sheetType: SHEET_TYPES[0], fileLink: "", notes: "" };

const INPUT =
  "mt-1.5 h-12 w-full rounded border border-neutral-700 bg-neutral-950 px-3 text-small text-neutral-100 placeholder:text-neutral-600 focus:border-amber-400 focus:outline-none";

const Spinner: React.FC<{ className?: string }> = ({ className = "" }) => <Loader2 className={`${className} animate-spin`} aria-hidden="true" />;

const summary = (f: Fields) =>
  [
    `Name: ${f.name}`,
    `Firm: ${f.firm}`,
    `Email: ${f.email}`,
    `Platform: ${f.platform}`,
    `Sheet type: ${f.sheetType}`,
    `Files: ${f.fileLink}`,
    `Notes: ${f.notes || "—"}`,
  ].join("\n");

const TestSheetForm: React.FC<{ specialistEmail: string }> = ({ specialistEmail }) => {
  const [fields, setFields] = useState<Fields>(EMPTY);
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [bot, setBot] = useState(false);

  const set = (key: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setFields((f) => ({ ...f, [key]: e.target.value }));

  const subject = `Test sheet request — ${fields.firm || fields.name}`;
  const mailto = `mailto:${specialistEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(summary(fields))}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ACCESS_KEY) {
      window.location.href = mailto;
      return;
    }
    setStatus("loading");
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ access_key: ACCESS_KEY, email: fields.email, subject, message: summary(fields), botcheck: bot }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus("done");
        trackEvent("generate_lead", { lead_source: "test_sheet" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  if (status === "done") {
    return (
      <div className="flex items-start gap-2 text-body text-neutral-200">
        <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-amber-400" aria-hidden="true" />
        <p>Received. You'll get a reply within one working day to confirm the sheet and the timing.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      {/* Honeypot (Web3Forms botcheck): hidden from people, filled in by bots, which get rejected. */}
      <input type="checkbox" name="botcheck" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" onChange={(e) => setBot(e.target.checked)} />
      <label className="text-label text-neutral-400">
        Name
        <input required value={fields.name} onChange={set("name")} autoComplete="name" className={INPUT} />
      </label>
      <label className="text-label text-neutral-400">
        Firm
        <input required value={fields.firm} onChange={set("firm")} autoComplete="organization" className={INPUT} />
      </label>
      <label className="text-label text-neutral-400 sm:col-span-2">
        Work email
        <input required type="email" value={fields.email} onChange={set("email")} autoComplete="email" placeholder="you@firm.com" className={INPUT} />
      </label>
      <label className="text-label text-neutral-400">
        Your platform
        <select value={fields.platform} onChange={set("platform")} className={INPUT}>
          {PLATFORMS.map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>
      </label>
      <label className="text-label text-neutral-400">
        Sheet type
        <select value={fields.sheetType} onChange={set("sheetType")} className={INPUT}>
          {SHEET_TYPES.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </label>
      <label className="text-label text-neutral-400 sm:col-span-2">
        Link to your files (Dropbox, Google Drive, WeTransfer)
        <input required type="url" value={fields.fileLink} onChange={set("fileLink")} placeholder="https://" className={INPUT} />
      </label>
      <label className="text-label text-neutral-400 sm:col-span-2">
        Notes
        <textarea
          value={fields.notes}
          onChange={set("notes")}
          rows={4}
          placeholder="Template, layer standard, markups, deadline…"
          className={`${INPUT} h-auto py-3`}
        />
      </label>
      <div className="sm:col-span-2">
        <Button type="submit" disabled={status === "loading"} icon={status === "loading" ? Spinner : Send}>
          Send the test sheet
        </Button>
        {status === "error" && (
          <p className="mt-3 text-label text-red-300">
            Something went wrong —{" "}
            <a href={mailto} className="underline">
              email it directly instead
            </a>
            .
          </p>
        )}
      </div>
    </form>
  );
};

export const TestSheetPage: React.FC<{ specialist: SpecialistProfile }> = ({ specialist }) => (
  <main className="flex-1">
    <PageHeader
      breadcrumbs={[
        { label: "Home", href: ROUTES.home },
        { label: "BIM / CAD Drafting", href: ROUTES.bimCad },
        { label: "Test sheet" },
      ]}
      eyebrow="Try before you commit"
      title="Send a test sheet — the first one is free."
      intro="The quickest way to judge overflow help is to see it on your own project. Send one sheet's worth of work and get it back drawn to your standards."
    />
    <Section raised>
      <Container>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-12 md:grid-cols-[2fr_3fr]">
          <div>
            <h2 className="eyebrow text-neutral-400">The offer</h2>
            <ItemList items={TERMS} className="mt-5" size="small" />
          </div>
          <TestSheetForm specialistEmail={specialist.email} />
        </div>
      </Container>
    </Section>
    <Section>
      <Container>
        <SectionHeader eyebrow="Rather talk first?" title="Book a 20-minute capacity call.">
          <Button href={BOOKING_URL} external>
            Book a capacity call
          </Button>
        </SectionHeader>
      </Container>
    </Section>
  </main>
);
