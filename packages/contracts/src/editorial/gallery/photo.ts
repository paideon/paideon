// packages/contracts/src/editorial/gallery/photo.ts
//
// Task 7.7/F-168: the full, persisted `GalleryPhoto` entity (src, alt,
// caption, order) lives as Zod I/O schemas in
// packages/api/src/modules/gallery/validators.ts, the same relocation
// album.ts's own header comment describes. `LightboxImageSchema`
// (shared/lightbox-image.ts) is the separate, unrelated projection
// @paideon/ui's Lightbox actually renders from — untouched by this move.

export const GALLERY_PHOTO_CONTENT_TYPE = "gallery-photo";
