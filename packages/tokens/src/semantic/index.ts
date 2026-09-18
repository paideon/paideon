// packages/tokens/src/semantic/index.ts

import { surface, overlay } from "./backgrounds.ts";
import { border } from "./borders.ts";
import { brandColors, statusColors } from "./colors.ts";
import { text, stateOpacity } from "./text.ts";

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

export {
  brandColors,
  statusColors,
  surface,
  overlay,
  border,
  text,
  stateOpacity,
};
