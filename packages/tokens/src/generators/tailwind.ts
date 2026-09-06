// packages/tokens/src/generators/tailwind.ts
//
// DELIBERATE DEVIATION FROM NEXUS'S PATTERN — documented here so it isn't
// mistaken for a copy-paste error.
//
// Nexus's generators/tailwind.ts spreads semantic color VALUES directly
// (literal hex/rgba) into the Tailwind theme. That bakes one theme's colors
// into every compiled utility class at build time — which is also why
// Nexus's themes/dark.ts is still `throw new Error('not implemented')`:
// flipping [data-theme="dark"] at runtime wouldn't change anything a
// Tailwind class produced, because the hex is already baked in.
//
// Paideon's dark mode (and Horizon) are fully specified and need to actually
// switch at runtime. So here, Tailwind's `colors` map to `var(--token-name)`
// strings — the SAME variable names generators/css.ts writes into :root /
// [data-theme="dark"] / [data-theme="horizon"]. A single class like
// `bg-bg-primary` compiles once and resolves to whichever theme block is
// active. Only the indirection is different; the primitives → semantic →
// generators architecture is otherwise the same shape as Nexus's.

import { spacing } from "../primitives/spacing.ts";
import { iconSize, layout } from "../primitives/sizing.ts";
import { borderRadius } from "../primitives/radius.ts";
import { boxShadow } from "../primitives/shadows.ts";
import {
  transitionDuration,
  transitionTimingFunction,
} from "../primitives/motion.ts";
import { zIndex, opacity } from "../primitives/effects.ts";
import {
  fontFamily,
  fontSize,
  letterSpacing,
} from "../primitives/typography.ts";
import { lightTheme } from "../semantic/index.ts";

function cssVar(name: string): string {
  return `var(--${name})`;
}

// Built from lightTheme's *keys* only (dark/horizon share the same key
// shape — that's the whole point of the token-name indirection) so this
// never has to be regenerated when a theme's values change, only when a
// token is added or removed.
function buildColorMap() {
  const bg: Record<string, string> = {};
  for (const key of Object.keys(lightTheme.bg))
    bg[key] = cssVar(`color-bg-${key}`);

  const nav = {
    bg: cssVar("color-nav-bg"),
    text: cssVar("color-nav-text"),
    hover: cssVar("color-nav-hover"),
    active: cssVar("color-nav-active"),
  };

  const text: Record<string, string> = {};
  for (const key of Object.keys(lightTheme.text))
    text[key] = cssVar(`color-text-${key}`);

  const border: Record<string, string> = {};
  for (const key of Object.keys(lightTheme.border))
    border[key] = cssVar(`color-border-${key}`);

  const status: Record<string, { bg: string; text: string; border: string }> =
    {};
  for (const state of Object.keys(lightTheme.status)) {
    status[state] = {
      bg: cssVar(`color-${state}-bg`),
      text: cssVar(`color-${state}-text`),
      border: cssVar(`color-${state}-border`),
    };
  }

  const achievement = {
    bg: cssVar("color-achievement-bg"),
    accent: cssVar("color-achievement-accent"),
    text: cssVar("color-achievement-text"),
    border: cssVar("color-achievement-border"),
  };

  return { bg, nav, text, border, ...status, achievement };
}

export const colors = {
  transparent: "transparent",
  current: "currentColor",
  white: "#FFFFFF", // logo/shield use only — see anti-patterns in brand doc
  black: "#000000",
  ...buildColorMap(),
};

export const screens = {
  // Design-system doc §9.1 breakpoints
  sm: "640px",
  md: "768px", // tablet threshold
  lg: "1024px", // desktop threshold
  xl: "1280px",
  "2xl": "1536px",
} satisfies Record<string, string>;

export const paideonTheme = {
  screens,
  colors,
  fontFamily,
  fontSize: Object.fromEntries(
    Object.entries(fontSize).map(([key, [size, meta]]) => [
      key,
      [size, { lineHeight: meta.lineHeight, fontWeight: meta.fontWeight }],
    ])
  ),
  letterSpacing,
  spacing,
  width: {
    ...spacing,
    ...Object.fromEntries(
      Object.entries(iconSize).map(([k, v]) => [`icon-${k}`, v])
    ),
  },
  height: {
    ...spacing,
    ...Object.fromEntries(
      Object.entries(iconSize).map(([k, v]) => [`icon-${k}`, v])
    ),
  },
  maxWidth: { "content-max": layout["content-max-width"] },
  borderRadius,
  boxShadow,
  transitionDuration,
  transitionTimingFunction,
  zIndex,
  opacity,
};
