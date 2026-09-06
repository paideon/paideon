// packages/tokens/src/semantic/index.ts
//
// Assembles the per-concern semantic files (backgrounds/text/borders/colors/
// elevation) into two complete, flat semantic objects — one per theme. These
// are what generators/css.ts and generators/tailwind.ts consume.

import {
  backgroundsLight,
  backgroundsDark,
  backgroundsHorizonOverrides,
  navBackgroundLight,
  navBackgroundDark,
  navBackgroundHorizon,
} from "./backgrounds.ts";
import { textLight, textDark, navTextLight, navTextDark } from "./text.ts";
import {
  bordersLight,
  bordersDark,
  navHoverLight,
  navHoverDark,
} from "./borders.ts";
import {
  statusColorsLight,
  statusColorsDark,
  achievementLight,
  achievementDark,
} from "./colors.ts";
import { elevationDark } from "./elevation.ts";
import { primitives } from "../primitives/colors.ts";

// Widened to `Record<key, string>` shapes rather than `typeof backgroundsLight`
// etc. — using the literal light-mode type directly would fix every value to
// light mode's exact strings and reject the dark-mode call below at compile
// time (each theme's hex values are different literal types).
// `primary-pressed` is Partial: the design-system doc only specifies a
// pressed state for LIGHT mode (§2.2 — sage-700). Dark mode's pressed state
// isn't documented (§2.3 only gives primary-hover). Rather than invent a
// value, this stays optional until that's an explicit product decision —
// see the TODO on backgroundsDark below.
type BgTokens = Partial<Record<"primary-pressed", string>> &
  Omit<Record<keyof typeof backgroundsLight, string>, "primary-pressed">;
type TextTokens = Record<keyof typeof textLight, string>;
type BorderTokens = Record<keyof typeof bordersLight, string>;
type StatusTokens = Record<
  keyof typeof statusColorsLight,
  { bg: string; text: string; border: string }
>;
type AchievementTokens = Record<keyof typeof achievementLight, string>;

function buildTheme(opts: {
  bg: BgTokens;
  navBg: string;
  navText: string;
  navHover: string;
  navActive: string;
  text: TextTokens;
  border: BorderTokens;
  status: StatusTokens;
  achievement: AchievementTokens;
}) {
  return {
    bg: opts.bg,
    nav: {
      bg: opts.navBg,
      text: opts.navText,
      hover: opts.navHover,
      active: opts.navActive,
    },
    text: opts.text,
    border: opts.border,
    status: opts.status,
    achievement: opts.achievement,
  } as const;
}

export const lightTheme = buildTheme({
  bg: backgroundsLight,
  navBg: navBackgroundLight,
  navText: navTextLight,
  navHover: navHoverLight,
  navActive: primitives.sage[500],
  text: textLight,
  border: bordersLight,
  status: statusColorsLight,
  achievement: achievementLight,
});

export const darkTheme = {
  ...buildTheme({
    bg: backgroundsDark,
    navBg: navBackgroundDark,
    navText: navTextDark,
    navHover: navHoverDark,
    navActive: primitives.sage[500],
    text: textDark,
    border: bordersDark,
    status: statusColorsDark,
    achievement: achievementDark,
  }),
  elevation: elevationDark,
} as const;

// Horizon — partial override, applied on top of lightTheme. Only bg.base,
// bg.primary, and nav.bg/nav.active are documented (design-system §11.2).
// Everything else inherits from lightTheme until Horizon is fully specified —
// do NOT invent additional Horizon-specific values here.
export const horizonThemeOverrides = {
  bg: { ...backgroundsHorizonOverrides },
  nav: { bg: navBackgroundHorizon, active: "#FF7F50" }, // coral
} as const;

export {
  backgroundsLight,
  backgroundsDark,
  textLight,
  textDark,
  bordersLight,
  bordersDark,
  statusColorsLight,
  statusColorsDark,
  achievementLight,
  achievementDark,
  elevationDark,
};
