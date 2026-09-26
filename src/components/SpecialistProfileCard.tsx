import React from "react";
import { BadgeCheck, FileText, GraduationCap, Instagram, Linkedin, MapPin, Youtube } from "lucide-react";
import { SpecialistProfile } from "../types";
import { assetUrl } from "../utils/assetPath";
import { ROUTES } from "../data/routes";
import { TESTIMONIALS, testimonialCredit } from "../data/testimonials";
import { Button } from "./Button";

interface SpecialistProfileCardProps {
  specialist: SpecialistProfile;
  /** Fits a small void (phone / short viewport): trims the bio and the secondary links. */
  compact?: boolean;
}

// The principal, introduced in the last chapter of the homepage sequence (v3.0 point 1) — centered
// like every other chapter (R6). No contact buttons here: email and WhatsApp live in the footer,
// which follows directly. The introduction ends in a client's words.
const QUOTE = TESTIMONIALS.q1;
export const SpecialistProfileCard: React.FC<SpecialistProfileCardProps> = ({ specialist, compact = false }) => {
  const socials = [
    { label: "LinkedIn", href: specialist.socials?.linkedin || "https://www.linkedin.com/in/arslan-qaiser-947976188/", Icon: Linkedin },
    { label: "Instagram", href: specialist.socials?.instagram, Icon: Instagram },
    { label: "YouTube", href: specialist.socials?.youtube, Icon: Youtube },
  ].filter((s): s is { label: string; href: string; Icon: typeof Linkedin } => Boolean(s.href));

  return (
    <section id="specialist" className={`relative bg-neutral-950 ${compact ? "py-2" : "py-4"}`}>
      <div className="mx-auto w-full max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        {specialist.avatarUrl && (
          <img
            src={specialist.avatarUrl}
            alt={specialist.name}
            className={`mx-auto rounded object-cover bg-neutral-900 ${compact ? "h-14 w-14" : "h-20 w-20"}`}
          />
        )}
        <p className={`eyebrow text-amber-400 ${compact ? "mt-3" : "mt-4"}`}>Principal Architect</p>
        <h2 className={`mt-2 font-display font-semibold tracking-tight text-neutral-100 ${compact ? "text-[1.75rem]" : "heading-2"}`}>
          {specialist.name}
        </h2>
        <p className="mt-1 text-small text-neutral-300">{specialist.title}</p>

        <div className="mt-3 flex flex-col items-center gap-1.5 text-label text-neutral-400 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-5">
          {specialist.registration && (
            <span className="inline-flex items-start gap-1.5">
              <BadgeCheck className="mt-px h-4 w-4 shrink-0 text-neutral-500" aria-hidden="true" />
              {specialist.registration}
            </span>
          )}
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

        <p className={`mx-auto mt-5 max-w-2xl text-neutral-300 ${compact ? "text-small line-clamp-2" : "text-body"}`}>
          {specialist.bio}
        </p>

        <div className={`flex items-center justify-center gap-10 ${compact ? "mt-4" : "mt-5"}`}>
          <div>
            <span className="block font-mono text-h3 text-neutral-100">{specialist.yearsExperience}+</span>
            <span className="text-label text-neutral-400">years in practice</span>
          </div>
          <div>
            <span className="block font-mono text-h3 text-neutral-100">{specialist.completedProjectsCount}+</span>
            <span className="text-label text-neutral-400">projects delivered</span>
          </div>
        </div>

        <figure className={`mx-auto max-w-xl border-l-2 border-amber-400/70 pl-4 text-left ${compact ? "mt-4" : "mt-6"}`}>
          <blockquote className={`font-display leading-snug text-neutral-200 ${compact ? "text-small" : "text-[1.125rem]"}`}>
            “{QUOTE.quote}”
          </blockquote>
          <figcaption className="mt-2 text-label text-neutral-500">{testimonialCredit(QUOTE)}</figcaption>
        </figure>

        <div className={`flex flex-wrap items-center justify-center gap-x-6 gap-y-2 ${compact ? "mt-3" : "mt-5"}`}>
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
