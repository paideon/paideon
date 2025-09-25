// packages/contracts/src/primitieves/locales.ts

import { z } from 'zod';

export const LOCALE_VALUES = ['en', 'si', 'ta'] as const;

export const SUPPORTED_LOCALES = LOCALE_VALUES;

export const LocaleEnum = z.enum(LOCALE_VALUES);

export type LocaleEnumData = z.infer<typeof LocaleEnum>;

export const DEFAULT_LOCALE: LocaleEnumData = 'en';

export const LOCALE_LABELS: Record<LocaleEnumData, string> = {
  en: 'English',
  si: 'සිංහල',
  ta: 'தமிழ்',
};
