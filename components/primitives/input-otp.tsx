/**
 * @component input-otp · stock: shadcn base-luma
 * @regen     pnpm ui:add input-otp
 * @frost     none
 * @delta     - slot: drop the active-slot focus treatment (z-10 + border-ring + ring +
 *              active-invalid ring); the blinking caret alone marks the active slot
 *            ~ group invalid ring: ring-3 → ring-2 (matches the lightened input focus)
 *            + re-export REGEXP_ONLY_DIGITS from `input-otp` so consumers can restrict
 *              entry to digits without depending on the lib directly
 */
"use client";

import { cn } from "@aec-craft/ui/lib/utils";
import { MinusIcon } from "@phosphor-icons/react";
import { OTPInput, OTPInputContext, REGEXP_ONLY_DIGITS } from "input-otp";
import * as React from "react";

function InputOTP({
  className,
  containerClassName,
  ...props
}: React.ComponentProps<typeof OTPInput> & {
  containerClassName?: string;
}) {
  return (
    <OTPInput
      className={cn("disabled:cursor-not-allowed", className)}
      containerClassName={cn(
        "cn-input-otp flex items-center has-disabled:opacity-50",
        containerClassName
      )}
      data-slot="input-otp"
      spellCheck={false}
      {...props}
    />
  );
}

function InputOTPGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex items-center rounded-3xl has-aria-invalid:border-destructive has-aria-invalid:ring-2 has-aria-invalid:ring-destructive/20 dark:has-aria-invalid:ring-destructive/40",
        className
      )}
      data-slot="input-otp-group"
      {...props}
    />
  );
}

function InputOTPSlot({
  index,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  index: number;
}) {
  const inputOTPContext = React.useContext(OTPInputContext);
  const { char, hasFakeCaret, isActive } = inputOTPContext?.slots[index] ?? {};

  return (
    <div
      className={cn(
        "relative flex size-9 items-center justify-center border-input border-y border-r bg-input/50 text-sm outline-none transition-all first:rounded-l-3xl first:border-l last:rounded-r-3xl aria-invalid:border-destructive",
        className
      )}
      data-active={isActive}
      data-slot="input-otp-slot"
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-4 w-px animate-caret-blink bg-foreground duration-1000" />
        </div>
      )}
    </div>
  );
}

function InputOTPSeparator({ ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className="flex items-center [&_svg:not([class*='size-'])]:size-4"
      data-slot="input-otp-separator"
      role="separator"
      {...props}
    >
      <MinusIcon />
    </div>
  );
}

export {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
  REGEXP_ONLY_DIGITS,
};
