import React from "react";
import { MessageSquare, Printer } from "lucide-react";
import { Container } from "../components/Container";
import { PageHeader, SectionHeader } from "../components/SectionHeader";
import { Button } from "../components/Button";
import { EmailCaptureForm } from "../components/EmailCaptureForm";
import {
  LOD_COVERAGE,
  LOD_DELIVER_TEXT,
  LOD_GLOSSARY,
  LOD_GUIDE_VERSION,
  LOD_HOW_TO_SPECIFY,
  LOD_ISO_TEXT,
  LOD_LEVELS,
  LOD_PERMIT_SET_INTRO,
  LOD_PHASE_TEXT,
  LOD_SOURCES,
  LOD_STATUS_LABEL,
  LodLevel,
} from "../data/lod";
import { SHEET_CATALOGUE, SHEET_SERIES_ORDER } from "../data/sheetCatalogue";
import { ROUTES } from "../data/routes";
import { trackEvent } from "../services/analytics";
import { whatsappHref } from "../services/contact";
import { SpecialistProfile } from "../types";

interface LodGuidePageProps {
  specialist: SpecialistProfile;
}

// The ISO 7817-1 aspects, in the order the level cards list them.
// Values read mid-sentence: lower-case their first letter, but leave "3D" alone.
const aspectValue = (v: string) => v.replace(/^[A-Z](?=[a-z])/, (c) => c.toLowerCase());

const ASPECTS: Array<[keyof LodLevel["informationNeed"], string]> = [
  ["detail", "Detail"],
  ["dimensionality", "Dimensionality"],
  ["location", "Location"],
  ["appearance", "Appearance"],
  ["parametric", "Parametric behaviour"],
];

// Sheet series of a typical permit set, straight from the estimator's catalogue (point 21).
const PERMIT_SET = SHEET_SERIES_ORDER.map((series) => ({
  series,
  sheets: SHEET_CATALOGUE.filter((s) => s.series === series).map((s) => ({ number: s.number, title: s.title })),
}));

const SectionBlock: React.FC<{ title: string; eyebrow?: string; children: React.ReactNode }> = ({ title, eyebrow, children }) => (
  <section className="border-t border-neutral-900 py-14 sm:py-16">
    <SectionHeader eyebrow={eyebrow} title={title} />
    <div className="mt-8 space-y-4 text-body text-neutral-300">{children}</div>
  </section>
);

export const LodGuidePage: React.FC<LodGuidePageProps> = ({ specialist }) => (
  <main className="flex-1">
    {/* Screen layout */}
    <article className="print-hide">
      <PageHeader
        breadcrumbs={[
          { label: "Home", href: ROUTES.home },
          { label: "BIM / CAD Drafting", href: ROUTES.bimCad },
          { label: "LOD Guide" },
        ]}
        eyebrow="Field reference"
        title="What LOD Actually Means"
        intro="“LOD” gets used loosely — a scope note says “LOD 300” and it isn't always clear what that promises. This is the plain-language version: what each level contains, what it's for, how it relates to project phases and ISO 7817-1, and how to write it into a proposal."
        className="pb-10 sm:pb-12"
      />

      <Container width="text">
        {/* Email capture — a bonus, not a gate: everything below is public either way */}
        <div className="border-y border-neutral-800 py-8">
          <p className="text-center text-small text-neutral-300">
            Keep it on hand: send it to your inbox, or print this page — it prints as a clean two-page reference.
          </p>
          <div className="mx-auto mt-5 flex max-w-xl flex-col gap-3 sm:flex-row sm:items-start">
            <EmailCaptureForm resource="the LOD field guide" source="LOD Guide page" specialistEmail={specialist.email} className="flex-1" />
            <Button
              variant="secondary"
              icon={Printer}
              onClick={() => {
                trackEvent("save_guide_pdf", { guide: "lod" });
                window.print();
              }}
            >
              Print / Save as PDF
            </Button>
          </div>
        </div>

        {/* The six levels at a glance */}
        <section className="py-14 sm:py-16">
          <SectionHeader eyebrow="At a glance" title="The six levels" />
          <table className="mt-10 w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-neutral-700 text-label text-neutral-500">
                <th scope="col" className="py-2 pr-4 font-semibold">Level</th>
                <th scope="col" className="py-2 pr-4 font-semibold">What it is</th>
                <th scope="col" className="py-2 font-semibold">Here</th>
              </tr>
            </thead>
            <tbody>
              {LOD_LEVELS.map((lod) => (
                <tr key={lod.level} className="border-b border-neutral-900 align-top">
                  <th scope="row" className="py-3 pr-4 font-normal">
                    <span className="block font-mono text-small text-amber-400">{lod.level}</span>
                    <span className="block text-label text-neutral-400">{lod.name}</span>
                  </th>
                  <td className="py-3 pr-4 text-small text-neutral-300">{lod.summary}</td>
                  <td className="whitespace-nowrap py-3 text-small text-neutral-300">{LOD_STATUS_LABEL[lod.status]}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-4 text-label text-neutral-500">
            Definitions below are paraphrased from the BIMForum LOD Specification 2025, Part I — see the{" "}
            <a href={LOD_SOURCES[0].href} target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:text-amber-300">
              specification
            </a>{" "}
            for its exact wording.
          </p>
        </section>

        {/* Level by level */}
        <section className="border-t border-neutral-900 py-14 sm:py-16">
          <SectionHeader eyebrow="Level by level" title="One element, six levels" intro="The same window, followed through every level." />
          <div className="mt-10">
            {LOD_LEVELS.map((lod) => (
              <article key={lod.level} className="border-t border-neutral-800 py-8">
                <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                  <h3 className="heading-3 text-neutral-100">
                    <span className="font-mono text-amber-400">{lod.level}</span> · {lod.name}
                  </h3>
                  <p className="text-small text-neutral-400">{LOD_STATUS_LABEL[lod.status]}</p>
                </div>
                <p className="mt-3 text-body text-neutral-200">{lod.definition}</p>
                <dl className="mt-5 grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
                  {[
                    ["In practice", lod.meaning],
                    ["Used for", lod.usedFor],
                    ["The window", lod.windowExample],
                    ["Usually modeled by", lod.modeledBy],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <dt className="text-label font-semibold text-neutral-500">{label}</dt>
                      <dd className="mt-1 text-small text-neutral-300">{value}</dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-5 text-label text-neutral-500">
                  <span className="font-semibold">Level of information need (ISO 7817-1):</span>{" "}
                  {ASPECTS.map(([key, label]) => `${label.toLowerCase()} — ${aspectValue(lod.informationNeed[key])}`).join(" · ")}
                </p>
              </article>
            ))}
          </div>
        </section>

        <SectionBlock title="LOD is not a project phase">
          {LOD_PHASE_TEXT.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </SectionBlock>

        <SectionBlock title="LOD and level of information (ISO 7817-1)">
          {LOD_ISO_TEXT.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </SectionBlock>

        <SectionBlock title="What a permit set typically covers">
          <p>{LOD_PERMIT_SET_INTRO}</p>
          <dl className="mt-4 divide-y divide-neutral-900 border-y border-neutral-900">
            {PERMIT_SET.map(({ series, sheets }) => (
              <div key={series} className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-[10rem_1fr] sm:gap-6">
                <dt className="text-small font-semibold text-neutral-200">{series}</dt>
                <dd className="text-small text-neutral-400">
                  {sheets.map((s) => (
                    <span key={s.number} className="block">
                      <span className="font-mono text-label text-neutral-300">{s.number}</span> {s.title}
                    </span>
                  ))}
                </dd>
              </div>
            ))}
          </dl>
        </SectionBlock>

        <SectionBlock title="How to specify LOD in a proposal">
          <ol className="list-decimal space-y-3 pl-6 marker:text-neutral-500">
            {LOD_HOW_TO_SPECIFY.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        </SectionBlock>

        <SectionBlock title="What we deliver">
          <p>{LOD_COVERAGE}</p>
          <p>{LOD_DELIVER_TEXT}</p>
        </SectionBlock>

        <SectionBlock title="Glossary">
          <dl className="space-y-3">
            {LOD_GLOSSARY.map(([term, meaning]) => (
              <div key={term} className="grid grid-cols-1 gap-1 sm:grid-cols-[7rem_1fr] sm:gap-6">
                <dt className="font-mono text-small text-neutral-100">{term}</dt>
                <dd className="text-small text-neutral-400">{meaning}</dd>
              </div>
            ))}
          </dl>
        </SectionBlock>

        <SectionBlock title="Sources">
          <ul className="space-y-3">
            {LOD_SOURCES.map((source) => (
              <li key={source.label} className="text-small">
                {source.href ? (
                  <a href={source.href} target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:text-amber-300">
                    {source.label}
                  </a>
                ) : (
                  <span className="text-neutral-200">{source.label}</span>
                )}
                {source.note && <span className="block text-label text-neutral-500">{source.note}</span>}
              </li>
            ))}
          </ul>
        </SectionBlock>

        <section className="border-t border-neutral-900 py-16">
          <SectionHeader title="Scoping a project and not sure what LOD you need?">
            <Button href={ROUTES.scopeEstimator}>Start a Project</Button>
            <Button
              variant="secondary"
              icon={MessageSquare}
              href={whatsappHref(specialist, `Hi ${specialist.name.split(" ")[0]}, I read the LOD guide and have a question about scoping my project.`)}
              external
            >
              WhatsApp
            </Button>
          </SectionHeader>
        </section>
      </Container>
    </article>

    <LodGuidePrint specialist={specialist} />
  </main>
);

// The printed / saved-as-PDF guide (point 14, Appendix B.4): a dense reference on two A4 or
// Letter pages — a title block, the six levels as rows, then the sections, sources and contact
// details. Hidden on screen; styled by the .lod-print rules in index.css.
const LodGuidePrint: React.FC<{ specialist: SpecialistProfile }> = ({ specialist }) => (
  <div className="print-only lod-print" aria-hidden="true">
    <div className="lod-print-title">
      <div className="lod-print-brand">
        {specialist.logoUrl && <img src={specialist.logoUrl} alt="" />}
        <div>
          <strong>{specialist.brandName || specialist.name}</strong>
          <span>LOD Field Guide — {LOD_GUIDE_VERSION}</span>
        </div>
      </div>
      <span>quinarch.design/guides/lod-guide/</span>
    </div>

    <h1>What LOD Actually Means</h1>
    <p className="lod-print-lead">
      A plain-language reference to the Level of Development scale: what each level contains, what it's for, how
      it relates to project phases and ISO 7817-1, and how to write it into a proposal. Definitions are paraphrased
      from the BIMForum LOD Specification 2025, Part I.
    </p>

    <table className="lod-print-table">
      <thead>
        <tr>
          <th>Level</th>
          <th>Definition (paraphrased)</th>
          <th>In practice · used for · the window</th>
          <th>Here</th>
        </tr>
      </thead>
      <tbody>
        {LOD_LEVELS.map((lod) => (
          <tr key={lod.level}>
            <td>
              <strong>{lod.level}</strong>
              <br />
              {lod.name}
              <br />
              <em>{lod.modeledBy}</em>
            </td>
            <td>{lod.definition}</td>
            <td>
              {lod.meaning} <strong>Used for:</strong> {lod.usedFor} <strong>The window:</strong> {lod.windowExample}
              <br />
              <span className="lod-print-aspects">
                ISO 7817-1: {ASPECTS.map(([key, label]) => `${label.toLowerCase()} ${aspectValue(lod.informationNeed[key])}`).join(" · ")}
              </span>
            </td>
            <td>{LOD_STATUS_LABEL[lod.status]}</td>
          </tr>
        ))}
      </tbody>
    </table>

    <div className="lod-print-columns">
      <section>
        <h2>LOD is not a project phase</h2>
        {LOD_PHASE_TEXT.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </section>
      <section>
        <h2>LOD and level of information (ISO 7817-1)</h2>
        {LOD_ISO_TEXT.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </section>
      <section>
        <h2>What a permit set typically covers</h2>
        <p>{LOD_PERMIT_SET_INTRO}</p>
        <ul className="lod-print-series">
          {PERMIT_SET.map(({ series, sheets }) => (
            <li key={series}>
              <strong>{series}:</strong> {sheets.map((s) => `${s.number} ${s.title}`).join("; ")}
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h2>How to specify LOD in a proposal</h2>
        <ol>
          {LOD_HOW_TO_SPECIFY.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
      </section>
      <section>
        <h2>What we deliver</h2>
        <p>{LOD_COVERAGE}</p>
        <p>{LOD_DELIVER_TEXT}</p>
      </section>
      <section>
        <h2>Glossary</h2>
        <dl>
          {LOD_GLOSSARY.map(([term, meaning]) => (
            <div key={term}>
              <dt>{term}</dt>
              <dd>{meaning}</dd>
            </div>
          ))}
        </dl>
      </section>
      <section>
        <h2>Sources</h2>
        <ul>
          {LOD_SOURCES.map((source) => (
            <li key={source.label}>
              {source.label}
              {source.href ? ` — ${source.href}` : ""}
            </li>
          ))}
        </ul>
      </section>
    </div>

    <p className="lod-print-footer">
      {specialist.brandName || specialist.name} · quinarch.design · {specialist.email} · WhatsApp {specialist.phone}
    </p>
  </div>
);
