// packages/contracts/src/primitives/index.ts

export * from "./locale.ts";
export * from "./localized-text.ts";
export * from "./link.ts";
export * from "./address.ts";
export * from "./seo.ts";
export * from "./pagination.ts";
export * from "./rich-text.ts";
export * from "./media/index.ts";
export * from "./enums/index.ts";

// Primitives — the foundation layer of @paideon/contracts.
//
// Dependency-free value objects reused across every other layer in this
// package: locale/localized text, link, image, address, SEO metadata,
// pagination shapes, rich text, non-image media (audio/video/document),
// and the small shared enums (publish status, visibility, priority,
// sort direction).
//
// Rule: nothing in this folder imports from blocks/, domains/, editorial/,
// shared/, system/, or registry/. Primitives depends on nothing else in
// this package — everything else depends on it. If a file in here ever
// needs to import from one of those folders, it belongs in one of them
// instead, not here.
//
// Consumed via the `Primitives` namespace from the package root
// (`Primitives.Locale`, `Primitives.Image`, etc.) — see the root index.ts
// and the package README for the import convention.
