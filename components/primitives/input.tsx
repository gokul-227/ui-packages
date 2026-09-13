/**
 * @component input · stock: shadcn base-luma
 * @regen     pnpm ui:add input
 * @frost     control (opt-in) — `frosted` prop swaps the fill for the `frosted` material
 * @delta     + frosted?: boolean prop
 *            ~ border: transparent → border-foreground/20 (visible hairline by default; the
 *              monochrome system reads the field edge without relying on the fill)
 *            ~ fill: bg-input/50 → (frosted ? frosted : bg-input/50); on a frosted surface the
 *              two fills compound so the input reads more solid than the panel (stacking)
 *            ~ focus/invalid ring lightened: ring-3 ring-ring/30 → ring-2 ring-ring/20
 *              (invalid ring-3 → ring-2); system-wide calmer focus
 */

import { cn } from "@aec-craft/ui/lib/utils";
import { Input as InputPrimitive } from "@base-ui/react/input";
import type * as React from "react";

function Input({
  className,
  type,
  frosted = false,
  ...props
}: React.ComponentProps<"input"> & { frosted?: boolean }) {
  return (
    <InputPrimitive
      className={cn(
        "h-9 w-full min-w-0 rounded-3xl border border-foreground/20 px-3 py-1 text-base outline-none transition-[color,box-shadow,background-color] file:inline-flex file:h-7 file:border-0 file:bg-transparent file:font-medium file:text-foreground file:text-sm placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/20 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 md:text-sm dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
        frosted ? "frosted" : "bg-input/50",
        className
      )}
      data-frost={frosted || undefined}
      data-slot="input"
      type={type}
      {...props}
    />
  );
}

export { Input };
