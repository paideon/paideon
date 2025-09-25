// packages/contracts/src/blocks/index.ts

export * from './block-type.js';

// generic blocks
export * from './generic/announcement.js';
export * from './generic/cta.js';
export * from './generic/downloads.js';
export * from './generic/faq.js';
export * from './generic/hero.js';
export * from './generic/quote.js';
export * from './generic/stats.js';
export * from './generic/rich-text-block.js';

// page specific blocks
export * from './page-specific/anthem.js';
export * from './page-specific/contact-info.js';
export * from './page-specific/crest-symbol.ts';
export * from './page-specific/gallery.js';
export * from './page-specific/key-dates.js';
export * from './page-specific/map.js';
export * from './page-specific/staff-grid.js';
export * from './page-specific/photo-strip.js';
export * from './page-specific/process-steps.js';
export * from './page-specific/results-display.js';
export * from './page-specific/timeline.js';
export * from './page-specific/values-grid.js';

// packages/contracts/src/blocks/index.ts
//
// ─── PURPOSE ──────────────────────────────────────────────────────────────────
// This folder is the central contract library for every editable content unit
// (or "section") that can be placed on a page or global area.
//
// Each file exports two things:
//   1. A Zod Schema (e.g., HeroSchema) – used to validate the JSON `data` payload
//      stored in a ContentEntry row before it hits the database.
//   2. An inferred TypeScript type (e.g., HeroData) – used across the Admin UI,
//      the Public UI, and the API to ensure type safety without code duplication.
//
// ─── CONSUMERS ──────────────────────────────────────────────────────────────
// These schemas are the single source of truth for three distinct layers:
//   - The Admin Panel (apps/admin) – Uses the schemas to render dynamic forms
//     and validate user input before saving.
//   - The API (packages/api) – Uses the schemas in tRPC procedures to validate
//     incoming updates (via contentEntryRouter.update).
//   - The Public Website (apps/web) – Uses the inferred types to type the data
//     fetched from the server (via the typed page fetchers).
//   - The Page Registry (packages/contracts/src/registry) – References these
//     schemas via their content-type keys (F-052) to map a `sectionKey` to the
//     correct validation logic.
//
// ─── FOLDER STRUCTURE ──────────────────────────────────────────────────────
// The blocks are logically split into two subfolders for clarity:
//   - generic/   → Truly reusable UI widgets that could appear on any page
//                  (hero, stats, cta, faq, quote, rich-text, announcement, downloads).
//   - page-specific/ → Highly specialised sections tied to a single page
//                      (crest, anthem, timeline, key-dates, etc.).
//
// This separation is purely for developer readability. Both categories are
// exported identically from this barrel file, so the rest of the codebase
// imports everything from the top-level `blocks` namespace without caring
// which subfolder a particular schema lives in.
//
// ─── RULE ──────────────────────────────────────────────────────────────────
// Every schema exported here MUST have a corresponding entry in
// BLOCK_TYPE_VALUES (defined in block-type.ts). That enum powers the
// Page Registry (F-052) and ensures the system knows about every possible
// editable section type at compile time.
// ─────────────────────────────────────────────────────────────────
