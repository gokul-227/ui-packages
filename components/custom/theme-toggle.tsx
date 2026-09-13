"use client";

import {
  ToggleGroup,
  ToggleGroupItem,
} from "@aec-craft/ui/components/primitives/toggle-group";
import { useThemeMode } from "@aec-craft/ui/hooks/use-theme-mode";
import { cn } from "@aec-craft/ui/lib/utils";
import { DesktopIcon, MoonIcon, SunIcon } from "@phosphor-icons/react";
import { flushSync } from "react-dom";

/**
 * The theme control: three round chips in a pill, the current one filled. Pair with
 * `ThemeProvider`; the state comes from `useThemeMode`.
 *
 * No new primitive was needed for it. `ToggleGroup`'s default variant is already the
 * ghost treatment, `aria-pressed` is set by Base UI, and the base class is already
 * `rounded-3xl`. Four overrides turn a toggle group into a pill, and each one is
 * load-bearing:
 *
 * - `spacing={0}` removes the 8px `--gap` the group applies by default. Three chips
 *   and two gaps make the control 18px wider for no reason.
 * - That same prop switches items to `rounded-none` with `px-3` for a segmented-bar
 *   look. Those are group-variant classes, so they outrank plain utilities on
 *   specificity and need `!` rather than merging.
 * - Hover is neutralised. `toggleVariants` responds to hover because a toolbar
 *   toggle has no other feedback; here one chip is always filled, so a hover fill
 *   means two look chosen at once.
 * - `weight="fill"`, because at 14px a stroked glyph reads thin against the pressed
 *   chip's fill.
 *
 * Three states rather than two: "system" is a real preference, and a light/dark
 * toggle discards it the first time anyone touches the control.
 */

const MODES = [
  { icon: SunIcon, label: "Light", value: "light" },
  { icon: MoonIcon, label: "Dark", value: "dark" },
  { icon: DesktopIcon, label: "System", value: "system" },
] as const;

type Mode = (typeof MODES)[number]["value"];

type WithViewTransition = Document & {
  startViewTransition?: (callback: () => void) => unknown;
};

function ThemeToggle({ className }: { className?: string }) {
  const { isMounted, mode, setMode } = useThemeMode();

  /**
   * Wrapped in a view transition, which is the only reason a theme change can feel
   * soft. Nothing about this control animates: the browser cross-fades the whole
   * document between palettes, so every surface changes together instead of each
   * one snapping on its own.
   *
   * `flushSync` is required. The transition captures the frame synchronously, so a
   * deferred update would be captured as the old state and nothing would appear to
   * change. Where the API is missing the theme still changes, just instantly.
   */
  function change(next: Mode) {
    const doc = document as WithViewTransition;
    if (doc.startViewTransition) {
      doc.startViewTransition(() => flushSync(() => setMode(next)));
      return;
    }
    setMode(next);
  }

  return (
    <ToggleGroup
      className={cn("rounded-full border border-border/60 p-1", className)}
      spacing={0}
      // Nothing is selected until mounted. The `dark` class is written by a
      // pre-hydration script the server never ran, so painting a selection on the
      // first render is a hydration mismatch.
      value={isMounted && mode ? [mode] : []}
    >
      {MODES.map(({ icon: Icon, label, value }) => (
        <ToggleGroupItem
          aria-label={label}
          className="size-6.5! min-w-0 rounded-full! px-0! text-muted-foreground hover:bg-transparent hover:text-muted-foreground aria-pressed:text-foreground"
          key={value}
          onClick={() => change(value)}
          size="sm"
          value={value}
        >
          <Icon className="size-3.5" weight="fill" />
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}

export { ThemeToggle };
