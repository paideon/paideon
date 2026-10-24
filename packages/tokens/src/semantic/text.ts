// packages/tokens/src/semantic/text.ts
// LIGHT theme text. Every value is AA (>= 4.5:1) on all light surfaces.

import { primitives } from '../primitives/colors.ts';

export const text = {
  primary: primitives.forest[900], // ink
  muted: primitives.forest[700], // secondary text
  subtle: primitives.forest[600], // tertiary text / placeholders
  inverse: primitives.forest[50], // text ON green.base / gold.base / status fills / surface.inverse
  heading: primitives.forest[800], // headings, deep forest
  gold: primitives.gold[700], // accent text (bronze; AA on light surfaces)
  // Text on a solid brand panel (surface.brand). Light in both themes.
  'on-brand': primitives.mist[50],
  // Text that sits on photos behind an overlay. The overlay stays dark in both
  // themes, so this stays light in both themes (unlike `inverse`, which flips).
  'on-overlay': primitives.mist[50],
} as const;

export const stateOpacity = {
  disabled: '0.5',
  loading: '0.6',
} as const;
