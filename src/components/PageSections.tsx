import React from "react";
import { Check, Mail, MessageSquare, Minus } from "lucide-react";
import { Container } from "./Container";
import { SectionHeader } from "./SectionHeader";
import { Button } from "./Button";
import { SpecialistProfile } from "../types";
import { EstimatorService, estimatorHref } from "../data/routes";
import { EXCLUSIONS } from "../data/exclusions";
import { showDraft } from "../data/ownerSignoff";
import { mailtoHref, whatsappHref } from "../services/contact";

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

/** The closing call to action: start a project, or just get in touch. */
export const ContactSection: React.FC<{
  specialist: SpecialistProfile;
  title: string;
  service?: EstimatorService;
  inquiry: string;
  emailSubject: string;
}> = ({ specialist, title, service, inquiry, emailSubject }) => (
  <Section>
    <Container>
      <SectionHeader title={title}>
        <Button href={estimatorHref(service)}>Start a Project</Button>
        <Button variant="secondary" icon={MessageSquare} href={whatsappHref(specialist, inquiry)} external>
          WhatsApp
        </Button>
        <Button variant="secondary" icon={Mail} href={mailtoHref(specialist.email, emailSubject)}>
          Email
        </Button>
      </SectionHeader>
    </Container>
  </Section>
);
