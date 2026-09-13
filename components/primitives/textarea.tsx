/**
 * @component textarea · stock: shadcn base-luma
 * @regen     pnpm ui:add textarea
 * @frost     control (opt-in) — `frosted` prop swaps the fill for the `frosted` material
 * @delta     + frosted?: boolean prop
 *            ~ border: transparent → border-foreground/20 (visible hairline by default; the
 *              monochrome system reads the field edge without relying on the fill)
 *            ~ fill: bg-input/50 → (frosted ? frosted : bg-input/50); compounds on a frosted surface
 *            ~ focus/invalid ring lightened: ring-3 ring-ring/30 → ring-2 ring-ring/20
 *              (invalid ring-3 → ring-2); system-wide calmer focus
 */

import { cn } from "@aec-craft/ui/lib/utils";
import type * as React from "react";

function Textarea({
  className,
  frosted = false,
  ...props
}: React.ComponentProps<"textarea"> & { frosted?: boolean }) {
  return (
    <textarea
      className={cn(
        "field-sizing-content flex min-h-16 w-full resize-none rounded-2xl border border-foreground/20 px-3 py-3 text-base outline-none transition-[color,box-shadow,background-color] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 md:text-sm dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
        frosted ? "frosted" : "bg-input/50",
        className
      )}
      data-frost={frosted || undefined}
      data-slot="textarea"
      {...props}
    />
  );
}

export { Textarea };
