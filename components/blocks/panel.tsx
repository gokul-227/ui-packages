"use client";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@aec-craft/ui/components/primitives/sidebar";
import type { IconComponent } from "@aec-craft/ui/lib/icon";
import { cn } from "@aec-craft/ui/lib/utils";
import type { ReactNode } from "react";

export interface PanelProps {
  children: ReactNode;
  className?: string;
  /** Top-bar content (back link, switcher, account menu, close, …). Omit for no top bar. */
  header?: ReactNode;
}

/**
 * The frosted surface frame shared by the settings `SidebarLayout` (sidebar + content)
 * and the auth `/account` page (single scrolling column): a tall frosted panel
 * with an optional bordered top bar. Visual only — wrap it in a `Dialog` for
 * modal behaviour, or drop it on a page as-is. Override the default width via
 * `className` (e.g. a narrower `w-[min(640px,…)]` for the single-column case).
 */
export function Panel({ header, className, children }: PanelProps) {
  return (
    <div
      className={cn(
        "frosted flex h-[min(760px,calc(100dvh-2rem))] w-[min(1040px,calc(100vw-2rem))] max-w-none flex-col overflow-hidden rounded-4xl text-foreground ring-1 ring-foreground/5 dark:ring-foreground/10",
        className
      )}
    >
      {header == null ? null : (
        <div className="flex flex-shrink-0 items-center justify-between gap-3 border-foreground/10 border-b px-3 py-2.5">
          {header}
        </div>
      )}
      {children}
    </div>
  );
}

export interface PanelSidebarItem {
  /** Heading this item sits under. Ungrouped items render before the first. */
  group?: string;
  icon: IconComponent;
  id: string;
  label: string;
}

/**
 * The nav column inside a `Panel`: grouped items, one selected.
 *
 * Composed from the shadcn sidebar primitive's parts, but not its `Sidebar`
 * shell, which is fixed to the viewport, collapses offcanvas, renders a `Sheet`
 * on mobile and persists open state to a cookie.
 */
export function PanelSidebar({
  items,
  activeId,
  onSelect,
  header,
  className,
}: {
  activeId: string;
  className?: string;
  /** Rendered above the items, inside the scroll area. */
  header?: ReactNode;
  items: readonly PanelSidebarItem[];
  onSelect: (id: string) => void;
}) {
  return (
    <nav
      className={cn(
        "scroll-slim flex flex-shrink-0 flex-col overflow-y-auto border-foreground/10 border-b p-3 sm:w-56 sm:border-r sm:border-b-0",
        className
      )}
    >
      {header}
      {runs(items).map(([heading, group]) => (
        <SidebarGroup
          className="p-0 sm:mt-5 sm:first:mt-0"
          key={heading ?? " "}
        >
          {heading == null ? null : (
            <SidebarGroupLabel className="h-auto px-3 pt-1 pb-1.5 text-[11px] text-muted-foreground uppercase tracking-wide">
              {heading}
            </SidebarGroupLabel>
          )}
          <SidebarMenu className="flex-row flex-wrap gap-1 sm:flex-col">
            {group.map((item) => {
              const Icon = item.icon;
              return (
                <SidebarMenuItem className="w-auto sm:w-full" key={item.id}>
                  <SidebarMenuButton
                    className="rounded-2xl text-[13px] hover:bg-foreground/[0.06] hover:text-foreground active:bg-foreground/[0.10] active:text-foreground data-active:bg-foreground/[0.08] data-active:font-medium data-active:text-foreground data-open:hover:bg-foreground/[0.06] data-open:hover:text-foreground"
                    isActive={item.id === activeId}
                    onClick={() => onSelect(item.id)}
                  >
                    <Icon />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      ))}
    </nav>
  );
}

type NavRun = [string | undefined, PanelSidebarItem[]];

function runs(items: readonly PanelSidebarItem[]): NavRun[] {
  const out: NavRun[] = [];
  for (const item of items) {
    const last = out.at(-1);
    if (last && last[0] === item.group) {
      last[1].push(item);
    } else {
      out.push([item.group, [item]]);
    }
  }
  return out;
}
