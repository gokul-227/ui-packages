"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export type ThemeMode = "light" | "dark" | "system";

/**
 * Theme state, decoupled from the control that renders it: `mode` drives a
 * three-state control (toggle group, menu radio group), `isDark` a two-state one
 * (icon button, switch). Pair with `ThemeProvider` from
 * `components/custom/theme-provider`.
 *
 * Nothing here is meaningful until `isMounted`. The `dark` class is written by a
 * pre-hydration script the server never ran, so a control painted from `isDark`
 * on the first render is a hydration mismatch. Gate only the part that differs
 * (the glyph, the checked state), not the whole control, or it shifts on mount.
 */
export function useThemeMode() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const isDark = isMounted && resolvedTheme === "dark";

  return {
    isMounted,
    isDark,
    /** The stored preference, `"system"` included. `undefined` until mounted. */
    mode: isMounted ? (theme as ThemeMode) : undefined,
    setMode: (mode: ThemeMode) => setTheme(mode),
    toggle: () => setTheme(isDark ? "light" : "dark"),
  };
}
