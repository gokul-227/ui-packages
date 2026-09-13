"use client";

import {
  Panel,
  PanelSidebar,
  type PanelSidebarItem,
} from "@aec-craft/ui/components/blocks/panel";
import type { ComponentType, ReactNode } from "react";

export interface SidebarLayoutSection extends PanelSidebarItem {
  Component: ComponentType;
}

export interface SidebarLayoutProps {
  activeId: string;
  className?: string;
  /** Uppercase heading above the items. Omit when the sections carry groups. */
  groupLabel?: ReactNode;
  /** Top-bar content (avatar, switcher, close, …). Omit for no top bar. */
  header?: ReactNode;
  onSelect: (id: string) => void;
  sections: readonly SidebarLayoutSection[];
}

/**
 * The settings-style surface: the shared `Panel` frame with a `PanelSidebar`
 * down the left and the active section's content beside it. Visual only — wrap
 * it in a `Dialog` for modal behaviour, or drop it on a page as-is. The auth
 * /account page shares the same `Panel` frame but stacks all sections in a
 * single scrolling column instead of this layout.
 */
export function SidebarLayout({
  header,
  groupLabel,
  sections,
  activeId,
  onSelect,
  className,
}: SidebarLayoutProps) {
  const active = sections.find((s) => s.id === activeId) ?? sections[0];
  const ActiveComponent = active?.Component;

  return (
    <Panel className={className} header={header}>
      <div className="flex min-h-0 flex-1 flex-col sm:flex-row">
        <PanelSidebar
          activeId={active?.id ?? ""}
          header={
            groupLabel == null ? null : (
              <div className="px-2 pt-1 pb-1.5 font-medium text-[11px] text-muted-foreground uppercase tracking-wide">
                {groupLabel}
              </div>
            )
          }
          items={sections}
          onSelect={onSelect}
        />

        <div className="scroll-slim min-w-0 flex-1 overflow-y-auto p-5 sm:p-8">
          {ActiveComponent ? <ActiveComponent /> : null}
        </div>
      </div>
    </Panel>
  );
}
