// packages/contracts/src/registry/page-registry/admissions.ts
//
// Page registry for: Admissions (docs/Design System/Page Specifications.md
// section 05). The actual application form is a downloadable PDF handled
// through Downloadable Documents, not an online submission — see
// domains/admissions/ for why there's no ApplicationFormSchema in this
// package at all.

import { z } from 'zod';

import {
  DownloadItemSchema,
  FaqSchema,
  HeroSchema,
} from '../../blocks/index.ts';
import { EligibilitySchema } from '../../domains/admissions/eligibility-requirements.ts';
import { AdmissionsCalendarSchema } from '../../domains/admissions/key-dates.ts';
import { AdmissionsProcessSchema } from '../../domains/admissions/process-steps.ts';
import { ContactFormSchema } from '../../domains/contact/contact-form.ts';
import type { PageRegistry } from '../types.ts';

export const AdmissionsHeroSchema = HeroSchema;

export const AdmissionsDocumentsSchema = z.object({
  eyebrow: z.string().optional(),
  heading: z.string().optional(),
  documents: z.array(DownloadItemSchema),
});
export type AdmissionsDocumentsData = z.infer<typeof AdmissionsDocumentsSchema>;

export const AdmissionsFaqSchema = FaqSchema;

export const AdmissionsEnquiryFormSchema = ContactFormSchema;

export const AdmissionsContactSchema = z.object({
  phone: z.string(),
  email: z.string().email(),
  officeHours: z.string().optional(),
});
export type AdmissionsContactData = z.infer<typeof AdmissionsContactSchema>;

export const AdmissionsTransportSchema = z.object({
  body: z.string(),
  mapEmbedUrl: z.string().optional(),
});
export type AdmissionsTransportData = z.infer<typeof AdmissionsTransportSchema>;

export const admissionsRegistry: PageRegistry = {
  page: 'admissions',
  scope: 'page:admissions',
  label: 'Admissions',
  description:
    'Manage the Admissions page — process steps, key dates, requirements, downloadable documents, FAQ, and the enquiry form.',
  sections: [
    {
      key: 'admissions.hero',
      blockKey: 'hero',
      label: 'Hero Banner',
      description: 'Top-of-page headline and eyebrow text.',
      schema: AdmissionsHeroSchema,
    },
    {
      key: 'admissions.processSteps',
      blockKey: 'process-steps',
      label: 'Admissions Process Steps',
      description:
        '4–5 steps: Apply Online → Interview → Documents → Acceptance.',
      schema: AdmissionsProcessSchema,
    },
    {
      key: 'admissions.keyDates',
      blockKey: 'key-dates',
      label: 'Key Dates Timeline',
      description:
        'Applications open, deadline, interview dates, and other admissions milestones.',
      schema: AdmissionsCalendarSchema,
    },
    {
      key: 'admissions.requirements',
      blockKey: 'rich-text-block',
      label: 'Requirements Checklist',
      description: 'Printable checklist of required documents, by grade level.',
      schema: EligibilitySchema,
    },
    {
      key: 'admissions.documents',
      blockKey: 'downloads',
      label: 'Downloadable Documents',
      description: 'Application form PDF, prospectus, fee structure (from R2).',
      schema: AdmissionsDocumentsSchema,
    },
    {
      key: 'admissions.faq',
      blockKey: 'faq',
      label: 'FAQ',
      description: 'Common questions — age limits, scholarships, transport.',
      schema: AdmissionsFaqSchema,
    },
    {
      key: 'admissions.enquiryForm',
      blockKey: 'rich-text-block',
      label: 'Enquiry Form',
      description:
        'Name, email, phone, message — routed to the admissions office.',
      schema: AdmissionsEnquiryFormSchema,
    },
    {
      key: 'admissions.contact',
      blockKey: 'rich-text-block',
      label: 'Dedicated Admissions Contact',
      description: 'Phone, email, office hours.',
      schema: AdmissionsContactSchema,
    },
    {
      key: 'admissions.transport',
      blockKey: 'map',
      label: 'Transport and Accessibility',
      description: 'School transport routes and accessibility features.',
      schema: AdmissionsTransportSchema,
    },
  ],
};
