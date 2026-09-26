import React from "react";
import { Check, Minus } from "lucide-react";
import { Container } from "./Container";
import { SectionHeader } from "./SectionHeader";
import { Button } from "./Button";
import { BOOKING_URL, EstimatorService, estimatorHref, ROUTES } from "../data/routes";
import { EXCLUSIONS } from "../data/exclusions";
import { showDraft } from "../data/ownerSignoff";

// Building blocks shared by the service, library and editorial pages, so every page follows the
// same rules (R6 of documentation/final-polish-v2.0.md): centered section headers, body text
// left-aligned inside the centered reading column, grids in the wide column.

export const Section: React.FC<{
  id?: string;
  raised?: boolean;
  tight?: boolean;
  className?: string;
  children: React.ReactNode;
}> = ({ id, raised = false, tight = false, className = "", children }) => (
  <section
    id={id}
    className={`scroll-mt-20 border-t border-neutral-900 ${tight ? "py-12" : "py-16 sm:py-24"} ${raised ? "bg-neutral-900/40" : ""} ${className}`}
  >
    {children}
  </section>
);

/** A plain list of what's in (or out of) scope, in the reading column. */
export const ItemList: React.FC<{
  items: string[];
  variant?: "included" | "excluded";
  size?: "body" | "small";
  className?: string;
}> = ({ items, variant = "included", size = "body", className = "" }) => (
  <ul className={`space-y-3 text-neutral-300 ${size === "body" ? "text-body" : "text-small"} ${className}`}>
    {items.map((item) => (
      <li key={item} className="flex items-start gap-3">
        {variant === "included" ? (
          <Check className="mt-1.5 h-4 w-4 shrink-0 text-amber-400" aria-hidden="true" />
        ) : (
          <Minus className="mt-1.5 h-4 w-4 shrink-0 text-neutral-500" aria-hidden="true" />
        )}
        <span>{item}</span>
      </li>
    ))}
  </ul>
);

export const NumberedSteps: React.FC<{ steps: Array<{ title: string; description: string }> }> = ({ steps }) => (
  <ol className="grid grid-cols-1 gap-x-12 gap-y-10 sm:grid-cols-2">
    {steps.map((step, i) => (
      <li key={step.title} className="flex items-start gap-5">
        <span className="w-8 shrink-0 pt-0.5 text-h3 font-semibold tabular-nums text-amber-400" aria-hidden="true">
          {String(i + 1).padStart(2, "0")}
        </span>
        <div>
          <h3 className="heading-3 text-neutral-100">{step.title}</h3>
          <p className="mt-2 text-small text-neutral-400">{step.description}</p>
        </div>
      </li>
    ))}
  </ol>
);

export const FaqList: React.FC<{ faqs: Array<{ question: string; answer: string }> }> = ({ faqs }) => (
  <dl className="space-y-8">
    {faqs.map((faq) => (
      <div key={faq.question}>
        <dt className="heading-3 text-neutral-100">{faq.question}</dt>
        <dd className="mt-2 text-body text-neutral-400">{faq.answer}</dd>
      </div>
    ))}
  </dl>
);

/** "Not included" for a service (point 7) — a draft until the owner confirms it. */
export const NotIncludedSection: React.FC<{ service: EstimatorService; raised?: boolean }> = ({ service, raised }) =>
  showDraft("exclusions") ? (
    <Section raised={raised}>
      <Container width="text">
        <SectionHeader
          eyebrow="Scope"
          title="Not included"
          intro="What this service doesn't cover, so there are no surprises when the proposal arrives."
        />
        <ItemList items={EXCLUSIONS[service].items} variant="excluded" className="mt-10" />
      </Container>
    </Section>
  ) : null;

/** The closing call to action on every page that sells something (v3.3 Phase 2): the capacity
 *  call, plus the free test sheet — or, for visualization, pricing a single project.
 *  Email and WhatsApp live in the footer's contact band, directly below. */
export const ContactSection: React.FC<{
  title: string;
  service?: EstimatorService;
  raised?: boolean;
}> = ({ title, service, raised }) => (
  <Section raised={raised}>
    <Container>
      <SectionHeader eyebrow="Next step" title={title}>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
          <Button href={BOOKING_URL} external>
            Book a 20-min capacity call
          </Button>
          {service === "visualization" ? (
            <Button href={estimatorHref(service)} variant="secondary">
              Price a single project
            </Button>
          ) : (
            <Button href={ROUTES.testSheet} variant="secondary">
              Send a test sheet — first one free
            </Button>
          )}
        </div>
      </SectionHeader>
    </Container>
  </Section>
);

/** The quiet ending of an editorial page (LOD guide, Design Philosophy, Why work with us). */
export const ServicesLink: React.FC<{ className?: string }> = ({ className = "" }) => (
  <div className={`flex justify-center ${className}`}>
    <Button href={ROUTES.services} variant="link">
      See the services
    </Button>
  </div>
);
