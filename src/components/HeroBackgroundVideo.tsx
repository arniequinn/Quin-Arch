import React from "react";

const FEATURED_VIDEO_ID = "Gbf1Qq946ds";

// Silent, looping, chrome-free YouTube embed used as the hero's background layer.
// controls/branding/related-video params are trimmed as far as YouTube's embed API allows —
// a small YouTube watermark may still appear per their attribution requirements.
const EMBED_SRC =
  `https://www.youtube-nocookie.com/embed/${FEATURED_VIDEO_ID}` +
  `?autoplay=1&mute=1&loop=1&playlist=${FEATURED_VIDEO_ID}` +
  `&controls=0&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&disablekb=1&playsinline=1`;

export const HeroBackgroundVideo: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <iframe
        src={EMBED_SRC}
        title="Background rendering animation"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vw] min-w-[177.78vh] h-[56.25vw] min-h-[100vh]"
        frameBorder="0"
        allow="autoplay; encrypted-media"
      />
      {/* Dark scrim so headline/CTA text stays readable over the footage — kept light enough that the video is still clearly visible */}
      <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/50 via-neutral-950/60 to-neutral-950/92" />
    </div>
  );
};
