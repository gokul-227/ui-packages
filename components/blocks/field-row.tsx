"use client";

import { Spinner } from "@aec-craft/ui/components/custom/spinner";

import { Button } from "@aec-craft/ui/components/primitives/button";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
} from "@aec-craft/ui/components/primitives/field";
import { Input } from "@aec-craft/ui/components/primitives/input";
import { cn } from "@aec-craft/ui/lib/utils";
import { type ReactNode, useId } from "react";

export interface FieldRowProps {
  className?: string;
  defaultValue?: string;
  hint?: ReactNode;
  /** Show the Save button (typically the field's dirty state). */
  isDirty?: boolean;
  isSaving?: boolean;
  label: string;
  onChange?: (value: string) => void;
  onSave?: () => void;
  readOnly?: boolean;
  type?: string;
  value?: string;
}

/**
 * One settings field, stacked: label, hint, then the input at full width.
 * `FieldForm` spaces fields apart rather than ruling a line between them.
 *
 * Pass `value`/`onChange` for a controlled field (e.g. from a form); an inline
 * "Save" button appears when `isDirty` is true and an `onSave` handler is
 * provided, collapsing to a spinner while `isSaving`. A shadcn-pattern block
 * reusable across apps.
 */
export function FieldRow({
  label,
  value,
  defaultValue,
  onChange,
  onSave,
  isDirty,
  isSaving,
  hint,
  type = "text",
  readOnly,
  className,
}: FieldRowProps) {
  const id = useId();
  // Keep the button mounted while saving even after the field stops being dirty
  // (the buffered spinner lasts a touch longer than the request).
  const showSave = !readOnly && !!onSave && (!!isDirty || !!isSaving);
  return (
    <Field className={cn("gap-2", className)}>
      <FieldContent>
        <FieldLabel htmlFor={id}>{label}</FieldLabel>
        {hint ? <FieldDescription>{hint}</FieldDescription> : null}
      </FieldContent>
      <div className="relative w-full">
        <Input
          className={
            readOnly
              ? "opacity-70"
              : showSave
                ? isSaving
                  ? "pr-9"
                  : "pr-16"
                : undefined
          }
          defaultValue={defaultValue}
          id={id}
          onChange={onChange ? (e) => onChange(e.target.value) : undefined}
          readOnly={readOnly}
          type={type}
          value={value}
        />
        {showSave ? (
          <div className="absolute inset-y-0 right-1.5 flex items-center">
            {isSaving ? (
              <Spinner
                aria-label="Saving"
                className="mr-1.5 size-4 text-muted-foreground"
              />
            ) : (
              <Button
                className="h-7 px-2.5 text-xs"
                onClick={onSave}
                size="sm"
                type="button"
              >
                Save
              </Button>
            )}
          </div>
        ) : null}
      </div>
    </Field>
  );
}
