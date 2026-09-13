/**
 * @component button · stock: shadcn base-luma
 * @regen     pnpm ui:add button
 * @frost     control (opt-in) — new `frosted` variant uses the `frosted` material
 * @delta     + variant "frosted": frosted fill + blur, hairline border, foreground text
 *              (a glass button; on a frosted surface the fills compound so it reads more solid)
 *              hover/expanded tint via color-mix on --frost-fill (NOT bg-foreground/N, which would
 *              replace the fill and expose the saturated backdrop)
 *            ~ focus/invalid ring lightened: ring-3 ring-ring/30 → ring-2 ring-ring/20 (invalid ring-3 → ring-2); system-wide calmer focus
 * @usage     <Button> renders a base-ui button and always sets role="button". For a
 *            LINK styled as a button, do NOT use <Button render={<a/>} nativeButton={false}>:
 *            the role="button" overrides the anchor's implicit link role (wrong semantics for
 *            assistive tech, breaks middle-click/open-in-new-tab affordances). Instead style a
 *            plain <a> with the exported `buttonVariants`:
 *              <a href={href} className={buttonVariants({ variant, size })}>Label</a>
 *            Merge extra classes with cn(buttonVariants({ ... }), "..."). (See calendar.tsx.)
 */

import { cn } from "@aec-craft/ui/lib/utils";
import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  "group/button inline-flex shrink-0 select-none items-center justify-center whitespace-nowrap rounded-4xl border border-transparent bg-clip-padding font-medium text-sm outline-none transition-all focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/20 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/80",
        // Tint, not the solid `muted` fill: opaque reads heavy on a frosted
        // surface, and a fill lighter than a hovered row's tint inverts the
        // hover. Needs no dark variant, since `foreground` flips with theme.
        outline:
          "border-border bg-background hover:bg-foreground/[0.04] hover:text-foreground aria-expanded:bg-foreground/[0.06] aria-expanded:text-foreground dark:bg-transparent",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
        ghost:
          "hover:bg-foreground/[0.06] hover:text-foreground aria-expanded:bg-foreground/[0.08] aria-expanded:text-foreground",
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:focus-visible:ring-destructive/40 dark:hover:bg-destructive/30",
        link: "text-primary underline-offset-4 hover:underline",
        frosted:
          "frosted border-border/60 text-foreground hover:bg-[color-mix(in_oklab,var(--frost-fill),var(--foreground)_8%)] aria-expanded:bg-[color-mix(in_oklab,var(--frost-fill),var(--foreground)_12%)]",
      },
      size: {
        default:
          "h-9 gap-1.5 px-3 has-data-[icon=inline-end]:pr-2.5 has-data-[icon=inline-start]:pl-2.5",
        xs: "h-6 gap-1 px-2.5 text-xs has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 gap-1 px-3 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        lg: "h-10 gap-1.5 px-4 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
        icon: "size-9",
        "icon-xs": "size-6 [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      className={cn(buttonVariants({ variant, size, className }))}
      data-slot="button"
      {...props}
    />
  );
}

export { Button, buttonVariants };
