import { cn } from "@aec-craft/ui/lib/utils";
import type { SVGProps } from "react";

/**
 * buildOS mark — isometric wireframe cube with the ember dot at the center
 * vertex. The mark glyph is unchanged from the original brand book (geometry +
 * the ember `#c47a3a` are fixed); only the product name around it is buildOS.
 *   top (60,18) · right (102,42) · left (18,42) · center (60,66)
 *   bottom-left (18,90) · bottom-right (102,90) · bottom (60,114)
 * Stroke uses `currentColor` so it inherits the brand color from `text-*`.
 */
export function BuildOsMark({
  size = 32,
  className,
  ...props
}: SVGProps<SVGSVGElement> & { size?: number }) {
  const aspect = 132 / 120;
  return (
    <svg
      aria-hidden="true"
      className={cn("text-foreground", className)}
      fill="none"
      height={size * aspect}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={4}
      viewBox="0 0 120 132"
      width={size}
      {...props}
    >
      {/* Outer hexagonal silhouette */}
      <path d="M 60 18 L 102 42 L 102 90 L 60 114 L 18 90 L 18 42 Z" />
      {/* Vertical bar through center: top → center → bottom */}
      <path d="M 60 18 L 60 114" />
      {/* Two side radials meeting at the center vertex */}
      <path d="M 18 42 L 60 66" />
      <path d="M 102 42 L 60 66" />
      {/* Ember dot — fixed brand color, unchanged from the original mark. */}
      <circle cx="60" cy="66" fill="#c47a3a" r="5" stroke="none" />
    </svg>
  );
}
