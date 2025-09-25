// packages/tokens/src/semantic/colors.ts

import { primitives } from '../primitives/colors.ts';

export const brandColors = {
  green: {
    base: primitives.green[100], // #1A4A2E — base green for elements
    light: primitives.forest[500], // #2E6B5A — lighter, for chips/badges
    hover: primitives.forest[400], // #8EB69B — visibly lighter hover state
  },
  gold: {
    base: primitives.gold[100],
    light: primitives.gold[80],
    pale: primitives.gold[60],
    hover: primitives.gold[40],
    active: primitives.gold[20],
    glow: primitives.gold.glow,
  },
} as const;

export const statusColors = {
  success: primitives.success,
  error: primitives.error,
  warning: primitives.warning,
  info: primitives.info,
} as const;
