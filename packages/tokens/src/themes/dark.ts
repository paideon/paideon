// packages/tokens/src/themes/dark.ts
//
// DARK theme. Same keys as the light theme (enforced by `Theme`).
//
// Rules that shaped these values:
//  - Depth comes from lighter surfaces + visible borders, not shadows.
//  - `text.inverse` FLIPS to dark: it is the text colour for filled
//    brand/status/inverse surfaces, and those fills are light in dark mode.
//    (Text on photos uses `text.on-overlay`, which never flips.)
//  - Brand/status/gold colours move to their light steps so they stay legible
//    as text on dark surfaces.
//  - Overlays stay dark: backdrops must dim the page in both themes.

import { primitives, withAlpha } from '../primitives/colors.ts';
import type { Theme } from '../semantic/index.ts';

const { night, mist, green, gold } = primitives;

const status = (hue: { 300: string }) => ({
  base: hue[300],
  surface: withAlpha(hue[300], 0.16),
});

export const darkTheme: Theme = {
  green: {
    base: green[400],
    light: green[900],
    hover: green[300],
  },
  gold: {
    base: gold[300],
    light: gold[400],
    pale: gold[900],
    hover: gold[200],
    active: gold[100],
    'on-brand': gold[300],
    glow: 'rgba(226, 180, 87, 0.3)',
  },
  surface: {
    base: night[900],
    default: night[850],
    deep: night[950],
    elevated: night[800],
    canopy: night.canopy,
    glass: withAlpha(night[800], 0.6),
    'glass-canopy': withAlpha(night.canopy, 0.5),
    'glass-subtle': withAlpha(night[800], 0.35),
    'glass-medium': withAlpha(night[800], 0.6),
    'glass-card': withAlpha(night[800], 0.75),
    brand: green[900],
    inverse: mist[200], // light plate: tooltips/banners invert against the dark page
    hover: night[750],
    active: night[700],
    disabled: night[850],
  },
  text: {
    primary: mist[200],
    muted: mist[400],
    subtle: mist[500],
    inverse: night[900],
    heading: mist[100],
    gold: gold[300],
    'on-brand': mist[50],
    'on-overlay': mist[50],
  },
  border: {
    default: withAlpha(mist[300], 0.42),
    light: withAlpha(mist[300], 0.14),
    strong: withAlpha(mist[300], 0.6),
    highlight: 'rgba(255, 255, 255, 0.12)',
    'glass-border': withAlpha(mist[300], 0.14),
    'glass-border-highlight': 'rgba(255, 255, 255, 0.18)',
  },
  semantic: {
    success: status(primitives.success),
    error: status(primitives.error),
    warning: status(primitives.warning),
    info: status(primitives.info),
  },
  overlay: {
    light: 'rgba(0, 0, 0, 0.45)',
    medium: 'rgba(0, 0, 0, 0.62)',
    heavy: 'rgba(0, 0, 0, 0.82)',
  },
  opacity: {
    disabled: '0.5',
    loading: '0.6',
  },
};
