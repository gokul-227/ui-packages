# Agent guide — @aec-craft/ui

Rules for modifying this package. Keep it lean: stock shadcn + one shared frost
material + accurate annotations. (Human overview lives in `README.md`.)

## Non-negotiables

1. **Annotate every divergence from stock.** Any component file that differs from
   its `.baseline/` stock MUST carry the header block (above `"use client"`):

   ```
   /**
    * @component <name> · stock: shadcn base-luma
    * @regen     pnpm ui:add <name>
    * @frost     surface | control | none — <mechanism>
    * @delta     + added   ~ changed   - removed
    */
   ```

   Files with no header are, by definition, untouched stock. The header IS the
   change log — there is no separate enforcement script.

2. **`.baseline/` is the diff anchor.** It holds the pristine stock of every
   primitive. When you add a stock primitive, copy it into `.baseline/` _before_
   customizing. `diff .baseline/<x>.tsx components/primitives/<x>.tsx` must equal
   exactly what the `@delta` claims.
   - Nothing imports `.baseline/`, so it adds **zero** to consumer bundle size
     (bundlers only trace reachable modules), and the `files` whitelist in
     `package.json` excludes it from the published tarball. Keep it out of
     `files`, or it ships as dead install weight.

3. **Frost is central — never hardcode it per component.** Blur/tint live in
   `styles/globals.css` (`--frost-blur`, `--frost-fill`, the `@utility frosted`).
   To make something glass, add the `frosted` class (or the control opt-in) — do
   not write bespoke `backdrop-blur`/`bg-*/NN` per file. Tune the look from the
   tokens only.

4. **No drop shadow on frosted surfaces.** Remove `shadow-*` when frosting; the
   `ring` hairline is the edge.

5. **Branding marks do not belong here.** Google/Microsoft/etc. live in the
   consuming app (e.g. `apps/auth/src/components/icons/`).

6. **Light mode is the tuned theme; dark mode is WIP.** Don't treat dark values
   as final.

7. **The documentation moves with the change.** Every component has a page and a
   preview in `aec-craft/docs` (`content/internal/design/design-system/…` and
   `apps/docs/src/components/previews/<layer>.tsx`), and a token has a row on the
   Colours page. A change to a component's props, variants or look is not
   finished until that page and preview say the same thing, in a pull request in
   that repository opened alongside this one and linked from this one's
   description. A new component gets a page and a line in its layer's
   `index.mdx`; a removed or renamed one is followed through every page that
   names it. The docs site typechecks against the published package, so
   co-develop against a `file:../ui` override there and land the docs PR with
   the catalog bump for the release.

## Adding a component

```sh
pnpm --filter @aec-craft/ui ui:add <name>   # base-luma style, phosphor icons
```

> ⚠️ **Never `shadcn add --overwrite`.** It overwrites dependency components
> (e.g. adding `alert-dialog` rewrote `dialog`/`button`) and silently wipes their
> frost + headers. Add without `--overwrite` (it skips existing files); if you
> must overwrite, re-apply frost + headers afterward and re-check `.baseline/`.

Then: snapshot to `.baseline/`, frost if applicable, write the header.

## Frosting patterns

- **Surface** (overlay/panel): replace the opaque `bg-popover`/`bg-card` with
  `frosted`, drop `shadow-*`, keep `ring`. Add a `surface` header.
- **Control** (opt-in): variant-less (`Input`, `Textarea`) take a `frosted?: boolean`
  prop that swaps the fill (`frosted ? "frosted" : "<stock bg>"`); cva-based
  (`Button`, `Badge`) get a `frosted` **variant**. Hover/active tints must use
  `color-mix(... var(--frost-fill) ...)`, NOT `bg-foreground/N` (which replaces
  the fill and exposes the saturated backdrop).
- **base-luma menus** (`dropdown-menu`, `select`, `context-menu`, `menubar`) ship
  a forced-`dark`, inverted-translucent treatment (`bg-popover/70` + a `::before`
  `backdrop-blur-2xl`). Convert to the shared material: drop the leading `dark`,
  replace the `bg-popover/70 before:…saturate-150` run with `frosted`, drop the
  `**:data-[variant=destructive]` accent overrides (dark-bg-only), drop `shadow-lg`.

## Verify

```sh
pnpm --filter @aec-craft/ui check   # tsc
pnpm --filter @aec-craft/ui lint
```

Then the docs pull request, per rule 7. Examples are **not** in this repository:
the react-cosmos gallery was retired once every component had a page on the docs
site, because two galleries are two sources of truth and they had already
drifted. A preview is an entry in `apps/docs/src/components/previews/<layer>.tsx`
referenced from the page with `<Preview of="..." />`. Two pull requests in two
repositories is the known cost, and the open question on the docs site's
*Previews* page.

Note: base-ui `*.GroupLabel` (menu/select labels) must sit inside a `*.Group`, or
it throws at runtime.
