// packages/transport/src/serialization/search-params.ts

/** Converts a params object into URLSearchParams, repeating the key for array values and skipping null/undefined. */
export function toSearchParams(
  params: Record<string, unknown>
): URLSearchParams {
  const search = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) continue;

    if (Array.isArray(value)) {
      for (const item of value) search.append(key, String(item));
      continue;
    }

    search.append(key, String(value));
  }

  return search;
}
