import React from "react";
import { BarnCompare } from "./BarnCompare";
import { Container } from "./Container";
import { SectionHeader } from "./SectionHeader";
import { Section } from "./PageSections";

// The practice note: a draggable before/after of the same barn residence — the CAD wireframe
// elevation revealed over the finished render, from the same camera position (both images
// were aligned so the roofline, door, openings and cupolas line up). Moved here from the Project
// Library (point 15), where the "logic and feeling" story belongs. Shown whole, at no more than
// its own 1109 px width.
export const PracticeNote: React.FC = () => {
  return (
    <Section>
      <Container>
        <SectionHeader
          eyebrow="Practice note"
          title="Maintaining harmony between person, place, and space."
          intro="It shows up in the work itself — proportion, light and material resolved together, not stitched on after the fact. It's also why every project gets the same rate and the same principal-level attention: judgment applied sheet by sheet, never queued behind whichever job pays more."
        />

        <BarnCompare className="mt-12" />
      </Container>
    </Section>
  );
};
