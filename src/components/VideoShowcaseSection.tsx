import React from "react";
import { Youtube, ExternalLink, Film } from "lucide-react";
import { SpecialistProfile } from "../types";

interface VideoShowcaseSectionProps {
  specialist: SpecialistProfile;
}

const FEATURED_VIDEO_ID = "Gbf1Qq946ds";

export const VideoShowcaseSection: React.FC<VideoShowcaseSectionProps> = ({ specialist }) => {
  const youtubeUrl = specialist.socials?.youtube;

  return (
    <section id="video-showcase" className="py-16 bg-neutral-900/50 border-t border-neutral-900 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold mb-3">
            <Youtube className="w-3.5 h-3.5" />
            <span>See It In Motion</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-100 tracking-tight">
            Rendering & Production Videos
          </h2>
          <p className="mt-3 text-sm text-neutral-400 leading-relaxed">
            Featured below: a fully refined 3D rendering animation of an apartment interior, delivered
            remotely for a client in Lahore. The YouTube channel also has raw, behind-the-scenes
            production footage from other projects.
          </p>
        </div>

        <div className="rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-950 shadow-xl">
          <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
            <iframe
              className="absolute inset-0 w-full h-full"
              src={`https://www.youtube.com/embed/${FEATURED_VIDEO_ID}`}
              title="Ultra-refined interior rendering animation — remote project, Lahore"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
          <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 shrink-0">
                <Film className="w-4 h-4" />
              </div>
              <div>
                <span className="text-sm font-semibold text-neutral-100 block">
                  Interior Rendering Animation
                </span>
                <span className="text-xs text-neutral-400">
                  Ultra-refined 3D visualization • Remote delivery, Lahore
                </span>
              </div>
            </div>
            {youtubeUrl && (
              <a
                href={youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-xs sm:text-sm flex items-center justify-center space-x-1.5 shadow-md shadow-red-600/20 transition-all shrink-0"
              >
                <Youtube className="w-4 h-4" />
                <span>Visit YouTube Channel</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-70" />
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
