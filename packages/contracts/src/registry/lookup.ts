// packages/contracts/src/registry/lookup.ts
//
// The only supported way to query the registry (F-052). Every function here
// used to be a stub that returned its own enum/schema regardless of input —
// none of it actually looked anything up. This is the real implementation.

import type { z } from "zod";

import type { BlockTypeEnumData } from "../blocks/block-type.ts";
import {
  AnnouncementSchema,
  AnthemSchema,
  ContactInfoSchema,
  CrestSchema,
  CtaSchema,
  DownloadsSchema,
  FaqSchema,
  GallerySchema,
  HeroSchema,
  KeyDatesSchema,
  MapSchema,
  MembersSchema,
  PhotoStripSchema,
  ProcessStepsSchema,
  QuoteSchema,
  ResultsDisplaySchema,
  RichTextBlockSchema,
  StatsSchema,
  TimelineSchema,
  ValuesSchema,
} from "../blocks/index.ts";
import * as GlobalRegistry from "./global-registry/index.ts";
import type { PageKeyEnumData } from "./page-key.ts";
import * as PageRegistries from "./page-registry/index.ts";
import type { PageRegistry, PageSection } from "./types.ts";

// ─── Block-level schema map ──────────────────────────────────────────────
//
// Covers every key in BLOCK_TYPE_VALUES. Editorial and domain content types
// (news-article, staff-member, facility, and so on) aren't in this map yet —
// each already has its own schema in editorial/ and domains/, but nothing
// has assembled them into one lookup table keyed by ContentTypeKeyEnum. That
// remains a real TODO, same as content-type-key.ts already says.

export const BLOCK_SCHEMA_MAP = {
  hero: HeroSchema,
  stats: StatsSchema,
  timeline: TimelineSchema,
  quote: QuoteSchema,
  faq: FaqSchema,
  cta: CtaSchema,
  gallery: GallerySchema,
  downloads: DownloadsSchema,
  announcement: AnnouncementSchema,
  "contact-info": ContactInfoSchema,
  map: MapSchema,
  "staff-grid": MembersSchema,
  "photo-strip": PhotoStripSchema,
  "process-steps": ProcessStepsSchema,
  "results-display": ResultsDisplaySchema,
  "rich-text-block": RichTextBlockSchema,
  "key-dates": KeyDatesSchema,
  "crest-symbols": CrestSchema,
  anthem: AnthemSchema,
  "values-grid": ValuesSchema,
  footer: GlobalRegistry.FooterContentSchema,
  navigation: GlobalRegistry.NavigationContentSchema,
} as const satisfies Record<BlockTypeEnumData, z.ZodTypeAny>;

// ─── Page registry ────────────────────────────────────────────────────────

export const PAGE_REGISTRY: Record<PageKeyEnumData, PageRegistry> = {
  home: PageRegistries.homeRegistry,
  about: PageRegistries.aboutRegistry,
  academics: PageRegistries.academicsRegistry,
  administration: PageRegistries.administrationRegistry,
  admissions: PageRegistries.admissionsRegistry,
  contact: PageRegistries.contactRegistry,
  events: PageRegistries.eventsRegistry,
  extracurriculars: PageRegistries.extracurricularsRegistry,
  facilities: PageRegistries.facilitiesRegistry,
  gallery: PageRegistries.galleryRegistry,
  news: PageRegistries.newsRegistry,
  results: PageRegistries.resultsRegistry,
  societies: PageRegistries.societiesRegistry,
};

export const GLOBAL_SECTIONS: PageSection[] = [
  GlobalRegistry.navigationSection,
  GlobalRegistry.footerSection,
];

// ─── Query functions ──────────────────────────────────────────────────────

export function getPageDefinition(
  pageKey: PageKeyEnumData
): PageRegistry | undefined {
  return PAGE_REGISTRY[pageKey];
}

export function getSectionDefinition(
  scope: string,
  sectionKey: string
): PageSection | undefined {
  if (scope === "global" || scope.startsWith("global:")) {
    return getGlobalSection(sectionKey);
  }
  const pageKey = scope.replace(/^page:/, "") as PageKeyEnumData;
  const page = PAGE_REGISTRY[pageKey];
  return page?.sections.find((section) => section.key === sectionKey);
}

export function getGlobalSection(sectionKey: string): PageSection | undefined {
  return GLOBAL_SECTIONS.find((section) => section.key === sectionKey);
}

/**
 * Flat map of every section schema across every page, keyed by sectionKey
 * (e.g. 'about.hero', 'academics.streams'). Used by content-entry.ts's
 * `update` mutation to validate incoming data against the right schema for
 * whatever sectionKey the admin panel is saving.
 */
export function getAllSectionSchemas(): Record<string, z.ZodTypeAny> {
  const schemas: Record<string, z.ZodTypeAny> = {};
  for (const page of Object.values(PAGE_REGISTRY)) {
    for (const section of page.sections) {
      schemas[section.key] = section.schema;
    }
  }
  return schemas;
}

/**
 * Same idea as getAllSectionSchemas, but for global (not page-scoped)
 * sections — currently footer and navigation.
 */
export function getGlobalSectionSchemas(): Record<string, z.ZodTypeAny> {
  const schemas: Record<string, z.ZodTypeAny> = {};
  for (const section of GLOBAL_SECTIONS) {
    schemas[section.key] = section.schema;
  }
  return schemas;
}

export function getContentSchema(
  key: BlockTypeEnumData
): z.ZodTypeAny | undefined {
  return BLOCK_SCHEMA_MAP[key];
}

export function getContentTypesByCategory(
  category: "block" | "editorial" | "domain"
): readonly string[] {
  if (category === "block") {
    return Object.keys(BLOCK_SCHEMA_MAP);
  }
  // Editorial and domain categories aren't split out from
  // CONTENT_TYPE_KEY_VALUES yet — see content-type-key.ts.
  return [];
}
