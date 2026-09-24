// Content drafted for v2.0 (documentation/final-polish-v2.0.md §8) that only the owner can
// approve. The dev server always shows it, so it can be reviewed in place; production builds —
// the deployed site — only show what's been confirmed here. Flip a flag to publish it.
export const OWNER_CONFIRMED = {
  /** Point 7: the "Not included" lists, including the licensing/stamping line. */
  exclusions: false,
};

export function showDraft(key: keyof typeof OWNER_CONFIRMED): boolean {
  return OWNER_CONFIRMED[key] || import.meta.env.DEV;
}
