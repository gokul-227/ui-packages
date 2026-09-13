/**
 * @component native-select · stock: shadcn base-luma
 * @regen     pnpm ui:add native-select
 * @frost     control (opt-in) — `frosted` prop swaps the fill for the `frosted` material
 * @delta     + frosted?: boolean prop
 *            ~ border: transparent → border-foreground/20 (visible hairline by default; matches Input)
 *            ~ fill: bg-input/50 → (frosted ? frosted : bg-input/50); compounds on a frosted surface
 *            ~ focus/invalid ring lightened: ring-3 ring-ring/30 → ring-2 ring-ring/20
 *              (invalid ring-3 → ring-2); system-wide calmer focus
 *            note: frost reaches the closed control only — the option list is OS-rendered
 *              and unstyleable, so Option/OptGroup keep the stock bg-[Canvas] fallback
 */

import { cn } from "@aec-craft/ui/lib/utils";
import { CaretDownIcon } from "@phosphor-icons/react";
import type * as React from "react";

type NativeSelectProps = Omit<React.ComponentProps<"select">, "size"> & {
  frosted?: boolean;
  size?: "sm" | "default";
};

function NativeSelect({
  className,
  frosted = false,
  size = "default",
  ...props
}: NativeSelectProps) {
  return (
    <div
      className={cn(
        "group/native-select relative w-fit has-[select:disabled]:opacity-50",
        className
      )}
      data-size={size}
      data-slot="native-select-wrapper"
    >
      <select
        className={cn(
          "h-9 w-full min-w-0 select-none appearance-none rounded-3xl border border-foreground/20 py-1 pr-8 pl-3 text-sm outline-none transition-[color,box-shadow,background-color] selection:bg-primary selection:text-primary-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/20 disabled:pointer-events-none disabled:cursor-not-allowed aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 data-[size=sm]:h-8 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
          frosted ? "frosted" : "bg-input/50"
        )}
        data-frost={frosted || undefined}
        data-size={size}
        data-slot="native-select"
        {...props}
      />
      <CaretDownIcon
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 right-2.5 size-4 -translate-y-1/2 select-none text-muted-foreground"
        data-slot="native-select-icon"
      />
    </div>
  );
}

function NativeSelectOption({
  className,
  ...props
}: React.ComponentProps<"option">) {
  return (
    <option
      className={cn("bg-[Canvas] text-[CanvasText]", className)}
      data-slot="native-select-option"
      {...props}
    />
  );
}

function NativeSelectOptGroup({
  className,
  ...props
}: React.ComponentProps<"optgroup">) {
  return (
    <optgroup
      className={cn("bg-[Canvas] text-[CanvasText]", className)}
      data-slot="native-select-optgroup"
      {...props}
    />
  );
}

export { NativeSelect, NativeSelectOptGroup, NativeSelectOption };
