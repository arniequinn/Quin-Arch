export const OWNER_EMAIL = "arslan.qaiser1991@gmail.com";

// Accepted owner master passkeys (case-insensitive)
const ACCEPTED_PASSKEYS = [
  "quinarch1991",
  "arslan1991",
  "archscope1991",
  "quintessential1991",
];

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

/**
 * Verifies a provided owner passkey against the authorized list.
 */
export function verifyOwnerPasskey(inputKey: string): boolean {
  if (!inputKey) return false;
  const clean = inputKey.trim().toLowerCase();
  const isValid = ACCEPTED_PASSKEYS.includes(clean);
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
