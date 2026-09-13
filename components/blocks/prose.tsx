import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@aec-craft/ui/components/primitives/table";
import { cn } from "@aec-craft/ui/lib/utils";
import type { ComponentProps, ElementType } from "react";

/**
 * Long-form text: one component per element a Markdown or CMS document can
 * produce, plus the `prose` map from tag name to component. The design system
 * owns how a document reads, so a consumer binds the map to its own renderer
 * (an MDX component map, a sanitizer's allow-list) and writes no typography.
 *
 * Nothing here knows about MDX, remark or a content pipeline: these are plain
 * elements with the theme's type scale on them.
 */

export function ProseH1({ className, ...props }: ComponentProps<"h1">) {
  return (
    <h1
      className={cn(
        "mt-2 mb-4 scroll-m-20 font-medium text-3xl text-foreground tracking-tight",
        className
      )}
      {...props}
    />
  );
}

export function ProseH2({ className, ...props }: ComponentProps<"h2">) {
  return (
    <h2
      className={cn(
        "mt-10 mb-3 scroll-m-20 border-border/60 border-b pb-2 font-medium text-foreground text-xl tracking-tight",
        className
      )}
      {...props}
    />
  );
}

export function ProseH3({ className, ...props }: ComponentProps<"h3">) {
  return (
    <h3
      className={cn(
        "mt-8 mb-2 scroll-m-20 font-medium text-base text-foreground",
        className
      )}
      {...props}
    />
  );
}

export function ProseH4({ className, ...props }: ComponentProps<"h4">) {
  return (
    <h4
      className={cn(
        "mt-6 mb-2 scroll-m-20 font-medium text-foreground text-sm",
        className
      )}
      {...props}
    />
  );
}

export function ProseP({ className, ...props }: ComponentProps<"p">) {
  return (
    <p
      className={cn("my-4 text-foreground/90 text-sm leading-7", className)}
      {...props}
    />
  );
}

/**
 * A plain anchor, so a document stays portable. A consumer whose router owns
 * navigation overrides `a` in the map and reuses `proseLinkClass`, the way
 * `badgeVariants` is reused.
 */
export const proseLinkClass =
  "font-medium text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground";

export function ProseLink({ className, ...props }: ComponentProps<"a">) {
  return <a className={cn(proseLinkClass, className)} {...props} />;
}

export function ProseUl({ className, ...props }: ComponentProps<"ul">) {
  return (
    <ul
      className={cn("my-4 ml-5 list-disc space-y-2 text-sm", className)}
      {...props}
    />
  );
}

export function ProseOl({ className, ...props }: ComponentProps<"ol">) {
  return (
    <ol
      className={cn("my-4 ml-5 list-decimal space-y-2 text-sm", className)}
      {...props}
    />
  );
}

export function ProseLi({ className, ...props }: ComponentProps<"li">) {
  return (
    <li
      className={cn(
        "text-foreground/90 leading-7 marker:text-muted-foreground",
        className
      )}
      {...props}
    />
  );
}

export function ProseQuote({
  className,
  ...props
}: ComponentProps<"blockquote">) {
  return (
    <blockquote
      className={cn(
        "my-5 border-border border-l-2 pl-4 text-muted-foreground text-sm italic",
        className
      )}
      {...props}
    />
  );
}

export function ProseCode({ className, ...props }: ComponentProps<"code">) {
  return (
    <code
      className={cn(
        "rounded-md bg-muted px-1.5 py-0.5 font-mono text-[0.85em] text-foreground",
        className
      )}
      {...props}
    />
  );
}

/**
 * The frame only. A highlighter has already written the spans and, with a dual
 * theme, their colours as custom properties; painting them is the consumer's
 * one line of CSS.
 */
export function ProsePre({
  className,
  style,
  ...props
}: ComponentProps<"pre">) {
  return (
    <div className="my-5 overflow-hidden rounded-2xl border border-border/60 bg-muted/40">
      <pre
        className={cn(
          "overflow-x-auto p-4 font-mono text-[13px] leading-6",
          className
        )}
        data-slot="prose-pre"
        style={style}
        {...props}
      />
    </div>
  );
}

export function ProseHr({ className, ...props }: ComponentProps<"hr">) {
  return <hr className={cn("my-10 border-border/60", className)} {...props} />;
}

/**
 * A document carries no dimensions and no loader, so this is an `img`. A
 * consumer with a framework image component overrides `img` in the map.
 */
export function ProseImage({
  alt,
  className,
  height,
  width,
  ...props
}: ComponentProps<"img">) {
  return (
    <img
      alt={alt ?? ""}
      className={cn("my-6 rounded-2xl border border-border/60", className)}
      height={height}
      width={width}
      {...props}
    />
  );
}

/** Scrolls inside its own frame, so a wide table never scrolls the page. */
export function ProseTable({ className, ...props }: ComponentProps<"table">) {
  return (
    <div className="my-6 overflow-x-auto rounded-2xl border border-border/60">
      <Table className={className} {...props} />
    </div>
  );
}

/** Tag name to component, for a renderer that maps elements by name. */
export const prose: Record<string, ElementType> = {
  a: ProseLink,
  blockquote: ProseQuote,
  code: ProseCode,
  h1: ProseH1,
  h2: ProseH2,
  h3: ProseH3,
  h4: ProseH4,
  hr: ProseHr,
  img: ProseImage,
  li: ProseLi,
  ol: ProseOl,
  p: ProseP,
  pre: ProsePre,
  table: ProseTable,
  tbody: TableBody,
  td: TableCell,
  th: TableHead,
  thead: TableHeader,
  tr: TableRow,
  ul: ProseUl,
};
