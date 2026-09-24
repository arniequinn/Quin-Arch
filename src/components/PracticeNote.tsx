import React, { useState } from "react";
import { MoveHorizontal } from "lucide-react";
import { assetUrl } from "../utils/assetPath";
import { Container } from "./Container";
import { SectionHeader } from "./SectionHeader";
import { Section } from "./PageSections";

// The practice note: a draggable before/after of the same barn residence — the CAD wireframe
// elevation revealed over the finished V-Ray render, from the same camera position (both images
// were aligned so the roofline, door, openings and cupolas line up). Moved here from the Project
// Library (point 15), where the "logic and feeling" story belongs. Shown whole, at no more than
// its own 1109 px width.
export const PracticeNote: React.FC = () => {
  const [sliderPosition, setSliderPosition] = useState<number>(45);

  return (
    <Section>
      <Container>
        <SectionHeader
          eyebrow="Practice note"
          title="Maintaining harmony between person, place, and space."
          intro="It shows up in the work itself — proportion, light and material resolved together, not stitched on after the fact. It's also why every project gets the same rate and the same principal-level attention: judgment applied sheet by sheet, never queued behind whichever job pays more."
        />

        <figure className="mt-12">
          <div className="relative mx-auto aspect-[1109/619] w-full max-w-[1109px] select-none overflow-hidden rounded-sm bg-neutral-900">
            {/* Background: finished render, full-size, never clipped */}
            <img
              src={assetUrl("/portfolio/barn-residence-vray.jpg")}
              alt="Finished V-Ray render of a barn-style residence"
              width={1109}
              height={619}
              loading="lazy"
              className="pointer-events-none absolute inset-0 h-full w-full object-cover"
            />

            {/* Foreground: aligned CAD wireframe, revealed via clip-path up to the slider position.
                Inverted to a dark "blueprint" treatment so it reads against the site's dark theme. */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden" style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}>
              <img
                src={assetUrl("/portfolio/barn-residence-wireframe.png")}
                alt="CAD wireframe elevation of the same residence, aligned to the render"
                width={1109}
                height={619}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover invert sepia-[0.15] contrast-125 brightness-95"
              />
            </div>

            <span className="pointer-events-none absolute left-4 top-4 rounded bg-neutral-950/70 px-2 py-1 text-label text-neutral-100">
              Wireframe
            </span>
            <span className="pointer-events-none absolute right-4 top-4 rounded bg-neutral-950/70 px-2 py-1 text-label text-neutral-100">
              Finished render
            </span>

            {/* Divider line & handle */}
            <div className="pointer-events-none absolute inset-y-0 w-px bg-neutral-100 shadow-lg" style={{ left: `${sliderPosition}%` }}>
              <div className="absolute top-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-neutral-100 text-neutral-900 shadow-md">
                <MoveHorizontal className="h-4 w-4" />
              </div>
            </div>

            {/* Invisible range input for dragging */}
            <input
              type="range"
              min={0}
              max={100}
              value={sliderPosition}
              onChange={(e) => setSliderPosition(Number(e.target.value))}
              className="absolute inset-0 z-10 h-full w-full cursor-ew-resize opacity-0"
              aria-label="Drag to compare the CAD wireframe with the finished render"
            />
          </div>
          <figcaption className="mt-4 text-center text-label text-neutral-500">
            Drag across the image: the same residence as a CAD wireframe and as the finished render.
          </figcaption>
        </figure>
      </Container>
    </Section>
  );
};
