// Shared client-side validation predicates: cheap, good-enough gates for form
// UX (disable a submit, flag a field). The contract/zod schemas on the server
// stay authoritative — these never replace server validation.

const EMAIL_SHAPE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Loose email shape check — enough to gate a submit button, not RFC-complete. */
export function isEmail(value: string): boolean {
  return EMAIL_SHAPE.test(value.trim());
}
