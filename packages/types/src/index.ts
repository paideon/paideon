// @paideon/types
// @paideon/types

// Shared types used by both apps/web and apps/api.
// Neither app defines its own version of these — they both import from here.
// If a shape changes, TypeScript errors surface in both places simultaneously.

//  Library Stats
// The shape of the school statistics object returned by GET /api/stats.
// Used as:
//   - The API controller return type (apps/api)
//   - The page.tsx fetch return type (apps/web)
//   - The prop type for AboutSection and ExploreSection (apps/web)

export interface LibraryStats {
  students: number; // total enrolled students    e.g. 4198
  teachers: number; // total teaching staff        e.g. 188
  staff: number; // total non-teaching staff    e.g. 77
  books: number; // total books in catalog      e.g. 8500
}

// ── Fallback ───────────────────────────────────────────────────────────────
// Used in two situations:
//   1. NOW  — API doesn't exist yet, page.tsx returns this directly
//   2. LATER — API is down, page.tsx catches the error and returns this
//
// Typed as LibraryStats so TypeScript forces this to stay in sync
// with the interface. If you add a field to LibraryStats, this will
// immediately error until you add it here too.

export const LIBRARY_STATS_FALLBACK: LibraryStats = {
  students: 4198,
  teachers: 188,
  staff: 77,
  books: 8500,
};
