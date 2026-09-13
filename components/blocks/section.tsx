import { Header } from "@aec-craft/ui/components/blocks/header";
import { Spinner } from "@aec-craft/ui/components/custom/spinner";
import type { ReactNode } from "react";

export interface SectionProps {
  /** Right-aligned header actions (e.g. a "New project" button). */
  actions?: ReactNode;
  children: ReactNode;
  description?: ReactNode;
  title: ReactNode;
}

/**
 * The frame a settings/account section shares: a page header over its content.
 * A shadcn-pattern block so every settings-style surface (the platform-settings
 * modal, the auth /account page) renders sections identically.
 */
export function Section({
  title,
  description,
  actions,
  children,
}: SectionProps) {
  return (
    <div className="flex flex-col gap-5">
      <Header actions={actions} description={description} title={title} />
      {children}
    </div>
  );
}

/** The loading indicator for a section's content area, while its data loads. */
export function SectionLoading() {
  return (
    <div className="flex justify-center py-16">
      <Spinner className="size-6 text-muted-foreground" />
    </div>
  );
}
