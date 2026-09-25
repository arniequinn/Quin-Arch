import React from "react";
import { TrackImage } from "../../types";
import { thumbOf } from "../../data/galleryProjects";
import { ProjectLink, surfaceOf } from "./JustifiedGrid";

interface FigureProps {
  image: TrackImage;
  /** The widest the figure is shown on a large screen, in CSS px (it never exceeds the image's own width). */
  displayWidth?: number;
  /** Cap the height, e.g. "70svh", keeping the proportions. */
  maxHeight?: string;
  caption?: boolean;
  priority?: boolean;
  className?: string;
}

// One image, whole, at its own proportions, with the thumbnail served where it's enough.
export const Figure: React.FC<FigureProps> = ({
  image,
  displayWidth = 800,
  maxHeight,
  caption = true,
  priority = false,
  className = "",
}) => {
  const thumb = thumbOf(image);
  const aspect = image.width / image.height;
  const maxWidth = maxHeight ? `min(${image.width}px, calc(${maxHeight} * ${aspect.toFixed(4)}))` : `${image.width}px`;
  return (
    <figure className={`mx-auto w-full ${className}`} style={{ maxWidth }}>
      <div className={`overflow-hidden rounded-sm ${surfaceOf(image)}`} style={{ aspectRatio: `${image.width} / ${image.height}` }}>
        <img
          src={thumb.width >= Math.min(displayWidth, image.width) ? thumb.src : image.src}
          srcSet={thumb.width < image.width ? `${thumb.src} ${thumb.width}w, ${image.src} ${image.width}w` : undefined}
          sizes={`min(100vw, ${Math.min(displayWidth, image.width)}px)`}
          width={image.width}
          height={image.height}
          alt={`${image.title} — ${image.caption}`}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : undefined}
          decoding="async"
          className="h-full w-full object-contain"
        />
      </div>
      {caption && (
        <figcaption className="mt-3">
          <p className="text-small font-semibold text-neutral-100">{image.title}</p>
          <p className="text-label text-neutral-400">{image.caption}</p>
          {image.project && <ProjectLink slug={image.project} className="mt-1" />}
        </figcaption>
      )}
    </figure>
  );
};
