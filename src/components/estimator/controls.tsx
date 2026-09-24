import React, { useEffect, useId, useState } from "react";
import { Check } from "lucide-react";
import { AreaScale, AreaUnit, fromUnit, toUnit, unitLabel } from "../../utils/units";
import { formatNumber } from "../../utils/format";

// The estimator's shared controls (R5 of documentation/final-polish-v2.0.md): the same step
// frame, segmented buttons, option cards, slider-plus-number input and unit toggle in every tab.
// Choices are native radio/checkbox inputs underneath, so keyboard and screen-reader behaviour
// come for free.

export const Step: React.FC<{
  number: number;
  title: string;
  hint?: React.ReactNode;
  children: React.ReactNode;
  aside?: React.ReactNode;
}> = ({ number, title, hint, children, aside }) => (
  <section className="border-t border-neutral-800 pt-8 first:border-t-0 first:pt-0">
    <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
      <div className="flex items-baseline gap-4">
        <span className="text-label font-semibold tabular-nums text-amber-400" aria-hidden="true">
          {String(number).padStart(2, "0")}
        </span>
        <h3 className="heading-3 text-neutral-100">{title}</h3>
      </div>
      {aside}
    </div>
    {hint && <p className="mt-2 text-small text-neutral-400 sm:pl-10">{hint}</p>}
    <div className="mt-6 space-y-6 sm:pl-10">{children}</div>
  </section>
);

export const FieldLabel: React.FC<{ htmlFor?: string; children: React.ReactNode; hint?: React.ReactNode }> = ({
  htmlFor,
  children,
  hint,
}) => (
  <div className="mb-3">
    <label htmlFor={htmlFor} className="block text-small font-semibold text-neutral-200">
      {children}
    </label>
    {hint && <p className="mt-0.5 text-label text-neutral-500">{hint}</p>}
  </div>
);

const optionBox = (selected: boolean) =>
  `relative block cursor-pointer rounded border transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-amber-400 ${
    selected ? "border-amber-400/80 bg-neutral-900" : "border-neutral-800 bg-neutral-900/30 hover:border-neutral-600"
  }`;

export interface Option<T extends string> {
  value: T;
  label: string;
  description?: string;
  meta?: string;
}

/** A row of mutually exclusive buttons — for short labels (scene, tier, schedule, units). */
export function SegmentedControl<T extends string>({
  name,
  value,
  onChange,
  options,
  ariaLabel,
  size = "md",
}: {
  name: string;
  value: T;
  onChange: (v: T) => void;
  options: Option<T>[];
  ariaLabel: string;
  size?: "md" | "sm";
}) {
  return (
    <div role="radiogroup" aria-label={ariaLabel} className="flex flex-wrap gap-2">
      {options.map((o) => {
        const selected = o.value === value;
        return (
          <label
            key={o.value}
            className={`${optionBox(selected)} ${size === "sm" ? "px-3 py-1.5" : "flex-1 min-w-[7rem] px-4 py-2.5"} text-center`}
          >
            <input
              type="radio"
              name={name}
              value={o.value}
              checked={selected}
              onChange={() => onChange(o.value)}
              className="sr-only"
            />
            <span className={`block font-semibold ${size === "sm" ? "text-label" : "text-small"} ${selected ? "text-neutral-100" : "text-neutral-300"}`}>
              {o.label}
            </span>
            {o.meta && <span className="block text-label text-neutral-500 mt-0.5">{o.meta}</span>}
          </label>
        );
      })}
    </div>
  );
}

/** Radio cards with a description — for choices that need a sentence (project type, stage). */
export function OptionCards<T extends string>({
  name,
  value,
  onChange,
  options,
  ariaLabel,
  columns = 2,
}: {
  name: string;
  value: T;
  onChange: (v: T) => void;
  options: Option<T>[];
  ariaLabel: string;
  columns?: 1 | 2 | 3;
}) {
  const grid = columns === 3 ? "sm:grid-cols-3" : columns === 2 ? "sm:grid-cols-2" : "";
  return (
    <div role="radiogroup" aria-label={ariaLabel} className={`grid grid-cols-1 gap-3 ${grid}`}>
      {options.map((o) => {
        const selected = o.value === value;
        return (
          <label key={o.value} className={`${optionBox(selected)} p-4`}>
            <input
              type="radio"
              name={name}
              value={o.value}
              checked={selected}
              onChange={() => onChange(o.value)}
              className="sr-only"
            />
            <span className="flex items-start justify-between gap-3">
              <span className={`text-small font-semibold ${selected ? "text-neutral-100" : "text-neutral-200"}`}>{o.label}</span>
              {selected && <Check className="w-4 h-4 mt-0.5 shrink-0 text-amber-400" aria-hidden="true" />}
            </span>
            {o.description && <span className="mt-1.5 block text-label text-neutral-400">{o.description}</span>}
            {o.meta && <span className="mt-2 block text-label text-neutral-500">{o.meta}</span>}
          </label>
        );
      })}
    </div>
  );
}

/** Checkbox cards — for picking any number of services. */
export function CheckboxCards<T extends string>({
  values,
  onToggle,
  options,
  ariaLabel,
}: {
  values: T[];
  onToggle: (v: T) => void;
  options: Option<T>[];
  ariaLabel: string;
}) {
  return (
    <div role="group" aria-label={ariaLabel} className="grid grid-cols-1 gap-3">
      {options.map((o) => {
        const checked = values.includes(o.value);
        return (
          <label key={o.value} className={`${optionBox(checked)} flex items-start gap-4 p-4`}>
            <input type="checkbox" checked={checked} onChange={() => onToggle(o.value)} className="sr-only" />
            <span
              aria-hidden="true"
              className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border ${
                checked ? "border-amber-400 bg-amber-400" : "border-neutral-600"
              }`}
            >
              {checked && <Check className="h-3 w-3 text-neutral-950" strokeWidth={3} />}
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <span className={`text-small font-semibold ${checked ? "text-neutral-100" : "text-neutral-200"}`}>{o.label}</span>
                {o.meta && <span className="text-label text-neutral-500">{o.meta}</span>}
              </span>
              {o.description && <span className="mt-1.5 block text-label text-neutral-400">{o.description}</span>}
            </span>
          </label>
        );
      })}
    </div>
  );
}

/** A slider paired with a number input. `value` and `onChange` are in the displayed unit. */
export const SliderInput: React.FC<{
  id?: string;
  label: string;
  hint?: React.ReactNode;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step: number;
  suffix?: string;
  presets?: number[];
  formatPreset?: (v: number) => string;
  aside?: React.ReactNode;
}> = ({ id, label, hint, value, onChange, min, max, step, suffix, presets, formatPreset = formatNumber, aside }) => {
  const autoId = useId();
  const inputId = id ?? autoId;
  // The number field keeps its own text while the visitor types, so clearing it to type a new
  // value doesn't snap back to the minimum mid-edit; it commits on blur or Enter.
  const [draft, setDraft] = useState<string | null>(null);
  useEffect(() => setDraft(null), [value]);
  const clampValue = (v: number) => Math.min(max, Math.max(min, v));
  const commit = (text: string) => {
    const n = Number(text.replace(/,/g, ""));
    if (Number.isFinite(n) && text.trim() !== "") onChange(clampValue(n));
    setDraft(null);
  };
  const fill = ((clampValue(value) - min) / (max - min)) * 100;

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
        <div>
          <label htmlFor={inputId} className="block text-small font-semibold text-neutral-200">
            {label}
          </label>
          {hint && <p className="mt-0.5 text-label text-neutral-500">{hint}</p>}
        </div>
        <div className="flex items-center gap-3">
          {aside}
          <div className="flex items-center gap-2">
            <input
              id={inputId}
              type="number"
              inputMode="numeric"
              min={min}
              max={max}
              step={step}
              value={draft ?? String(Math.round(value))}
              onChange={(e) => setDraft(e.target.value)}
              onBlur={(e) => commit(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") commit((e.target as HTMLInputElement).value);
              }}
              onWheel={(e) => e.currentTarget.blur()}
              className="no-spinner w-24 rounded border border-neutral-700 bg-neutral-950 px-3 py-2 text-right font-mono text-small text-neutral-100 focus:border-amber-400 focus:outline-none"
            />
            {suffix && <span className="w-7 text-label text-neutral-400">{suffix}</span>}
          </div>
        </div>
      </div>
      <input
        type="range"
        aria-label={label}
        min={min}
        max={max}
        step={step}
        value={clampValue(value)}
        onChange={(e) => onChange(Number(e.target.value))}
        className="range-input"
        style={{ ["--range-fill" as string]: `${fill}%` }}
      />
      {!!presets?.length && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {presets.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => onChange(p)}
              aria-pressed={Math.round(value) === p}
              className={`rounded border px-3 py-1.5 font-mono text-label transition-colors ${
                Math.round(value) === p
                  ? "border-amber-400/80 text-neutral-100"
                  : "border-neutral-800 text-neutral-400 hover:border-neutral-600 hover:text-neutral-200"
              }`}
            >
              {formatPreset(p)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export const UnitToggle: React.FC<{ unit: AreaUnit; onChange: (u: AreaUnit) => void; name: string }> = ({
  unit,
  onChange,
  name,
}) => (
  <SegmentedControl
    name={name}
    ariaLabel="Area unit"
    size="sm"
    value={unit}
    onChange={onChange}
    options={[
      { value: "ft2", label: "ft²" },
      { value: "m2", label: "m²" },
    ]}
  />
);

/** Area slider + number + presets in the chosen unit, stored as square feet. */
export const AreaInput: React.FC<{
  label: string;
  hint?: React.ReactNode;
  sqft: number;
  onChange: (sqft: number) => void;
  unit: AreaUnit;
  onUnitChange: (u: AreaUnit) => void;
  scale: AreaScale;
  name: string;
}> = ({ label, hint, sqft, onChange, unit, onUnitChange, scale, name }) => {
  const s = scale[unit];
  const shown = Math.round(toUnit(sqft, unit));
  return (
    <SliderInput
      label={label}
      hint={hint}
      value={shown}
      onChange={(v) => onChange(fromUnit(v, unit))}
      min={s.min}
      max={s.max}
      step={s.step}
      suffix={unitLabel(unit)}
      presets={s.presets}
      aside={<UnitToggle unit={unit} onChange={onUnitChange} name={`${name}-unit`} />}
    />
  );
};
