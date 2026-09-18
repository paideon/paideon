// packages/contracts/src/domains/extracurriculars/achievement.ts
//
// Card-projection companion to activity.ts's ActivitySchema — what
// @paideon/ui's ExtracurricularCard renders as `recentAchievements` is a
// flattened `string[]` (ActivitySchema itself), not this richer shape.
// This schema is kept for callers that want the structured record
// directly (e.g. a future "all achievements for this activity" detail
// view) — the full, persisted entity is
// packages/api/src/modules/extracurriculars/validators.ts's
// ExtracurricularAchievementOutput, which this mirrors.
//
// Distinct from editorial/achievements/achievement.ts's `AchievementSchema`
// — that one is school-wide (home page + a dedicated achievements list,
// Task 7.19), this one is scoped to a single extracurricular activity.

import { z } from "zod";

import { AchievementLevel } from "../../editorial/achievements/achievement.ts";

export const ExtracurricularAchievementSchema = z.object({
  id: z.string().min(1),
  activityId: z.string().min(1),
  title: z.string().min(1),
  description: z.string().optional(),
  level: AchievementLevel,
  date: z.string().min(1),
  awardedBy: z.string().optional(),
});

export type ExtracurricularAchievementData = z.infer<
  typeof ExtracurricularAchievementSchema
>;
