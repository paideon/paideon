// packages/contracts/src/registry/page-key.ts
//
// The closed set of public page keys (F-052). One PageRegistry entry exists
// per key, in registry/page-registry/.
//
// This file used to also hold PageDefinitionSchema, a serializable
// path+seo+sections shape with zero consumers anywhere in the codebase — it
// was the old PageConfig model, which the Feature Registry (F-052) already
// says was "removed entirely rather than deferred." It just hadn't actually
// been removed from here yet.

import { z } from 'zod';

export const PAGE_KEY_VALUES = [
  'home',
  'about',
  'academics',
  'administration',
  'admissions',
  'contact',
  'events',
  'extracurriculars',
  'facilities',
  'gallery',
  'news',
  'results',
  'societies',
] as const;

export const PageKeyEnum = z.enum(PAGE_KEY_VALUES);

export type PageKeyEnumData = z.infer<typeof PageKeyEnum>;
