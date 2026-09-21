import React, { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Images } from "lucide-react";
import { TrackImage } from "../types";

interface ImageSlideshowBandProps {
  images: TrackImage[];
  /** 1 = one big image per card. 2 = stack two images (top/bottom) in a single card — for wide
   * screenshots that read better paired up than shown one at a time. */
  imagesPerCard?: 1 | 2;
  /** Short eyebrow label shown above the band so visitors know what they're looking at. */
  title?: string;
}

// A clean breathing-space divider between sections: one large image (or a stacked pair) at a
// time, cut at a crisp diagonal top and bottom edge, navigated with simple left/right buttons —
// no scroll hijacking. Normal page scroll just scrolls past it like any other section.
function chunk(images: TrackImage[], size: number): TrackImage[][] {
  const cards: TrackImage[][] = [];
  for (let i = 0; i < images.length; i += size) {
    cards.push(images.slice(i, i + size));
  }
  return cards;
}

// Diagonal cut for the card's top/bottom edges. A literal 15deg across the card's full width
// would eat more than half its height on a wide card, so this is scaled to a tasteful diagonal
// that still reads unmistakably as "cut at an angle," not a subtle blur.
const DIAGONAL_CLIP = "polygon(0 9%, 100% 0%, 100% 91%, 0% 100%)";

export const ImageSlideshowBand: React.FC<ImageSlideshowBandProps> = ({ images, imagesPerCard = 1, title }) => {
  const cards = useMemo(() => chunk(images, imagesPerCard), [images, imagesPerCard]);
  const [cardIndex, setCardIndex] = useState(0);

  const atStart = cardIndex <= 0;
  const atEnd = cardIndex >= cards.length - 1;

  const goPrev = () => setCardIndex((i) => Math.max(0, i - 1));
  const goNext = () => setCardIndex((i) => Math.min(cards.length - 1, i + 1));

  const currentCard = cards[cardIndex] || [];

  return (
    <div className="relative bg-neutral-950 border-t border-neutral-900 py-8 sm:py-12">
      {title && (
        <div className="flex justify-center mb-5">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
            <Images className="w-3.5 h-3.5" />
            <span>{title}</span>
          </div>
        </div>
      )}
      <div className="relative mx-auto w-[95vw] max-w-[1860px] h-[75vh] sm:h-[85vh]">
        <div
          className="relative w-full h-full overflow-hidden bg-neutral-900 flex flex-col gap-1"
          style={{ clipPath: DIAGONAL_CLIP }}
        >
          {currentCard.map((img, i) => (
            <div key={img.src} className={imagesPerCard === 2 ? "flex-1 overflow-hidden" : "w-full h-full"}>
              <img src={img.src} alt="" className="w-full h-full object-cover" loading="lazy" />
            </div>
          ))}
        </div>

        {/* Prev / Next */}
        <button
          type="button"
          onClick={goPrev}
          disabled={atStart}
          aria-label="Previous image"
          className={`absolute left-2 lg:-left-5 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-neutral-950/80 border border-neutral-700 flex items-center justify-center backdrop-blur-sm transition-all ${
            atStart ? "opacity-30 cursor-not-allowed" : "hover:bg-amber-500 hover:border-amber-500 hover:text-neutral-950 text-neutral-100 cursor-pointer"
          }`}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={goNext}
          disabled={atEnd}
          aria-label="Next image"
          className={`absolute right-2 lg:-right-5 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-neutral-950/80 border border-neutral-700 flex items-center justify-center backdrop-blur-sm transition-all ${
            atEnd ? "opacity-30 cursor-not-allowed" : "hover:bg-amber-500 hover:border-amber-500 hover:text-neutral-950 text-neutral-100 cursor-pointer"
          }`}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Progress */}
      <div className="mt-6 flex items-center justify-center space-x-2">
        {cards.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Go to image ${i + 1}`}
            onClick={() => setCardIndex(i)}
            className={`h-1.5 rounded-full transition-all cursor-pointer ${
              i === cardIndex ? "w-6 bg-amber-500" : "w-1.5 bg-neutral-700 hover:bg-neutral-500"
            }`}
          />
        ))}
      </div>
      <p className="mt-2 text-center text-[11px] font-mono text-neutral-400">
        {cardIndex + 1} / {cards.length}
      </p>
    </div>
  );
};
