import React, { useState } from "react";
import { ClientStory } from "../../data/galleryProjects";
import { Lightbox } from "./Lightbox";
import { tileSources } from "./JustifiedGrid";

// A client's drawings, then the client's own words (v3.0 §9, D5): a quote set as text, never a
// screenshot — no stars, ratings or platform names.
/** `compact`: a shorter drawing panel, for service pages where the stories support other work. */
export const ClientStories: React.FC<{ stories: ClientStory[]; compact?: boolean }> = ({ stories, compact = false }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const images = stories.map((s) => s.image);

  return (
    <>
      <ul className="grid grid-cols-1 gap-x-10 gap-y-14 md:grid-cols-3">
        {stories.map((story, i) => (
          <li key={story.title} className="flex flex-col">
            <button
              type="button"
              onClick={() => setOpenIndex(i)}
              aria-label={`Open ${story.image.title}`}
              className={`flex ${compact ? "aspect-[4/3]" : "aspect-[4/5]"} cursor-zoom-in items-center justify-center rounded-sm bg-white p-4 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400`}
            >
              <img
                {...tileSources(story.image, [320, 360, 420])}
                width={story.image.width}
                height={story.image.height}
                alt={`${story.image.title} — ${story.image.caption}`}
                loading="lazy"
                decoding="async"
                className="max-h-full w-auto max-w-full object-contain"
              />
            </button>
            <p className="eyebrow mt-5 text-amber-400">Client story</p>
            <h3 className="heading-3 mt-1.5 text-neutral-100">{story.title}</h3>
            <p className="mt-1 text-small text-neutral-400">{story.image.caption}</p>
            <figure className="mt-5 border-l-2 border-amber-400/70 pl-4">
              <blockquote className="font-display text-[1.25rem] leading-snug text-neutral-200">“{story.quote.quote}”</blockquote>
              <figcaption className="mt-3 text-label text-neutral-500">{story.quote.attribution}</figcaption>
            </figure>
          </li>
        ))}
      </ul>
      <Lightbox items={images} index={openIndex} onIndex={setOpenIndex} onClose={() => setOpenIndex(null)} />
    </>
  );
};
