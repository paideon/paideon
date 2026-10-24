// packages/tokens/src/semantic/elevation.ts
//
// Dark-mode elevation: depth comes from lighter surface tones plus an explicit
// border, never from shadows (shadows are invisible on dark surfaces).
// There is no light-mode equivalent; light mode uses primitives/shadows.ts.
//
// Do not skip a level. Each step up = one lighter surface + one lighter border.

import { primitives, withAlpha } from '../primitives/colors.ts';

const { night, mist } = primitives;

export const elevationDark = {
  0: { bg: night[900], border: null },
  1: { bg: night[850], border: withAlpha(mist[300], 0.14) },
  2: { bg: night[800], border: withAlpha(mist[300], 0.24) },
  3: { bg: night[750], border: withAlpha(mist[300], 0.34) },
  4: { bg: night[700], border: withAlpha(mist[300], 0.42) },
} as const;
