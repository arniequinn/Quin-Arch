import React, { useEffect, useRef, useState } from "react";
import { Check, Compass, Copy, FileText, Instagram, Linkedin, Mail, MessageSquare, Youtube } from "lucide-react";
import { SpecialistProfile } from "../types";
import { BOOKING_URL, projectHref, ROUTES } from "../data/routes";
import { FOOTER_TESTIMONIALS } from "../data/testimonials";
import { mailtoHref, whatsappHref } from "../services/contact";
import { trackEvent } from "../services/analytics";
import { assetUrl } from "../utils/assetPath";
import { usePrefersReducedMotion } from "./filmstrip/usePrefersReducedMotion";
import { Container } from "./Container";

interface FooterProps {
  specialist: SpecialistProfile;
}

type FooterLink = { label: string; href: string };

const LINK_COLUMNS: Array<{ heading: string; links: FooterLink[] }> = [
  {
    heading: "Services",
    links: [
      { label: "BIM / CAD Drafting", href: ROUTES.bimCad },
      { label: "Visualization", href: ROUTES.visualization },
      { label: "Consultancy", href: ROUTES.consultancy },
      { label: "Scope Estimator", href: ROUTES.scopeEstimator },
    ],
  },
  {
    heading: "Work",
    links: [
      { label: "Project Library", href: ROUTES.projects },
      { label: "Case Studies", href: ROUTES.caseStudies },
      { label: "Furniture & Virtual Staging", href: projectHref("furniture") },
    ],
  },
  {
    heading: "Studio",
    links: [
      { label: "Why Work With Us", href: ROUTES.whyWorkWithUs },
      { label: "Design Philosophy", href: ROUTES.designPhilosophy },
      { label: "LOD Guide", href: ROUTES.lodGuide },
    ],
  },
];

const ROTATE_MS = 8000;

// One client quote at a time (Q4–Q8, v3.0 §9). All quotes share one grid cell so the band keeps
// the height of the longest and never jumps. Rotation runs only while the band is on screen, stops
// on hover or focus, and is off under reduced motion.
const RotatingQuote: React.FC = () => {
  const reduceMotion = usePrefersReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const [index, setIndex] = useState(0);
  const [inView, setInView] = useState(false);
  const [held, setHeld] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (reduceMotion || !inView || held) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % FOOTER_TESTIMONIALS.length), ROTATE_MS);
    return () => window.clearInterval(id);
  }, [reduceMotion, inView, held]);

  return (
    <figure
      ref={ref}
      className="mt-8 grid border-l-2 border-amber-400/70 pl-5"
      onMouseEnter={() => setHeld(true)}
      onMouseLeave={() => setHeld(false)}
      onFocus={() => setHeld(true)}
      onBlur={() => setHeld(false)}
    >
      {FOOTER_TESTIMONIALS.map((t, i) => (
        <div
          key={t.id}
          className={`[grid-area:1/1] transition-opacity duration-700 ${i === index ? "opacity-100" : "pointer-events-none opacity-0"}`}
          aria-hidden={i !== index}
        >
          <blockquote className="font-display text-[1.25rem] leading-snug text-neutral-200">“{t.quote}”</blockquote>
          <figcaption className="mt-3 text-label text-neutral-500">{t.attribution}</figcaption>
        </div>
      ))}
    </figure>
  );
};

const CopyButton: React.FC<{ value: string; label: string }> = ({ value, label }) => {
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!copied) return;
    const id = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(id);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      trackEvent("contact_copy", { method: "email" });
    } catch {
      // Clipboard blocked: the address is still a visible, selectable link beside the button.
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={copied ? "Copied" : label}
      title={copied ? "Copied" : label}
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded border border-neutral-800 text-neutral-400 transition-colors hover:border-neutral-600 hover:text-neutral-100"
    >
      {copied ? <Check className="h-4 w-4 text-amber-400" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
      <span className="sr-only" aria-live="polite">
        {copied ? "Email address copied" : ""}
      </span>
    </button>
  );
};

// Two tiers (v3.0 point 11, D9): the contact band — the one place on the site that carries email
// and WhatsApp — then the link columns and the bottom line.
export const Footer: React.FC<FooterProps> = ({ specialist }) => {
  const brand = specialist.brandName || specialist.name;
  const first = specialist.name.split(" ")[0];
  const s = specialist.socials;
  const linkedin = s?.linkedin || "https://www.linkedin.com/in/arslan-qaiser-947976188/";

  const contactRows = [
    {
      key: "email",
      Icon: Mail,
      label: "Email",
      value: specialist.email,
      href: mailtoHref(specialist.email),
      external: false,
      copy: true,
    },
    {
      key: "whatsapp",
      Icon: MessageSquare,
      label: "WhatsApp",
      value: specialist.phone || specialist.whatsapp,
      href: whatsappHref(specialist, `Hi ${first}, I'd like to discuss a project.`),
      external: true,
      copy: false,
    },
    {
      key: "linkedin",
      Icon: Linkedin,
      label: "LinkedIn",
      value: specialist.name,
      href: linkedin,
      external: true,
      copy: false,
    },
  ];

  const socials = [
    { label: "Instagram", href: s?.instagram, Icon: Instagram },
    { label: "YouTube", href: s?.youtube, Icon: Youtube },
  ].filter((l): l is { label: string; href: string; Icon: typeof Instagram } => Boolean(l.href));

  const linkClass = "text-small text-neutral-300 transition-colors hover:text-amber-400";

  return (
    <footer id="site-footer" className="border-t border-neutral-900 bg-neutral-950">
      {/* Tier 1: contact band */}
      <section id="contact" aria-labelledby="footer-contact-title" className="scroll-mt-20 bg-neutral-900/40">
        <Container className="py-16 sm:py-20">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-6">
              <p className="eyebrow text-amber-400">Contact</p>
              <h2 id="footer-contact-title" className="heading-2 mt-4 text-neutral-100">
                Talk to {first} directly
              </h2>
              <p className="mt-4 max-w-md text-body text-neutral-400">
                Based in Lahore, working with clients in the USA, UK, Canada, Australia and the Gulf.
              </p>
              <RotatingQuote />
            </div>

            <div className="lg:col-span-6">
              <ul className="divide-y divide-neutral-800 border-y border-neutral-800">
                {contactRows.map(({ key, Icon, label, value, href, external, copy }) => (
                  <li key={key} className="flex items-center gap-4 py-5">
                    <Icon className="h-5 w-5 shrink-0 text-amber-400" aria-hidden="true" />
                    <div className="min-w-0 flex-1">
                      <p className="eyebrow text-neutral-500">{label}</p>
                      <a
                        href={href}
                        className="mt-1 block break-words text-body font-semibold text-neutral-100 transition-colors hover:text-amber-300"
                        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      >
                        {value}
                      </a>
                    </div>
                    {copy && <CopyButton value={value} label="Copy email address" />}
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-3">
                <a
                  href={assetUrl("/portfolio/docs/AQ CV Minimal.pdf")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-label font-semibold text-neutral-300 transition-colors hover:text-neutral-100"
                >
                  <FileText className="h-3.5 w-3.5" aria-hidden="true" />
                  Download CV
                </a>
                <a
                  href={BOOKING_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-label font-semibold text-amber-400 transition-colors hover:text-amber-300"
                >
                  Book a capacity call →
                </a>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Tier 2: link columns */}
      <Container className="py-14">
        <div className="grid grid-cols-1 gap-12 text-center sm:grid-cols-3 md:grid-cols-12 md:gap-8 md:text-left">
          <div className="sm:col-span-3 md:col-span-6">
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
            {socials.length > 0 && (
              <div className="mt-4 flex justify-center gap-1 md:-ml-2 md:justify-start">
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
              </div>
            )}
          </div>

          {LINK_COLUMNS.map((col) => (
            <nav key={col.heading} aria-label={col.heading} className="md:col-span-2">
              <p className="eyebrow text-neutral-500">{col.heading}</p>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <a href={l.href} className={linkClass}>
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
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
