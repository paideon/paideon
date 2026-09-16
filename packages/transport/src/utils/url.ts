// packages/transport/src/utils/url.ts

/**
 * Joins URL segments with exactly one slash between them, e.g.
 * joinUrl('https://api.example.com/', '/news', '42') → 'https://api.example.com/news/42'.
 * The protocol's own `//` in the first segment is left untouched.
 */
export function joinUrl(...parts: Array<string | undefined | null>): string {
  const segments = parts.filter((part): part is string =>
    Boolean(part && part.length > 0)
  );

  return segments
    .map((part, index) => {
      const stripLeading = index > 0 ? part.replace(/^\/+/, "") : part;
      const stripTrailing =
        index < segments.length - 1
          ? stripLeading.replace(/\/+$/, "")
          : stripLeading;
      return stripTrailing;
    })
    .join("/");
}
