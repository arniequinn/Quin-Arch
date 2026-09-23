import React from "react";
import { DeliverablesGallery } from "../components/DeliverablesGallery";
import { ProjectGallery } from "../components/ProjectGallery";
import { PracticeNote } from "../components/PracticeNote";
import { Reveal } from "../components/Reveal";
import {
  BIMCAD_WORKFLOW_IMAGES,
  EXTERIOR_SHOWCASE_IMAGES,
  VISUALIZATION_SHOWCASE_IMAGES,
} from "../data/architecturalData";
import { SpecialistProfile } from "../types";

interface ProjectsPageProps {
  specialist: SpecialistProfile;
}

// The full project library — everything that used to fill the middle of the homepage, now in one
// place that the homepage's chapter cards link to.
export const ProjectsPage: React.FC<ProjectsPageProps> = () => {
  const base = import.meta.env.BASE_URL;

  return (
    <main className="flex-1">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <nav className="flex items-center space-x-2 text-xs text-neutral-500 font-mono" aria-label="Breadcrumb">
          <a href={base} className="hover:text-neutral-300 transition-colors">Home</a>
          <span>/</span>
          <span className="text-neutral-300">Project Library</span>
        </nav>
        <h1 className="font-display text-4xl sm:text-5xl font-bold text-neutral-100 tracking-tight leading-[1.08] mt-6">
          Project Library
        </h1>
        <p className="mt-4 max-w-2xl text-base text-neutral-400 leading-relaxed font-light">
          Permit sets and BIM production, alongside photorealistic interior and exterior
          visualization — selected work, all in one place.
        </p>
      </div>

      <div id="deliverables" className="scroll-mt-16 mt-10">
        <Reveal>
          <DeliverablesGallery />
        </Reveal>
      </div>

      <div id="gallery" className="scroll-mt-16">
        <Reveal>
          <ProjectGallery
            groups={[
              { label: "Interior Visualization", images: VISUALIZATION_SHOWCASE_IMAGES },
              { label: "Exterior Visualization", images: EXTERIOR_SHOWCASE_IMAGES },
            ]}
          />
        </Reveal>
      </div>

      <PracticeNote />

      <div id="bim-workflow" className="scroll-mt-16">
        <Reveal>
          <ProjectGallery groups={[{ label: "BIM / CAD Workflow", images: BIMCAD_WORKFLOW_IMAGES }]} />
        </Reveal>
      </div>
    </main>
  );
};
