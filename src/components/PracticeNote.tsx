import React, { useState } from "react";
import { MoveHorizontal } from "lucide-react";
import { assetUrl } from "../utils/assetPath";

// One deliberate asymmetric, full-bleed moment — image runs to the viewport edge rather than
// stopping at the standard max-w-7xl container, paired with an offset caption column. Used once,
// as a signature transition between "see the work" and "here's how pricing/engagement works."
//
// The image itself is a draggable before/after comparison: a CAD wireframe elevation revealed
// over the finished V-Ray render of the same building, from the same camera position. Both
// source images were aligned (scaled + positioned) so architectural features — roofline, door,
// window openings, the three cupolas — line up at the same screen position in both.
export const PracticeNote: React.FC = () => {
  const [sliderPosition, setSliderPosition] = useState<number>(45);

  return (
    <section className="relative bg-neutral-950 border-t border-neutral-900">
      <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
        <div className="lg:col-span-7 h-[46vh] lg:h-[600px] relative overflow-hidden select-none">
          {/* Background: finished render, full-size, never clipped */}
          <img
            src={assetUrl("/portfolio/barn-residence-vray.jpg")}
            alt="Finished V-Ray render of a barn-style residence"
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          />

          {/* Foreground: aligned CAD wireframe, revealed via clip-path up to the slider position */}
          <div
            className="absolute inset-0 overflow-hidden pointer-events-none"
            style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
          >
            {/* Inverted to a dark "blueprint" treatment — white CAD background becomes
                near-black, linework becomes light — so it reads with presence against the
                site's dark theme instead of as a glaring white panel. */}
            <img
              src={assetUrl("/portfolio/barn-residence-wireframe.png")}
              alt="CAD wireframe elevation of the same residence, aligned to the render"
              className="absolute inset-0 w-full h-full object-cover invert sepia-[0.15] contrast-125 brightness-95"
            />
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/40 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-neutral-950/20 pointer-events-none" />

          {/* Plain-text labels, not bordered badges */}
          <div className="absolute top-4 left-4 text-[11px] font-mono text-neutral-200 bg-neutral-950/60 backdrop-blur-sm px-2 py-1 rounded pointer-events-none">
            Wireframe
          </div>
          <div className="absolute top-4 right-4 text-[11px] font-mono text-neutral-200 bg-neutral-950/60 backdrop-blur-sm px-2 py-1 rounded pointer-events-none">
            Finished Render
          </div>

          {/* Divider line & handle */}
          <div
            className="absolute inset-y-0 w-px bg-neutral-100 shadow-lg pointer-events-none"
            style={{ left: `${sliderPosition}%` }}
          >
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-neutral-100 text-neutral-900 flex items-center justify-center shadow-md">
              <MoveHorizontal className="w-4 h-4" />
            </div>
          </div>

          {/* Invisible range input for dragging */}
          <input
            type="range"
            min={0}
            max={100}
            value={sliderPosition}
            onChange={(e) => setSliderPosition(Number(e.target.value))}
            className="absolute inset-0 opacity-0 cursor-ew-resize w-full h-full z-10"
            aria-label="Drag to compare the CAD wireframe with the finished render"
          />
        </div>

        <div className="lg:col-span-5 flex items-center px-4 sm:px-6 lg:px-14 py-12 lg:py-0">
          <div className="max-w-md">
            <span className="text-[11px] font-mono text-neutral-500 tracking-widest uppercase">
              Practice Note
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-neutral-100 tracking-tight leading-[1.1] mt-3">
              Maintaining harmony between person, place, and space.
            </h2>
            <p className="mt-5 text-sm text-neutral-400 leading-relaxed">
              That shows up in the work itself — proportion, light, and material resolved
              together, not stitched on after the fact. It's also why every project gets the
              same flat worldwide rate and the same principal-level attention: judgment applied
              sheet by sheet, never queued behind whichever job pays more.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
