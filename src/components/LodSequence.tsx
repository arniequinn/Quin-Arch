import React from "react";
import { LOD_LEVELS, LOD_STATUS_LABEL } from "../data/lod";

// "One element, six levels" as a sequence (v3.0 point 9): the same window in the same wall, drawn
// once per level in the site's line style. Grey is what the level inherits; brass is what it adds.
// Simple SVGs drawn for the page — no screenshots.

const BASE = "stroke-neutral-500";
const NEW = "stroke-amber-400";
const TEXT_BASE = "fill-neutral-400";
const TEXT_NEW = "fill-amber-400";

/** The wall panel every drawing sits in. */
const Wall: React.FC = () => <rect x="16" y="14" width="168" height="212" className={BASE} fill="none" strokeWidth="1.5" />;

/** Opening at LOD 200 geometry: 3 ft × 5 ft, roughly placed. */
const Opening: React.FC<{ className?: string }> = ({ className = BASE }) => (
  <rect x="62" y="58" width="76" height="118" className={className} fill="none" strokeWidth="1.5" />
);

/** The specified window: frame, sash and sill. */
const Window: React.FC<{ className?: string }> = ({ className = BASE }) => (
  <g className={className} fill="none" strokeWidth="1.25">
    <rect x="62" y="58" width="76" height="118" />
    <rect x="68" y="64" width="64" height="106" />
    <line x1="56" y1="178" x2="144" y2="178" />
    <line x1="56" y1="182" x2="144" y2="182" />
  </g>
);

const Dimensions: React.FC<{ className?: string; textClass?: string }> = ({ className = BASE, textClass = TEXT_BASE }) => (
  <g>
    <g className={className} fill="none" strokeWidth="0.75">
      <line x1="62" y1="30" x2="138" y2="30" />
      <line x1="62" y1="25" x2="62" y2="35" />
      <line x1="138" y1="25" x2="138" y2="35" />
      <line x1="160" y1="58" x2="160" y2="176" />
      <line x1="155" y1="58" x2="165" y2="58" />
      <line x1="155" y1="176" x2="165" y2="176" />
    </g>
    <text x="100" y="23" textAnchor="middle" className={textClass} fontSize="9" fontFamily="JetBrains Mono, monospace">
      3'-0"
    </text>
    <text x="170" y="120" textAnchor="middle" className={textClass} fontSize="9" fontFamily="JetBrains Mono, monospace" transform="rotate(90 170 120)">
      5'-0"
    </text>
  </g>
);

const Interfaces: React.FC<{ className?: string }> = ({ className = NEW }) => (
  <g className={className} fill="none">
    {/* Lintel over the opening */}
    <rect x="50" y="46" width="100" height="10" strokeWidth="1.25" />
    <path d="M52 56 L60 46 M62 56 L70 46 M72 56 L80 46 M82 56 L90 46 M92 56 L100 46 M102 56 L110 46 M112 56 L120 46 M122 56 L130 46 M132 56 L140 46 M142 56 L148 48" strokeWidth="0.6" />
    {/* Sill flashing and clearance zone */}
    <path d="M52 186 L148 186 L152 192" strokeWidth="1.25" />
    <rect x="56" y="52" width="88" height="130" strokeWidth="0.75" strokeDasharray="3 3" />
  </g>
);

const Fabrication: React.FC<{ className?: string }> = ({ className = NEW }) => (
  <g className={className} fill="none" strokeWidth="1">
    {/* Mullion, glazing build-up and fixings */}
    <line x1="100" y1="64" x2="100" y2="170" />
    <line x1="96" y1="64" x2="96" y2="170" />
    <rect x="72" y="68" width="22" height="98" strokeWidth="0.6" />
    <rect x="102" y="68" width="26" height="98" strokeWidth="0.6" />
    {[78, 104, 130, 156].map((y) => (
      <g key={y}>
        <path d={`M58 ${y - 3} L64 ${y + 3} M64 ${y - 3} L58 ${y + 3}`} />
        <path d={`M136 ${y - 3} L142 ${y + 3} M142 ${y - 3} L136 ${y + 3}`} />
      </g>
    ))}
  </g>
);

const SurveyTargets: React.FC = () => (
  <g className={NEW} fill="none" strokeWidth="1">
    {[
      [62, 58],
      [138, 58],
      [138, 176],
    ].map(([x, y]) => (
      <g key={`${x}-${y}`}>
        <circle cx={x} cy={y} r="6" />
        <line x1={x - 9} y1={y} x2={x + 9} y2={y} />
        <line x1={x} y1={y - 9} x2={x} y2={y + 9} />
      </g>
    ))}
    <text x="100" y="212" textAnchor="middle" className={TEXT_NEW} stroke="none" fontSize="9" fontFamily="JetBrains Mono, monospace">
      as surveyed ± 3 mm
    </text>
  </g>
);

const DRAWINGS: Record<string, React.ReactNode> = {
  "LOD 100": (
    <>
      <Wall />
      <rect x="50" y="50" width="100" height="130" className={NEW} fill="none" strokeWidth="1" strokeDasharray="5 4" />
      <text x="100" y="120" textAnchor="middle" className={TEXT_NEW} fontSize="10" fontFamily="JetBrains Mono, monospace">
        ≈ 30% glazed
      </text>
    </>
  ),
  "LOD 200": (
    <>
      <Wall />
      <Opening className={NEW} />
      <text x="100" y="40" textAnchor="middle" className={TEXT_NEW} fontSize="9" fontFamily="JetBrains Mono, monospace">
        ≈ 3' × 5'
      </text>
    </>
  ),
  "LOD 300": (
    <>
      <Wall />
      <Window className={NEW} />
      <Dimensions className={NEW} textClass={TEXT_NEW} />
    </>
  ),
  "LOD 350": (
    <>
      <Wall />
      <Window />
      <Dimensions />
      <Interfaces />
    </>
  ),
  "LOD 400": (
    <>
      <Wall />
      <Window />
      <Interfaces className={BASE} />
      <Fabrication />
    </>
  ),
  "LOD 500": (
    <>
      <Wall />
      <Window />
      <Fabrication className={BASE} />
      <SurveyTargets />
    </>
  ),
};

export const LodSequence: React.FC = () => (
  <ol className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
    {LOD_LEVELS.map((lod) => (
      <li key={lod.level}>
        <div className="rounded-sm border border-neutral-800 bg-neutral-950 p-3">
          <svg viewBox="0 0 200 240" role="img" aria-label={`${lod.level}: ${lod.windowExample}`} className="mx-auto block h-auto w-full max-w-[150px]">
            {DRAWINGS[lod.level]}
          </svg>
        </div>
        <div className="mt-4 flex items-baseline justify-between gap-4">
          <h3 className="heading-3 text-neutral-100">
            <span className="font-mono text-amber-400">{lod.level}</span> · {lod.name}
          </h3>
          <span className="shrink-0 text-label text-neutral-500">{LOD_STATUS_LABEL[lod.status]}</span>
        </div>
        <p className="mt-2 text-small text-neutral-300">{lod.summary}</p>
        <p className="mt-2 text-label text-neutral-500">{lod.windowExample}</p>
      </li>
    ))}
  </ol>
);
