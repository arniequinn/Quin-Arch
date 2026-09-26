import React, { useState } from "react";
import { Compass, Linkedin, Menu, MessageSquare, X } from "lucide-react";
import { SpecialistProfile } from "../types";
import { BOOKING_URL, ROUTES } from "../data/routes";
import { whatsappHref } from "../services/contact";
import { Button } from "./Button";

interface NavbarProps {
  specialist: SpecialistProfile;
}

// Five destinations, each listed once (point 1 of documentation/final-polish-v2.0.md). "Start a
// Project" is the one primary action; the full row only appears from the `nav` breakpoint
// (index.css), where it fits with room to spare — below that, the menu button takes over.
export const NAV_LINKS = [
  { label: "Services", href: ROUTES.services },
  { label: "Project Library", href: ROUTES.projects },
  { label: "Case Studies", href: ROUTES.caseStudies },
  { label: "Why Work With Us", href: ROUTES.whyWorkWithUs },
  { label: "Design Philosophy", href: ROUTES.designPhilosophy },
];

export const Navbar: React.FC<NavbarProps> = ({ specialist }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const brand = specialist.brandName || specialist.name;
  const linkedin = specialist.socials?.linkedin || "https://www.linkedin.com/in/arslan-qaiser-947976188/";

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-800/60 bg-neutral-950/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[100rem] items-center justify-between gap-6 px-4 sm:px-6 lg:px-10">
        {/* Brand — a real link home, never compressed: it wraps onto two lines before it would
            ever run under the navigation. */}
        <a href={ROUTES.home} className="flex shrink-0 items-center gap-3" aria-label={`${brand} — home`}>
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded border border-neutral-800 bg-neutral-900 p-1">
            {specialist.logoUrl ? (
              <img src={specialist.logoUrl} alt="" className="h-full w-full object-contain" />
            ) : (
              <Compass className="h-4 w-4 text-amber-400" />
            )}
          </span>
          <span className="max-w-[9.5rem] font-display text-[1.125rem] font-semibold leading-[1.05] tracking-tight text-neutral-100 sm:max-w-none sm:text-[1.25rem] nav:text-h3">
            {brand}
          </span>
        </a>

        <nav aria-label="Main" className="hidden items-center gap-8 nav:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="whitespace-nowrap text-small text-neutral-300 transition-colors hover:text-neutral-100"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <a
            href={linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            title="LinkedIn"
            className="hidden h-10 w-10 items-center justify-center rounded text-neutral-400 transition-colors hover:text-neutral-100 md:flex"
          >
            <Linkedin className="h-[1.125rem] w-[1.125rem]" />
          </a>
          {/* On phones the button lives in the menu panel instead, so the brand keeps its room. */}
          <span className="hidden sm:block">
            <Button href={BOOKING_URL} external size="sm">
              Book a call
            </Button>
          </span>
          <button
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-expanded={isMenuOpen}
            aria-controls="site-menu"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            className="-mr-2 flex h-10 w-10 cursor-pointer items-center justify-center rounded text-neutral-300 transition-colors hover:bg-neutral-900 hover:text-neutral-100 nav:hidden"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <nav
          id="site-menu"
          aria-label="Main"
          className="border-t border-neutral-800/60 bg-neutral-950 px-4 pb-6 pt-2 sm:px-6 nav:hidden"
        >
          <ul className="divide-y divide-neutral-900">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="block py-3.5 text-body text-neutral-200 transition-colors hover:text-amber-400"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <Button href={BOOKING_URL} external fullWidth className="mt-4">
            Book a 20-min capacity call
          </Button>
          <div className="mt-4 flex items-center justify-center gap-6 text-small text-neutral-400">
            {specialist.whatsapp && (
              <a
                href={whatsappHref(specialist, `Hi ${specialist.name.split(" ")[0]}, I found your portfolio and would like to discuss a project.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-neutral-100"
              >
                <MessageSquare className="h-4 w-4" />
                WhatsApp
              </a>
            )}
            <a href={linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-neutral-100">
              <Linkedin className="h-4 w-4" />
              LinkedIn
            </a>
          </div>
        </nav>
      )}
    </header>
  );
};
