// packages/tokens/src/semantic/backgrounds.ts
// LIGHT theme surfaces. The dark counterpart lives in themes/dark.ts and must
// keep exactly the same keys (enforced by the Theme type).

import { primitives, withAlpha } from '../primitives/colors.ts';

const f = primitives.forest;

export const surface = {
  base: f[50], // page floor
  default: f[100], // default tinted surface
  deep: f[200], // recessed / deep panel
  elevated: '#FFFFFF', // raised surfaces: cards, inputs, modals
  canopy: f[300], // pale mint accent surface
  glass: 'rgba(255, 255, 255, 0.55)',
  'glass-canopy': withAlpha(f[300], 0.45),
  'glass-subtle': 'rgba(255, 255, 255, 0.35)',
  'glass-medium': 'rgba(255, 255, 255, 0.55)',
  'glass-card': 'rgba(255, 255, 255, 0.7)',
  brand: primitives.green[800], // solid brand panel: pair with text.on-brand + gold.on-brand
  inverse: f[900], // dark surface for tooltips/banners (pair with text.inverse)
  hover: '#E8EEEA',
  active: f[200],
  disabled: f[100],
} as const;

export const overlay = {
  light: withAlpha(f[900], 0.2),
  medium: withAlpha(f[900], 0.45), // modal backdrops, image captions
  heavy: withAlpha(f[900], 0.72), // lightbox, full-screen takeovers
} as const;
