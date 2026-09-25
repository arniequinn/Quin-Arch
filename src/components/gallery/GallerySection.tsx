import React, { useState } from "react";
import { TrackImage } from "../../types";
import { Button } from "../Button";
import { JustifiedGrid } from "./JustifiedGrid";
import { Lightbox } from "./Lightbox";

interface GallerySectionProps {
  items: TrackImage[];
  /** Show this many first, then a "Show all" button (v3.0 §7 performance). */
  initialCount?: number;
  /** e.g. "Show all 88 furniture pieces". */
  showAllLabel?: string;
  currentProject?: string;
  className?: string;
}

// A justified grid with its own lightbox. The lightbox moves through the whole section, including
// items still folded behind "Show all".
export const GallerySection: React.FC<GallerySectionProps> = ({
  items,
  initialCount,
  showAllLabel,
  currentProject,
  className = "",
}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [expanded, setExpanded] = useState(false);
  const folded = initialCount !== undefined && !expanded && items.length > initialCount;
  const visible = folded ? items.slice(0, initialCount) : items;

  return (
    <div className={className}>
      <JustifiedGrid items={visible} onOpen={setOpenIndex} currentProject={currentProject} />
      {folded && (
        <div className="mt-10 flex justify-center">
          <Button variant="secondary" onClick={() => setExpanded(true)}>
            {showAllLabel ?? `Show all ${items.length}`}
          </Button>
        </div>
      )}
      <Lightbox
        items={items}
        index={openIndex}
        onIndex={setOpenIndex}
        onClose={() => setOpenIndex(null)}
        currentProject={currentProject}
      />
    </div>
  );
};
