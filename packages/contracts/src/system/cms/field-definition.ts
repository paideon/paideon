// packages/contracts/src/system/cms/field-definition.ts
//
// The metadata shape describing one editable field for the admin dynamic form builder.

import { z } from "zod";

export const FIELD_TYPE_VALUES = [
  "text",
  "textarea",
  "richtext",
  "number",
  "boolean",
  "select",
  "multiselect",
  "image",
  "date",
  "url",
  "email",
  "array",
  "object",
] as const;

export const FieldTypeEnum = z.enum(FIELD_TYPE_VALUES);

export type FieldTypeEnumData = z.infer<typeof FieldTypeEnum>;

export const FieldDefinitionSchema = z.object({
  key: z.string(),
  label: z.string(),
  inputKind: FieldTypeEnum,
  validationHints: z
    .object({
      required: z.boolean().optional(),
      min: z.number().optional(),
      max: z.number().optional(),
      pattern: z.string().optional(),
    })
    .optional(),
  options: z
    .array(z.object({ label: z.string(), value: z.string() }))
    .optional(),
  conditionalVisibility: z
    .object({
      dependsOn: z.string(),
      value: z.unknown(),
    })
    .optional(),
});

export type FieldDefinitionData = z.infer<typeof FieldDefinitionSchema>;
