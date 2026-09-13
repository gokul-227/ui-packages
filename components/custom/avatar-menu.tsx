"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@aec-craft/ui/components/primitives/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@aec-craft/ui/components/primitives/dropdown-menu";
import { initials } from "@aec-craft/ui/lib/format";
import { cn } from "@aec-craft/ui/lib/utils";
import type { ReactNode } from "react";

export interface AvatarMenuProps {
  /** Menu alignment relative to the avatar trigger. */
  align?: "start" | "end";
  /** Menu items below the name/email header. */
  children: ReactNode;
  /** Extra classes on the menu content. */
  className?: string;
  email?: string | null;
  name?: string | null;
  picture?: string | null;
  /** Extra classes on the trigger button (e.g. `pointer-events-auto`). */
  triggerClassName?: string;
}

/**
 * Avatar dropdown shell: an avatar-button trigger over a name/email header and a
 * caller-supplied item list. The shared chrome behind the app's account hub and
 * the settings account menu; each consumer composes its own items (scope
 * entries, sign-out, the settings modal) as children.
 */
export function AvatarMenu({
  name,
  email,
  picture,
  align = "end",
  triggerClassName,
  className,
  children,
}: AvatarMenuProps) {
  const displayName = name || email || "Account";
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            aria-label="Account"
            className={cn(
              "rounded-full outline-none ring-1 ring-foreground/10 transition-[box-shadow] hover:ring-foreground/20 focus-visible:ring-2 focus-visible:ring-ring",
              triggerClassName
            )}
            type="button"
          />
        }
      >
        <Avatar className="size-8">
          {picture ? <AvatarImage alt={displayName} src={picture} /> : null}
          <AvatarFallback className="text-xs">
            {initials(name, email)}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className={cn("w-60", className)}>
        <div className="flex flex-col px-2 py-1.5">
          <span className="font-medium text-sm">{displayName}</span>
          {email ? (
            <span className="text-muted-foreground text-xs">{email}</span>
          ) : null}
        </div>
        <DropdownMenuSeparator />
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
