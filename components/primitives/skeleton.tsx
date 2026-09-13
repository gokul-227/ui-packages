import { cn } from "@aec-craft/ui/lib/utils";

/**
 * A shape standing in for content that has not arrived. On the translucent scale
 * rather than `--muted`: a skeleton has to read as a shape on whatever it sits
 * on, and the fill token is the page's own light grey, which all but disappears
 * on a white card.
 */
function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-2xl bg-foreground/[0.08]",
        className
      )}
      data-slot="skeleton"
      {...props}
    />
  );
}

export { Skeleton };
