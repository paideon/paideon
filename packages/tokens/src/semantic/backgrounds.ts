// packages/tokens/src/semantic/backgrounds.ts

import { primitives } from '../primitives/colors.ts';

export const surface = {
  base: primitives.forest[50], // #FBF9F2 — parchment page floor
  default: primitives.forest[100], // #F5EFE0 — default card surface, faint cream tint
  deep: primitives.forest[200], // #EDE6D0 — deep/recessed panel
  elevated: '#FFFFFF', // pure white — raised surface (modals, popovers), pops off parchment
  canopy: primitives.forest[300], // #DCEADE — pale leaf-mint accent surface ("forest glass")
  glass: 'rgba(255,255,255,0.55)',
  'glass-canopy': 'rgba(220,234,222,0.45)',
  'glass-subtle': 'rgba(255,255,255,0.35)',
  'glass-medium': 'rgba(255,255,255,0.55)',
  'glass-card': 'rgba(255,255,255,0.70)',
  inverse: primitives.forest[900], // #1C1A16 — dark surface for chips/badges on a light bg
  hover: '#F0E9D8', // between default and deep — subtle tint lift on hover
  active: primitives.forest[200], // #EDE6D0 — pressed/active, same as deep (mirrors old active=deep pattern)
  disabled: primitives.forest[100], // #F5EFE0 — disabled = default surface
} as const;

export const overlay = primitives.overlay;
