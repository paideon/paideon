// packages/contracts/src/domains/people/staff-member.ts

// 'head-prefect' is a real StaffRole value even though prefects are students,

import { z } from "zod";

import { AvatarSchema } from "../../primitives/media/index.ts";
import { DepartmentKeyEnum } from "../academics/department.ts";

export const StaffRoleEnum = z.enum([
  "principal",
  "deputy-principal",
  "assistant-principal",
  "head-prefect",
  "teacher",
  "support",
]);

export const StaffCardVariantEnum = z.enum(["principal", "grid", "compact"]);

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
 * F-165's "list sorted by role hierarchy" order — principal down to
 * support staff. The Staff Module's admin list groups by this order (with
 * `Staff.order` breaking ties within a group); Postgres/JS default string
 * sort on `role` would instead put them alphabetically
 * (assistant-principal, deputy-principal, head-prefect, principal,
 * support, teacher), which is not the intended hierarchy.
 */
export const STAFF_ROLE_HIERARCHY: readonly StaffRoleEnumData[] = [
  "principal",
  "deputy-principal",
  "assistant-principal",
  "head-prefect",
  "teacher",
  "support",
];

export const STAFF_ROLE_LABELS: Record<StaffRoleEnumData, string> = {
  principal: "Principal",
  "deputy-principal": "Deputy Principal",
  "assistant-principal": "Assistant Principal",
  "head-prefect": "Head Prefect",
  teacher: "Teacher",
  support: "Support Staff",
};

/**
 * Flattens a StaffSchema entry's nested `portrait: { src, alt }` into the
 * `imageSrc`/`imageAlt` props StaffCard (@paideon/ui) actually reads.
 *
 * This exists because `PrincipalSection.tsx`/`StaffGridSection.tsx`
 * (apps/web) used to spread a raw `StaffData` object straight into
 * `<StaffCard {...data.principal} />` — a plain object spread doesn't
 * rename `portrait.src` to `imageSrc`, so every StaffCard on the
 * Administration page has been silently rendering its no-portrait
 * fallback (an initial-letter monogram) regardless of whether the source
 * data actually had a photo. Every call site that renders a StaffCard from
 * Staff-module data should go through this helper instead of spreading
 * `StaffData` directly.
 *
 * `href` (a future staff-profile detail link) isn't derivable from
 * `StaffData` at all — not every context that renders a StaffCard wants
 * one (a compact list item vs. a page's principal banner), so it's left
 * for the caller to set explicitly via `overrides`.
 */
export function toStaffCardData(
  staff: StaffData,
  overrides: Partial<Pick<StaffCardData, "href">> = {}
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
