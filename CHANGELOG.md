# @aec-craft/ui

## 0.8.0

### Minor Changes

- 84b9588: `DangerZone` is a `Card` like every other section on the page, and its one red
  button opens the `DestructiveDialog` itself: the block takes the action's label
  and `onConfirm` (plus the dialog's title, description and typed phrase where
  they differ) instead of an `action` slot each caller filled with its own
  dialog. The red border and red title are gone. `variant="tinted"` washes the
  whole card in the destructive tone, for a surface where a plain card does not
  read as the zone.
- 47f49a7: `DataTable` serves a page that renders on the server. `readTableQuery` and
  `writeTableQuery` in `lib/table-query` move a `TableQuery` in and out of
  `URLSearchParams`, owning only the table's column keys and `?sort=field:dir`,
  so a filtered view is a URL and the page reads it from `searchParams`. A
  `pager` prop renders First / Previous / Next for a list that hands back an
  opaque next-page token and no total, where `onLoadMore` could only append.
- 0d6a50b: Five status tones beside `--destructive`: `--warning`, `--caution`, `--success`,
  `--info` and `--discovery`, defined in both themes and exposed as Tailwind
  colours. `Badge` and `Alert` gain a variant per tone, each the tinted treatment
  `destructive` already has, so a surface that needs to say "this is fine" or
  "look at this" no longer reaches for a raw `emerald-500` class.
- 318020c: Three components every console rebuilt, moved here. `Header` takes a `back`
  link (a caret and a muted link above the title, with a `render` slot for a
  framework link) and a `badges` slot beside the title for what the subject is,
  as distinct from `actions` for what can be done to it. `CopyButton` is the
  ghost icon button that writes a string to the clipboard and shows a check for a
  moment. `DestructiveDialog` is the confirmation a destructive action opens
  first: a verb-named button, and an optional phrase that must be typed before
  it enables.

### Patch Changes

- e3e3220: A vertical `Field` stacks its label, control and description at `gap-2` rather
  than `gap-3`, so the label reads as belonging to the control beneath it. A
  horizontal field keeps `gap-3` between the control and its label, and a
  responsive one takes each gap with its own layout.

## 0.7.0

### Minor Changes

- 590fa91: Theme control as a component: `components/custom/theme-toggle` is three round chips
  in a pill, the current one filled, pairing with `ThemeProvider` and reading its state
  from `useThemeMode`.

  Three states rather than two, because "system" is a real preference that a light/dark
  toggle discards the first time anyone touches the control.

  It needed no new primitive. `ToggleGroup`'s default variant is already the ghost
  treatment and Base UI sets `aria-pressed`, so the difference between a toggle group
  and a pill is four overrides: no gap, a squared chip, `!` on the two classes
  `spacing={0}` switches to a segmented-bar look, and a neutralised hover. Hover is
  removed on purpose: one chip is always filled, so a hover fill means two look chosen
  at once.

  The change is wrapped in `document.startViewTransition`, which is the only reason a
  theme change can feel soft. Nothing about the control animates; the browser
  cross-fades the whole document, so every surface changes together. `flushSync` is
  required because the transition captures the frame synchronously. Where the API is
  missing the theme still changes, just instantly.

  The cosmos decorator now uses it instead of the two-state toggle it had hand-rolled.

## 0.6.0

### Minor Changes

- d973197: Long-form text as a block: `components/blocks/prose` ships one component per
  element a document can produce, plus the `prose` map from tag name to component.
  A consumer binds the map to its own renderer and writes no typography, so a
  change to how a document reads is a release here rather than an edit in every
  app that renders one.

## 0.5.0

### Minor Changes

- 8c2dda2: Theme switching is a hook and a provider, not a component.

  The tokens key off a `dark` class on an ancestor, so every app was reimplementing the same two lines of `next-themes` wiring and picking `attribute="class"` correctly by hand. `ThemeProvider` (`components/custom/theme-provider`) bakes that in and leaves the rest of next-themes' options alone; `attribute` is omitted from its props, because it is the design system's to set.

  `useThemeMode` (`hooks/use-theme-mode`) returns the state a switcher needs and nothing else: `mode` for a three-state control (toggle group, menu radio group), `isDark` for a two-state one (icon button, switch), plus `setMode` and `toggle`. No switcher component ships with it, because the state is two scalars and the control is whatever the surface already uses.

  Both are gated on `isMounted`. The class is written by a pre-hydration script the server never ran, so a control painted from `isDark` on the first render is a hydration mismatch; `mode` is `undefined` and `isDark` is `false` until mount.

  The gallery's own toggle now runs on the hook, and a `theme-mode` fixture shows the four control shapes side by side. Its decorator still opens on light, but through the shared provider, so `system` is now a selectable value there.

## 0.4.1

### Patch Changes

- f680e43: The toast reads dark mode from the `dark` class, not from `next-themes`.

  An app with no next-themes provider reports `"system"`, so sonner painted its internals from the operating system while every token in the sheet followed the class. The disagreement was invisible until it was not: sonner's dark rule sets the description to `#e8e8e8`, which on a light toast is white on white. The gallery never showed it, because its cosmos decorator mounts a `ThemeProvider` and the apps do not.

  The `Toaster` now watches the root element's class list, so the toast and the tokens switch together, and next-themes still works for an app that uses it, since it writes that same class.

  The description colour is marked, because sonner sets it through `[data-sonner-toast] [data-description]` and two attribute selectors outrank a class: without it the hex wins and the token is decoration.

  `position` defaults to `bottom-right`, so every app agrees without passing it.

## 0.4.0

### Minor Changes

- 56d14e1: The light theme's neutral fills stop being three percent off white.

  `--muted`, `--accent`, `--secondary` and `--sidebar-accent` move from `oklch(0.97)` to `oklch(0.945)`, and `--border` / `--input` from `0.922` to `0.91` so a hairline still reads as the step below a fill rather than level with it. Those four tokens are what a skeleton, an empty state's icon tile, a secondary button and every menu hover are painted with, and on a white card the old value was both bright and close to invisible.

  `--background` moves from pure white to `oklch(0.985)` while `--card` and `--popover` stay white, so a card reads as raised off the page instead of as the page with a border drawn on it.

  `Skeleton` moves onto the translucent scale, `bg-foreground/[0.08]` rather than `bg-muted`: a shape standing in for content has to read against whatever it sits on, and the fill token is the page's own grey.

  The dark theme is unchanged.

### Patch Changes

- 56d14e1: The toast takes its palette from the theme tokens, and looks like a surface.

  Its colour variables move from the toaster onto `toastOptions.style`, so they land on the toast element itself. Sonner decides light or dark from `next-themes` and writes its own palette onto each toast; an app whose dark mode is a `.dark` class rather than a next-themes provider always reads as `"system"` there, so the toast followed the operating system while every other surface followed the tokens. A variable set on the toast outranks the one it inherits from the toaster, so the tokens win either way.

  It also has a surface now: `rounded-3xl`, a shadow, a hairline ring, and typography for the title, description and buttons. The registry names a `cn-toast` class for this, which belongs to a class layer this repo does not vendor, so it was styling nothing at all.

## 0.3.2

### Patch Changes

- c86ed32: `PanelSidebar` items no longer flash white while pressed. The override covered `hover` and `data-active` but not the `:active` pseudo, and tailwind-merge keys on the variant prefix, so `active:bg-sidebar-accent` survived from the primitive and painted the opaque token for as long as the mouse was held. All four states now sit on the translucent scale, pressed one step darker than selected.

## 0.3.1

### Patch Changes

- b7b3409: `PanelSidebar` items hover and select on the translucent `foreground/[0.06–0.08]` scale, matching the ghost button, instead of the `sidebar-*` tokens.

  Those tokens are opaque and assume the shadcn shell's own `--sidebar` behind them — `--sidebar-accent` is `oklch(0.97)` against a `oklch(0.985)` sidebar, which reads as a faint grey there. A `Panel` is frosted and has no such backdrop, so the fill landed as a pale block and the rounded corners vanished into it.

  The group label follows, taking the design system's muted foreground at 11px uppercase rather than `text-sidebar-foreground`.

## 0.3.0

### Minor Changes

- 640e0bb: **Renamed:** `SidebarPanel` is now `SidebarLayout`, at `blocks/sidebar-layout`. It frames a page rather than being a sidebar, and `Sidebar` was taken — the shadcn sidebar primitive exports it with 23 siblings, so a block by that name would collide on the symbol wherever both are imported. `SidebarPanelProps` and `SidebarPanelSection` follow.

  **New:** `PanelSidebar` in `blocks/panel`, the nav column a `Panel` puts down its left side. Items take an optional `group` and a heading renders per consecutive run of them, so a surface that has outgrown a flat list gets structure without the caller assembling one. `SidebarLayout` is now this plus a content pane.

  It is built from the shadcn sidebar primitive's `SidebarGroup` / `SidebarGroupLabel` / `SidebarMenu` / `SidebarMenuButton`, so items carry the `sidebar-*` tokens and the active, hover, icon-sizing and truncation behaviour the design system already defines. It deliberately does not use that primitive's `Sidebar` shell, which is fixed to the viewport at `h-svh`, collapses offcanvas, renders a `Sheet` on mobile and persists open state to a cookie — an app shell, none of which a panel wants.

  **Primitive delta:** `useSidebar` returns a detached default (`expanded`, not mobile) instead of throwing when there is no `SidebarProvider`. `SidebarMenuButton` calls it unconditionally but only reads it to place a collapsed-state tooltip, so throwing made the one reusable part of that file unusable outside an app shell.

- 640e0bb: `DataTable` gains `isLoading`, so a table's initial load renders skeleton rows inside its own frame instead of being swapped out for a separate loading component. The toolbar and column headers stay mounted, which removes the layout jump between the loading and loaded states and keeps the search box from unmounting across a refetch boundary. It also suppresses the empty state, which would otherwise flash before the first rows arrive.

  This makes loading a prop alongside `empty` / `isEmpty`, so all three table states are owned by one component rather than split between a prop and a sibling. `skeletonRows` (default 5) sets the placeholder row count, and the table wrapper reports `aria-busy` while loading.

  `SectionLoading` is unchanged and still correct for form-shaped sections, which have no frame to preserve.

- 640e0bb: Ten new shadcn primitives, bringing `primitives/` level with the base-luma registry: `attachment`, `bubble`, `carousel`, `combobox`, `drawer`, `marker`, `message`, `message-scroller`, `native-select`, `toast`. The chat family (attachment/bubble/marker/message/message-scroller) is new to the registry. Five ship as pure stock, unchanged from their `.baseline/` anchor: `carousel`, `bubble`, `marker`, `message`, `message-scroller`.

  Frosted per the house patterns: `drawer`, `toast` and `attachment` become frosted surfaces (shadows dropped, the ring or border is the edge); `combobox` gets the base-luma menu conversion `select` already had (forced-`dark` inversion and the bespoke `::before` blur replaced by the shared `frosted` material); `native-select` becomes a control with an opt-in `frosted` prop plus the `border-foreground/20` hairline and calmer focus ring that `Input` uses. Frost reaches only the closed native-select control, since its option list is OS-rendered.

  Two registry defects are worked around. `shadcn add toast` is refused by a stale radix-era deprecation guard even though base-luma serves a real base-ui toast, so the file is vendored by hand and its `@regen` line records that `ui:add` will not reproduce it. Five components import an `IconPlaceholder` from an unresolvable shadcn-site path; each placeholder names its own phosphor icon, so the substitution is mechanical. `toast` coexists with `sonner`, which remains the toaster apps mount today.

  `direction` is deliberately not included (the repo is `rtl: false`), `spinner` stays superseded by the custom comet spinner, and the registry's `form` entry is an empty stub.

  New dependencies: `embla-carousel-react` (carousel) and `@shadcn/react` (message-scroller).

### Patch Changes

- 640e0bb: `FieldForm` drops the rule between rows. A field already reads as its own line from the label sitting beside it, so a divider under every one turned a two-field form into a table of nothing.

  `FieldRow` fixes its label column at every width instead of from the `sm:` breakpoint. The consumer is a settings modal, so the viewport says nothing about how much room the row actually has, and a breakpoint reading the wrong one is how a label-beside-input pair collapses into a stack.

- 640e0bb: `outline` and `ghost` hover on a translucent tint instead of the solid `muted` fill, on the same `foreground/[0.03–0.08]` scale the table rows and list items already use.

  Two things were wrong with the solid fill. On a frosted surface an opaque swatch reads heavier than anything around it, which is most visible on `AlertDialogCancel` (an `outline` button by default). And a `ghost` icon button inside a hovered table row filled with a grey _lighter_ than the row's own tint, so hovering the action button punched a pale hole in the row instead of darkening past it.

  Neither variant needs a `dark:` override for hover any more: `foreground` flips with the theme, where `muted` is a fixed grey that had to be respecified per theme.

## 0.2.0

### Minor Changes

- 206ab53: `DataTable` gains `isLoading`, so a table's initial load renders skeleton rows inside its own frame instead of being swapped out for a separate loading component. The toolbar and column headers stay mounted, which removes the layout jump between the loading and loaded states and keeps the search box from unmounting across a refetch boundary. It also suppresses the empty state, which would otherwise flash before the first rows arrive.

  This makes loading a prop alongside `empty` / `isEmpty`, so all three table states are owned by one component rather than split between a prop and a sibling. `skeletonRows` (default 5) sets the placeholder row count, and the table wrapper reports `aria-busy` while loading.

  `SectionLoading` is unchanged and still correct for form-shaped sections, which have no frame to preserve.

- 206ab53: Ten new shadcn primitives, bringing `primitives/` level with the base-luma registry: `attachment`, `bubble`, `carousel`, `combobox`, `drawer`, `marker`, `message`, `message-scroller`, `native-select`, `toast`. The chat family (attachment/bubble/marker/message/message-scroller) is new to the registry. Five ship as pure stock, unchanged from their `.baseline/` anchor: `carousel`, `bubble`, `marker`, `message`, `message-scroller`.

  Frosted per the house patterns: `drawer`, `toast` and `attachment` become frosted surfaces (shadows dropped, the ring or border is the edge); `combobox` gets the base-luma menu conversion `select` already had (forced-`dark` inversion and the bespoke `::before` blur replaced by the shared `frosted` material); `native-select` becomes a control with an opt-in `frosted` prop plus the `border-foreground/20` hairline and calmer focus ring that `Input` uses. Frost reaches only the closed native-select control, since its option list is OS-rendered.

  Two registry defects are worked around. `shadcn add toast` is refused by a stale radix-era deprecation guard even though base-luma serves a real base-ui toast, so the file is vendored by hand and its `@regen` line records that `ui:add` will not reproduce it. Five components import an `IconPlaceholder` from an unresolvable shadcn-site path; each placeholder names its own phosphor icon, so the substitution is mechanical. `toast` coexists with `sonner`, which remains the toaster apps mount today.

  `direction` is deliberately not included (the repo is `rtl: false`), `spinner` stays superseded by the custom comet spinner, and the registry's `form` entry is an empty stub.

  New dependencies: `embla-carousel-react` (carousel) and `@shadcn/react` (message-scroller).

## 0.1.0

### Minor Changes

- fe087aa: Version reset to 0.1.0. No external consumers (only aec-craft/platform and aec-craft/cbm-demo), so the design system starts from a clean baseline instead of carrying the 2.x history. Also removes `packages/settings`: the settings surface is retired here and now lives in `@aec-craft/platform-sdk`'s `./ui` entry (aec-craft/platform#94), so the design system repo is purely the API-blind design system again.
