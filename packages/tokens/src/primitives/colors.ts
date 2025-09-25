// packages/tokens/src/primitives/colors.ts

export const primitives = {
  // Forest palette — light-dominant parchment + leaf green.
  // Ramp runs light→dark, 50→900 (previously dark-native, 900→100).
  // Cream/parchment surfaces, warm-ink text, pale leaf-mint accents —
  // matches the locked light-theme direction (surface #DCEADE, text #1C1A16).
  forest: {
    50: '#FBF9F2', // parchment paper — lightest, base page floor
    100: '#F5EFE0', // warm cream — default surface
    200: '#EDE6D0', // deeper cream — recessed/"deep" panel
    300: '#DCEADE', // pale leaf mint — canopy accent surface ("forest glass")
    400: '#B8CDB8', // pale sage — borders, dividers, disabled fills
    500: '#8FA898', // sage — muted/placeholder text, subtle borders
    600: '#5C7A68', // mid forest green — secondary text, hover accents
    700: '#3D5C52', // dark forest green — headings, strong accents
    800: '#1F3B32', // deep forest — near-primary text
    900: '#1C1A16', // warm near-black ink — primary text
  },
  green: {
    100: '#1A4A2E',
    80: '#235C3A',
  },
  gold: {
    100: '#C9973A',
    80: '#E8B84B',
    60: '#F2D98A',
    40: '#D6A645',
    20: '#B7852F',
    glow: 'rgba(201,151,58,0.32)',
  },
  border: {
    default: 'rgba(28,26,22,0.10)', // warm ink at low opacity — faint line on a light surface
    light: 'rgba(28,26,22,0.06)', // ghost border
  },
  success: {
    base: '#3E8F5E',
    surface: 'rgba(62,143,94,0.12)', // light wash — dark mode used a heavy dark tint, light mode needs a pale one
  },
  error: {
    base: '#C24A4A',
    surface: 'rgba(194,74,74,0.12)',
  },
  warning: {
    base: '#B7852F',
    surface: 'rgba(183,133,47,0.12)',
  },
  info: {
    base: '#3E7EA8',
    surface: 'rgba(62,126,168,0.12)',
  },
  overlay: {
    light: 'rgba(28,26,22,0.20)', // warm ink tint — tooltips, hover overlays
    medium: 'rgba(28,26,22,0.45)', // modal backdrops, drawers
    heavy: 'rgba(15,13,10,0.72)', // full-screen takeovers, lightbox
  },
} as const;
