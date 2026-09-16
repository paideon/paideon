// packages/transport/src/utils/merge.ts

export type PlainObject = Record<string, unknown>;

function isPlainObject(value: unknown): value is PlainObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Recursively merges `source` over `target`; plain objects are merged key-by-key, everything else is overwritten. */
export function mergeDeep<T extends PlainObject, U extends PlainObject>(
  target: T,
  source: U
): T & U {
  const result: PlainObject = { ...target };

  for (const key of Object.keys(source)) {
    const sourceValue = source[key];
    const targetValue = result[key];

    result[key] =
      isPlainObject(sourceValue) && isPlainObject(targetValue)
        ? mergeDeep(targetValue, sourceValue)
        : sourceValue;
  }

  return result as T & U;
}
