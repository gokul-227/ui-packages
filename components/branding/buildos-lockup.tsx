import { cn } from "@aec-craft/ui/lib/utils";
import type { HTMLAttributes } from "react";

import { BuildOsMark } from "./buildos-mark";
import { BuildOsWordmark } from "./buildos-wordmark";

/**
 * buildOS lockup — mark + wordmark. The cube sits left of the wordmark,
 * vertically centered, 10px gap. `size` = wordmark font-size in px; the cube
 * width is derived to match its visible height.
 */
export function BuildOsLockup({
  size = 32,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  /** Wordmark font-size in px. Cube auto-matches the visible height. */
  size?: number;
}) {
  const cubeWidth = Math.round(size * 1.15);
  return (
    <div className={cn("inline-flex items-center", className)} {...props}>
      <BuildOsMark className="text-foreground" size={cubeWidth} />
      <BuildOsWordmark className="ml-[10px] text-foreground" size={size} />
    </div>
  );
}
