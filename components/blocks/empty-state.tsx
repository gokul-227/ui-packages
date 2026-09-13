import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@aec-craft/ui/components/primitives/empty";
import type { IconComponent } from "@aec-craft/ui/lib/icon";
import { cn } from "@aec-craft/ui/lib/utils";
import type { ReactNode } from "react";

/**
 * Bordered empty-state box: an icon (optional), a title, a description, and an
 * optional action. The general shape behind both "couldn't load" errors and
 * "coming soon" placeholders — pick `dashed` for the placeholder feel,
 * `outline` (default) for a solid hairline. A shadcn-pattern block on top of
 * the `Empty` primitive, reusable across apps.
 */
export interface EmptyStateProps {
  /** Optional footer (e.g. a button). */
  action?: ReactNode;
  className?: string;
  description?: ReactNode;
  /** Leading icon, rendered in the `Empty` icon medium. */
  icon?: IconComponent;
  title: ReactNode;
  variant?: "outline" | "dashed";
}

const VARIANT = {
  outline: "border border-foreground/10",
  dashed: "border border-dashed border-foreground/15",
} as const;

export function EmptyState({
  title,
  description,
  icon: Icon,
  variant = "outline",
  action,
  className,
}: EmptyStateProps) {
  return (
    <Empty className={cn("rounded-xl", VARIANT[variant], className)}>
      <EmptyHeader>
        {Icon ? (
          <EmptyMedia variant="icon">
            <Icon />
          </EmptyMedia>
        ) : null}
        <EmptyTitle>{title}</EmptyTitle>
        {description ? (
          <EmptyDescription>{description}</EmptyDescription>
        ) : null}
      </EmptyHeader>
      {action ? <EmptyContent>{action}</EmptyContent> : null}
    </Empty>
  );
}
