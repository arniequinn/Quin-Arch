import React from "react";
import { Button } from "./Button";
import { BOOKING_URL, ROUTES } from "../data/routes";
import { useOnlineHours } from "../utils/onlineHours";

// v3.3 Phase 4: how overflow work plugs into a firm — four steps, the working facts, and the two
// actions. Used as the first homepage chapter (in the void between the ribbons) and in full on
// the How We Work page.
export const PLUG_IN_STEPS = [
  { title: "Send your standards", body: "Template, titleblock, layer standard and pens — or a past set to match." },
  { title: "Free test sheet", body: "One plan or elevation drawn to your standards, back in 2 working days." },
  { title: "Weekly capacity block", body: "A set number of hours each week on your projects, booked ahead." },
  { title: "Redlines in 24–48 h", body: "Markups in, corrected sheets out — while your team moves on." },
];

// The first fact, the online hours, is added per visitor (see onlineHours.ts).
export const PLUG_IN_FACTS = [
  "PCATP-registered architect, A-07767",
  "Archicad · IFC · RVT · DWG · PDF",
  "NDA signed; IP stays yours",
  "Email, Teams or Slack",
  "Prepared for your architect of record to stamp",
];

export const PlugInChapter: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const hours = useOnlineHours();
  return (
  <section className={`relative bg-neutral-950 ${compact ? "py-2" : "py-6"}`}>
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <p className="eyebrow text-amber-400">How we plug into your office</p>
        <h2
          className={`mt-3 font-display font-semibold leading-[1.08] tracking-tight text-neutral-100 ${
            compact ? "text-[1.75rem]" : "heading-2 sm:text-[2.75rem]"
          }`}
        >
          Your standards. Our hours.
        </h2>
      </div>

      <ol className={`mx-auto grid gap-3 ${compact ? "mt-4 grid-cols-2" : "mt-7 max-w-6xl grid-cols-2 gap-y-6 sm:gap-4 lg:grid-cols-4"}`}>
        {PLUG_IN_STEPS.map((step, i) => (
          <li key={step.title} className={`border-t border-amber-400/60 text-left ${compact ? "pt-2" : "pt-4"}`}>
            <span className="font-mono text-label text-amber-400">0{i + 1}</span>
            <h3 className={`mt-1 font-semibold text-neutral-100 ${compact ? "text-small" : "text-body"}`}>{step.title}</h3>
            <p className={`mt-1 text-neutral-400 ${compact ? "text-label line-clamp-2" : "text-small"}`}>{step.body}</p>
          </li>
        ))}
      </ol>

      {!compact && (
        <ul className="mx-auto mt-7 flex max-w-5xl flex-wrap justify-center gap-x-6 gap-y-2 text-label text-neutral-400">
          {[`Online ${hours.short}, 6 days`, ...PLUG_IN_FACTS].map((fact) => (
            <li key={fact} className="font-mono">
              {fact}
            </li>
          ))}
        </ul>
      )}

      <div className={`flex flex-wrap items-center justify-center gap-x-6 gap-y-3 ${compact ? "mt-4" : "mt-7"}`}>
        <Button href={BOOKING_URL} external size={compact ? "sm" : "md"}>
          Book a 20-min capacity call
        </Button>
        <Button href={ROUTES.testSheet} variant="link" size={compact ? "sm" : "md"}>
          Send a test sheet — first one free
        </Button>
      </div>
    </div>
  </section>
  );
};
