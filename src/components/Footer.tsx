import React from "react";
import { Compass } from "lucide-react";
import { SpecialistProfile } from "../types";
import { ROUTES } from "../data/routes";
import { mailtoHref, whatsappHref } from "../services/contact";
import { Container } from "./Container";

interface FooterProps {
  specialist: SpecialistProfile;
}

type FooterLink = { label: string; href: string; external?: boolean };

// A grid footer (point 9): brand, site, contact and platform columns, and a bottom bar on the same
// column edges. Every page is listed exactly once (point 22). Phones get one centered column.
export const Footer: React.FC<FooterProps> = ({ specialist }) => {
  const brand = specialist.brandName || specialist.name;
  const s = specialist.socials;

  const site = [
    { label: "Services", href: ROUTES.services },
    { label: "Project Library", href: ROUTES.projects },
    { label: "Case Studies", href: ROUTES.caseStudies },
    { label: "Scope Estimator", href: ROUTES.scopeEstimator },
    { label: "LOD Guide", href: ROUTES.lodGuide },
    { label: "Design Philosophy", href: ROUTES.designPhilosophy },
    { label: "Why Work With Us", href: ROUTES.whyWorkWithUs },
  ];

  const contact = (
    [
      { label: specialist.email, href: mailtoHref(specialist.email) },
      specialist.whatsapp
        ? { label: "WhatsApp", href: whatsappHref(specialist, `Hi ${specialist.name.split(" ")[0]}, I'd like to discuss a project.`), external: true }
        : null,
      { label: "LinkedIn", href: s?.linkedin || "https://www.linkedin.com/in/arslan-qaiser-947976188/", external: true },
      s?.instagram ? { label: "Instagram", href: s.instagram, external: true } : null,
      s?.youtube ? { label: "YouTube", href: s.youtube, external: true } : null,
    ] as Array<FooterLink | null>
  ).filter((l): l is FooterLink => l !== null);

  const platforms = (
    [
      s?.upwork ? { label: "Upwork", href: s.upwork } : null,
      s?.fiverr ? { label: "Fiverr", href: s.fiverr } : null,
      s?.freelancer ? { label: "Freelancer", href: s.freelancer } : null,
      s?.cadcrowd ? { label: "Cad Crowd", href: s.cadcrowd } : null,
    ] as Array<FooterLink | null>
  ).filter((l): l is FooterLink => l !== null);

  const linkClass = "text-sm text-neutral-300 transition-colors hover:text-amber-400";
  const headingClass = "eyebrow text-neutral-500";

  return (
    <footer id="site-footer" className="border-t border-neutral-900 bg-neutral-950">
      <Container className="py-16">
        <div className="grid grid-cols-1 gap-12 text-center md:grid-cols-12 md:gap-8 md:text-left">
          <div className="md:col-span-4">
            <a href={ROUTES.home} className="inline-flex items-center gap-3">
              {specialist.logoUrl ? (
                <img src={specialist.logoUrl} alt="" className="h-10 w-10 rounded border border-neutral-800 bg-neutral-900 object-contain p-1" />
              ) : (
                <Compass className="h-5 w-5 text-amber-400" />
              )}
              <span className="font-display text-h3 font-semibold leading-tight text-neutral-100">{brand}</span>
            </a>
            <p className="mx-auto mt-4 max-w-xs text-label text-neutral-400 md:mx-0">
              The practice of principal architect {specialist.name} — BIM production, construction documentation and
              visualization, delivered remotely.
            </p>
          </div>

          <nav aria-label="Site" className="md:col-span-3">
            <p className={headingClass}>Site</p>
            <ul className="mt-4 space-y-2.5">
              {site.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className={linkClass}>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-3">
            <p className={headingClass}>Contact</p>
            <ul className="mt-4 space-y-2.5">
              {contact.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    className={`${linkClass} break-words`}
                    {...(l.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <p className={headingClass}>Also on</p>
            <ul className="mt-4 space-y-2.5">
              {platforms.map((l) => (
                <li key={l.label}>
                  <a href={l.href} target="_blank" rel="noopener noreferrer" className="text-sm text-neutral-400 transition-colors hover:text-neutral-200">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-2 border-t border-neutral-900 pt-6 text-center text-label text-neutral-500 md:grid-cols-12 md:gap-8 md:text-left">
          {/* The year is baked in at build time; the browser's may differ right after New Year. */}
          <p className="md:col-span-10" suppressHydrationWarning>
            © {new Date().getFullYear()} {brand}
          </p>
          <p className="md:col-span-2">Lahore · working worldwide</p>
        </div>
      </Container>
    </footer>
  );
};
