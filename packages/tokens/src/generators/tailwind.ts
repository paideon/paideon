// packages/tokens/src/generators/tailwind.ts

import {
  backgroundImage,
  aspectRatio,
  blur,
  zIndex,
  opacity as opacityScale,
  scale,
} from "../primitives/effects.ts";
import {
  transitionDuration,
  transitionTimingFunction,
} from "../primitives/motion.ts";
import { borderRadius } from "../primitives/radius.ts";
import { boxShadow } from "../primitives/shadows.ts";
import { sizing, borderWidth, maxWidth } from "../primitives/sizing.ts";
import { spacing } from "../primitives/spacing.ts";
import {
  fontFamily,
  fontSize,
  lineHeight,
  letterSpacing,
} from "../primitives/typography.ts";
import { semantic } from "../semantic/index.ts";

export const colors = {
  transparent: "transparent",
  current: "currentColor",
  ...semantic,
};

export const screens = {
  xs: "480px",
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
} satisfies Record<string, string>;

export const paideonTheme = {
  screens,
  colors,
  fontFamily,
  fontSize,
  letterSpacing,
  lineHeight,
  spacing,
  width: sizing,
  height: sizing,
  minWidth: sizing,
  minHeight: sizing,
  maxHeight: sizing,
  maxWidth: { ...maxWidth, ...sizing },
  borderWidth,
  borderRadius,
  boxShadow,
  transitionDuration,
  transitionTimingFunction,
  zIndex,
  opacity: opacityScale,
  blur,
  aspectRatio,
  backgroundImage,
  scale,
};
