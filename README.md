# @aec-craft/ui

The buildOS design system: shadcn (base-ui) primitives, blocks, custom
components, branding, and the frost material. Published to GitHub Packages
under the `@aec-craft` scope via changesets (see
`.github/workflows/release.yml`).

This repo is the **API-blind design system** — pure UI, no platform coupling.
Connected surfaces that call platform APIs (settings, upload widgets, ...) live
in `@aec-craft/platform-sdk`'s `./ui` entry, not here.

## Working on it

```sh
pnpm install
pnpm lint           # ultracite (biome)
```

Releases: add a changeset (`pnpm changeset`) in your PR; merging to main
opens/updates the Version Packages PR; merging that publishes.

## Consuming

Ships raw TS/TSX (no build step). In a consumer:

- add `@aec-craft/ui` to `transpilePackages` (Next.js),
- `@import "@aec-craft/ui/globals.css"`,
- point a Tailwind `@source` glob at `node_modules/@aec-craft/ui/components`.

Export map: `./components/{primitives,blocks,custom,branding}/*`, `./lib/*`,
`./hooks/*`, `./globals.css`, `./fonts`, `./icons`.