"use client";

import { FieldRow } from "@aec-craft/ui/components/blocks/field-row";

import { cn } from "@aec-craft/ui/lib/utils";
import { type ReactNode, useState } from "react";

export interface FieldFormField {
  hint?: ReactNode;
  label: string;
  name: string;
  /** Read-only fields render their value but never save (e.g. a
   *  provider-managed email). */
  readOnly?: boolean;
  type?: string;
}

/**
 * Inline-save settings form: a vertical stack of `FieldRow`s, each saved on its
 * own. Stateless about persistence — it owns the editing draft, per-field dirty
 * + saving state (held a beat so a fast save doesn't flash), and calls back to
 * persist one field at a time. Dirty compares the draft against `values`, so a
 * successful save that refetches `values` clears the row.
 *
 * Re-seed the draft on identity change by keying the element
 * (`<FieldForm key={entity.id} … />`). A shadcn-pattern block reusable across
 * apps; bring your own mutation in `onSave`.
 */
export interface FieldFormProps {
  className?: string;
  fields: readonly FieldFormField[];
  /** Floor on the saving indicator so a fast save doesn't flash. */
  minSaveMs?: number;
  /** Called when `onSave` rejects (e.g. to surface a toast). */
  onError?: (err: unknown) => void;
  /** Persist one field; resolve to clear its dirty/saving state. */
  onSave: (name: string, value: string) => Promise<unknown>;
  /** Current server values, keyed by field name; dirty compares against these. */
  values: Record<string, string>;
}

export function FieldForm({
  values,
  fields,
  onSave,
  onError,
  minSaveMs = 450,
  className,
}: FieldFormProps) {
  const [draft, setDraft] = useState(values);
  const [savingField, setSavingField] = useState<string | null>(null);

  const save = async (name: string) => {
    setSavingField(name);
    const started = Date.now();
    try {
      await onSave(name, draft[name] ?? "");
    } catch (err) {
      onError?.(err);
    } finally {
      const wait = Math.max(0, minSaveMs - (Date.now() - started));
      window.setTimeout(
        () => setSavingField((cur) => (cur === name ? null : cur)),
        wait
      );
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      {fields.map((f) =>
        f.readOnly ? (
          <FieldRow
            defaultValue={values[f.name]}
            hint={f.hint}
            key={f.name}
            label={f.label}
            readOnly
            type={f.type}
          />
        ) : (
          <FieldRow
            hint={f.hint}
            isDirty={(draft[f.name] ?? "") !== (values[f.name] ?? "")}
            isSaving={savingField === f.name}
            key={f.name}
            label={f.label}
            onChange={(v) => setDraft((d) => ({ ...d, [f.name]: v }))}
            onSave={() => void save(f.name)}
            type={f.type}
            value={draft[f.name] ?? ""}
          />
        )
      )}
    </div>
  );
}
