import { cn } from "@aec-craft/ui/lib/utils";
import type { HTMLAttributes } from "react";

/**
 * buildOS wordmark — medium weight, tight tracking. "buildOS" keeps its caps
 * ("OS"), so no text-transform.
 */
export function BuildOsWordmark({
  size = 24,
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement> & { size?: number }) {
  return (
    <span
      aria-label="buildOS"
      className={cn(
        "inline-block select-none font-medium font-sans",
        className
      )}
      role="img"
      style={{
        fontSize: `${String(size)}px`,
        letterSpacing: "-0.04em",
        lineHeight: 1,
      }}
      {...props}
    >
      buildOS
    </span>
  );
}
