// packages/contracts/src/features/societies/achievement.ts

import { z } from 'zod';

import { AchievementLevel } from '../../editorial/achievements/achievement.ts';

export const SocietyAchievementSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().optional(),
  level: AchievementLevel,
  date: z.string().min(1),
  awardedBy: z.string().optional(),
  image: z.string().optional(),
});

export type SocietyAchievementData = z.infer<typeof SocietyAchievementSchema>;
