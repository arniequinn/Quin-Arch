import { SpecialistProfile } from "../types";

// Pre-filled WhatsApp and email links. Every contact link on the site is built here, so the
// number formatting and encoding can't drift between pages (analytics.ts relies on the prefixes).

export function whatsappHref(specialist: SpecialistProfile, text: string): string {
  return `https://wa.me/${specialist.whatsapp.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(text)}`;
}

export function mailtoHref(email: string, subject?: string, body?: string): string {
  const params = [
    subject ? `subject=${encodeURIComponent(subject)}` : "",
    body ? `body=${encodeURIComponent(body)}` : "",
  ].filter(Boolean);
  return `mailto:${email}${params.length ? `?${params.join("&")}` : ""}`;
}

export const firstName = (specialist: SpecialistProfile) => specialist.name.split(" ")[0];
