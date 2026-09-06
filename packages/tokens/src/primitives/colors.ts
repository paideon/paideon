// packages/tokens/src/primitives/colors.ts
//
// Raw color values. Never consumed directly by components — only referenced
// by semantic/*.ts. Source of truth: brand/design-system-&-visual-identity.md §2.1
// (Paideon Design System v2.0).

export const primitives = {
  // Ink family — dark mode base + all body text in light mode.
  // Not "black" — a warm, cool-undertone near-black. See designer guide §2.2.
  ink: {
    950: "#0E1117", // page background (dark mode), primary text (light mode)
    900: "#161B22", // cards / elevated surfaces (dark mode) — elevation level 1
    800: "#1E2630", // modals / drawers (dark mode) — elevation level 2
    700: "#2A3441", // dropdowns (dark mode) — elevation level 3 / subtle borders
    600: "#3B4758", // tooltips (dark mode) — elevation level 4 / default borders
  },

  // Navy family — institutional authority. Sidebar + structure in LIGHT mode only.
  // Never carried into dark mode surfaces — the Ink family takes over that role.
  navy: {
    900: "#001F3F", // sidebar background (light mode)
    800: "#002E5C",
    700: "#003F7A",
    600: "#004F97",
    200: "#A8C0D6",
    100: "#D0E0ED",
  },

  // Sage family — action color. Buttons, active states, focus rings. Identical
  // role in both themes, but reads brighter/more prominent against Ink than Cream.
  sage: {
    700: "#2E5C52",
    600: "#3A7065", // light-mode hover
    500: "#4E7C6F", // PRIMARY — brand action color, unchanged across themes
    400: "#6A9E91", // dark-mode hover
    200: "#B8D5CF",
    100: "#D8EDEA",
    50: "#EEF7F5",
  },

  // Cream family — the canvas. Replaces pure white on every primary content
  // surface in light mode. Undergoes a full role reversal in dark mode, where
  // cream-050 becomes the PRIMARY TEXT color instead of a background.
  cream: {
    900: "#7A7168",
    200: "#E8E4DC",
    100: "#F0EDE6",
    50: "#FAF8F4", // primary page background (light mode) / primary text (dark mode)
  },

  // Gold family — the most restricted color in the system. Achievement only.
  // Never navigation, never buttons, never decorative. See designer guide §2.2.
  gold: {
    700: "#8A6A1A",
    500: "#C9A84C", // light-mode achievement fill/accent
    300: "#E4CC8A", // dark-mode achievement fill/accent (warmer, more luminous on Ink)
    100: "#F7EFD0",
  },

  // Danger family
  danger: {
    600: "#A0403A",
    500: "#C0544D",
    100: "#F5E0DE",
  },

  // Primitive-level semantic state references (used by semantic/colors.ts
  // as the base values before light/dark-specific bg/text/border are derived)
  state: {
    success: "#4E7C6F", // = sage-500
    warning: "#C9A84C", // = gold-500
    danger: "#C0544D", // = danger-500
    info: "#5A7A99",
  },

  pure: {
    white: "#FFFFFF", // logo shield field only — NEVER a page background (see anti-patterns)
    black: "#000000",
  },
} as const;
