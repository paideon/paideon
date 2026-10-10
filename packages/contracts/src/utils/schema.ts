// packages/contracts/src/utils/schema.ts

// Generic, concept-agnostic helpers for building a discriminated-union schema
// and a keyed lookup record from a single ordered tuple of schemas.

import { z } from 'zod';

export type SchemaEntry<T extends z.ZodTypeAny, K extends string> = {
  schema: T;
  key: K;
};

export function buildLookupRecord<T extends z.ZodTypeAny, K extends string, V>(
  entries: readonly SchemaEntry<T, K>[],
  valueSelector: (entry: SchemaEntry<T, K>) => V,
): Record<K, V> {
  const record = {} as Record<K, V>;
  for (const entry of entries) {
    record[entry.key] = valueSelector(entry);
  }
  return record;
}
