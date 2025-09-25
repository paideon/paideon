// packages/contracts/src/editorial/achievements/ticker-config.ts
//
// Achievement ticker — horizontally scrolling achievement strip on the home page.
//
// Notes:
//   Items are manually curated — not auto-generated from all achievements.
//   Stored in ContentEntry: sectionKey 'home.ticker', scope 'page:home'.

import { z } from 'zod';

export const ACHIEVEMENT_TICKER_CONTENT_TYPE = 'achievement-ticker';

export const TickerItemSchema = z.object({
  id: z.string().min(1),
  text: z.string().min(1).max(80),
  category: z.string().optional(),
  href: z.string().url().optional(),
});

export const TickerSchema = z.object({
  items: z.array(TickerItemSchema),
  speed: z.string().optional(),
});

export type TickerItemData = z.infer<typeof TickerItemSchema>;
export type TickerData = z.infer<typeof TickerSchema>;
export type Ticker = TickerData;
