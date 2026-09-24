import React from "react";
import { FileText, GraduationCap, Instagram, Linkedin, Mail, MapPin, MessageSquare, Youtube } from "lucide-react";
import { SpecialistProfile } from "../types";
import { assetUrl } from "../utils/assetPath";
import { ROUTES } from "../data/routes";
import { mailtoHref, whatsappHref } from "../services/contact";
import { Button } from "./Button";

interface SpecialistProfileCardProps {
  specialist: SpecialistProfile;
  /** Fits a small void (phone / short viewport): trims the bio and the secondary links. */
  compact?: boolean;
}

// The principal, introduced in the first chapter of the homepage sequence — centered like every
// other chapter (R6), sitting directly on the page background.
export const SpecialistProfileCard: React.FC<SpecialistProfileCardProps> = ({ specialist, compact = false }) => {
  const socials = [
    { label: "LinkedIn", href: specialist.socials?.linkedin || "https://www.linkedin.com/in/arslan-qaiser-947976188/", Icon: Linkedin },
    { label: "Instagram", href: specialist.socials?.instagram, Icon: Instagram },
    { label: "YouTube", href: specialist.socials?.youtube, Icon: Youtube },
  ].filter((s): s is { label: string; href: string; Icon: typeof Linkedin } => Boolean(s.href));

  return (
    <section id="specialist" className={`relative bg-neutral-950 ${compact ? "py-2" : "py-6"}`}>
      <div className="mx-auto w-full max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        {specialist.avatarUrl && (
          <img
            src={specialist.avatarUrl}
            alt={specialist.name}
            className={`mx-auto rounded object-cover bg-neutral-900 ${compact ? "h-16 w-16" : "h-20 w-20"}`}
          />
        )}
        <p className="eyebrow mt-4 text-amber-400">Principal Architect</p>
        <h2 className={`mt-2 font-display font-semibold tracking-tight text-neutral-100 ${compact ? "text-[1.75rem]" : "heading-2"}`}>
          {specialist.name}
        </h2>
        <p className="mt-1 text-small text-neutral-300">{specialist.title}</p>

        <div className="mt-3 flex flex-col items-center gap-1.5 text-label text-neutral-400 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-5">
          {specialist.education && (
            <span className="inline-flex items-start gap-1.5">
              <GraduationCap className="mt-px h-4 w-4 shrink-0 text-neutral-500" aria-hidden="true" />
              {specialist.education}
            </span>
          )}
          {!compact && (
            <span className="inline-flex items-start gap-1.5">
              <MapPin className="mt-px h-4 w-4 shrink-0 text-neutral-500" aria-hidden="true" />
              {specialist.location}
            </span>
          )}
        </div>

        <p className={`mx-auto mt-5 max-w-2xl text-neutral-300 ${compact ? "text-small line-clamp-3" : "text-body"}`}>
          {specialist.bio}
        </p>

        <div className={`flex items-center justify-center gap-10 ${compact ? "mt-4" : "mt-6"}`}>
          <div>
            <span className="block font-mono text-h3 text-neutral-100">{specialist.yearsExperience}+</span>
            <span className="text-label text-neutral-400">years in practice</span>
          </div>
          <div>
            <span className="block font-mono text-h3 text-neutral-100">{specialist.completedProjectsCount}+</span>
            <span className="text-label text-neutral-400">projects delivered</span>
          </div>
        </div>

        <div className={`flex flex-wrap items-center justify-center gap-3 ${compact ? "mt-4" : "mt-7"}`}>
          <Button href={ROUTES.scopeEstimator} size={compact ? "sm" : "md"}>
            Start a Project
          </Button>
          <Button
            variant="secondary"
            size={compact ? "sm" : "md"}
            icon={MessageSquare}
            href={whatsappHref(specialist, `Hi ${specialist.name.split(" ")[0]}, I found your portfolio and would like to discuss a project.`)}
            external
          >
            WhatsApp
          </Button>
          {!compact && (
            <Button variant="secondary" icon={Mail} href={mailtoHref(specialist.email)}>
              Email
            </Button>
          )}
        </div>

        <div className={`flex flex-wrap items-center justify-center gap-x-6 gap-y-2 ${compact ? "mt-3" : "mt-6"}`}>
          <Button href={ROUTES.designPhilosophy} variant="link" size="sm">
            Design Philosophy
          </Button>
          {!compact && (
            <a
              href={assetUrl("/portfolio/docs/AQ CV Minimal.pdf")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-label font-semibold text-neutral-300 transition-colors hover:text-neutral-100"
            >
              <FileText className="h-3.5 w-3.5" aria-hidden="true" />
              Download CV
            </a>
          )}
          <span className="flex items-center gap-1">
            {socials.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                title={label}
                className="flex h-9 w-9 items-center justify-center rounded text-neutral-400 transition-colors hover:text-neutral-100"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </span>
        </div>
      </div>
    </section>
  );
};
