import React from "react";
import { Container } from "../components/Container";
import { PageHeader, SectionHeader } from "../components/SectionHeader";
import { Section } from "../components/PageSections";
import { Button } from "../components/Button";
import { PlugInChapter } from "../components/PlugInSection";
import { WorkflowsSection } from "../components/WorkflowsSection";
import { BOOKING_URL, ROUTES } from "../data/routes";
import { TESTIMONIALS, testimonialCredit } from "../data/testimonials";
import { galleryImage } from "../data/galleryProjects";

const DUCT_MODEL = galleryImage("sheets/office-hvac-duct-axonometric-boq.webp", "Office HVAC retrofit — the duct model, with quantities counted from it", {
  project: "office-hvac-retrofit",
});
const SCHEDULE = galleryImage("sheets/villa-materials-schedule.webp", "Two-storey villa — materials schedule from the model", { project: "two-storey-villa" });

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

    {/* v3.33 D2: one asymmetric module — a wide image on the left, a narrow caption column and a
        smaller offset image on the right. The only broken grid on the page, on purpose. */}
    <Section>
      <Container>
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 md:grid-cols-12 md:gap-8">
          <figure className="md:col-span-7 md:self-start">
            <img src={DUCT_MODEL.src} width={DUCT_MODEL.width} height={DUCT_MODEL.height} alt={DUCT_MODEL.caption} loading="lazy" decoding="async" className="h-auto w-full bg-white" />
            <figcaption className="mt-3 text-label text-neutral-500">{DUCT_MODEL.caption}</figcaption>
          </figure>
          <div className="flex flex-col gap-10 md:col-span-4 md:col-start-9 md:pt-24">
            <div>
              <p className="text-label uppercase tracking-[0.2em] text-amber-400">Coordinated, not just drawn</p>
              <p className="mt-4 font-display text-[1.25rem] leading-snug text-neutral-200">
                Ducts, grilles and quantities come out of one model, so the drawings and the bill of quantities always agree.
              </p>
            </div>
            <figure>
              <img src={SCHEDULE.src} width={SCHEDULE.width} height={SCHEDULE.height} alt={SCHEDULE.caption} loading="lazy" decoding="async" className="h-auto w-full bg-white" />
              <figcaption className="mt-3 text-label text-neutral-500">{SCHEDULE.caption}</figcaption>
            </figure>
          </div>
        </div>
      </Container>
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
