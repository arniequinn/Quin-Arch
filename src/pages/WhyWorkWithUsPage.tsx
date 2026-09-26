import React from "react";
import { Container } from "../components/Container";
import { PageHeader, SectionHeader } from "../components/SectionHeader";
import { Section } from "../components/PageSections";
import { Button } from "../components/Button";
import { PlugInChapter } from "../components/PlugInSection";
import { WorkflowsSection } from "../components/WorkflowsSection";
import { BOOKING_URL, ROUTES } from "../data/routes";
import { TESTIMONIALS, testimonialCredit } from "../data/testimonials";

// v3.3 Phase 4: "How We Work" — firms first and only. The homeowner case moved to /for-homeowners/
// (D3); a single small link points there. The URL stays /why-work-with-us/ so it keeps its SEO.
export const WhyWorkWithUsPage: React.FC = () => (
  <main className="flex-1">
    <PageHeader
      breadcrumbs={[{ label: "Home", href: ROUTES.home }, { label: "How We Work" }]}
      eyebrow="How we work"
      title={
        <>
          Overflow production, <span className="text-amber-400">on your standards.</span>
        </>
      }
      intro="For architecture firms, developers and design-build contractors with more work than hands: senior production capacity that drafts in your titleblocks and layering, answers during your morning, and has the overnight work waiting when you start the next day."
    >
      <Button href={BOOKING_URL} external>
        Book a 20-min capacity call
      </Button>
    </PageHeader>

    <Section>
      <PlugInChapter />
    </Section>

    <WorkflowsSection />
    {/* v3.0 §9: the page ends in clients' own words — text, never screenshots or star ratings. */}
    <Section>
      <Container>
        <SectionHeader eyebrow="What clients say" title="In their words" />
        <ul className="mx-auto mt-14 grid max-w-6xl grid-cols-1 gap-12 md:grid-cols-3">
          {[TESTIMONIALS.q1, TESTIMONIALS.q2, TESTIMONIALS.q6].map((t) => (
            <li key={t.id}>
              <figure className="border-l-2 border-amber-400/70 pl-5">
                <blockquote className="font-display text-[1.25rem] leading-snug text-neutral-200">“{t.quote}”</blockquote>
                <figcaption className="mt-4 text-label text-neutral-500">{testimonialCredit(t)}</figcaption>
              </figure>
            </li>
          ))}
        </ul>
        <p className="mt-14 text-center text-label text-neutral-500">
          Planning your own home?{" "}
          <a href={ROUTES.forHomeowners} className="text-neutral-300 underline hover:text-amber-400">
            See the homeowner page
          </a>
          .
        </p>
      </Container>
    </Section>
  </main>
);
