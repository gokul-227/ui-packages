"use client";

import { DestructiveDialog } from "@aec-craft/ui/components/blocks/destructive-dialog";
import { Button } from "@aec-craft/ui/components/primitives/button";
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@aec-craft/ui/components/primitives/card";
import { cn } from "@aec-craft/ui/lib/utils";

export interface DangerZoneProps {
  className?: string;
  /** What the dialog says goes. Defaults to `description`. */
  confirmDescription?: string;
  /** The dialog's own button. Defaults to `label`. */
  confirmLabel?: string;
  /** Must be typed exactly before the dialog's button enables. For what
   *  cannot be undone, and nothing else. */
  confirmPhrase?: string;
  /** The dialog's title. Defaults to the label as a question. */
  confirmTitle?: string;
  description: string;
  disabled?: boolean;
  /** A refusal from the server, shown under the description: "You are the
   *  last owner of Riverside." */
  error?: string | null;
  isPending?: boolean;
  /** The button's text. A verb: "Delete project", "Close my account". */
  label: string;
  onConfirm: () => void;
  title: string;
  /**
   * `plain` is the card every other section on the page is, and the button
   * carries the only red. `tinted` washes the whole card in the destructive
   * tone, for a surface where a plain card does not read as the zone.
   */
  variant?: "plain" | "tinted";
}

/**
 * Where a destructive action lives: a card with a title, what the action
 * removes, and the one red button, which opens the confirmation before it
 * runs. Used for delete-account / delete-org / delete-project. The consumer
 * owns the permission gate and the mutation.
 */
export function DangerZone({
  title,
  description,
  label,
  onConfirm,
  confirmTitle,
  confirmDescription,
  confirmLabel,
  confirmPhrase,
  disabled,
  error,
  isPending,
  variant = "plain",
  className,
}: DangerZoneProps) {
  return (
    <Card
      className={cn(
        // Mixed into the frost fill rather than layered over it, so the tint
        // stays glass instead of replacing the material with a flat red.
        variant === "tinted" &&
          "bg-[color-mix(in_oklab,var(--frost-fill),var(--destructive)_8%)] ring-destructive/15 dark:bg-[color-mix(in_oklab,var(--frost-fill),var(--destructive)_14%)] dark:ring-destructive/25",
        className
      )}
      data-variant={variant}
      size="sm"
    >
      <CardHeader className="gap-0.5">
        <CardTitle className="text-sm">{title}</CardTitle>
        <CardDescription className="text-xs">
          {description}
          {error ? (
            <span className="mt-1 block text-destructive">{error}</span>
          ) : null}
        </CardDescription>
        <CardAction className="self-center">
          <DestructiveDialog
            confirmLabel={confirmLabel ?? label}
            confirmPhrase={confirmPhrase}
            description={confirmDescription ?? description}
            isPending={isPending}
            onConfirm={onConfirm}
            title={confirmTitle ?? `${label}?`}
            trigger={
              <Button
                disabled={disabled || isPending}
                size="sm"
                variant="destructive"
              >
                {label}
              </Button>
            }
          />
        </CardAction>
      </CardHeader>
    </Card>
  );
}
