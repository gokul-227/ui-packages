"use client";

import { Button } from "@aec-craft/ui/components/primitives/button";
import { CheckIcon, CopyIcon } from "@aec-craft/ui/icons";
import { useEffect, useState } from "react";

/** How long the check stands in for the copy icon. */
export const COPIED_FOR_MS = 1500;

export interface CopyButtonProps {
  className?: string;
  /** The accessible name; the button shows only an icon. */
  label?: string;
  size?: "icon-xs" | "icon-sm" | "icon";
  value: string;
}

/**
 * A ghost icon button that writes `value` to the clipboard and shows a check
 * for a moment. For an id, a secret, a path: anything a reader would otherwise
 * select by hand.
 */
export function CopyButton({
  value,
  label = "Copy to clipboard",
  size = "icon-xs",
  className,
}: CopyButtonProps) {
  const [hasCopied, setHasCopied] = useState(false);

  useEffect(() => {
    if (!hasCopied) {
      return;
    }
    const id = setTimeout(() => setHasCopied(false), COPIED_FOR_MS);
    return () => clearTimeout(id);
  }, [hasCopied]);

  function handleCopy(): void {
    // Rejects off HTTPS and when the document is not focused; the icon then
    // says nothing happened, which is the truth.
    navigator.clipboard.writeText(value).then(
      () => setHasCopied(true),
      () => setHasCopied(false)
    );
  }

  return (
    <Button
      aria-label={hasCopied ? "Copied" : label}
      className={className}
      onClick={handleCopy}
      size={size}
      variant="ghost"
    >
      {hasCopied ? <CheckIcon /> : <CopyIcon />}
    </Button>
  );
}
