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
  0: { bg: primitives.forest[900], border: null },
  1: { bg: primitives.forest[800], border: primitives.forest[700] },
  2: { bg: primitives.forest[700], border: primitives.forest[600] },
  3: { bg: primitives.forest[700], border: primitives.forest[500] },
  4: { bg: primitives.forest[600], border: primitives.forest[500] },
} as const;
