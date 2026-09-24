import React from "react";
import { ArrowRight } from "lucide-react";
import { Container } from "../components/Container";
import { PageHeader } from "../components/SectionHeader";
import { Button } from "../components/Button";
import { ROUTES } from "../data/routes";

const DESTINATIONS: Array<[label: string, href: string]> = [
  ["Services", ROUTES.services],
  ["Project Library", ROUTES.projects],
  ["Case Studies", ROUTES.caseStudies],
  ["Scope Estimator", ROUTES.scopeEstimator],
  ["LOD Guide", ROUTES.lodGuide],
  ["Why Work With Us", ROUTES.whyWorkWithUs],
];

// Served by GitHub Pages (as /404.html) for any URL that doesn't exist — typically an old or
// mistyped link — so a visitor lands one click from every real page instead of a dead end.
export const NotFoundPage: React.FC = () => (
  <main className="flex-1">
    <PageHeader
      eyebrow="404 · Page not found"
      title="This page isn't here."
      intro="The link may be out of date, or the page may have moved. Everything on the site is one step from here."
      className="pt-20 sm:pt-28"
    />
    <Container width="text" className="pb-24">
      <ul className="grid grid-cols-1 gap-x-10 border-t border-neutral-900 sm:grid-cols-2">
        {DESTINATIONS.map(([label, href]) => (
          <li key={href} className="border-b border-neutral-900">
            <a href={href} className="group flex items-center justify-between py-4 text-body text-neutral-300 transition-colors hover:text-amber-400">
              <span>{label}</span>
              <ArrowRight className="h-4 w-4 text-neutral-600 transition-all group-hover:translate-x-1 group-hover:text-amber-400" />
            </a>
          </li>
        ))}
      </ul>
      <div className="mt-12 flex justify-center">
        <Button href={ROUTES.home} variant="secondary">
          Back to the homepage
        </Button>
      </div>
    </Container>
  </main>
);
