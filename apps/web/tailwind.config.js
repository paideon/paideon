/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class', '[data-theme="dark"]'],
  content: [
    './{src,pages,components,app}/**/*.{ts,tsx,js,jsx,html}',
    '!./{src,pages,components,app}/**/*.{stories,spec}.{ts,tsx,js,jsx,html}',
    //     ...createGlobPatternsForDependencies(__dirname)
  ],
  theme: {
    extend: {

      // Colors
      colors: {
        background:   'var(--background)',
        card:         'var(--background-card)',
        hover:        'var(--background-hover)',

        foreground:   'var(--foreground)',
        muted:        'var(--foreground-muted)',
        subtle:       'var(--foreground-subtle)',

        primary:      'var(--primary)',
        'primary-light': 'var(--primary-light)',
        'primary-muted': 'var(--primary-muted)',

        gold:         'var(--gold)',
        'gold-muted': 'var(--gold-muted)',

        success:      'var(--success)',
        warning:      'var(--warning)',
        danger:       'var(--danger)',

        border:       'var(--border)',
        'border-strong': 'var(--border-strong)',
      },

      // Typography
      fontFamily: {
        display: ['Cormorant Garamond', 'serif'],
        body:    ['Inter', 'sans-serif'],
        mono:    ['JetBrains Mono', 'monospace'],
      },

      // Font Sizes
      fontSize: {
        'display-2xl': 'clamp(64px, 12vw, 160px)',
        'display-xl':  'clamp(48px, 8vw, 100px)',
        'display-lg':  'clamp(36px, 6vw, 72px)',
        'display-md':  'clamp(28px, 4vw, 52px)',
        'display-sm':  'clamp(22px, 3vw, 36px)',
        'label':       '0.625rem',
      },

      // Border Radius
      borderRadius: {
        'none': '0px',
        'sm':   '2px',
        'md':   '4px',
        'lg':   '8px',
      },
      // Animations
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { transform: 'translateY(24px)', opacity: '0' },
          '100%': { transform: 'translateY(0)',    opacity: '1' },
        },
        slideDown: {
          '0%':   { transform: 'translateY(-24px)', opacity: '0' },
          '100%': { transform: 'translateY(0)',     opacity: '1' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.4' },
        },
      },
      animation: {
        'fade-in':    'fadeIn 0.5s ease forwards',
        'slide-up':   'slideUp 0.6s ease forwards',
        'slide-down': 'slideDown 0.6s ease forwards',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },

    },
  },
  plugins: [],
};
