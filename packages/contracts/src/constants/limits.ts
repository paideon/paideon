// packages/contracts/src/constants/limits.ts

export const DEFAULT_PAGE_SIZE = 20;
export const MAX_GALLERY_IMAGES = 50;
export const MIN_PASSWORD_LENGTH = 8;
export const DEFAULT_UPLOAD_LIMIT = 10 * 1024 * 1024; // 10MB in bytes
export const MAX_RICH_TEXT_LENGTH = 100000;
export const MAX_TITLE_LENGTH = 200;
export const MAX_DESCRIPTION_LENGTH = 500;
/** Task 7.17/F-179 — bounds the achievements array on one
 * ExtracurricularActivity's create/update input, the same role
 * MAX_GALLERY_IMAGES plays for GalleryAlbum.photos. A team's trophy
 * cabinet is large but finite; this exists to stop a malformed or
 * malicious payload from submitting an unbounded array, not because any
 * real activity is expected to approach it. */
export const MAX_ACTIVITY_ACHIEVEMENTS = 100;
