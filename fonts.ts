import { Geist, JetBrains_Mono } from "next/font/google";

// The design system's fonts. Geist drives everything (headings + body) via
// --font-sans; JetBrains Mono is --font-mono, applied to labels + secondary
// (description) text by the base layer in globals.css.
//
// Apply `fontVariables` on <html> (or <body>) in the consuming Next app so the
// CSS variables resolve:
//
//   import { fontVariables } from "@aec-craft/ui/fonts";
//   <html className={fontVariables}>…</html>
//
// (next/font is Next-only. A non-Next consumer loads the two families itself
// and defines the same two variables.)
export const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const fontVariables = `${fontSans.variable} ${fontMono.variable}`;
