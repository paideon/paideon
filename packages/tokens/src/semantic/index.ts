// packages/tokens/src/semantic/index.ts
//
// `semantic` is the LIGHT theme (the default). themes/dark.ts exports a
// second object with exactly the same shape.

import { surface, overlay } from './backgrounds.ts';
import { border } from './borders.ts';
import { brandColors, statusColors } from './colors.ts';
import { text, stateOpacity } from './text.ts';

export const semantic = {
  green: brandColors.green,
  gold: brandColors.gold,
  surface,
  text,
  border,
  semantic: statusColors,
  overlay,
  opacity: stateOpacity,
} as const;

/** Same shape as `semantic`, but with plain `string` leaves. */
type Widen<T> = T extends string ? string : { [K in keyof T]: Widen<T[K]> };

/**
 * The contract every theme must satisfy. A theme missing a key (or adding an
 * unknown one) fails to compile, so light and dark can never drift apart.
 */
export type Theme = Widen<typeof semantic>;

export {
  brandColors,
  statusColors,
  surface,
  overlay,
  border,
  text,
  stateOpacity,
};
