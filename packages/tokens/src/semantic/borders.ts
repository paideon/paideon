// packages/tokens/src/semantic/borders.ts
// LIGHT theme borders. `default` and `strong` are tuned to >= 3:1 against the
// surfaces they sit on (WCAG 1.4.11, non-text contrast) because form inputs
// rely on them. `light` is the quiet hairline for cards.

import { primitives, withAlpha } from '../primitives/colors.ts';

const ink = primitives.forest[900];

export const border = {
  default: withAlpha(ink, 0.5), // inputs, checkboxes, dividers
  light: withAlpha(ink, 0.12), // card hairline
  strong: withAlpha(ink, 0.64),
  highlight: 'rgba(255, 255, 255, 0.6)', // top/left edge highlight on glass
  'glass-border': withAlpha(ink, 0.1),
  'glass-border-highlight': 'rgba(255, 255, 255, 0.5)',
} as const;
