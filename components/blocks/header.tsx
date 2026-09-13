import { CaretLeftIcon } from "@aec-craft/ui/icons";
import { cn } from "@aec-craft/ui/lib/utils";
import { useRender } from "@base-ui/react/use-render";
import type { ReactNode } from "react";

export interface HeaderBack {
  href: string;
  label: string;
  /** A framework link in place of the plain anchor: `render={<Link href={href} />}`. */
  render?: useRender.ComponentProps<"a">["render"];
}

export interface HeaderProps {
  actions?: ReactNode;
  /** Where this page sits under: a caret and a muted link above the title. */
  back?: HeaderBack;
  /** Beside the title, for what the subject *is* (a state, an authority).
   *  `actions` is for what can be done to it. */
  badges?: ReactNode;
  className?: string;
  description?: ReactNode;
  title: ReactNode;
}

/**
 * Header: title + optional description, with optional right-side actions.
 * A shadcn-pattern block reusable across apps (page and section headers).
 */
export function Header({
  title,
  description,
  actions,
  back,
  badges,
  className,
}: HeaderProps) {
  return (
    <div className={cn("flex items-start justify-between gap-4", className)}>
      <div className="flex min-w-0 flex-col gap-1">
        {back ? <BackLink {...back} /> : null}
        <div className="flex items-center gap-2">
          <h2 className="font-semibold text-lg tracking-tight">{title}</h2>
          {badges}
        </div>
        {description ? (
          <p className="text-muted-foreground text-sm">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="flex shrink-0 gap-2">{actions}</div> : null}
    </div>
  );
}

function BackLink({ href, label, render }: HeaderBack) {
  return useRender({
    defaultTagName: "a",
    props: {
      children: (
        <>
          <CaretLeftIcon className="size-3" />
          {label}
        </>
      ),
      className:
        "-ml-1 flex w-fit items-center gap-0.5 text-muted-foreground text-xs hover:text-foreground hover:underline",
      href,
    },
    render,
    state: { slot: "header-back" },
  });
}
