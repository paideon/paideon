// packages/tokens/src/generators/tailwind.ts

import {
  backgroundImage,
  aspectRatio,
  blur,
  zIndex,
  opacity as opacityScale,
  scale,
} from '../primitives/effects.ts';
import {
  transitionDuration,
  transitionTimingFunction,
} from '../primitives/motion.ts';
import { borderRadius } from '../primitives/radius.ts';
import { boxShadow } from '../primitives/shadows.ts';
import { sizing, borderWidth, maxWidth } from '../primitives/sizing.ts';
import { spacing } from '../primitives/spacing.ts';
import {
  fontFamily,
  fontSize,
  lineHeight,
  letterSpacing,
} from '../primitives/typography.ts';
import { semantic, type Theme } from '../semantic/index.ts';

// Colours are NOT literal values here. Each leaf becomes `var(--color-<path>)`,
// the same variable names generators/css.ts writes into :root (light) and
// [data-theme="dark"]. A class like `bg-surface-base` therefore compiles once
// and resolves to whichever theme is active — that is what makes switching
// themes a one-attribute change with no re-render and no `dark:` variants.
type VarRefs<T> = T extends string ? string : { [K in keyof T]: VarRefs<T[K]> };

function toVarRefs<T extends Theme>(obj: T, prefix = 'color'): VarRefs<T> {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    const name = `${prefix}-${key}`;
    out[key] =
      value && typeof value === 'object'
        ? toVarRefs(value as unknown as Theme, name)
        : `var(--${name})`;
  }
  return out as VarRefs<T>;
}

export const colors = {
  transparent: 'transparent',
  current: 'currentColor',
  ...toVarRefs(semantic as Theme),
};

export const screens = {
  xs: '480px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
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
