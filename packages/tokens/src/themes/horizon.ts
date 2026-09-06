// packages/tokens/src/themes/horizon.ts
//
// Student-selectable skin for primary-level users (design-system doc §11.2).
// "Design intent: when students 'graduate' from The Horizon into the default
// Dark Scholarly theme at secondary level, the visual shift provides a
// tangible signal of academic progression — a rite of passage encoded into
// the interface itself."
//
// Deferred to a future version per architecture-overview.md — this accessor
// exists so the token layer is ready, but Horizon is not wired into the
// portal's theme switcher until product decides to ship it.

import { lightTheme, horizonThemeOverrides } from "../semantic/index.ts";

export function getHorizonTheme() {
  return {
    ...lightTheme,
    bg: { ...lightTheme.bg, ...horizonThemeOverrides.bg },
    nav: { ...lightTheme.nav, ...horizonThemeOverrides.nav },
  };
}
