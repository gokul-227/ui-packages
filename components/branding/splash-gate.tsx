"use client";

import {
  BuildOsLoader,
  buildOsLoaderCycleMs,
} from "@aec-craft/ui/components/branding/buildos-loader";
import { cn } from "@aec-craft/ui/lib/utils";
import { type ReactNode, useEffect, useState } from "react";

interface Props {
  children: ReactNode;
  /** Extra classes for the full-screen overlay. */
  className?: string;
  /** Per-character animation length in ms. Lower = snappier. */
  cycleMs?: number;
  /** Loader glyph size in px. */
  size?: number;
  /** Per-character reveal stagger in ms. */
  staggerMs?: number;
}

// Minimum overlay time under `prefers-reduced-motion`, where the loader holds
// static and never animates a cycle.
const REDUCED_MOTION_MS = 400;
// Fade-out length once the cycle completes; matches `duration-300` below.
const FADE_MS = 300;

/**
 * Holds a full-screen buildOS splash over `children` until the loader has
 * played through at least one full cycle, then fades it out. `children` mount
 * (and boot) underneath immediately, so the splash overlaps app startup rather
 * than adding to it. Honors `prefers-reduced-motion`.
 */
export function SplashGate({
  children,
  size,
  cycleMs,
  staggerMs,
  className,
}: Props): ReactNode {
  const [hiding, setHiding] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const holdMs = reduced
      ? REDUCED_MOTION_MS
      : buildOsLoaderCycleMs({ cycleMs, staggerMs });

    const hide = setTimeout(() => {
      setHiding(true);
    }, holdMs);
    const remove = setTimeout(() => {
      setGone(true);
    }, holdMs + FADE_MS);

    return () => {
      clearTimeout(hide);
      clearTimeout(remove);
    };
  }, [cycleMs, staggerMs]);

  return (
    <>
      {children}
      {!gone && (
        <div
          className={cn(
            "fixed inset-0 z-50 grid place-items-center bg-background transition-opacity duration-300",
            hiding ? "pointer-events-none opacity-0" : "opacity-100",
            className
          )}
        >
          <BuildOsLoader cycleMs={cycleMs} size={size} staggerMs={staggerMs} />
        </div>
      )}
    </>
  );
}
