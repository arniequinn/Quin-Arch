import React, { useEffect, useState } from "react";

const FEATURED_VIDEO_ID = "Gbf1Qq946ds";
// YouTube's own loading thumbnail and transient play-state icon can flash for a moment after
// the embed mounts, even with controls stripped from the URL. A flat cover held for longer than
// that flash ever lasts is far more reliable than trying to time it against player events —
// there's no autoplay-state or cross-origin postMessage quirk left to chase.
// Some shots in the source video are 4:3 pictures baked into the 16:9 frame (black bars left and
// right), which showed up as dead negative space on wide screens. Size the 16:9 iframe so its
// central 4:3 region covers the container — the bars fall outside the crop, and the picture
// always fills the hero at any screen shape. The small overscan hides edge rounding.
const FRAME_ASPECT = 16 / 9;
const SAFE_ASPECT = 4 / 3;
const OVERSCAN = 1.02;
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
  // The embed is only mounted in the browser, not written into the prerendered HTML, so the
  // YouTube player doesn't compete with the page's own scripts while it loads — it sits under
  // the cover for the first COVER_MS anyway.
  const [mounted, setMounted] = useState(false);
  const [revealed, setRevealed] = useState(false);

  // The player (about 1 MB of YouTube scripts) only starts once the page itself has finished
  // loading, so it never competes with the fonts, scripts and first images for bandwidth.
  useEffect(() => {
    let revealTimer = 0;
    const start = () => {
      setMounted(true);
      revealTimer = window.setTimeout(() => setRevealed(true), COVER_MS);
    };
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });
    return () => {
      window.removeEventListener("load", start);
      window.clearTimeout(revealTimer);
    };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none [container-type:size]" aria-hidden="true">
      {mounted && (
        <iframe
          src={EMBED_SRC}
          title="Background rendering animation"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          // Cover the container at any aspect ratio (a tall phone hero needs a video wider than 100vw)
          style={{
            height: `max(${OVERSCAN * 100}cqh, ${(OVERSCAN / SAFE_ASPECT) * 100}cqw)`,
            width: `calc(max(${OVERSCAN * 100}cqh, ${(OVERSCAN / SAFE_ASPECT) * 100}cqw) * ${FRAME_ASPECT})`,
          }}
          frameBorder="0"
          allow="autoplay; encrypted-media"
        />
      )}
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
