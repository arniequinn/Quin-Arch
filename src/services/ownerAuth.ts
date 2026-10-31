export const OWNER_EMAIL = "arslan.qaiser1991@gmail.com";

// NOTE: This is NOT a real access control boundary. This is a static site with no backend, so
// this gate only decides whether SpecialistDataModal writes to the visitor's own browser
// localStorage (archscope_specialist_profile_v4). It protects no shared or server-side data.
//
// The public code holds only the SHA-256 fingerprint of the passkey, not the passkey itself, so the
// passkey can't be read out of the page or the repository. The passkey is a long random value kept
// in documentation/private/owner-passkey.txt (git-ignored). To change it, hash the new one
// (lowercase, trimmed) with SHA-256 and replace the fingerprint below.
const PASSKEY_SHA256 = "9b4daa34c8472119015d7bf24da631756389fbd37a5f12dccd3e1c26f60575ab";

const PASSKEY_SESSION_KEY = "archscope_owner_session_authenticated";

/**
 * Checks if the owner has been authenticated via master passkey in the current session.
 */
export function isOwnerPasskeyVerified(): boolean {
  try {
    return sessionStorage.getItem(PASSKEY_SESSION_KEY) === "true";
  } catch {
    return false;
  }
}

/** SHA-256 of the trimmed, lowercased input, as lowercase hex. */
async function sha256Hex(input: string): Promise<string> {
  const bytes = new TextEncoder().encode(input.trim().toLowerCase());
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Verifies a provided owner passkey against the stored fingerprint.
 */
export async function verifyOwnerPasskey(inputKey: string): Promise<boolean> {
  if (!inputKey) return false;
  let isValid = false;
  try {
    isValid = (await sha256Hex(inputKey)) === PASSKEY_SHA256;
  } catch {
    return false; // no Web Crypto (very old browser or insecure context)
  }
  if (isValid) {
    try {
      sessionStorage.setItem(PASSKEY_SESSION_KEY, "true");
    } catch {
      // ignore
    }
  }
  return isValid;
}

/**
 * Clears the session passkey authorization.
 */
export function clearOwnerPasskeySession(): void {
  try {
    sessionStorage.removeItem(PASSKEY_SESSION_KEY);
  } catch {
    // ignore
  }
}

/**
 * Returns true if the current browser session has unlocked owner editing via passkey.
 */
export function isOwnerAuthorized(): boolean {
  return isOwnerPasskeyVerified();
}
