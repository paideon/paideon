// packages/tokens/src/semantic/backgrounds.ts
//
// Source: design-system doc §2.2 (light) / §2.3 (dark).

import { primitives } from "../primitives/colors.ts";

export const backgroundsLight = {
  base: primitives.cream[50], // #FAF8F4 — page background. NEVER pure white (anti-pattern).
  elevated: primitives.pure.white, // #FFFFFF — cards, modals
  inset: primitives.cream[100], // #F0EDE6 — code blocks, inset panels
  overlay: "rgba(14,17,23,0.4)", // modal backdrops

  primary: primitives.sage[500], // primary buttons, active nav
  "primary-hover": primitives.sage[600],
  "primary-pressed": primitives.sage[700],
  secondary: primitives.cream[200], // secondary buttons
  "secondary-hover": primitives.cream[100],
} as const;

export const backgroundsDark = {
  base: primitives.ink[950], // #0E1117
  elevated: primitives.ink[900], // #161B22 — cards, modals
  inset: primitives.ink[800], // #1E2630 — code blocks
  overlay: "rgba(0,0,0,0.6)",

  primary: primitives.sage[500], // unchanged
  "primary-hover": primitives.sage[400],
  // TODO(product decision): dark-mode primary-pressed isn't specified in
  // design-system doc §2.3 (only primary-hover is given). Left unset here
  // rather than guessed — @paideon/ui's Button component should fall back
  // to `primary-hover` for the pressed state on dark until this is decided.
  secondary: primitives.ink[800],
  "secondary-hover": primitives.ink[700],
} as const;

// Horizon theme — student-selectable skin for primary-level users
// (design-system doc §11.2). Only these values are documented; everything
// else inherits from backgroundsLight until Horizon is fully specified.
export const backgroundsHorizonOverrides = {
  primary: "#4B0082", // plum purple
  base: "#FFF8F5", // peach-tinted cream
} as const;

export const navBackgroundLight = primitives.navy[900]; // #001F3F — sidebar (light mode ONLY)
export const navBackgroundDark = primitives.ink[900]; // #161B22 — Ink replaces Navy in dark mode
export const navBackgroundHorizon = "#4B0082"; // plum purple, per §11.2
