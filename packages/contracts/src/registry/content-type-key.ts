// packages/contracts/src/registry/content-type-key.ts
//
// The exhaustive union of every content-type identifier in the system: every
// block type, plus every editorial and domain content type that can be
// stored as a ContentEntry.

import { z } from 'zod';

import { BLOCK_TYPE_VALUES } from '../blocks/block-type.ts';

// Content type keys are the union of all block types plus editorial and domain content types
export const CONTENT_TYPE_KEY_VALUES = [
  ...BLOCK_TYPE_VALUES,
  // Editorial content types
  'news-article',
  'news-category',
  'event',
  'event-category',
  'gallery-album',
  'gallery-photo',
  'achievement',
  'achievement-ticker',
  // Domain content types
  'department',
  'subject',
  'stream',
  'staff-member',
  'facility',
  'extracurricular',
  'society',
  'contact-form',
  'feedback-form',
] as const;

export const ContentTypeKeyEnum = z.enum(CONTENT_TYPE_KEY_VALUES);

export type ContentTypeKeyEnumData = z.infer<typeof ContentTypeKeyEnum>;

// The schema map over the block-type subset lives in lookup.ts
// (BLOCK_SCHEMA_MAP). Editorial and domain content types aren't mapped
// yet — that's the remaining TODO.
