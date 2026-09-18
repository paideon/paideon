// packages/contracts/src/registry/page-registry/news.ts
//
// Page registry for: News and Announcements (docs/Design System/Page
// Specifications.md section 06). The full article page (/news/[slug])
// reads a single NewsArticle row via the `news` tRPC router (packages/api)
// — it isn't a registry section here, since it's one article at a time,
// not a page composed of interchangeable ContentEntry sections.

import { AnnouncementSchema, HeroSchema } from "../../blocks/index.ts";
import type { PageRegistry } from "../types.ts";

export const NewsHeroSchema = HeroSchema;

export const NewsAnnouncementSchema = AnnouncementSchema;

// NewsFeaturedSchema / NewsFeedSchema (and their 'news.featured' / 'news.feed'
// sections) were removed as of M3. They were ContentEntry placeholders
// authored while News was still a "deferred domain model" (F-057) with no
// real backing table — an editor would hand-paste article JSON into a
// generic textarea. Now that NewsArticle + newsRouter are real, the featured
// slot and paginated feed are populated live from `news.getFeatured` /
// `news.list`, not from a ContentEntry row. Only the two genuinely
// hand-authored page-chrome sections remain here.

export const newsRegistry: PageRegistry = {
  page: "news",
  scope: "page:news",
  label: "News and Announcements",
  description:
    "Manage the News page hero and announcement banner. The featured article and news feed are populated automatically from published articles — manage those under the News module, not here.",
  sections: [
    {
      key: "news.hero",
      blockKey: "hero",
      label: "Hero Banner",
      description: "Top-of-page headline and eyebrow text.",
      schema: NewsHeroSchema,
    },
    {
      key: "news.announcement",
      blockKey: "announcement",
      label: "Announcement Banner",
      description:
        'Optional dismissible urgent notice (e.g. "School reopens 5 May").',
      schema: NewsAnnouncementSchema,
    },
  ],
};
