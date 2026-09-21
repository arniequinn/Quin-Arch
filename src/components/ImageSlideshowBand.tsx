import React, { useEffect, useMemo, useState } from "react";
import { Images } from "lucide-react";
import { TrackImage } from "../types";

interface ImageSlideshowBandProps {
  images: TrackImage[];
  /** 1 = one big image per card. 2 = stack two images (top/bottom) in a single card — for wide
   * screenshots that read better paired up than shown one at a time. */
  imagesPerCard?: 1 | 2;
  /** Short eyebrow label shown above the band so visitors know what they're looking at. */
  title?: string;
}

// A full-bleed, ambient breathing-space divider between sections: cards crossfade through the
// whole set on their own — no arrows, no counter, nothing to operate — so the panel can spend
// all of its space on the imagery itself.
function chunk(images: TrackImage[], size: number): TrackImage[][] {
  const cards: TrackImage[][] = [];
  for (let i = 0; i < images.length; i += size) {
    cards.push(images.slice(i, i + size));
  }
  return cards;
}

// Diagonal cut for the card's top/bottom edges — a tasteful angle that still reads unmistakably
// as "cut," without eating too much of the frame now that the panel runs edge to edge.
const DIAGONAL_CLIP = "polygon(0 6%, 100% 0%, 100% 94%, 0% 100%)";
const CYCLE_MS = 5000;
const FADE_MS = 1200;

export const ImageSlideshowBand: React.FC<ImageSlideshowBandProps> = ({ images, imagesPerCard = 1, title }) => {
  const cards = useMemo(() => chunk(images, imagesPerCard), [images, imagesPerCard]);
  const [cardIndex, setCardIndex] = useState(0);

  useEffect(() => {
    if (cards.length <= 1) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => {
      setCardIndex((i) => (i + 1) % cards.length);
    }, CYCLE_MS);
    return () => window.clearInterval(id);
  }, [cards.length]);

  return (
    <div className="relative bg-neutral-950 border-t border-neutral-900 py-6 sm:py-8">
      {title && (
        <div className="flex justify-center mb-5">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
            <Images className="w-3.5 h-3.5" />
            <span>{title}</span>
          </div>
        </div>
      )}
      <div className="relative w-full h-[82vh] sm:h-[92vh]">
        <div
          className="relative w-full h-full overflow-hidden bg-neutral-900"
          style={{ clipPath: DIAGONAL_CLIP }}
        >
          {cards.map((card, idx) => (
            <div
              key={idx}
              className="absolute inset-0 flex flex-col gap-1 transition-opacity ease-in-out"
              style={{
                opacity: idx === cardIndex ? 1 : 0,
                transitionDuration: `${FADE_MS}ms`,
                zIndex: idx === cardIndex ? 1 : 0,
              }}
              aria-hidden={idx === cardIndex ? undefined : true}
            >
              {card.map((img) => (
                <div key={img.src} className={imagesPerCard === 2 ? "flex-1 overflow-hidden" : "w-full h-full"}>
                  <img src={img.src} alt="" className="w-full h-full object-cover" loading="lazy" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
