> This document is the single source of truth for all visual and design decisions made for the NEXUS platform. Every decision here has a reason. For the full psychological rationale behind color and typography choices, refer to `color_and_typography_psychology.md`.

---

## Table of Contents

1. [Design Philosophy](#1-design-philosophy)
2. [Color System](#2-color-system)
3. [Typography System](#3-typography-system)
4. [Global Base Styles](#4-global-base-styles)
5. [Tailwind Configuration](#5-tailwind-configuration)
6. [Spacing & Layout](#6-spacing--layout)
7. [Component Guidelines](#7-component-guidelines)
8. [Animation & Motion](#8-animation--motion)
9. [Theme System](#9-theme-system)
10. [Accessibility](#10-accessibility)
11. [Responsive Design](#11-responsive-design)

---

## 1. Design Philosophy

### 1.1 The Direction

**Aesthetic identity: "Dark Scholarly"**

NEXUS is not a generic school system. It is a premium, institutional platform that respects the intelligence of its users — students, teachers, and staff alike. The visual language is sharp, minimal, and considered. It draws from the world of editorial design, premium digital products, and serious academic publishing.

**What NEXUS looks like:**

- Dark by default, like a focused study environment at night
- Sharp edges, not rounded. Angular, not soft
- Generous whitespace that gives content room to breathe
- Subtle, purposeful motion — nothing decorative
- Typography that does real emotional work

**What NEXUS does not look like:**

- A government portal — cold, bureaucratic, unstyled
- A children's app — loud colors, excessive roundness, cartoon elements
- A generic SaaS dashboard — every component feels the same
- A marketing website — style without substance

### 1.2 The Four Design Pillars

**Trustworthy** — The institution must feel credible. Administrative users, teachers, and parents need to trust the system immediately.

**Inviting** — Students must want to come back. The environment should feel warm enough to spend time in, not just functional enough to complete a task.

**Focused** — Every interface must reduce cognitive load, not increase it. Every element present is present for a reason.

**Scalable** — Every decision made today must still work when NEXUS expands into a full LMS with dozens of pages, hundreds of components, and thousands of daily users.

### 1.3 Design Language Summary

| Aspect             | Decision                                   |
| ------------------ | ------------------------------------------ |
| Theme default      | Dark                                       |
| Corner style       | Sharp — max 8px radius                     |
| Motion style       | Subtle, purposeful, eased                  |
| Spacing philosophy | Generous, 8px base grid                    |
| Color count        | Minimal — two brand colors, three semantic |
| Typography layers  | Three — Display, Body, Mono                |

---

## 2. Color System

### 2.1 CSS Variables — Both Themes

The entire color system is built on CSS variables. Tailwind classes point to these variables so theme switching happens automatically across every component.

```css
/* ── DARK THEME (Default) ───────────────────────────────── */
:root {
  /* Backgrounds */
  --background:         #0e1117;
  --background-card:    #161b27;
  --background-hover:   #1c2333;

  /* Text */
  --foreground:         #e8e4dc;
  --foreground-muted:   #8892a4;
  --foreground-subtle:  #3d4659;

  /* Brand */
  --primary:            #4e7c6f;
  --primary-light:      #6a9e8f;
  --primary-muted:      rgba(78, 124, 111, 0.15);

  /* Accent */
  --gold:               #c9a84c;
  --gold-muted:         rgba(201, 168, 76, 0.15);

  /* Semantic */
  --success:            #4e7c6f;
  --warning:            #c9a84c;
  --danger:             #c0544d;

  /* Borders */
  --border:             rgba(255, 255, 255, 0.06);
  --border-strong:      rgba(255, 255, 255, 0.12);

  /* Typography (referenced in body styles) */
  --font-display:       'Cormorant Garamond', serif;
  --font-body:          'Inter', sans-serif;
  --font-mono:          'JetBrains Mono', monospace;
}

/* ── LIGHT THEME ────────────────────────────────────────── */
[data-theme="light"] {
  --background:         #faf8f4;
  --background-card:    #ffffff;
  --background-hover:   #f0ede7;

  --foreground:         #1a1f2e;
  --foreground-muted:   #5a6478;
  --foreground-subtle:  #a0a8b8;

  --border:             rgba(0, 0, 0, 0.07);
  --border-strong:      rgba(0, 0, 0, 0.14);

  /* primary, gold, success, warning, danger — unchanged in light mode */
}
```

### 2.2 Color Token Reference

| Token                 | Dark Value               | Light Value        | Usage                                 |
| --------------------- | ------------------------ | ------------------ | ------------------------------------- |
| `--background`        | `#0e1117`                | `#faf8f4`          | Page background                       |
| `--background-card`   | `#161b27`                | `#ffffff`          | Cards, panels, modals                 |
| `--background-hover`  | `#1c2333`                | `#f0ede7`          | Hover states on cards/rows            |
| `--foreground`        | `#e8e4dc`                | `#1a1f2e`          | Primary text, headings                |
| `--foreground-muted`  | `#8892a4`                | `#5a6478`          | Secondary text, descriptions          |
| `--foreground-subtle` | `#3d4659`                | `#a0a8b8`          | Placeholders, disabled, decorative    |
| `--primary`           | `#4e7c6f`                | `#4e7c6f`          | Brand color, primary actions, success |
| `--primary-light`     | `#6a9e8f`                | `#6a9e8f`          | Hover state of primary                |
| `--primary-muted`     | `rgba(78,124,111,0.15)`  | same               | Subtle primary backgrounds            |
| `--gold`              | `#c9a84c`                | `#c9a84c`          | Achievements, CTAs, highlights        |
| `--gold-muted`        | `rgba(201,168,76,0.15)`  | same               | Subtle gold backgrounds               |
| `--danger`            | `#c0544d`                | `#c0544d`          | Overdue, errors, destructive actions  |
| `--border`            | `rgba(255,255,255,0.06)` | `rgba(0,0,0,0.07)` | Default borders                       |
| `--border-strong`     | `rgba(255,255,255,0.12)` | `rgba(0,0,0,0.14)` | Emphasized borders                    |

### 2.3 Color Usage Rules

**Primary green `#4e7c6f`** is used for:

- Primary buttons and interactive elements
- Success states (book returned, task complete, streak active)
- Active navigation states
- Progress indicators

**Gold `#c9a84c`** is used for:

- Achievement badges and reading milestones
- Reading streak highlights
- Key call-to-action elements (Sign In, Open Vault)
- Premium or featured content labels

**Danger `#c0544d`** is used for:

- Overdue book notifications
- Form validation errors
- Destructive actions (delete, remove)
- Critical system alerts

**Gold and primary must never appear together** on the same element. They are both accent colors and will compete visually.

### 2.4 What Not to Do

- Never use `#000000` or `#ffffff` anywhere in the UI
- Never use primary green for decorative purposes — it must mean something interactive or successful
- Never use gold for anything other than achievement, reward, or primary CTA
- Never place light text on `--primary-muted` or `--gold-muted` backgrounds — contrast is too low for text

---

## 3. Typography System

### 3.1 Font Stack

```css
/* Display — Cormorant Garamond */
/* Used for: All headings, hero text, pull quotes, anything 32px+ */
font-family: 'Cormorant Garamond', Georgia, serif;

/* Body — Inter */
/* Used for: Everything else. Body text, buttons, nav, forms, cards */
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

/* Mono — JetBrains Mono */
/* Used for: Labels, tags, ISBN, dates, metadata, section counters */
font-family: 'JetBrains Mono', 'Courier New', monospace;
```

### 3.2 Google Fonts Import

```css
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@300;400;500&display=swap');
```

In Next.js this import lives at the top of `global.css`, above all `@tailwind` directives.

### 3.3 Font Loading in Next.js

Fonts are loaded via `next/font` in `apps/web/src/app/layout.tsx` for optimal performance. Google Fonts loaded through `next/font`are self-hosted automatically by Next.js, eliminating the external network request.

```tsx
import { Cormorant_Garamond, Inter, JetBrains_Mono } from 'next/font/google'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '600'],
  style: ['normal', 'italic'],
  variable: '--font-display',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-body',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-mono',
})
```

### 3.4 Type Scale

| Token              | Value                      | Usage                         |
| ------------------ | -------------------------- | ----------------------------- |
| `text-display-2xl` | `clamp(64px, 12vw, 160px)` | Hero titles, magnetic text    |
| `text-display-xl`  | `clamp(48px, 8vw, 100px)`  | Major section heroes          |
| `text-display-lg`  | `clamp(36px, 6vw, 72px)`   | Section headings              |
| `text-display-md`  | `clamp(28px, 4vw, 52px)`   | Page titles, card headings    |
| `text-display-sm`  | `clamp(22px, 3vw, 36px)`   | Sub-headings                  |
| `text-label`       | `0.625rem`                 | All mono labels with tracking |

Tailwind's default scale (`text-sm`, `text-base`, `text-lg`, etc.) is used for body text — no need to override these.

### 3.5 Font Usage Rules

| Font                      | Weight         | Use case                                      |
| ------------------------- | -------------- | --------------------------------------------- |
| Cormorant Garamond        | 300 (light)    | Large display headings                        |
| Cormorant Garamond        | 400 (regular)  | Mid-size headings                             |
| Cormorant Garamond Italic | 300–400        | Emphasis, brand voice moments, pull quotes    |
| Inter                     | 300 (light)    | Long body text, descriptions                  |
| Inter                     | 400 (regular)  | Standard body, paragraphs                     |
| Inter                     | 500 (medium)   | Navigation, secondary labels                  |
| Inter                     | 600 (semibold) | Buttons, strong UI labels                     |
| JetBrains Mono            | 300–400        | All mono usage — always small, always tracked |

### 3.6 The Letter-Spacing Rule for Mono

All JetBrains Mono usage should have `tracking-[0.2em]` or wider applied. This is what gives the labels their distinctive precision feel. Mono without wide tracking loses its character.

```tsx
// ✅ Correct mono usage
<span className="font-mono text-label tracking-[0.3em] uppercase text-subtle">
  01 — About
</span>

// ❌ Wrong — no tracking, loses the effect
<span className="font-mono text-sm">
  01 — About
</span>
```

---

## 4. Global Base Styles

### 4.1 Complete `global.css`

```css
/* ── 1. FONT IMPORT ─────────────────────────────────────── */
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@300;400;500&display=swap');

/* ── 2. TAILWIND DIRECTIVES ─────────────────────────────── */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* ── 3. CSS VARIABLES ───────────────────────────────────── */
:root {
  --background:         #0e1117;
  --background-card:    #161b27;
  --background-hover:   #1c2333;
  --foreground:         #e8e4dc;
  --foreground-muted:   #8892a4;
  --foreground-subtle:  #3d4659;
  --primary:            #4e7c6f;
  --primary-light:      #6a9e8f;
  --primary-muted:      rgba(78, 124, 111, 0.15);
  --gold:               #c9a84c;
  --gold-muted:         rgba(201, 168, 76, 0.15);
  --success:            #4e7c6f;
  --warning:            #c9a84c;
  --danger:             #c0544d;
  --border:             rgba(255, 255, 255, 0.06);
  --border-strong:      rgba(255, 255, 255, 0.12);
  --font-display:       'Cormorant Garamond', serif;
  --font-body:          'Inter', sans-serif;
  --font-mono:          'JetBrains Mono', monospace;
}

[data-theme="light"] {
  --background:         #faf8f4;
  --background-card:    #ffffff;
  --background-hover:   #f0ede7;
  --foreground:         #1a1f2e;
  --foreground-muted:   #5a6478;
  --foreground-subtle:  #a0a8b8;
  --border:             rgba(0, 0, 0, 0.07);
  --border-strong:      rgba(0, 0, 0, 0.14);
}

/* ── 4. BASE RESET ──────────────────────────────────────── */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  cursor: none;
}

/* ── 5. HTML + BODY ─────────────────────────────────────── */
html {
  scroll-behavior: smooth;
}

body {
  background-color: var(--background);
  color: var(--foreground);
  font-family: var(--font-body);
  font-size: 16px;
  line-height: 1.6;
  font-weight: 400;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
  min-height: 100vh;
  transition: background-color 0.3s ease, color 0.3s ease;
}

/* ── 6. TYPOGRAPHY BASE ─────────────────────────────────── */
h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-display);
  font-weight: 300;
  line-height: 1.1;
  color: var(--foreground);
}

p {
  font-family: var(--font-body);
  color: var(--foreground-muted);
  line-height: 1.8;
}

code, kbd, pre {
  font-family: var(--font-mono);
}

a {
  color: inherit;
  text-decoration: none;
}

/* ── 7. SELECTION COLOR ─────────────────────────────────── */
::selection {
  background-color: var(--primary-muted);
  color: var(--foreground);
}

/* ── 8. CUSTOM SCROLLBAR ────────────────────────────────── */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: var(--background);
}

::-webkit-scrollbar-thumb {
  background: var(--foreground-subtle);
  border-radius: 999px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--foreground-muted);
}

/* ── 9. REDUCED MOTION ──────────────────────────────────── */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

/* ── 10. FOCUS STATES ───────────────────────────────────── */
*:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}

/* ── 11. SCREEN READER UTILITY ──────────────────────────── */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

---

## 5. Tailwind Configuration

### 5.1 Complete `tailwind.config.js`

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class', '[data-theme="dark"]'],
  content: [
    './{src,pages,components,app}/**/*.{ts,tsx,js,jsx,html}',
    '!./{src,pages,components,app}/**/*.{stories,spec}.{ts,tsx,js,jsx,html}',
  ],
  theme: {
    extend: {

      // ── Colors ────────────────────────────────────────
      colors: {
        background:       'var(--background)',
        card:             'var(--background-card)',
        hover:            'var(--background-hover)',
        foreground:       'var(--foreground)',
        muted:            'var(--foreground-muted)',
        subtle:           'var(--foreground-subtle)',
        primary:          'var(--primary)',
        'primary-light':  'var(--primary-light)',
        'primary-muted':  'var(--primary-muted)',
        gold:             'var(--gold)',
        'gold-muted':     'var(--gold-muted)',
        success:          'var(--success)',
        warning:          'var(--warning)',
        danger:           'var(--danger)',
        border:           'var(--border)',
        'border-strong':  'var(--border-strong)',
      },

      // ── Typography ─────────────────────────────────────
      fontFamily: {
        display: ['Cormorant Garamond', 'serif'],
        body:    ['Inter', 'sans-serif'],
        mono:    ['JetBrains Mono', 'monospace'],
      },

      // ── Display Font Sizes ─────────────────────────────
      fontSize: {
        'display-2xl': 'clamp(64px, 12vw, 160px)',
        'display-xl':  'clamp(48px, 8vw, 100px)',
        'display-lg':  'clamp(36px, 6vw, 72px)',
        'display-md':  'clamp(28px, 4vw, 52px)',
        'display-sm':  'clamp(22px, 3vw, 36px)',
        'label':       '0.625rem',
      },

      // ── Border Radius (sharp design language) ──────────
      borderRadius: {
        'none': '0px',
        'sm':   '2px',
        'md':   '4px',
        'lg':   '8px',
      },

      // ── Animations ─────────────────────────────────────
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
        skeletonLoad: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'fade-in':       'fadeIn 0.5s ease forwards',
        'slide-up':      'slideUp 0.6s ease forwards',
        'slide-down':    'slideDown 0.6s ease forwards',
        'pulse-slow':    'pulse 3s ease-in-out infinite',
        'skeleton':      'skeletonLoad 1.5s ease-in-out infinite',
      },

    },
  },
  plugins: [],
};
```

### 5.2 Using Tokens in Components

```tsx
// ✅ Always use token-based classes
<div className="bg-background text-foreground">
<div className="bg-card border border-border">
<h1 className="font-display text-display-lg text-foreground">
<p className="font-body text-muted">
<span className="font-mono text-label tracking-[0.3em] uppercase text-subtle">
<button className="bg-primary text-foreground">
<span className="text-gold">
<div className="animate-slide-up">

// ❌ Never hardcode color values in components
<div style={{ backgroundColor: '#161b27' }}>
<div className="bg-[#0e1117]">
```

---

## 6. Spacing & Layout

### 6.1 Base Grid

All spacing decisions use an **8px base grid**. This means every margin, padding, gap, and size should be a multiple of 8px (or 4px for micro-spacing). Tailwind's default spacing scale already follows this — `p-4` = 16px, `p-8` = 32px, `p-12` = 48px.

### 6.2 Page Layout Widths

```
Content narrow:   65ch    (optimal reading line length — book descriptions, articles)
Content medium:   75ch    (standard content)
Content wide:     1280px  (page containers, dashboards)
Full bleed:       100%    (hero sections, full-width elements)
```

### 6.3 Section Padding

Horizontal page padding uses viewport-relative values for fluidity:

```
Mobile:   px-[5vw]
Tablet:   px-[8vw]
Desktop:  px-[10vw]
```

Vertical section padding is `py-20` (80px) minimum for breathing room.

### 6.4 Border Radius Philosophy

NEXUS uses a sharp, angular design language. Rounded corners signal softness and playfulness — the wrong tone for a scholarly platform. The maximum border radius used anywhere in the system is `8px` (`rounded-lg`).

| Token          | Value   | Use                                                |
| -------------- | ------- | -------------------------------------------------- |
| `rounded-none` | `0px`   | Default for most elements — cards, buttons, inputs |
| `rounded-sm`   | `2px`   | Subtle rounding on small tags, badges              |
| `rounded-md`   | `4px`   | Optional softening on interactive elements         |
| `rounded-lg`   | `8px`   | Maximum — used sparingly on modals                 |
| `rounded-full` | `999px` | Pills only — for status badges and avatar images   |

---

## 7. Component Guidelines

### 7.1 Buttons

Buttons come in three variants. All buttons use `font-body`, `font-semibold`, `tracking-[0.12em]`, and `uppercase` text.

**Primary Button** — for the most important action on a screen

```tsx
<button className="
  bg-card hover:bg-hover
  text-foreground
  border border-border hover:border-border-strong
  font-body text-xs font-semibold tracking-[0.15em] uppercase
  px-9 py-4
  transition-all duration-200
  inline-flex items-center gap-3 group
">
  Sign In
  <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
</button>
```

**Gold Button** — for the single highest-priority CTA on a page

```tsx
<button className="
  bg-gold-muted hover:bg-gold
  text-gold hover:text-background
  border border-gold/20 hover:border-gold
  font-body text-xs font-semibold tracking-[0.15em] uppercase
  px-9 py-4
  transition-all duration-200
">
  Get Started
</button>
```

**Ghost Button** — for secondary actions

```tsx
<button className="
  bg-transparent
  text-muted hover:text-foreground
  border border-border hover:border-border-strong
  font-body text-xs font-semibold tracking-[0.15em] uppercase
  px-9 py-4
  transition-all duration-200
">
  Learn More
</button>
```

### 7.2 Cards

All cards use zero or minimal border radius. The card surface is `bg-card`, border is `border border-border`.

**Standard Card**

```tsx
<div className="
  bg-card
  border border-border hover:border-border-strong
  hover:bg-hover
  transition-all duration-300
  p-8
">
```

**Feature Card** (for Why NEXUS style grids)

```tsx
<div className="
  bg-card
  border border-border
  p-10
  flex flex-col gap-4
  hover:bg-hover
  transition-colors duration-300
  group
">
```

### 7.3 Input Fields

```tsx
<input className="
  bg-card
  text-foreground
  border border-border focus:border-border-strong
  font-body text-sm font-light
  px-6 py-4
  w-full
  outline-none
  placeholder:text-subtle
  transition-colors duration-300
" />
```

### 7.4 Status Badges

```tsx
// Available
<span className="
  bg-primary-muted text-primary
  font-mono text-label tracking-[0.15em] uppercase
  px-3 py-1 rounded-full
">Available</span>

// Overdue
<span className="
  bg-danger/10 text-danger
  font-mono text-label tracking-[0.15em] uppercase
  px-3 py-1 rounded-full
">Overdue</span>

// Achievement / streak
<span className="
  bg-gold-muted text-gold
  font-mono text-label tracking-[0.15em] uppercase
  px-3 py-1 rounded-full
">🔥 12 Day Streak</span>
```

### 7.5 Section Labels (Mono Labels)

The section counter pattern used throughout the landing page should be used consistently:

```tsx
<span className="
  font-mono text-label
  tracking-[0.3em]
  text-subtle
  uppercase
">
  01 — About
</span>
```

### 7.6 Navigation Bar

The navbar is hidden in the hero section and appears as the user scrolls past it (IntersectionObserver on the hero section).

```tsx
// Visible state
<nav className="
  fixed top-0 left-0 right-0 z-50
  flex items-center justify-between
  px-12 py-6
  bg-background/80 backdrop-blur-md
  border-b border-border
">
```

### 7.7 Modal / Dialog

```tsx
<div className="
  fixed inset-0 z-50
  bg-background/60 backdrop-blur-sm
  flex items-center justify-center
  p-4
">
  <div className="
    bg-card
    border border-border
    max-w-lg w-full
    p-10
    animate-slide-up
  ">
```

### 7.8 Skeleton Loading

Used while data is being fetched. The animation is defined in Tailwind config.

```tsx
<div className="
  animate-skeleton
  bg-gradient-to-r from-card via-hover to-card
  bg-[length:200%_100%]
  h-4 rounded-sm
" />
```

---

## 8. Animation & Motion

### 8.1 Principles

**Purposeful** — animation must serve a function. It communicates state, guides attention, or confirms an action. Never decorative.

**Subtle** — NEXUS is a focused, scholarly environment. Motion should be felt, not seen. If an animation draws attention to itself, it's too strong.

**Fast** — most transitions are 200–300ms. Anything longer than 500ms feels sluggish for UI interactions. Only entrance animations on scroll use longer durations.

### 8.2 Timing Reference

| Duration     | Use case                                               |
| ------------ | ------------------------------------------------------ |
| `100ms`      | Instant feedback — button press, checkbox tick         |
| `200ms`      | Fast transitions — hover color changes, border changes |
| `300ms`      | Standard — theme switch, dropdown open                 |
| `500–600ms`  | Entrance animations — card reveal on scroll            |
| `800–1000ms` | Hero animations — first load only                      |

### 8.3 Easing Functions

```
ease-out  →  Default for entrances (fast start, slow end — feels natural)
ease-in   →  Exits only (element leaving the screen)
[0.22, 1, 0.36, 1]  →  Premium ease — used for card deal and hero animations
backOut   →  Framer Motion — used for the mask cursor grow effect
```

### 8.4 Scroll Reveal Pattern

All sections use `IntersectionObserver` with a `threshold: 0.12` to trigger entrance. The `CardSection` component handles this — wrap any section in it and it gets the reveal animation automatically.

```
Initial state:  opacity: 0, x: -6%, y: 4%, rotate: -1deg, scale: 0.97
Animated to:    opacity: 1, x: 0, y: 0, rotate: 0deg, scale: 1
Duration:       0.85s
Easing:         [0.22, 1, 0.36, 1]
```

### 8.5 Framer Motion Usage

Framer Motion is installed in `apps/web`. It is used for:

- The mask cursor effect (webkitMaskPosition animation)
- The magnetic letter hero effect (useMotionValue + useSpring)
- The navbar show/hide (AnimatePresence)
- The CardSection scroll reveal (motion.section)
- The loading screen exit animation

All Framer Motion components must be in files with `"use client"` at the top.

### 8.6 Custom Cursor

NEXUS uses a two-element custom cursor — a small dot and a larger ring — defined in CSS and controlled via JavaScript through the `useMousePosition` hook.

**Files:**

- CSS in `global.css`
- Hook in `apps/web/src/hooks/useMousePosition.ts`
- Component at `apps/web/src/components/layout/CustomCursor.tsx`
- Imported in `apps/web/src/app/layout.tsx`

The ring expands on hover over links and buttons via `body:has(a:hover)` CSS selector — no JavaScript needed for the hover effect.

---

## 9. Theme System

### 9.1 How Themes Work

Theme switching is handled by setting a `data-theme` attribute on the `<html>` element. The CSS variables in `global.css`respond to this attribute and update every color across every component simultaneously.

```
Default (no attribute or data-theme="dark") → Dark theme (:root variables)
data-theme="light"                          → Light theme ([data-theme="light"] variables)
```

### 9.2 Theme Toggle Logic

```tsx
// In a ThemeToggle component (must be "use client")
const toggleTheme = () => {
  const current = document.documentElement.getAttribute('data-theme')
  const next = current === 'light' ? 'dark' : 'light'
  document.documentElement.setAttribute('data-theme', next)
  localStorage.setItem('theme', next)
}
```

### 9.3 Preventing Flash on Load

This script must be placed inside `<head>` in `layout.tsx` and must run **before** React hydrates. This prevents the wrong theme flashing on page load.

```tsx
<script dangerouslySetInnerHTML={{
  __html: `
    try {
      const theme = localStorage.getItem('theme') || 'dark';
      document.documentElement.setAttribute('data-theme', theme);
    } catch(e) {}
  `
}} />
```

### 9.4 Default Behavior

Dark theme is the default. If a user has never visited, they see dark. Their preference is stored in `localStorage` and applied on every subsequent visit.

---

## 10. Accessibility

### 10.1 Contrast Ratios

All text must meet WCAG 2.1 Level AA minimum (4.5:1 for normal text, 3:1 for large text).

|Combination|Contrast|Status|
|---|---|---|
|`--foreground` on `--background`|~11:1|✅ AAA|
|`--foreground-muted` on `--background`|~4.8:1|✅ AA|
|`--foreground` on `--background-card`|~10:1|✅ AAA|
|`--primary` on `--background`|~3.8:1|✅ AA Large|
|`--gold` on `--background`|~5.2:1|✅ AA|
|`--danger` on `--background`|~4.6:1|✅ AA|

**Note:** `--foreground-subtle` (`#3d4659`) does not meet AA contrast on the dark background. It must only be used for decorative text, placeholders, and disabled states — never for readable content.

### 10.2 Focus States

Focus states use `outline: 2px solid var(--primary)` with a `2px` offset. This is defined globally in `global.css` and applies to all focusable elements. Never remove focus outlines without providing an alternative.

### 10.3 Reduced Motion

The `@media (prefers-reduced-motion: reduce)` block in `global.css` collapses all animations and transitions to near-zero for users who have requested reduced motion in their OS settings. All animations must work in a no-motion environment — they enhance, never gate functionality.

### 10.4 Screen Reader Support

The `.sr-only` utility class is defined in `global.css`. Use it for icon buttons, decorative elements, and any visual content that needs a text alternative.

### 10.5 Custom Cursor Accessibility

The custom cursor is a visual enhancement only. It must not affect keyboard navigation or touch interaction. `pointer-events: none` is applied to both cursor elements to ensure this. On touch devices, the cursor simply doesn't appear.

---

## 11. Responsive Design

### 11.1 Breakpoints (Tailwind Defaults)

| Breakpoint | Width  | Target       |
| ---------- | ------ | ------------ |
| `sm`       | 640px  | Large mobile |
| `md`       | 768px  | Tablet       |
| `lg`       | 1024px | Desktop      |
| `xl`       | 1280px | Wide desktop |
| `2xl`      | 1536px | Ultra-wide   |

### 11.2 Mobile-First Rule

All styles are written mobile-first. Base styles target mobile, breakpoint prefixes add complexity for larger screens.

```tsx
// ✅ Mobile first
<div className="px-5 md:px-[8vw] lg:px-[10vw]">
<h1 className="text-display-sm lg:text-display-lg">

// ❌ Desktop first (wrong)
<div className="px-[10vw] sm:px-5">
```

### 11.3 Expected Device Distribution

Based on the school context, approximately 80% of student access will be via smartphones. Desktop access is expected primarily from the librarian admin dashboard and teachers. Every component must be fully functional and readable on a 375px wide screen before being considered complete.

---

