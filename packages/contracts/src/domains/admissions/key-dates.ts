// packages/contracts/src/features/admissions/key-dates.ts

import { z } from "zod";

export const AdmissionsDateCategoryEnum = z.enum([
  "application",
  "exam",
  "results",
  "enrollment",
  "other",
]);

export const AdmissionsDateSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  date: z.string().min(1),
  category: AdmissionsDateCategoryEnum,
  description: z.string().optional(),
});

export const AdmissionsCalendarSchema = z.object({
  academicYear: z.string().min(1),
  dates: z.array(AdmissionsDateSchema),
});

export type AdmissionsDateCategoryEnumData = z.infer<
  typeof AdmissionsDateCategoryEnum
>;
export type AdmissionsDateData = z.infer<typeof AdmissionsDateSchema>;
export type AdmissionsCalendarData = z.infer<typeof AdmissionsCalendarSchema>;
