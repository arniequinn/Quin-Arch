import React from "react";
import { Container } from "../components/Container";
import { PageHeader, SectionHeader } from "../components/SectionHeader";
import { ContactSection, FaqList, ItemList, NotIncludedSection, Section } from "../components/PageSections";
import { Button } from "../components/Button";
import { MARKET_BENCHMARK_RATES, OFFERED_RATES, TARGET_MARKETS } from "../data/architecturalData";
import { estimatorHref, ROUTES } from "../data/routes";
import { SpecialistProfile } from "../types";
import { formatUsd } from "../utils/format";

interface ConsultancyServicePageProps {
  specialist: SpecialistProfile;
}

const COVERS = [
  "Design review and a second-opinion sign-off before a scheme goes to production",
  "Code-compliance strategy — a jurisdiction pre-check before drafting begins, not after",
  "Client-facing technical coordination, as an embedded advisor in project meetings",
  "Parametric and computational design strategy (Rhino + Grasshopper workflow planning)",
  "Structural and MEP coordination oversight ahead of formal clash detection",
  "Plan-check response strategy for contested or unusual review comments",
];

const WHO_ITS_FOR = [
  { title: "Architecture studios", description: "Overflow senior judgment on a specific design question, without hiring for it." },
  { title: "Contractors & builders", description: "A code-compliance check before committing to a full drafting engagement." },
  { title: "Developers", description: "Independent technical review of a design or a consultant's work before signing it off." },
];

const FAQS = [
  {
    question: "How is this different from BIM/CAD drafting hours?",
    answer:
      "Consulting is advisory time — review, strategy and judgment calls — billed separately from drafting and modeling. It doesn't produce drawing sheets itself, though it often shapes what those sheets should say.",
  },
  {
    question: "Can consulting hours turn into a full production engagement later?",
    answer:
      "Yes — a common path is a short consulting block to settle the direction and scope, followed by a fixed-price or retainer BIM/CAD engagement once the approach is agreed.",
  },
  {
    question: "How do sessions actually happen?",
    answer:
      "Whatever fits the project — video calls, written review over email or Bluebeam markups, or direct coordination in your team's Slack or Teams channel.",
  },
];

export const ConsultancyServicePage: React.FC<ConsultancyServicePageProps> = ({ specialist }) => (
  <main className="flex-1">
    <PageHeader
      breadcrumbs={[
        { label: "Home", href: ROUTES.home },
        { label: "Services", href: ROUTES.services },
        { label: "Architect Consultant" },
      ]}
      eyebrow="Architect consultant"
      title="Hourly Design & Strategy Consulting"
      intro="Design review, code strategy and client-facing coordination — a principal architect's judgment, billed hourly and separately from drafting, at one flat rate worldwide."
    >
      <Button href={estimatorHref("consultancy")}>Start a Project</Button>
      <Button href="#pricing" variant="link">
        See the rate
      </Button>
    </PageHeader>

    <Section>
      <Container width="text">
        <SectionHeader title="What this covers" />
        <ItemList items={COVERS} className="mt-10" />
      </Container>
    </Section>

    <NotIncludedSection service="consultancy" raised />

    <Section raised>
      <Container>
        <SectionHeader title="Who it's for" />
        <div className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-10 sm:grid-cols-3">
          {WHO_ITS_FOR.map((item) => (
            <div key={item.title} className="border-t border-neutral-800 pt-5">
              <h3 className="heading-3 text-neutral-100">{item.title}</h3>
              <p className="mt-2 text-small text-neutral-400">{item.description}</p>
            </div>
          ))}
        </div>
      </Container>
    </Section>

    <Section>
      <Container width="text">
        <SectionHeader title="Why the judgment call is worth paying for" />
        <p className="mt-10 text-body text-neutral-300">
          {specialist.education}. {specialist.yearsExperience}+ years of independent remote consulting and firm
          coordination across residential, commercial and hospitality work, with {specialist.completedProjectsCount}+
          projects delivered — the same background behind the BIM/CAD and visualization work, applied to a specific
          question instead of a full production engagement.
        </p>
      </Container>
    </Section>

    <Section id="pricing" raised>
      <Container width="text">
        <SectionHeader
          eyebrow="Pricing"
          title={`${formatUsd(OFFERED_RATES.consultantHourly)} an hour, worldwide`}
          intro="The same rate for every client, anywhere. For comparison, typical architect-consultant rates by market (benchmark, Sept 2026):"
        >
          <Button href={estimatorHref("consultancy")}>Start a Project</Button>
        </SectionHeader>
        <dl className="mt-10 divide-y divide-neutral-800 border-y border-neutral-800">
          {TARGET_MARKETS.map((m) => (
            <div key={m.id} className="flex items-baseline justify-between gap-6 py-3 text-small">
              <dt className="text-neutral-300">{m.name}</dt>
              <dd className="font-mono text-neutral-100">{formatUsd(MARKET_BENCHMARK_RATES[m.id]?.consultantHourly ?? 0)}/hr</dd>
            </div>
          ))}
        </dl>
      </Container>
    </Section>

    <Section>
      <Container width="text">
        <SectionHeader title="Common questions" />
        <div className="mt-12">
          <FaqList faqs={FAQS} />
        </div>
      </Container>
    </Section>

    <ContactSection
      specialist={specialist}
      service="consultancy"
      title="Have a design or code question worth a second opinion?"
      inquiry={`Hi ${specialist.name.split(" ")[0]}, I found your consultancy page and would like to discuss a consulting engagement.`}
      emailSubject="Architect consultant inquiry"
    />
  </main>
);
