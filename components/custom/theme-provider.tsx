"use client";

import {
  ThemeProvider as NextThemeProvider,
  type ThemeProviderProps,
} from "next-themes";

/**
 * Theme root. The tokens key off a `dark` class on an ancestor
 * (`@custom-variant dark` in `styles/globals.css`), so `attribute` belongs to the
 * design system and is not overridable; everything else is the app's call. Read
 * the state back with `useThemeMode`.
 *
 * Mount it at the app root and set `suppressHydrationWarning` on `<html>`: the
 * class is written by a pre-hydration script, which React otherwise reports as a
 * server/client mismatch.
 */
function ThemeProvider({
  children,
  ...props
}: Omit<ThemeProviderProps, "attribute">) {
  return (
    <NextThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      {...props}
    >
      {children}
    </NextThemeProvider>
  );
}

export { ThemeProvider };
