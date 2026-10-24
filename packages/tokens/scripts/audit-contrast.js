// packages/tokens/scripts/audit-contrast.js
//
// WCAG contrast audit for every text/background pairing @paideon/ui relies on,
// in BOTH themes. Exits non-zero on any failure, so it can gate CI.
//
//   pnpm --filter @paideon/tokens audit:contrast
//
// The pair list mirrors how components actually combine tokens (e.g. Button
// primary = bg-green-base + text-text-inverse; ghost/outline/link buttons use
// text-gold-base as TEXT). If you add a new combination to a component, add it
// here too.

import { semantic } from '../src/semantic/index.ts';
import { darkTheme } from '../src/themes/dark.ts';

// ─── WCAG 2.x maths ──────────────────────────────────────────────────────────

function parse(c) {
  const s = c.trim();
  if (s.startsWith('#')) {
    const h = s.slice(1);
    return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)).concat(1);
  }
  const p = s
    .match(/rgba?\(([^)]+)\)/)[1]
    .split(',')
    .map(parseFloat);
  return [p[0], p[1], p[2], p[3] ?? 1];
}

/** Composite a (possibly translucent) colour over an opaque one. */
function over(fg, bg) {
  const f = parse(fg);
  const b = parse(bg);
  return [0, 1, 2].map((i) => f[i] * f[3] + b[i] * (1 - f[3]));
}

const toCss = (rgb) => `rgb(${rgb.join(',')})`;

function luminance([r, g, b]) {
  const lin = (v) => {
    const x = v / 255;
    return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

/** Contrast of fg on bg; a translucent fg is composited over bg first. */
function ratio(fg, bg) {
  const B = over(bg, '#ffffff');
  const F = over(fg, toCss(B));
  const [hi, lo] = [luminance(F), luminance(B)].sort((a, b) => b - a);
  return (hi + 0.05) / (lo + 0.05);
}

// ─── Pairings ────────────────────────────────────────────────────────────────

const SURFACES = ['base', 'default', 'deep', 'elevated', 'canopy', 'hover'];
const STATUSES = ['success', 'error', 'warning', 'info'];
const AA = 4.5; // normal text
const UI = 3.0; // non-text UI boundaries (WCAG 1.4.11)

function audit(name, t) {
  const rows = [];
  const check = (label, fg, bg, min) => {
    const r = ratio(fg, bg);
    rows.push({ ok: r >= min, label, r, min });
  };

  for (const s of SURFACES) {
    const bg = t.surface[s];
    for (const k of ['primary', 'heading', 'muted', 'subtle']) {
      check(`text.${k} on surface.${s}`, t.text[k], bg, AA);
    }
    check(`text.gold on surface.${s}`, t.text.gold, bg, AA);
    for (const g of ['base', 'hover', 'active']) {
      check(`gold.${g} (as text) on surface.${s}`, t.gold[g], bg, AA);
    }
    check(`green.base (as text) on surface.${s}`, t.green.base, bg, AA);
    for (const k of STATUSES) {
      check(`${k}.base (as text) on surface.${s}`, t.semantic[k].base, bg, AA);
    }
  }

  // Filled elements that carry text.inverse (Button, Badge, Tooltip, banners…)
  for (const [label, bg] of [
    ['green.base', t.green.base],
    ['green.hover', t.green.hover],
    ['gold.base', t.gold.base],
    ['gold.hover', t.gold.hover],
    ['gold.active', t.gold.active],
    ['surface.inverse', t.surface.inverse],
    ...STATUSES.map((k) => [`${k}.base`, t.semantic[k].base]),
  ]) {
    check(`text.inverse on ${label}`, t.text.inverse, bg, AA);
  }

  // Solid brand panels (auth screen, headers): fixed-light text and vivid gold
  check(
    'text.on-brand on surface.brand',
    t.text['on-brand'],
    t.surface.brand,
    AA,
  );
  check(
    'gold.on-brand on surface.brand',
    t.gold['on-brand'],
    t.surface.brand,
    AA,
  );

  check('gold.active on gold.pale', t.gold.active, t.gold.pale, AA);
  check('gold.base on gold.pale', t.gold.base, t.gold.pale, AA);

  // Status badges: base text on its own translucent surface, over each page tone
  for (const k of STATUSES) {
    for (const s of ['base', 'default', 'elevated']) {
      const tint = toCss(over(t.semantic[k].surface, t.surface[s]));
      check(
        `${k}.base on ${k}.surface over surface.${s}`,
        t.semantic[k].base,
        tint,
        AA,
      );
    }
  }

  // Borders that define inputs and controls must be visible (>= 3:1)
  for (const s of ['base', 'default', 'elevated']) {
    check(`border.default on surface.${s}`, t.border.default, t.surface[s], UI);
    check(`border.strong on surface.${s}`, t.border.strong, t.surface[s], UI);
  }

  // Text on photos sits on an overlay that stays dark in both themes
  check(
    'text.on-overlay on overlay.heavy (over a white photo)',
    t.text['on-overlay'],
    toCss(over(t.overlay.heavy, '#ffffff')),
    AA,
  );
  check(
    'text.on-overlay on overlay.medium (over a mid-grey photo)',
    t.text['on-overlay'],
    toCss(over(t.overlay.medium, '#808080')),
    AA,
  );

  const failed = rows.filter((r) => !r.ok);
  console.log(
    `\n${name}: ${rows.length - failed.length}/${rows.length} pairings pass`,
  );
  for (const f of failed) {
    console.log(`  FAIL  ${f.label}  ${f.r.toFixed(2)}:1  (needs ${f.min}:1)`);
  }
  return failed.length;
}

const failures = audit('light', semantic) + audit('dark', darkTheme);
console.log(
  failures === 0 ? '\nAll pairings pass.' : `\n${failures} failure(s).`,
);
process.exit(failures === 0 ? 0 : 1);
