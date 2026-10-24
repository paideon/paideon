// packages/tokens/src/semantic/colors.ts
// LIGHT theme brand + status colours.

import { primitives, withAlpha } from '../primitives/colors.ts';

const { green, gold } = primitives;

export const brandColors = {
  green: {
    base: green[700], // primary fills; white-ish text on it is AAA
    light: green[100], // chip / badge tint
    hover: green[600], // hover fill (still carries inverse text)
  },
  gold: {
    base: gold[600], // accent text / borders / focus ring (AA on light surfaces)
    light: gold[400], // vivid, DECORATIVE only (never text)
    pale: gold[50], // tint behind gold.active text
    hover: gold[700],
    active: gold[800],
    // Vivid gold for crests/eyebrows/icons on surface.brand. Never on light surfaces.
    'on-brand': gold[300],
    glow: 'rgba(201, 151, 58, 0.32)',
  },
} as const;

const status = (hue: { 700: string }) => ({
  base: hue[700],
  surface: withAlpha(hue[700], 0.12),
});

export const statusColors = {
  success: status(primitives.success),
  error: status(primitives.error),
  warning: status(primitives.warning),
  info: status(primitives.info),
} as const;
