/**
 * @component badge · stock: shadcn base-luma
 * @regen     pnpm ui:add badge
 * @frost     control (opt-in) — new `frosted` variant uses the `frosted` material
 * @delta     + variant "frosted": frosted fill + blur, hairline border, foreground text
 *            + variants "warning" "caution" "success" "info" "discovery": the status tones,
 *              each the tinted treatment of "destructive" on its own token
 *            ~ focus ring lightened: ring-[3px] ring-ring/50 → ring-2 ring-ring/20; system-wide calmer focus
 */

import { cn } from "@aec-craft/ui/lib/utils";
import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";

const badgeVariants = cva(
  "group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden whitespace-nowrap rounded-3xl border border-transparent px-2 py-0.5 font-medium text-xs transition-all focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/20 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground [a]:hover:bg-primary/80",
        secondary:
          "bg-secondary text-secondary-foreground [a]:hover:bg-secondary/80",
        destructive:
          "bg-destructive/10 text-destructive focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:focus-visible:ring-destructive/40 [a]:hover:bg-destructive/20",
        warning:
          "bg-warning/10 text-warning focus-visible:ring-warning/20 dark:bg-warning/20 dark:focus-visible:ring-warning/40 [a]:hover:bg-warning/20",
        caution:
          "bg-caution/10 text-caution focus-visible:ring-caution/20 dark:bg-caution/20 dark:focus-visible:ring-caution/40 [a]:hover:bg-caution/20",
        success:
          "bg-success/10 text-success focus-visible:ring-success/20 dark:bg-success/20 dark:focus-visible:ring-success/40 [a]:hover:bg-success/20",
        info: "bg-info/10 text-info focus-visible:ring-info/20 dark:bg-info/20 dark:focus-visible:ring-info/40 [a]:hover:bg-info/20",
        discovery:
          "bg-discovery/10 text-discovery focus-visible:ring-discovery/20 dark:bg-discovery/20 dark:focus-visible:ring-discovery/40 [a]:hover:bg-discovery/20",
        outline:
          "border-border text-foreground [a]:hover:bg-muted [a]:hover:text-muted-foreground",
        ghost:
          "hover:bg-muted hover:text-muted-foreground dark:hover:bg-muted/50",
        link: "text-primary underline-offset-4 hover:underline",
        frosted: "frosted border-border/60 text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Badge({
  className,
  variant = "default",
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant }), className),
      },
      props
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  });
}

export { Badge, badgeVariants };
