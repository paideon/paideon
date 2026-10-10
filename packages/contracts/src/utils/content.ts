// packages/contracts/src/utils/content.ts

// Pure predicates/transforms over primitive shapes.

import { LocalizedTextSchema } from '../primitives/localized-text.ts';

export function isLocalized(
  value: unknown,
): value is { en: string; si: string; ta: string } {
  return LocalizedTextSchema.safeParse(value).success;
}

export function normalizeRichText(text: unknown): string {
  if (typeof text === 'string') {
    return text.trim();
  }
  return '';
}
