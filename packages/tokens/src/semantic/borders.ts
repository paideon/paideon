// packages/tokens/src/semantic/borders.ts

import { primitives } from '../primitives/colors.ts';

export const border = {
  default: primitives.border.default, // rgba(28,26,22,0.10) — barely-there ink line
  light: primitives.border.light, // rgba(28,26,22,0.06) — ghost border
  strong: 'rgba(28,26,22,0.18)', // visible border
  highlight: 'rgba(255,255,255,0.6)', // top/left edge highlight on glass — needs to be whiter than the surface now, not the old dark-mode mint tint
  'glass-border': 'rgba(28,26,22,0.08)',
  'glass-border-highlight': 'rgba(255,255,255,0.5)',
} as const;
