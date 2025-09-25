// packages/contracts/src/blocks/block-type.ts
//
// The single closed enum of every valid block identifier.
// Central contract for the canonical block-type values and shared constants.

import { z } from 'zod';

export const BLOCK_TYPE_VALUES = [
  'hero',
  'stats',
  'timeline',
  'quote',
  'faq',
  'cta',
  'gallery',
  'downloads',
  'announcement',
  'contact-info',
  'map',
  'staff-grid',
  'photo-strip',
  'process-steps',
  'results-display',
  'rich-text-block',
  'key-dates',
  'crest-symbols',
  'anthem',
  'values-grid',
  'footer',
  'navigation',
] as const;

export const BlockTypeEnum = z.enum(BLOCK_TYPE_VALUES);

export type BlockTypeEnumData = z.infer<typeof BlockTypeEnum>;

// Named literal constants for each block type
export const HERO_BLOCK = 'hero';
export const STATS_BLOCK = 'stats';
export const TIMELINE_BLOCK = 'timeline';
export const QUOTE_BLOCK = 'quote';
export const FAQ_BLOCK = 'faq';
export const CTA_BLOCK = 'cta';
export const GALLERY_BLOCK = 'gallery';
export const DOWNLOADS_BLOCK = 'downloads';
export const ANNOUNCEMENT_BLOCK = 'announcement';
export const CONTACT_INFO_BLOCK = 'contact-info';
export const MAP_BLOCK = 'map';
export const STAFF_GRID_BLOCK = 'staff-grid';
export const PHOTO_STRIP_BLOCK = 'photo-strip';
export const PROCESS_STEPS_BLOCK = 'process-steps';
export const RESULTS_DISPLAY_BLOCK = 'results-display';
export const RICH_TEXT_BLOCK = 'rich-text-block';
export const KEY_DATES_BLOCK = 'key-dates';
export const CREST_SYMBOLS_BLOCK = 'crest-symbols';
export const ANTHEM_BLOCK = 'anthem';
export const VALUES_GRID_BLOCK = 'values-grid';
export const FOOTER_BLOCK = 'footer';
export const NAVIGATION_BLOCK = 'navigation';
