import React from "react";
import { assetUrl } from "../utils/assetPath";
import { CompareSlider } from "./CompareSlider";

// The barn residence as its model (the CAD wireframe elevation) and as the finished render, from
// the same camera and at the same pixel size — the one pair that qualifies for a slider (v3.0 §8).
// Black line work on white, as drawn; never inverted. Used by the Design Philosophy practice note
// and the Visualization page.
export const BarnCompare: React.FC<{ className?: string }> = ({ className = "" }) => (
  <figure className={className}>
    <CompareSlider
      overlay={{
        src: assetUrl("/portfolio/barn-residence-wireframe.png"),
        width: 1109,
        height: 619,
        alt: "CAD wireframe elevation of a barn-style residence, aligned to the render",
        label: "Model",
      }}
      base={{
        src: assetUrl("/portfolio/barn-residence-render.jpg"),
        width: 1109,
        height: 619,
        alt: "Finished render of the same barn-style residence",
        label: "Render",
      }}
    />
    <figcaption className="mt-4 text-center text-label text-neutral-500">
      Drag across the image — or use the arrow keys — to compare the model with the finished render. Double-click to
      snap.
    </figcaption>
  </figure>
);
