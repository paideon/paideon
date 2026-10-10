// packages/contracts/src/registry/page-registry/contact.ts
//
// Page registry for: Contact (docs/Design System/Page Specifications.md
// section 11).

import { z } from 'zod';

import { CtaSchema, HeroSchema } from '../../blocks/index.ts';
import { DepartmentKeyEnum } from '../../domains/academics/department.ts';
import { ContactFormSchema } from '../../domains/contact/contact-form.ts';
import { FeedbackFormSchema } from '../../domains/contact/feedback-form.ts';
import type { PageRegistry } from '../types.ts';

export const ContactHeroSchema = HeroSchema;

export const ContactDepartmentEntrySchema = z.object({
  department: DepartmentKeyEnum,
  phone: z.string().optional(),
  email: z.string().email().optional(),
  extension: z.string().optional(),
});

export const ContactDepartmentsTableSchema = z.object({
  eyebrow: z.string().optional(),
  heading: z.string().optional(),
  departments: z.array(ContactDepartmentEntrySchema),
});
export type ContactDepartmentsTableData = z.infer<
  typeof ContactDepartmentsTableSchema
>;

export const ContactMapSchema = z.object({
  mapEmbedUrl: z.string(),
  note: z.string().optional(),
});
export type ContactMapData = z.infer<typeof ContactMapSchema>;

export const ContactEnquiryFormSchema = ContactFormSchema;
export const ContactFeedbackFormSchema = FeedbackFormSchema;

export const ContactHoursSchema = z.object({
  officeHours: z.string(),
  emergencyContacts: z.array(
    z.object({ label: z.string(), phone: z.string() }),
  ),
  afterHoursProtocol: z.string().optional(),
});
export type ContactHoursData = z.infer<typeof ContactHoursSchema>;

export const ContactTransportSchema = z.object({
  busRoutes: z.string().optional(),
  trainStation: z.string().optional(),
  parking: z.string().optional(),
  accessibilityNotes: z.string().optional(),
});
export type ContactTransportData = z.infer<typeof ContactTransportSchema>;

export const ContactCtaSchema = CtaSchema;

export const contactRegistry: PageRegistry = {
  page: 'contact',
  scope: 'page:contact',
  label: 'Contact',
  description:
    'Manage the Contact page content, including hero, contact details, and enquiry CTA.',
  sections: [
    {
      key: 'contact.hero',
      blockKey: 'hero',
      label: 'Hero Banner',
      description: 'Top-of-page headline and eyebrow text.',
      schema: ContactHeroSchema,
    },
    {
      key: 'contact.departments',
      blockKey: 'rich-text-block',
      label: 'Department Contacts',
      description: 'Department name, phone, email, and extension table.',
      schema: ContactDepartmentsTableSchema,
    },
    {
      key: 'contact.map',
      blockKey: 'map',
      label: 'Map',
      description: 'Google Maps embed of the campus location.',
      schema: ContactMapSchema,
    },
    {
      key: 'contact.generalEnquiry',
      blockKey: 'rich-text-block',
      label: 'General Enquiry Form',
      description: 'Name, email, subject, message — sent to info@cwwkcc.lk.',
      schema: ContactEnquiryFormSchema,
    },
    {
      key: 'contact.feedback',
      blockKey: 'rich-text-block',
      label: 'Feedback and Complaints Form',
      description:
        "Name (optional), category, message, anonymous toggle — sent to the principal's office.",
      schema: ContactFeedbackFormSchema,
    },
    {
      key: 'contact.officeHours',
      blockKey: 'rich-text-block',
      label: 'Office Hours and Emergency Contacts',
      description: 'Timings, emergency numbers, after-hours protocol.',
      schema: ContactHoursSchema,
    },
    {
      key: 'contact.transport',
      blockKey: 'rich-text-block',
      label: 'Transport and Directions',
      description: 'Bus routes, train station, parking, accessibility.',
      schema: ContactTransportSchema,
    },
    {
      key: 'contact.cta',
      blockKey: 'cta',
      label: 'Call to Action',
      description: 'Bottom of page call-to-action for enquiries.',
      schema: ContactCtaSchema,
    },
  ],
};
