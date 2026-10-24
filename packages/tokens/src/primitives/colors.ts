// packages/tokens/src/primitives/colors.ts
//
// Raw palette. Theme-agnostic: nothing here says "background" or "text" —
// that meaning lives in semantic/ (light) and themes/dark.ts (dark), which
// pick steps from these ramps. Change a hue here and both themes follow.
//
// Design direction (Paideon = school MANAGEMENT system, not a marketing site):
//   - Brand stays forest green + gold (heritage, school identity).
//   - Surfaces are a clean, slightly green-tinted off-white instead of warm
//     parchment, so tables, forms and status colours stay legible all day.
//   - Gold is an accent. Its light-theme steps are deliberately dark enough
//     to be read as TEXT (ghost/outline/link buttons use it as text colour).
//   - Every text/background pairing used by @paideon/ui is checked for
//     WCAG AA in both themes (see scripts/audit-contrast.js).

/** Hex + alpha → rgba() string. Used by the semantic layers for tints. */
export function withAlpha(hex: string, alpha: number): string {
  const h = hex.replace('#', '');
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export const primitives = {
  // Green-tinted neutrals for the LIGHT theme. Runs light → dark.
  forest: {
    50: '#F6F8F6', // page floor
    100: '#EEF2EF', // default tinted surface
    200: '#E2E9E4', // recessed / "deep" panel
    300: '#DBEBE0', // pale mint accent surface
    400: '#B6C5BB', // soft borders, disabled fills
    500: '#8D9F94', // mid neutral
    600: '#4C6054', // tertiary text (AA on every light surface)
    700: '#3F5247', // secondary text
    800: '#143826', // headings — deep forest
    900: '#121D17', // ink: primary text
  },

  // Green-tinted neutrals for the DARK theme surfaces. Runs dark → lighter.
  night: {
    950: '#0A100D', // recessed
    900: '#0E1613', // page floor
    850: '#131D18', // default surface
    800: '#18241E', // raised surface (cards, inputs)
    750: '#1D2C25', // hover
    700: '#24352C', // pressed / active
    canopy: '#15291F', // deep-green accent surface
  },

  // Light neutrals used for text and hairlines on the DARK theme.
  mist: {
    50: '#F6F8F6',
    100: '#F2F7F3',
    200: '#E8EEEA',
    300: '#CDE0D5',
    400: '#B4C3BA',
    500: '#93A69B',
  },

  // Brand green. 700 is the light-theme brand colour, 400 the dark-theme one.
  green: {
    100: '#CFE5D8',
    300: '#7AD0A2',
    400: '#5BBE8B',
    600: '#237448',
    700: '#1B5E3C',
    800: '#154A30', // solid brand panels (light theme)
    900: '#1F3A2C', // solid brand panels (dark theme)
  },

  // Accent gold. 600–800 read as text on light surfaces; 300–100 on dark.
  gold: {
    50: '#F7ECCB',
    100: '#F7DA9B',
    200: '#F0C975',
    300: '#E2B457',
    400: '#C9973A', // vivid decorative gold — NOT for text
    600: '#85610E',
    700: '#6B4F08',
    800: '#543E06',
    900: '#3A2F12',
  },

  // Status hues. 700 = light theme, 300 = dark theme.
  error: { 300: '#F28B82', 700: '#B3261E' },
  success: { 300: '#7DD39B', 700: '#23702F' },
  warning: { 300: '#FB9A4B', 700: '#984300' }, // orange, so it never reads as brand gold
  info: { 300: '#7DB6E8', 700: '#1F5F99' },
} as const;
