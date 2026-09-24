import React from "react";
import { Container } from "./Container";

interface SectionHeaderProps {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  intro?: React.ReactNode;
  /** h1 for a page's own title, h2 (default) for a section. */
  as?: "h1" | "h2";
  id?: string;
  className?: string;
  /** Actions, centered under the intro. */
  children?: React.ReactNode;
}

// Eyebrow + heading + intro, always centered (R6) — the only way a section introduces itself.
export const SectionHeader: React.FC<SectionHeaderProps> = ({
  eyebrow,
  title,
  intro,
  as: Heading = "h2",
  id,
  className = "",
  children,
}) => (
  <div className={`mx-auto text-center ${Heading === "h1" ? "max-w-5xl" : "max-w-4xl"} ${className}`}>
    {eyebrow && <p className="eyebrow text-amber-400">{eyebrow}</p>}
    <Heading
      id={id}
      className={`${Heading === "h1" ? "heading-1" : "heading-2"} text-neutral-100 ${eyebrow ? "mt-4" : ""}`}
    >
      {title}
    </Heading>
    {intro && <div className="mx-auto mt-5 max-w-2xl text-body text-neutral-400">{intro}</div>}
    {children && <div className="mt-8 flex flex-wrap items-center justify-center gap-4">{children}</div>}
  </div>
);

export interface Crumb {
  label: string;
  href?: string;
}

export const Breadcrumbs: React.FC<{ items: Crumb[] }> = ({ items }) => (
  <nav aria-label="Breadcrumb" className="print-hide">
    <ol className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-label text-neutral-500">
      {items.map((crumb, i) => (
        <li key={crumb.label} className="flex items-center gap-2">
          {i > 0 && (
            <span aria-hidden="true" className="text-neutral-700">
              /
            </span>
          )}
          {crumb.href ? (
            <a href={crumb.href} className="hover:text-neutral-200 transition-colors">
              {crumb.label}
            </a>
          ) : (
            <span aria-current="page" className="text-neutral-300">
              {crumb.label}
            </span>
          )}
        </li>
      ))}
    </ol>
  </nav>
);

interface PageHeaderProps extends Omit<SectionHeaderProps, "as"> {
  breadcrumbs?: Crumb[];
}

// A page's opening block: breadcrumbs and the H1 share one centered container.
export const PageHeader: React.FC<PageHeaderProps> = ({ breadcrumbs, className = "", ...header }) => (
  <Container className={`pt-10 pb-14 sm:pt-14 sm:pb-20 ${className}`}>
    {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}
    <SectionHeader as="h1" {...header} className={breadcrumbs ? "mt-10" : ""} />
  </Container>
);
