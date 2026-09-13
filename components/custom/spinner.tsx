// Product spinner — not a shadcn primitive (the shadcn `Spinner` was just an
// animated phosphor icon). A circular ring whose stroke tapers from
// `currentColor` at the head to fully transparent at the tail (a comet), with a
// rounded cap on the leading tip so it reads as a smooth loop rather than a
// sharp-cut arc.
//
// - Color follows `currentColor`; set it with `text-*` (e.g. text-muted-foreground).
// - Size with `size-*` on `className`; defaults to `size-4`.
// - Ring thickness via the `--spinner-width` CSS var (default 2px).

import { cn } from "@aec-craft/ui/lib/utils";
import type { ComponentProps } from "react";

const RING_MASK =
  "radial-gradient(farthest-side, transparent calc(100% - var(--spinner-width)), #000 calc(100% - var(--spinner-width)))";

function Spinner({ className, style, ...props }: ComponentProps<"div">) {
  return (
    <div
      aria-label="Loading"
      className={cn(
        "relative inline-block size-4 shrink-0 animate-spin [--spinner-width:2px]",
        className
      )}
      data-slot="spinner"
      role="status"
      style={style}
      {...props}
    >
      {/* fading comet body */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: "conic-gradient(from 0deg, transparent, currentColor)",
          WebkitMask: RING_MASK,
          mask: RING_MASK,
        }}
      />
      {/* rounded cap on the leading (opaque) tip */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 rounded-full bg-current"
        style={{
          width: "var(--spinner-width)",
          height: "var(--spinner-width)",
        }}
      />
    </div>
  );
}

export { Spinner };
