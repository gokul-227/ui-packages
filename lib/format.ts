// Shared presentation helpers — pure string/date formatting, no domain
// knowledge. Lives next to `cn` so any app on @aec-craft/ui can reuse
// it instead of hand-rolling per-surface copies.

const WHITESPACE = /\s+/;

export function titleCase(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/** Two-letter avatar fallback from a name (or email when name is empty). */
export function initials(name?: string | null, email?: string | null): string {
  const src = (name || email || "").trim();
  if (!src) {
    return "?";
  }
  const parts = src.split(WHITESPACE).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0]![0]! + parts[1]![0]!).toUpperCase();
  }
  return src.slice(0, 2).toUpperCase();
}

/** Short absolute date, e.g. "Apr 4, 2024". */
export function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) {
    return iso;
  }
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/** Coarse relative time, e.g. "2h ago", "3d ago", or a date for older events. */
export function relativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) {
    return iso;
  }
  const secs = Math.round((Date.now() - then) / 1000);
  if (secs < 60) {
    return "just now";
  }
  const mins = Math.round(secs / 60);
  if (mins < 60) {
    return `${mins}m ago`;
  }
  const hours = Math.round(mins / 60);
  if (hours < 24) {
    return `${hours}h ago`;
  }
  const days = Math.round(hours / 24);
  if (days < 7) {
    return `${days}d ago`;
  }
  return formatDate(iso);
}
