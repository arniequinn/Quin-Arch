import React, { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { FilmstripMask } from "./FilmstripMask";
import { TrackImage } from "../../types";

interface FinaleSequenceProps {
  interiorImages: TrackImage[];
  exteriorImages: TrackImage[];
}

type Stage = "closed" | "interior" | "exterior" | "exit";

// Phase 3: the closing act before the Scope Estimator. The two filmstrip bands come together
// once more, and this time each takes over the full viewport in turn — interior first, then
// exterior — with cursor position steering which way it drifts (left half of the screen = one
// direction, right half = the other; speed stays constant, only direction changes). Reuses
// ScrollFilmstrip/useMarquee exactly as built for the ambient hero bands — the mouse-driven
// direction is just a different *input* into the same engine, per useMarquee's design.
//
// Still scroll-reading, not scroll-jacking: native wheel/trackpad/touch/keyboard scrolling is
// never intercepted or overridden. A tall wrapper + a `position: sticky` inner stage is what
// makes the fullscreen takeover track scroll position at all — the same non-hijacking technique
// ChapterFrame uses, just carried to 100vh instead of a partial-height band.
export const FinaleSequence: React.FC<FinaleSequenceProps> = ({ interiorImages, exteriorImages }) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({ target: wrapperRef, offset: ["start start", "end end"] });

  const interiorVh = useTransform(scrollYProgress, [0, 0.22, 0.45, 0.5], [0, 100, 100, 0]);
  const exteriorVh = useTransform(scrollYProgress, [0.5, 0.55, 0.78, 1], [0, 100, 100, 0]);
  const interiorHeight = useTransform(interiorVh, (v) => `${v}vh`);
  const exteriorHeight = useTransform(exteriorVh, (v) => `${v}vh`);

  const [stage, setStage] = useState<Stage>("closed");
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (v < 0.03) setStage("closed");
    else if (v < 0.5) setStage("interior");
    else if (v < 0.97) setStage("exterior");
    else setStage("exit");
  });

  // Separate direction values per band so each remembers its own last direction independently.
  const interiorDir = useMotionValue(1);
  const exteriorDir = useMotionValue(-1);

  // Cursor/touch position (relative to stage center) only drives direction while that band is
  // the one currently fullscreen — attached/detached per stage, not always-on. Mouse and touch
  // share one handler so this works identically with a trackpad/mouse or a finger dragging
  // across the stage on a phone or tablet.
  useEffect(() => {
    if (stage !== "interior" && stage !== "exterior") return;
    const el = stageRef.current;
    if (!el) return;
    const target = stage === "interior" ? interiorDir : exteriorDir;
    const setFromX = (clientX: number) => {
      const rect = el.getBoundingClientRect();
      const center = rect.left + rect.width / 2;
      target.set(clientX < center ? -1 : 1);
    };
    const handlePointerMove = (e: PointerEvent) => setFromX(e.clientX);
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) setFromX(e.touches[0].clientX);
    };
    el.addEventListener("pointermove", handlePointerMove);
    el.addEventListener("touchmove", handleTouchMove, { passive: true });
    return () => {
      el.removeEventListener("pointermove", handlePointerMove);
      el.removeEventListener("touchmove", handleTouchMove);
    };
  }, [stage, interiorDir, exteriorDir]);

  // The only skip condition left is accessibility (prefers-reduced-motion) or having nothing to
  // show — this finale is native-scroll-linked, not scroll-jacked, so it runs the same way on a
  // phone's touch-scroll as on a desktop wheel.
  if (reduceMotion || (!interiorImages.length && !exteriorImages.length)) {
    return null;
  }

  return (
    <div ref={wrapperRef} className="relative h-[400vh]">
      <div ref={stageRef} className="sticky top-0 h-screen overflow-hidden bg-neutral-950">
        <FilmstripMask
          images={interiorImages}
          direction="right"
          directionOverride={interiorDir}
          speedPx={42}
          height={interiorHeight}
          angledEdge="bottom"
          align="start"
          paused={stage !== "interior"}
          className="absolute inset-x-0 top-0"
          trackHeightClassName="h-[78vh]"
        />

        <FilmstripMask
          images={exteriorImages}
          direction="left"
          directionOverride={exteriorDir}
          speedPx={42}
          height={exteriorHeight}
          angledEdge="top"
          align="end"
          paused={stage !== "exterior"}
          className="absolute inset-x-0 bottom-0"
          trackHeightClassName="h-[78vh]"
        />

        {(stage === "interior" || stage === "exterior") && (
          <div className="absolute inset-x-0 bottom-6 flex justify-center pointer-events-none">
            <span className="text-[11px] font-mono text-neutral-300 bg-neutral-950/60 backdrop-blur-sm px-3 py-1.5 rounded">
              {stage === "interior" ? "Interior" : "Exterior"} — move your cursor or finger to change direction
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
