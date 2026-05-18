// packages/types/src/index.ts
// @paideon/types
//
// Shared types used by both apps/portal and apps/api.
// Neither app defines its own version of these — they both import from here.

// ── Library Stats ──────────────────────────────────────────────────────────

export interface LibraryStats {
  students: number;
  teachers: number;
  staff: number;
  books: number;
}

export const LIBRARY_STATS_FALLBACK: LibraryStats = {
  students: 4198,
  teachers: 188,
  staff: 77,
  books: 8500,
};

// ── Role ───────────────────────────────────────────────────────────────────
// Mirrors the Prisma Role enum exactly.
// Import this in the portal instead of importing Role from @prisma/client
// (Prisma client belongs only in the API and database packages).

export type Role =
  | "STUDENT"
  | "TEACHER"
  | "PARENT"
  | "STAFF"
  | "LIBRARIAN"
  | "ADMIN";
