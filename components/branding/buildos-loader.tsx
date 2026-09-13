import { cn } from "@aec-craft/ui/lib/utils";
import type { HTMLAttributes } from "react";

interface Props extends Omit<HTMLAttributes<HTMLDivElement>, "role"> {
  /** Per-character animation length in ms. Lower = snappier. Default 2400. */
  cycleMs?: number;
  /** Font size in px. Default 28. */
  size?: number;
  /** Per-character reveal stagger in ms. Default 120. */
  staggerMs?: number;
}

const CHARS = ["b", "u", "i", "l", "d", "O", "S"] as const;

const DEFAULT_CYCLE_MS = 2400;
const DEFAULT_STAGGER_MS = 120;

/**
 * Length in ms of one full visual cycle — the reveal-and-clear of every
 * character, including the trailing stagger of the last char. Hold a splash
 * for at least this long to guarantee the loader plays through once.
 */
export function buildOsLoaderCycleMs({
  cycleMs = DEFAULT_CYCLE_MS,
  staggerMs = DEFAULT_STAGGER_MS,
}: {
  cycleMs?: number;
  staggerMs?: number;
} = {}): number {
  return cycleMs + (CHARS.length - 1) * staggerMs;
}

/**
 * buildOS loader — animated brand mark for Suspense fallbacks and loading
 * states. Typewriter-style char-by-char reveal of "buildOS", same weight +
 * tracking as the wordmark so the loading and resolved states are continuous.
 * Pure CSS animation; honors `prefers-reduced-motion: reduce`.
 */
export function BuildOsLoader({
  size = 28,
  cycleMs = DEFAULT_CYCLE_MS,
  staggerMs = DEFAULT_STAGGER_MS,
  className,
  ...props
}: Props) {
  return (
    <div
      aria-label="Loading"
      className={cn("select-none font-medium font-sans", className)}
      role="status"
      style={{
        fontSize: `${String(size)}px`,
        letterSpacing: "-0.04em",
        lineHeight: 1,
      }}
      {...props}
    >
      {CHARS.map((c, i) => (
        <span
          className="buildos-loader-char inline-block opacity-0"
          key={i}
          style={{ animationDelay: `${String(i * staggerMs)}ms` }}
        >
          {c}
        </span>
      ))}
      <style>{`
        @keyframes buildos-loader-char {
          0%   { opacity: 0; transform: translateY(3px); filter: blur(2px); }
          12%  { opacity: 1; transform: translateY(0);   filter: blur(0);   }
          55%  { opacity: 1; transform: translateY(0);   filter: blur(0);   }
          70%  { opacity: 0; transform: translateY(-3px); filter: blur(2px); }
          100% { opacity: 0; }
        }
        .buildos-loader-char {
          animation: buildos-loader-char ${String(cycleMs)}ms cubic-bezier(0.65, 0, 0.35, 1) infinite both;
        }
        @media (prefers-reduced-motion: reduce) {
          .buildos-loader-char { animation: none; opacity: 1; }
        }
      `}</style>
    </div>
  );
}
