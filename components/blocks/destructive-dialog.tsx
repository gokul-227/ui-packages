"use client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@aec-craft/ui/components/primitives/alert-dialog";
import { Button } from "@aec-craft/ui/components/primitives/button";
import { Input } from "@aec-craft/ui/components/primitives/input";
import { Label } from "@aec-craft/ui/components/primitives/label";
import { type ReactElement, useEffect, useId, useState } from "react";

export interface DestructiveDialogProps {
  /** What the dialog's own button says. A verb: "Delete project", not
   *  "Confirm", or the reader reconstructs what they agreed to from the title. */
  confirmLabel: string;
  /** When set, the action stays disabled until exactly this is typed. For
   *  what cannot be undone, and nothing else. */
  confirmPhrase?: string;
  description: string;
  isPending?: boolean;
  onConfirm: () => void;
  onOpenChange?: (open: boolean) => void;
  /** Omit, with a `trigger`, for an uncontrolled dialog. A trigger inside a
   *  dropdown menu unmounts with it, so from a menu drive `open` yourself. */
  open?: boolean;
  title: string;
  /** Rendered as the dialog's trigger: `<Button variant="destructive">…</Button>`. */
  trigger?: ReactElement;
}

/**
 * The confirmation a destructive action opens before it runs: a title, what
 * goes, and a verb-named button. The typed phrase is a deliberation gate, not
 * an authorization check; what a caller may do is settled server-side.
 */
export function DestructiveDialog({
  confirmLabel,
  confirmPhrase,
  description,
  isPending,
  onConfirm,
  onOpenChange,
  open,
  title,
  trigger,
}: DestructiveDialogProps) {
  const inputId = useId();
  const [typed, setTyped] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const isShown = open ?? isOpen;

  // Reopening after a cancel must not arrive already satisfied.
  useEffect(() => {
    if (!isShown) {
      setTyped("");
    }
  }, [isShown]);

  const isBlocked = confirmPhrase !== undefined && typed !== confirmPhrase;

  function handleOpenChange(next: boolean): void {
    setIsOpen(next);
    onOpenChange?.(next);
  }

  return (
    <AlertDialog onOpenChange={handleOpenChange} open={isShown}>
      {trigger ? <AlertDialogTrigger render={trigger} /> : null}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>

        {confirmPhrase === undefined ? null : (
          <div className="flex flex-col gap-2">
            <Label htmlFor={inputId}>
              Type <span className="text-foreground">{confirmPhrase}</span> to
              confirm
            </Label>
            <Input
              autoComplete="off"
              id={inputId}
              onChange={(event) => setTyped(event.target.value)}
              spellCheck={false}
              value={typed}
            />
          </div>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button
            disabled={isBlocked || isPending}
            onClick={onConfirm}
            variant="destructive"
          >
            {confirmLabel}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
