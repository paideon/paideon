import { z } from 'zod';

export const EventStatus = z.enum([
  'upcoming',
  'today',
  'ongoing',
  'past',
  'registration-open',
  'registration-closed',
]);

export const EventCardVariant = z.enum(['standard', 'compact', 'featured']);

// Card projection, matching EventCardProps and Calendar in @paideon/ui.
export const EventCardSchema = z.object({
  id: z.string(),
  variant: EventCardVariant.optional(),
  title: z.string(),
  description: z.string().optional(),
  date: z.string(),
  time: z.string().optional(),
  venue: z.string().optional(),
  category: z.string().optional(),
  status: EventStatus.optional(),
  href: z.string(),
  imageSrc: z.string().optional(),
  imageAlt: z.string().optional(),
  relativeTime: z.string().optional(),
  registrationHref: z.string().optional(),
});

export type EventCardData = z.infer<typeof EventCardSchema>;
export type EventStatusType = z.infer<typeof EventStatus>;
export type EventCardVariantType = z.infer<typeof EventCardVariant>;
