// packages/tokens/src/semantic/borders.ts
//
// Source: design-system doc §2.2/§2.3.
// Dark mode note: borders are the PRIMARY elevation mechanism in dark mode
// (shadows are invisible on dark surfaces). See semantic/elevation.ts for
// the full level-by-level surface+border map used by cards/modals/dropdowns.

import { primitives } from "../primitives/colors.ts";

export const bordersLight = {
  subtle: primitives.cream[200], // #E8E4DC — dividers, table lines
  default: "#D4CFC8", // card borders, input borders
  strong: "#A0998E", // emphasized separators
  brand: primitives.sage[500], // focus rings, active borders
} as const;

export const bordersDark = {
  subtle: primitives.ink[700], // #2A3441 — dividers
  default: primitives.ink[600], // #3B4758 — card borders — this is the load-bearing token in dark mode
  strong: "#4A5568", // emphasized separators
  brand: primitives.sage[500], // unchanged
} as const;

export const navHoverLight = "rgba(255,255,255,0.08)";
export const navHoverDark = "rgba(255,255,255,0.06)"; // slightly dimmer to prevent over-brightness on Ink
