// packages/tokens/src/semantic/elevation.ts
//
// Source: design-system doc §5.2 "Elevation usage map", designer guide §2.2
// (Ink) and §4.2 (Dark Mode Design Rules).
//
// This has no light-mode equivalent — light mode elevation is handled by
// primitives/shadows.ts (boxShadow.sm/md/lg/xl) directly. Dark mode has NO
// shadow-based elevation; shadows are invisible against dark surfaces. Depth
// is created entirely through layered surface tones + explicit borders.
// "Cards need an explicit border: 1px solid #3B4758. Without it they are
// invisible." — designer guide §4.2
//
// Do not skip a level. Each step up = one lighter Ink tone + one lighter
// border, never a shadow.

import { primitives } from "../primitives/colors.ts";

export const elevationDark = {
  0: { bg: primitives.ink[950], border: null }, // page base, table rows
  1: { bg: primitives.ink[900], border: primitives.ink[700] }, // inline cards, standard cards
  2: { bg: primitives.ink[800], border: primitives.ink[700] }, // floating dropdowns
  3: { bg: primitives.ink[800], border: primitives.ink[600] }, // modals, side drawers
  4: { bg: primitives.ink[700], border: primitives.ink[600] }, // command palette, critical overlays
} as const;
