import { DEFAULT_SPECIALIST_PROFILE } from "../data/architecturalData";
import { SpecialistProfile } from "../types";

export const SPECIALIST_PROFILE_STORAGE_KEY = "archscope_specialist_profile_v4";

// Reading localStorage throws when the browser blocks site storage; treat that as "nothing saved"
// rather than letting it stop the page from mounting.
function readSavedProfile(): string | null {
  try {
    return localStorage.getItem(SPECIALIST_PROFILE_STORAGE_KEY);
  } catch {
    return null;
  }
}

/** True only in a browser where the owner has saved an edited profile. */
export function hasSavedSpecialistProfile(): boolean {
  return readSavedProfile() !== null;
}

// Shared by the homepage and every standalone service page so contact details stay in sync
// wherever the owner has customized them (each page reads independently — this is a static
// multi-page site, not a single SPA session).
export function loadSpecialistProfile(): SpecialistProfile {
  const saved = readSavedProfile();
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      return {
        ...DEFAULT_SPECIALIST_PROFILE,
        ...parsed,
        phone: "+92 322 4316477",
        whatsapp: "+923224316477",
        socials: {
          ...DEFAULT_SPECIALIST_PROFILE.socials,
          ...(parsed.socials || {}),
          linkedin: parsed.socials?.linkedin || DEFAULT_SPECIALIST_PROFILE.socials.linkedin,
        },
      };
    } catch (e) {
      console.error("Failed to parse saved specialist profile:", e);
    }
  }
  return DEFAULT_SPECIALIST_PROFILE;
}
