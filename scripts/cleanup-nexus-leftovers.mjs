#!/usr/bin/env node
// Removes Nexus (public school website) leftovers from the Paideon monorepo.
//
//   node scripts/cleanup-nexus-leftovers.mjs           -> dry run, prints the plan
//   node scripts/cleanup-nexus-leftovers.mjs --apply   -> performs it
//
// Run from the repo root, on a clean git tree, after: git tag pre-cleanup
// Scope: packages/ui, packages/contracts, packages/tokens (themes).
// The Prisma schema is handled separately (schema.pruned.prisma).

import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const APPLY = process.argv.includes('--apply');
const abs = (p) => path.join(ROOT, p);

if (
  !fs.existsSync(abs('packages/ui/src')) ||
  !fs.existsSync(abs('packages/contracts/src'))
) {
  console.error('Run this from the Paideon repo root.');
  process.exit(1);
}

// ---------------------------------------------------------------- what goes
const UI = 'packages/ui/src';
const uiFiles = (dir, names) => names.map((n) => `${UI}/${dir}/${n}`);

const DELETE = [
  // website cards (StatCard stays)
  ...uiFiles('components/cards', [
    'AcademicStreamCard.tsx',
    'AchievementCard.tsx',
    'AlumniCard.tsx',
    'ArchiveCard.tsx',
    'DownloadableDocumentItem.tsx',
    'EventCard.tsx',
    'ExtracurricularCard.tsx',
    'FacilityCard.tsx',
    'GalleryAlbumCard.tsx',
    'NewsCard.tsx',
    'SocietyBanner.tsx',
    'SocietyCard.tsx',
    'StaffCard.tsx',
  ]),
  ...uiFiles('components/effects', ['AmbientEmbers.tsx']),
  // Calendar.tsx is a website events calendar that imports EventCardData, which no longer
  // exists in contracts (already a type error today). Rebuild it with the school-calendar module.
  ...uiFiles('components/forms', [
    'AlumniSubmitForm.tsx',
    'ContactForm.tsx',
    'FeedbackForm.tsx',
    'Calendar.tsx',
  ]),
  ...uiFiles('components/layout', [
    'Hero.tsx',
    'MasonryGrid.tsx',
    'QuickAccessPortal.tsx',
  ]),
  ...uiFiles('components/media', [
    'AudioPlayer.tsx',
    'Lightbox.tsx',
    'MapEmbed.tsx',
    'PanoramicFacilityViewer.tsx',
    'VideoFrame.tsx',
  ]),
  ...uiFiles('components/navigation', ['TableOfContents.tsx']),
  ...uiFiles('components/notifications', ['AnnouncementBanner.tsx']),
  ...uiFiles('components/overlays', ['ShareSheet.tsx']),
  ...uiFiles('components/page-states', ['CookieConsentBanner.tsx']),
  ...uiFiles('components/sections', [
    'AchievementTicker.tsx',
    'CategorizedPhotoStrip.tsx',
    'LeaderMessage.tsx',
    'MilestoneTimeline.tsx',
    'ProfileCarousel.tsx',
    'SectionSlider.tsx',
    'Timeline.tsx',
  ]),
  ...uiFiles('components/typography', [
    'QuoteBlock.tsx',
    'RichTextRenderer.tsx',
  ]),
  ...uiFiles('components/utilities', [
    'BackToTopButton.tsx',
    'CountdownTimer.tsx',
    'ScrollProgressBar.tsx',
  ]),
  ...uiFiles('components/visualization', [
    'ResultsDisplay.tsx',
    'StreamComparisonTable.tsx',
    'StudentJourneyFlow.tsx',
  ]),
  ...uiFiles('components/atoms', ['ResultsGradeBadge.tsx']),
  ...uiFiles('hooks', ['useActiveSection.ts', 'useMousePosition.ts']),
  ...uiFiles('components/icons/brand', [
    'CrestAnimation.tsx',
    'CrestDiagram.tsx',
  ]),
  `${UI}/components/icons/social`, // whole folder (fb, github, instagram, linkedin, whatsapp, youtube)

  // contracts: website content shapes. Re-derive from Prisma when each module is built.
  'packages/contracts/src/domains/academics',
  'packages/contracts/src/domains/archive',
  'packages/contracts/src/domains/extracurriculars',
  'packages/contracts/src/domains/facilities',
  'packages/contracts/src/domains/people',
  'packages/contracts/src/domains/societies',
  'packages/contracts/src/shared/crest-symbol.ts',
  'packages/contracts/src/shared/lightbox-image.ts',
  'packages/contracts/src/shared/toc-section.ts',
  'packages/contracts/src/shared/video-source.ts',

  // themes: only light and dark ship
  'packages/tokens/src/themes/horizon.ts',
  'packages/tokens/src/themes/high-contrast.ts',
];

const BARREL_DIRS = [
  'packages/ui/src/components',
  'packages/ui/src/hooks',
  'packages/contracts/src',
  'packages/tokens/src/themes',
];

// ---------------------------------------------------------- virtual file system
const gone = new Set(); // absolute file paths removed
const rewritten = new Map(); // absolute path -> new content

function walk(dir) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(p));
    else out.push(p);
  }
  return out;
}
const isFile = (p) =>
  fs.existsSync(p) && fs.statSync(p).isFile() && !gone.has(p);
const read = (p) => rewritten.get(p) ?? fs.readFileSync(p, 'utf8');

for (const rel of DELETE) {
  const p = abs(rel);
  if (!fs.existsSync(p)) {
    console.warn(`skip (not found): ${rel}`);
    continue;
  }
  if (fs.statSync(p).isDirectory()) walk(p).forEach((f) => gone.add(f));
  else gone.add(p);
}

// ---------------------------------------------------------------- barrels
const STATEMENT =
  /^[ \t]*export\s+(?:type\s+)?(?:\*(?:\s+as\s+\w+)?|\{[^}]*\})\s+from\s+['"]([^'"]+)['"];?[ \t]*\r?\n?/gm;

function resolves(fromFile, spec) {
  if (!spec.startsWith('.')) return true; // external package, not our business
  const base = path.resolve(path.dirname(fromFile), spec);
  return [
    base,
    `${base}.ts`,
    `${base}.tsx`,
    `${base}/index.ts`,
    `${base}/index.tsx`,
  ].some(isFile);
}

function pruneBarrel(file) {
  const src = read(file);
  let removed = 0;
  let next = src.replace(STATEMENT, (full, spec) => {
    if (resolves(file, spec)) return full;
    removed++;
    return '\u0000'; // marker, so we can also drop a comment line that only introduced it
  });
  if (!removed) return false;
  // drop a pure-comment line that sat directly above a removed statement, if the next
  // line is not another export (i.e. the comment would be orphaned)
  next = next
    .replace(/^[ \t]*\/\/[^\n]*\n(?=\u0000)/gm, '')
    .replace(/\u0000/g, '');
  next = next.replace(/\n{3,}/g, '\n\n');
  rewritten.set(file, next);
  return true;
}
const hasExports = (file) =>
  /\bexport\b/.test(read(file).replace(/\/\/[^\n]*/g, ''));

let changed = true;
while (changed) {
  changed = false;
  const barrels = BARREL_DIRS.flatMap((d) => walk(abs(d))).filter(
    (f) => /[\\/]index\.tsx?$/.test(f) && !gone.has(f),
  );
  for (const b of barrels) {
    if (pruneBarrel(b)) changed = true;
    if (!hasExports(b)) {
      gone.add(b);
      rewritten.delete(b);
      changed = true;
    }
  }
}

// ------------------------------------------------------------------- patches
// ThemeToggle (inside @paideon/ui) imports from '@paideon/ui' itself: a circular self-import
// that only resolves because of the workspace link. Use relative imports instead.
{
  const f = abs(`${UI}/components/layout/ThemeToggle.tsx`);
  const from = "import { Button, Icon } from '@paideon/ui';";
  const to =
    "import { Button } from '../atoms/Button';\nimport { Icon } from '../icons/Icon';";
  if (isFile(f) && read(f).includes(from))
    rewritten.set(f, read(f).replace(from, to));
  else
    console.warn('skip patch (ThemeToggle import line not found as expected)');
}

// ------------------------------------------------------------------- report
const removedFiles = [...gone].map((f) => path.relative(ROOT, f)).sort();
const lines = (f) =>
  fs.existsSync(f) ? fs.readFileSync(f, 'utf8').split('\n').length : 0;
const removedLines = [...gone].reduce((n, f) => n + lines(f), 0);

console.log(
  `${APPLY ? 'APPLYING' : 'DRY RUN'}: ${removedFiles.length} files removed (~${removedLines} lines)`,
);
for (const f of removedFiles) console.log(`  - ${f}`);
console.log(`\n${rewritten.size} barrel file(s) rewritten:`);
for (const f of rewritten.keys()) console.log(`  ~ ${path.relative(ROOT, f)}`);

if (!APPLY) {
  console.log('\nNothing changed. Re-run with --apply.');
  process.exit(0);
}

for (const f of gone) fs.rmSync(f, { force: true });
for (const [f, content] of rewritten)
  if (!gone.has(f)) fs.writeFileSync(f, content);

// remove directories left empty
for (const d of BARREL_DIRS.map(abs)) {
  const dirs = walk(d).map((f) => path.dirname(f));
  const all = new Set();
  for (const x of fs.existsSync(d)
    ? fs.readdirSync(d, { recursive: true, withFileTypes: true })
    : []) {
    if (x.isDirectory()) all.add(path.join(x.parentPath ?? x.path, x.name));
  }
  for (const dir of [...all].sort((a, b) => b.length - a.length)) {
    if (fs.existsSync(dir) && fs.readdirSync(dir).length === 0)
      fs.rmdirSync(dir);
  }
  void dirs;
}

console.log(
  '\nDone. Next: pnpm install && pnpm typecheck && pnpm test && pnpm smoke:library',
);
console.log(
  'Also update packages/tokens/README.md (it still mentions the horizon theme).',
);
