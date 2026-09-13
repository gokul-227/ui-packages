"use client";

import { Spinner } from "@aec-craft/ui/components/custom/spinner";
import { Button } from "@aec-craft/ui/components/primitives/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@aec-craft/ui/components/primitives/dialog";
import { Input } from "@aec-craft/ui/components/primitives/input";
import { type FormEvent, type ReactNode, useState } from "react";

export interface CreateDialogProps {
  extraFields?: ReactNode;
  nameLabel?: string;
  namePlaceholder?: string;
  onCreate: (input: { name: string }) => Promise<unknown>;
  onOpenChange: (open: boolean) => void;
  open: boolean;
  title: string;
}

/**
 * Controlled create-entity dialog: a built-in Name field (the slug derives from
 * it server-side) plus an `extraFields` slot so a consumer app can inject its
 * own required fields — the same extensibility the `apps` scope gives
 * `<Settings>`. Presentational only: the consumer owns the mutation (passed as
 * `onCreate`), reads any extra-field values from its own state, and navigates on
 * success. `onCreate` rejecting keeps the dialog open and surfaces the error.
 */
export function CreateDialog({
  open,
  onOpenChange,
  title,
  nameLabel = "Name",
  namePlaceholder,
  extraFields,
  onCreate,
}: CreateDialogProps) {
  const [name, setName] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const trimmed = name.trim();
  const isValid = trimmed.length >= 1 && trimmed.length <= 100;

  const handleOpenChange = (next: boolean) => {
    if (isPending) {
      return;
    }
    if (!next) {
      setName("");
      setError(null);
    }
    onOpenChange(next);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!isValid || isPending) {
      return;
    }
    setIsPending(true);
    setError(null);
    try {
      await onCreate({ name: trimmed });
      setName("");
      onOpenChange(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong. Try again."
      );
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Dialog onOpenChange={handleOpenChange} open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <label className="font-medium text-sm" htmlFor="create-scope-name">
              {nameLabel}
            </label>
            <Input
              autoFocus
              disabled={isPending}
              id="create-scope-name"
              maxLength={100}
              onChange={(e) => setName(e.target.value)}
              placeholder={namePlaceholder}
              value={name}
            />
          </div>

          {extraFields}

          {error !== null && (
            <p className="text-destructive text-sm">{error}</p>
          )}

          <DialogFooter>
            <DialogClose
              render={
                <Button disabled={isPending} type="button" variant="outline">
                  Cancel
                </Button>
              }
            />
            <Button disabled={!isValid || isPending} type="submit">
              {isPending ? <Spinner className="size-4" /> : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
