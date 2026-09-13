"use client";

import { CreateDialog } from "@aec-craft/ui/components/blocks/create-dialog";
import { ActiveTag } from "@aec-craft/ui/components/custom/active-tag";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@aec-craft/ui/components/primitives/dropdown-menu";
import {
  BuildingsIcon,
  CaretDownIcon,
  CaretRightIcon,
  CubeIcon,
  PlusIcon,
} from "@aec-craft/ui/icons";
import { titleCase } from "@aec-craft/ui/lib/format";
import type { IconComponent } from "@aec-craft/ui/lib/icon";
import { cn } from "@aec-craft/ui/lib/utils";
import { type ReactNode, useState } from "react";

/**
 * Presentational org ▸ project breadcrumb switcher. Holds no data and no
 * navigation: callers pass already-fetched items + handlers, so the same chrome
 * serves both the Platform App shell (navigates by slug) and platform-settings
 * (navigates by id, with extra scope items injected via `column.leading`). The
 * active item is marked here; everything else is caller-driven.
 *
 * A column may also carry a `create` config: when the caller can create in that
 * scope, a "+ New …" item is pinned at the TOP of the dropdown (so it stays
 * reachable no matter how long the list scrolls) and opens a CreateDialog.
 */

export interface ScopeItem {
  id: string;
  name: string;
  slug?: string;
}

export interface ScopeCreate {
  /** Permission gate — the create item only renders when true. */
  canCreate: boolean;
  /** Entity noun; derives the menu item ("New …"), the dialog title
   *  ("Create …"), and the name field label ("… name"). e.g. "organization". */
  entity: string;
  /** Consumer-injected extra fields rendered below Name in the dialog. */
  extraFields?: ReactNode;
  /** Create + (typically) navigate; reject to surface an error in the dialog. */
  onCreate: (input: { name: string }) => Promise<unknown>;
}

export interface ScopeColumn<T extends ScopeItem = ScopeItem> {
  /** Marks the in-context item with an "Active" pill. */
  activeId?: string | null;
  /** Pins a "+ New …" item at the top of the menu (gated by `canCreate`). */
  create?: ScopeCreate;
  // State
  disabled?: boolean;
  emptyText?: string;
  icon?: IconComponent;
  isLoading?: boolean;
  // Data
  items: readonly T[];
  // Display
  /** Text shown on the trigger chip (the caller computes loading/fallback). */
  label: string;
  // Slots
  /** Rendered above the item group — e.g. an "Organization settings" entry. */
  leading?: ReactNode;
  /** Header above the item list inside the menu. */
  menuLabel: string;
  // Handlers
  onSelect: (item: T) => void;
}

const chip =
  "flex min-w-0 items-center gap-2 rounded-2xl px-2.5 py-1.5 transition-colors hover:bg-foreground/[0.06]";

function ScopeMenuChip<T extends ScopeItem>({
  label,
  menuLabel,
  items,
  activeId,
  onSelect,
  icon: Icon = CubeIcon,
  disabled,
  isLoading,
  emptyText = "Nothing here yet.",
  leading,
  create,
}: ScopeColumn<T>) {
  const [createOpen, setCreateOpen] = useState(false);
  const showCreate = !!create?.canCreate;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={<button className={chip} disabled={disabled} type="button" />}
        >
          <Icon className="size-4 shrink-0 text-muted-foreground" />
          <span className="truncate font-medium text-sm">{label}</span>
          <CaretDownIcon className="size-3.5 shrink-0 text-muted-foreground" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-64">
          {showCreate ? (
            <>
              <DropdownMenuItem onClick={() => setCreateOpen(true)}>
                <PlusIcon className="size-4" />
                <span className="truncate">New {create!.entity}</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          ) : null}
          {leading}
          <DropdownMenuGroup>
            <DropdownMenuLabel>{menuLabel}</DropdownMenuLabel>
            {items.map((item) => (
              <DropdownMenuItem key={item.id} onClick={() => onSelect(item)}>
                <Icon className="size-4" />
                <span className="truncate">{item.name}</span>
                {item.id === activeId ? <ActiveTag /> : null}
              </DropdownMenuItem>
            ))}
            {isLoading ? (
              <div className="px-2 py-1.5 text-muted-foreground text-xs">
                Loading…
              </div>
            ) : items.length === 0 ? (
              <div className="px-2 py-1.5 text-muted-foreground text-xs">
                {emptyText}
              </div>
            ) : null}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {showCreate ? (
        <CreateDialog
          extraFields={create!.extraFields}
          nameLabel={`${titleCase(create!.entity)} name`}
          onCreate={create!.onCreate}
          onOpenChange={setCreateOpen}
          open={createOpen}
          title={`Create ${create!.entity}`}
        />
      ) : null}
    </>
  );
}

export function ScopeSwitcher<O extends ScopeItem, P extends ScopeItem>({
  org,
  project,
  className,
}: {
  org: ScopeColumn<O>;
  /** Omit (or pass null) to render the org chip alone — e.g. account scope. */
  project?: ScopeColumn<P> | null;
  className?: string;
}) {
  return (
    <div className={cn("flex min-w-0 items-center gap-1", className)}>
      <ScopeMenuChip icon={BuildingsIcon} {...org} />
      {project ? (
        <>
          <CaretRightIcon className="size-3.5 shrink-0 text-muted-foreground/50" />
          <ScopeMenuChip icon={CubeIcon} {...project} />
        </>
      ) : null}
    </div>
  );
}
