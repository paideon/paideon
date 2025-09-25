// packages/contracts/src/registry/types.ts
//
// The runtime shape every page-registry file is built from (F-052). A
// PageRegistry pairs each section with its live, importable block schema —
// not a serializable string reference — because the registry's whole job is
// letting the admin panel render a dynamic form and validate a submission
// against the real Zod schema for that section, in one step.
//
// This file was referenced by every page-registry file from the start but
// never actually created — every one of them failed to compile as a result.

import type { z } from 'zod';

import type { PageKeyEnumData } from './page-key.ts';
import type { BlockTypeEnumData } from '../blocks/block-type.ts';

export interface PageSection {
  key: string;
  blockKey: BlockTypeEnumData;
  label: string;
  description: string;
  schema: z.ZodTypeAny;
}

export interface PageRegistry {
  page: PageKeyEnumData;
  scope: string;
  label: string;
  description: string;
  sections: PageSection[];
}
