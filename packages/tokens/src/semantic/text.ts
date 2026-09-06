// packages/tokens/src/semantic/text.ts
//
// Source: design-system doc §2.2/§2.3, designer guide §2.4.
// Dark mode note: Cream undergoes a full ROLE REVERSAL — it's the primary
// TEXT color in dark mode, not a background. Never use pure white as text.

import { primitives } from "../primitives/colors.ts";

export const textLight = {
  primary: primitives.ink[950], // #0E1117 — body copy
  secondary: "#4A4A4A",
  muted: "#8A8A8A", // placeholders, timestamps
  inverse: primitives.cream[50], // text on dark backgrounds (e.g. inside the navy sidebar)
  brand: primitives.sage[600], // brand-colored links
  accent: primitives.gold[700], // gold text — headings/labels in achievement contexts only
} as const;

export const textDark = {
  primary: primitives.cream[50], // #FAF8F4 — NOT white
  secondary: "#B8C0CC",
  muted: "#6B7685",
  inverse: primitives.ink[950],
  brand: primitives.sage[400], // #6A9E91
  accent: primitives.gold[300], // #E4CC8A — lighter, warmer on Ink
} as const;

export const navTextLight = primitives.cream[50];
export const navTextDark = primitives.cream[50]; // unchanged — cream reads correctly on both nav backgrounds
