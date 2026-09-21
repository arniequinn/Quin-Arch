import React, { useEffect, useState } from "react";

const FEATURED_VIDEO_ID = "Gbf1Qq946ds";
// YouTube's own loading thumbnail and transient play-state icon can flash for a moment after
// the embed mounts, even with controls stripped from the URL. A flat cover held for longer than
// that flash ever lasts is far more reliable than trying to time it against player events —
// there's no autoplay-state or cross-origin postMessage quirk left to chase.
const COVER_MS = 2800;
const FADE_MS = 800;

const EMBED_SRC =
  `https://www.youtube-nocookie.com/embed/${FEATURED_VIDEO_ID}` +
  `?autoplay=1&mute=1&loop=1&playlist=${FEATURED_VIDEO_ID}` +
  `&controls=0&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&disablekb=1&playsinline=1`;

// Silent, looping, chrome-free YouTube embed used as the hero's background layer.
// controls/branding/related-video params are trimmed as far as YouTube's embed API allows —
// a small YouTube watermark may still appear per their attribution requirements.
export const HeroBackgroundVideo: React.FC = () => {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => setRevealed(true), COVER_MS);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <iframe
        src={EMBED_SRC}
        title="Background rendering animation"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vw] min-w-[177.78vh] h-[56.25vw] min-h-[100vh]"
        frameBorder="0"
        allow="autoplay; encrypted-media"
      />
      {/* Solid cover hides YouTube's own loading/branding flash — held for a fixed duration
          rather than tied to a player event, since that flash isn't reliably observable from
          the parent page across a cross-origin embed. */}
      <div
        className="absolute inset-0 bg-neutral-950 transition-opacity ease-out"
        style={{ opacity: revealed ? 0 : 1, transitionDuration: `${FADE_MS}ms` }}
      />
      {/* Dark scrim so headline/CTA text stays readable over the footage — kept light enough that the video is still clearly visible */}
      <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/50 via-neutral-950/60 to-neutral-950/92" />
    </div>
  );
};
