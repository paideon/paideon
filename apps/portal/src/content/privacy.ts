// The text of the privacy notice at /privacy.
//
// DRAFT. This was written without the school's input and has NOT been
// reviewed by the school or a lawyer. It describes how the portal is built to
// behave; the school must check every statement (and the contact line, and the
// retention periods) before it is published, then set PRIVACY_NOTICE_STATUS to
// 'approved' to remove the draft banner on the page.

export const PRIVACY_NOTICE_STATUS: 'draft' | 'approved' = 'draft';

export type PrivacySection = {
  id: string;
  heading: string;
  paragraphs: string[];
};

export const PRIVACY_INTRO =
  'This notice explains what personal information Paideon keeps about students, guardians, teachers and staff of C.W.W. Kannangara Central College, why it is kept, and who can see it.';

export const PRIVACY_SECTIONS: PrivacySection[] = [
  {
    id: 'what-we-keep',
    heading: 'What we keep',
    paragraphs: [
      'For every person with a record: name, date of birth, gender, school or staff number, class and the school email address used to sign in.',
      'For students we also keep the guardians’ names and contact details, the student’s home address and the school medium and stream.',
    ],
  },
  {
    id: 'photos',
    heading: 'Photos',
    paragraphs: [
      'A photo may be kept on a person’s record to identify them and to print their school ID card. Photos are shown only to people whose work needs them, such as the office staff who print cards and the library desk that checks them at lending.',
      'A photo is never shown on the public pages and is not shared outside the school.',
    ],
  },
  {
    id: 'religion-ethnicity',
    heading: 'Religion and ethnicity',
    paragraphs: [
      'The school records the religion and ethnicity of its students and staff, for school-wide statistics and official returns.',
      'They are treated as sensitive. Only people who have been given specific permission can see them on a record, and statistics that use them are limited in the same way. They are not used to make decisions about an individual.',
    ],
  },
  {
    id: 'guardian-contacts',
    heading: 'Guardian contact details',
    paragraphs: [
      'Guardians’ phone numbers and addresses are kept so the school can reach a family. They are visible only to staff who need them for that purpose and are not given to other families or outside organisations.',
    ],
  },
  {
    id: 'who-sees',
    heading: 'Who can see your information',
    paragraphs: [
      'What a person can see in Paideon depends on the permissions the school has given them. A student can see their own information. Staff see the records their job needs. Every change to a record is logged.',
    ],
  },
  {
    id: 'keeping-safe',
    heading: 'Keeping it safe',
    paragraphs: [
      'You sign in with your own account and password. Please do not share your password. If you think someone else knows it, change it or tell the school office straight away.',
    ],
  },
  {
    id: 'your-rights',
    heading: 'Questions and corrections',
    paragraphs: [
      'If something on a record is wrong, or you have a question about this notice, ask the school office.',
    ],
  },
];
