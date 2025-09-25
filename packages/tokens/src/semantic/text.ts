// packages/tokens/src/semantic/text.ts

import { primitives } from '../primitives/colors.ts';

export const text = {
  primary: primitives.forest[900], // #1C1A16 — warm ink, primary readable text
  muted: primitives.forest[700], // #3D5C52 — dark forest green, secondary/meta text
  subtle: primitives.forest[600], // #5C7A68 — mid forest green, tertiary/placeholder text
  inverse: primitives.forest[50], // #FBF9F2 — light parchment text for dark/inverse surfaces
  heading: primitives.forest[800], // #1F3B32 — deep forest, headings read richer/darker than body
  gold: primitives.gold[100], // #C9973A — accent text; base gold reads better on light bg than the old pale gold did on dark
} as const;

export const stateOpacity = {
  disabled: '0.5',
  loading: '0.6',
} as const;
