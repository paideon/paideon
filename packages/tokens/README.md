# `@paideon/tokens`

Design tokens are the single source of truth for every visual decision in
Paideon. This package transcribes `brand/design-system-&-visual-identity.md`
(v2.0) into code and exports raw primitives, theme-aware semantic mappings,
and generator functions that produce:

- CSS custom properties for `apps/portal` (light / dark / horizon)
- The Tailwind theme (consumed by a future `@paideon/config` preset)
- The `cn()` utility used by `@paideon/ui`
- A flat JSON token list for docs/dev tooling

Everything — color, typography, spacing, radius, shadow, motion — is defined
once here. If a value in a component doesn't trace back to a token in this
package, it shouldn't be there (see design-system doc §14 anti-patterns:
_"Using raw hex values in component code."_).

Architecture mirrors `@nexus/tokens`' primitives → semantic → themes →
generators structure, with one deliberate change — see
[Deviation from Nexus](#deviation-from-nexus) below.

---

## Structure

```
packages/tokens/
├── src/
│   ├── primitives/       # Raw values — the building blocks
│   │   ├── colors.ts       Ink / Navy / Sage / Cream / Gold / Danger families
│   │   ├── typography.ts   Cormorant / Inter / Ubuntu, full type scale
│   │   ├── spacing.ts      base-4 grid (space-1 … space-24)
│   │   ├── sizing.ts       icon sizes, sidebar/layout widths, touch targets
│   │   ├── radius.ts       sm/md/lg/xl/full (md=8px is the signature value)
│   │   ├── shadows.ts      light-mode elevation + focus rings
│   │   ├── motion.ts       durations, easings, achievement-reveal pattern
│   │   └── effects.ts      z-index scale, disabled opacity
│   ├── semantic/          # Purpose-bound, THEME-AWARE mappings
│   │   ├── backgrounds.ts  bg + nav backgrounds, light/dark/horizon
│   │   ├── text.ts         light/dark
│   │   ├── borders.ts      light/dark
│   │   ├── colors.ts       status states + achievement (gold reserve), light/dark
│   │   ├── elevation.ts    dark-mode ONLY — border-based elevation levels 0–4
│   │   └── index.ts        assembles lightTheme / darkTheme / horizonThemeOverrides
│   ├── themes/            # Real implementations (not stubs — see below)
│   │   ├── light.ts
│   │   ├── dark.ts
│   │   └── horizon.ts      partial overrides only; deferred per architecture-overview.md
│   ├── generators/         # Pure functions, no filesystem access
│   │   ├── css.ts          → :root + [data-theme="dark"] + [data-theme="horizon"]
│   │   ├── tailwind.ts     → Tailwind theme object (var()-indirected, see below)
│   │   ├── cn.ts           → source text for @paideon/ui's cn() utility
│   │   └── json.ts         → flat token list
│   └── index.ts
├── scripts/
│   ├── generate-css-vars.js   writes to apps/portal/src/app/tokens.css
│   └── generate-cn-groups.js  writes to packages/ui/src/utilities/cn.ts
└── package.json
```

---

## Deviation from Nexus

Nexus's `generators/tailwind.ts` spreads semantic color **values** (literal
hex/rgba) directly into the Tailwind theme — which means a Tailwind class
compiles one theme's color permanently into the output CSS. That's also why
`@nexus/tokens`' `themes/dark.ts` is still `throw new Error('not implemented
yet')`: flipping `[data-theme="dark"]` at runtime wouldn't change anything a
Tailwind-generated class already baked in.

Paideon's dark mode (and Horizon) are fully specified in the brand docs and
need to actually switch at runtime. So here, `colors` in `generators/
tailwind.ts` map to `var(--color-bg-base)` etc. — the **same variable names**
`generators/css.ts` writes into `:root` / `[data-theme="dark"]` /
`[data-theme="horizon"]`. One Tailwind class (`bg-bg-primary`) compiles once
and resolves to whichever theme block is active on the page. This means
`themes/light.ts` / `dark.ts` / `horizon.ts` here are real, working
implementations, not stubs.

---

## Known gaps (flagged, not silently guessed)

- **Dark-mode `primary-pressed`** isn't specified in design-system doc §2.3
  (only `primary-hover` is documented for dark). Left `undefined` rather than
  invented — `@paideon/ui`'s `Button` component should fall back to
  `primary-hover` for the pressed state in dark mode until this gets an
  explicit product decision.
- **Horizon theme** only has 4 documented token overrides (§11.2). Deferred
  to a future version per `architecture-overview.md` — the token layer is
  ready, but don't build Horizon-specific UI until product decides to ship it.

---

## Before this builds in the real repo

`config/typescript/tsconfig.base.json` does not currently set
`rewriteRelativeImportExtensions` (or `allowImportingTsExtensions`). This
package's source uses explicit `.ts` extensions in relative imports (matching
`@nexus/tokens`' convention, and required under `moduleResolution: "nodenext"`
for source-level imports across a monorepo boundary). Added the flag locally
in this package's `tsconfig.json` — consider promoting it to the shared base
config if other packages adopt the same import style.

`config/typescript/tsconfig.base.json`'s `paths` map also doesn't yet include
`@paideon/tokens` — needs adding alongside the existing `@paideon/types` /
`@paideon/database` / `@paideon/ui` entries.

---

## Usage

```ts
import { fontSize, spacing, lightTheme } from "@paideon/tokens";
```

### Generate CSS variables

```bash
pnpm --filter @paideon/tokens generate:css
```

Writes `tokens.css` to `apps/portal/src/app/`. Import it in the app's global
stylesheet.

### Generate the `cn()` utility

```bash
pnpm --filter @paideon/tokens generate:cn
```

Writes `packages/ui/src/utilities/cn.ts`. Requires `clsx` and `tailwind-merge`
as dependencies of `@paideon/ui` (not of this package — the generated file is
the only thing that imports them).

### Generate everything

```bash
pnpm --filter @paideon/tokens generate
```

---

## Adding or modifying tokens

1. **Edit primitives** — update raw values in `primitives/*.ts`. If a value
   doesn't come from the brand docs, don't add it here without a decision.
2. **Edit semantic mappings** — adjust `semantic/*.ts` for both light and
   dark if the change applies to both.
3. **Re-generate** — `pnpm --filter @paideon/tokens generate`.
4. **Commit** everything, including generated output.

---

_Sources: brand/brand-documentation.md, brand/design-system-&-visual-identity.md,
design/paideon-ui-designer-guide.md (Paideon Brand & Design System v2.0)._
