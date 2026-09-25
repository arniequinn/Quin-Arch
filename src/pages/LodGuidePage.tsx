import React from "react";
import { Printer } from "lucide-react";
import { Container } from "../components/Container";
import { PageHeader, SectionHeader } from "../components/SectionHeader";
import { Button } from "../components/Button";
import { EmailCaptureForm } from "../components/EmailCaptureForm";
import { ServicesLink } from "../components/PageSections";
import { LodSequence } from "../components/LodSequence";
import { Figure } from "../components/gallery/Figure";
import { galleryImage } from "../data/galleryProjects";
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

// v3.0 point 9: every section opens with its brass eyebrow, the raised background alternates, the
// long reference material folds away, and an index follows the reader on wide screens.
// Phase 9 (D17) shortened the screen version: the phases/ISO text and the permit-set sheet list
// fold away too. The printed guide (LodGuidePrint) is unchanged and still has everything.
const SECTIONS = [
  { id: "at-a-glance", label: "The six levels" },
  { id: "one-element", label: "One element, six levels" },
  { id: "permit-set", label: "A permit set" },
  { id: "specify", label: "Specifying LOD" },
  { id: "deliver", label: "What we deliver" },
  { id: "reference", label: "Standards, glossary, sources" },
];

const DELIVER_IMAGE = galleryImage("bimcad-workflow/05a-structural-model.webp", "Coordinated to LOD 350 — the tower's structural frame", {
  title: "Structural model",
});

const PERMIT_SHEET = galleryImage("sheets/beach-house-a021-elevations.webp", "Sheet A-0.2.1 — elevations from a permit set", {
  title: "Texas beach house — elevations",
});

const Block: React.FC<{ id: string; eyebrow: string; title: string; raised?: boolean; wide?: boolean; children: React.ReactNode }> = ({
  id,
  eyebrow,
  title,
  raised = false,
  wide = false,
  children,
}) => (
  <section id={id} className={`scroll-mt-20 border-t border-neutral-900 py-12 sm:py-16 ${raised ? "bg-neutral-900/40" : ""}`}>
    <Container width={wide ? "wide" : "text"}>
      <SectionHeader eyebrow={eyebrow} title={title} />
      <div className="mt-10 space-y-4 text-body text-neutral-300">{children}</div>
    </Container>
  </section>
);

/** A closed-by-default fold for reference material. */
const Fold: React.FC<{ summary: string; children: React.ReactNode }> = ({ summary, children }) => (
  <details className="group border-y border-neutral-800">
    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-small font-semibold text-neutral-100 marker:hidden hover:text-amber-300">
      {summary}
      <span className="text-amber-400 transition-transform group-open:rotate-45" aria-hidden="true">
        +
      </span>
    </summary>
    <div className="pb-6">{children}</div>
  </details>
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
      </Container>

      <div className="relative mt-14">
        {/* "On this page", sticky beside the reading column where there's room for it (≥ 1280 px). */}
        <div className="pointer-events-none absolute inset-0 hidden xl:block" aria-hidden="false">
          <div className="mx-auto h-full max-w-7xl px-8">
            <nav aria-label="On this page" className="pointer-events-auto sticky top-[var(--sticky-top,6rem)] w-48 pt-20">
              <p className="eyebrow text-neutral-500">On this page</p>
              <ol className="mt-4 space-y-2.5 border-l border-neutral-800">
                {SECTIONS.map((s) => (
                  <li key={s.id}>
                    <a href={`#${s.id}`} className="-ml-px block border-l border-transparent pl-4 text-label text-neutral-400 transition-colors hover:border-amber-400 hover:text-neutral-100">
                      {s.label}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </div>
        </div>

        <Block id="at-a-glance" eyebrow="At a glance" title="The six levels" wide>
          <table className="mx-auto w-full max-w-5xl border-collapse text-left">
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
          <p className="mx-auto max-w-5xl text-label text-neutral-500">
            Definitions below are paraphrased from the BIMForum LOD Specification 2025, Part I — see the{" "}
            <a href={LOD_SOURCES[0].href} target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:text-amber-300">
              specification
            </a>{" "}
            for its exact wording.
          </p>
        </Block>

        <section id="one-element" className="scroll-mt-20 border-t border-neutral-900 bg-neutral-900/40 py-14 sm:py-20">
          <Container>
            <SectionHeader
              eyebrow="Level by level"
              title="One element, six levels"
              intro="The same window in the same wall, drawn once per level. Grey is what a level inherits; brass is what it adds."
            />
            <div className="mx-auto mt-14 max-w-5xl">
              <LodSequence />
            </div>
            <div className="mx-auto mt-14 max-w-3xl">
              <Fold summary="Every level in full — in practice, uses, who models it, and ISO 7817-1">
                {LOD_LEVELS.map((lod) => (
                  <article key={lod.level} className="border-t border-neutral-800 py-6 first:border-t-0">
                    <h3 className="heading-3 text-neutral-100">
                      <span className="font-mono text-amber-400">{lod.level}</span> · {lod.name}
                    </h3>
                    <p className="mt-3 text-body text-neutral-200">{lod.definition}</p>
                    <dl className="mt-4 grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
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
                    <p className="mt-4 text-label text-neutral-500">
                      <span className="font-semibold">Level of information need (ISO 7817-1):</span>{" "}
                      {ASPECTS.map(([key, label]) => `${label.toLowerCase()} — ${aspectValue(lod.informationNeed[key])}`).join(" · ")}
                    </p>
                  </article>
                ))}
              </Fold>
            </div>
          </Container>
        </section>

        <section id="permit-set" className="scroll-mt-20 border-t border-neutral-900 bg-neutral-900/40 py-12 sm:py-16">
          <Container>
            <SectionHeader eyebrow="Permit sets" title="What a permit set typically covers" intro={LOD_PERMIT_SET_INTRO} />
            <div className="mt-12 grid grid-cols-1 items-start gap-12 lg:grid-cols-12">
              <div className="lg:col-span-5">
                <Figure image={PERMIT_SHEET} displayWidth={520} maxHeight="420px" />
              </div>
              <div className="space-y-6 lg:col-span-7">
                <p className="text-body text-neutral-300">
                  A typical set runs to {PERMIT_SET.reduce((n, s) => n + s.sheets.length, 0)} sheets across{" "}
                  {PERMIT_SET.length} series: {PERMIT_SET.map((s) => s.series).join(", ")}.
                </p>
                <Fold summary="Every sheet, by series">
                  <dl className="gap-8 sm:columns-2">
                    {PERMIT_SET.map(({ series, sheets }) => (
                      <div key={series} className="break-inside-avoid border-t border-neutral-800 py-3">
                        <dt className="text-small font-semibold text-neutral-200">{series}</dt>
                        <dd className="mt-1 text-small text-neutral-400">
                          {sheets.map((s) => (
                            <span key={s.number} className="block">
                              <span className="font-mono text-label text-neutral-300">{s.number}</span> {s.title}
                            </span>
                          ))}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </Fold>
              </div>
            </div>
          </Container>
        </section>

        <Block id="specify" eyebrow="In a proposal" title="How to specify LOD in a proposal" wide>
          <ol className="mx-auto grid max-w-5xl grid-cols-1 gap-x-12 gap-y-4 md:grid-cols-2">
            {LOD_HOW_TO_SPECIFY.map((item, i) => (
              <li key={item} className="flex items-start gap-4">
                <span className="w-7 shrink-0 font-semibold tabular-nums text-amber-400" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ol>
        </Block>

        <section id="deliver" className="scroll-mt-20 border-t border-neutral-900 bg-neutral-900/40 py-12 sm:py-16">
          <Container>
            <div className="mx-auto grid max-w-5xl grid-cols-1 items-center gap-12 lg:grid-cols-2">
              <div className="space-y-4 text-body text-neutral-300">
                <p className="eyebrow text-amber-400">Our scope</p>
                <h2 className="heading-2 text-neutral-100">What we deliver</h2>
                <p>{LOD_COVERAGE}</p>
                <p className="text-small">{LOD_DELIVER_TEXT}</p>
                <p className="pt-2">
                  <a href={ROUTES.bimCad} className="text-small font-semibold text-amber-400 hover:text-amber-300">
                    BIM / CAD drafting →
                  </a>
                </p>
              </div>
              <Figure image={DELIVER_IMAGE} displayWidth={500} maxHeight="400px" />
            </div>
          </Container>
        </section>

        <Block id="reference" eyebrow="Reference" title="Standards, glossary and sources">
          <Fold summary="LOD is not a project phase — and how it maps to ISO 7817-1">
            <div className="space-y-4">
              {LOD_PHASE_TEXT.map((p) => (
                <p key={p} className="text-small text-neutral-300">{p}</p>
              ))}
              <h3 className="heading-3 pt-4 text-neutral-100">LOD and level of information (ISO 7817-1)</h3>
              {LOD_ISO_TEXT.map((p) => (
                <p key={p} className="text-small text-neutral-300">{p}</p>
              ))}
            </div>
          </Fold>
          <Fold summary={`Glossary — ${LOD_GLOSSARY.length} terms`}>
            <dl className="space-y-3">
              {LOD_GLOSSARY.map(([term, meaning]) => (
                <div key={term} className="grid grid-cols-1 gap-1 sm:grid-cols-[7rem_1fr] sm:gap-6">
                  <dt className="font-mono text-small text-neutral-100">{term}</dt>
                  <dd className="text-small text-neutral-400">{meaning}</dd>
                </div>
              ))}
            </dl>
          </Fold>
          <Fold summary={`Sources — ${LOD_SOURCES.length}`}>
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
          </Fold>
        </Block>
      </div>

      <ServicesLink className="border-t border-neutral-900 py-16 print-hide" />
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
