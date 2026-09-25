import React, { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { useAfterLoad } from "./filmstrip/useAfterLoad";

// The hero background videos (v3.0 phase 9), made by scripts/build-hero-videos.mjs from the
// owner's own reels — self-hosted, so there's no player to download, no cookies and no branding.
export const HERO_VIDEOS = {
  home: { src: "/video/hero-home.mp4", poster: "/video/hero-home.webp" },
  bimCad: { src: "/video/hero-bim-cad.mp4", poster: "/video/hero-bim-cad.webp" },
  visualization: { src: "/video/hero-visualization.mp4", poster: "/video/hero-visualization.webp" },
} as const;

/** Dark scrims so the title stays readable over the footage. */
export const SCRIM = {
  /** Centred homepage headline: light at the top, near-black where the ribbons rest. */
  centred: "bg-gradient-to-b from-neutral-950/50 via-neutral-950/60 to-neutral-950/92",
  /** Service page headers: evenly darker, since their reels include white drawing sheets. */
  page: "bg-gradient-to-b from-neutral-950/80 via-neutral-950/80 to-neutral-950/92",
} as const;

interface HeroVideoProps {
  src: string;
  poster: string;
  scrim?: string;
}

// Silent, looping background footage that fills its (positioned) parent.
// - The poster (a few KB) is in the prerendered HTML, so the hero's picture is there from the
//   first paint and is the page's largest paint early on. The video mounts only once the page
//   has loaded, so it never competes with the fonts and scripts; it stays transparent until
//   it's actually playing, then fades in over the poster (same size, so it isn't a new largest
//   paint).
// - It pauses whenever it's scrolled out of view (the ribbons carry the hero off the top).
// - Under reduced motion only the poster shows.
export const HeroVideo: React.FC<HeroVideoProps> = ({ src, poster, scrim = SCRIM.centred }) => {
  const ready = useAfterLoad();
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    // Set as a property as well: autoplay on iOS needs the video to be muted before play().
    v.muted = true;
    const play = () => v.play().catch(() => undefined);
    // Ratio, not isIntersecting: the ribbons park the hero exactly against the top of their
    // layer, which counts as an (empty) intersection.
    const io = new IntersectionObserver(([e]) => (e.intersectionRatio > 0 ? play() : v.pause()), {
      threshold: [0, 0.01],
    });
    io.observe(v);
    return () => io.disconnect();
  }, [ready, reduceMotion]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <img src={poster} alt="" fetchPriority="high" className="absolute inset-0 h-full w-full object-cover" />
      {ready && !reduceMotion && (
        <video
          ref={ref}
          src={src}
          poster={poster}
          muted
          loop
          playsInline
          autoPlay
          preload="auto"
          disablePictureInPicture
          tabIndex={-1}
          onPlaying={() => setPlaying(true)}
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-out"
          style={{ opacity: playing ? 1 : 0 }}
        />
      )}
      <div className={`absolute inset-0 ${scrim}`} />
    </div>
  );
};
