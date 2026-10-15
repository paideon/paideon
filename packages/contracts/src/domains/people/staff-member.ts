import { z } from 'zod';

import { AvatarSchema } from '../../primitives/media/index.ts';
import { DepartmentKeyEnum } from '../academics/department.ts';

// 'head-prefect' is a real StaffRole value even though prefects are students.
export const StaffRoleEnum = z.enum([
  'principal',
  'deputy-principal',
  'assistant-principal',
  'head-prefect',
  'teacher',
  'support',
]);

export const StaffCardVariantEnum = z.enum(['principal', 'grid', 'compact']);

export const StaffSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  role: StaffRoleEnum,
  title: z.string().min(1),
  department: DepartmentKeyEnum.optional(),
  portfolio: z.string().optional(),
  tenure: z.string().optional(),
  quote: z.string().optional(),
  bio: z.string().optional(),
  portrait: AvatarSchema.optional(),
  contactEmail: z.string().email().optional(),
  joinedYear: z.string().optional(),
});

export const StaffCardSchema = StaffSchema.extend({
  imageSrc: z.string().optional(),
  imageAlt: z.string().optional(),
  href: z.string().optional(),
}).omit({
  bio: true,
  joinedYear: true,
});

export type StaffRoleEnumData = z.infer<typeof StaffRoleEnum>;
export type StaffCardVariantType = z.infer<typeof StaffCardVariantEnum>;
export type StaffData = z.infer<typeof StaffSchema>;
export type StaffCardData = z.infer<typeof StaffCardSchema>;

/**
 * Role hierarchy, principal down to support staff. Sorting on `role`
 * directly would order alphabetically (assistant-principal first), which is
 * not the intended hierarchy.
 */
export const STAFF_ROLE_HIERARCHY: readonly StaffRoleEnumData[] = [
  'principal',
  'deputy-principal',
  'assistant-principal',
  'head-prefect',
  'teacher',
  'support',
];

export const STAFF_ROLE_LABELS: Record<StaffRoleEnumData, string> = {
  principal: 'Principal',
  'deputy-principal': 'Deputy Principal',
  'assistant-principal': 'Assistant Principal',
  'head-prefect': 'Head Prefect',
  teacher: 'Teacher',
  support: 'Support Staff',
};

/**
 * Flattens `StaffData`'s nested `portrait: { src, alt }` into the
 * `imageSrc`/`imageAlt` props StaffCard reads. Spreading a raw `StaffData`
 * into StaffCard does not rename those fields, so the card silently falls
 * back to its monogram. Build StaffCard props through this helper instead.
 *
 * `href` cannot be derived from `StaffData`, so callers pass it via
 * `overrides` when they want a profile link.
 */
export function toStaffCardData(
  staff: StaffData,
  overrides: Partial<Pick<StaffCardData, 'href'>> = {},
): StaffCardData {
  return {
    id: staff.id,
    name: staff.name,
    role: staff.role,
    title: staff.title,
    department: staff.department,
    portfolio: staff.portfolio,
    tenure: staff.tenure,
    quote: staff.quote,
    portrait: staff.portrait,
    contactEmail: staff.contactEmail,
    imageSrc: staff.portrait?.src,
    imageAlt: staff.portrait?.alt,
    href: overrides.href,
  };
}
