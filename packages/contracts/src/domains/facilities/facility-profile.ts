// packages/contracts/src/domains/facilities/facility-profile.ts

import { z } from "zod";

import { ImageSchema } from "../../primitives/media/index.ts";

export const FacilityTypeEnum = z.enum([
  "building",
  "laboratory",
  "auditorium",
  "sports",
  "pool",
  "library",
]);

export const FacilityCardVariantEnum = z.enum(["standard", "schedule"]);

export const FacilityScheduleSlotSchema = z.object({
  day: z.string().min(1),
  opens: z.string().min(1),
  closes: z.string().min(1),
  notes: z.string().optional(),
});

export const FacilityCardScheduleSlotSchema = z.object({
  day: z.string().min(1),
  time: z.string().min(1),
  group: z.string().min(1),
});

export const FacilitySchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  name: z.string().min(1),
  type: FacilityTypeEnum,
  description: z.string().min(1),
  images: z.array(ImageSchema).min(1),
  features: z.array(z.string()).optional(),
  capacity: z.number().int().positive().optional(),
  schedule: z.array(FacilityScheduleSlotSchema).optional(),
});

export const FacilityCardSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  name: z.string().min(1),
  type: FacilityTypeEnum,
  description: z.string().min(1),
  image: ImageSchema,
  imageSrc: z.string().optional(),
  imageAlt: z.string().optional(),
  features: z.array(z.string()).optional(),
  schedule: z.array(FacilityCardScheduleSlotSchema).optional(),
  href: z.string().optional(),
});

export type FacilityTypeEnumData = z.infer<typeof FacilityTypeEnum>;
export type FacilityCardVariantType = z.infer<typeof FacilityCardVariantEnum>;
export type FacilityScheduleSlotData = z.infer<
  typeof FacilityScheduleSlotSchema
>;
export type FacilityData = z.infer<typeof FacilitySchema>;
export type FacilityCardData = z.infer<typeof FacilityCardSchema>;
