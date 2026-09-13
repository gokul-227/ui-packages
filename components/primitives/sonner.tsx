/**
 * @component sonner · stock: shadcn base-luma
 * @regen     pnpm ui:add sonner
 * @frost     none
 * @delta     + re-export `toast` from sonner, so apps call the toast fn through the
 *              design system instead of depending on the raw `sonner` package
 *            ~ the palette vars move from the toaster to `toastOptions.style`, so
 *              they land on the toast element itself
 *            ~ the theme comes from the `dark` class rather than from next-themes,
 *              which is the signal the design tokens switch on
 *            ~ position defaults to bottom-right for every app
 *            + surface + typography classes: the registry names `cn-toast`, which
 *              belongs to a class layer this repo does not vendor, so it styled
 *              nothing
 */
"use client";

import {
  CheckCircleIcon,
  InfoIcon,
  SpinnerIcon,
  WarningIcon,
  XCircleIcon,
} from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { Toaster as Sonner, type ToasterProps } from "sonner";

/**
 * Whether this document is in dark mode, read from the `dark` class on the root
 * element and watched for changes.
 *
 * Not `next-themes`: an app that has no provider reports `"system"` from it, and
 * sonner then paints its internals from the operating system while every token in
 * the sheet follows the class. That disagreement is invisible until it is not —
 * sonner's dark rule sets the description to `#e8e8e8`, which on a light toast is
 * white on white. next-themes writes this same class, so an app that does use it
 * is covered by reading the class instead.
 */
function useIsDarkDocument(): boolean {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const read = () => setIsDark(root.classList.contains("dark"));
    read();
    const observer = new MutationObserver(read);
    observer.observe(root, { attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  return isDark;
}

const Toaster = ({ position = "bottom-right", ...props }: ToasterProps) => {
  const isDark = useIsDarkDocument();

  return (
    <Sonner
      className="toaster group"
      icons={{
        success: <CheckCircleIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <WarningIcon className="size-4" />,
        error: <XCircleIcon className="size-4" />,
        loading: <SpinnerIcon className="size-4 animate-spin" />,
      }}
      position={position}
      theme={isDark ? "dark" : "light"}
      toastOptions={{
        classNames: {
          actionButton: "font-medium",
          cancelButton: "text-muted-foreground",
          // Marked, because sonner colours the description through
          // `[data-sonner-toast] [data-description]` and two attribute selectors
          // outrank a class: without it the hex wins and the token is decoration.
          description: "text-muted-foreground!",
          title: "font-medium",
          toast:
            "gap-2.5 rounded-3xl p-4 text-sm shadow-black/5 shadow-xl ring-1 ring-foreground/10",
        },
        /**
         * On the toast, not on the toaster. Sonner decides light or dark from
         * `next-themes` and writes its own palette onto each toast element; an
         * app whose theme is a `.dark` class and not a next-themes provider
         * always reads as "system" there, so its guess followed the OS while
         * every other surface followed the tokens. Vars set on the toast itself
         * outrank the ones it inherits, so the tokens win either way.
         */
        style: {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border":
            "color-mix(in oklab, var(--foreground) 10%, transparent)",
          "--border-radius": "var(--radius-3xl)",
        } as React.CSSProperties,
      }}
      {...props}
    />
  );
};

export { toast } from "sonner";
export { Toaster };
