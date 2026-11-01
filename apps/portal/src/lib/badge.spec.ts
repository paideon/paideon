import type { MyProfileData } from '@paideon/contracts';

import { badgeDetails, initialsOf } from './badge';

const base: MyProfileData = {
  id: 'u1',
  paideonId: 'PAI-STU-0001',
  cardNumber: 'KCCM-LIB-00001',
  role: 'STUDENT',
  firstName: 'Nimal',
  lastName: 'Perera',
  displayName: null,
  email: 'nimal@school.lk',
  photoUrl: null,
  phone: null,
  address: null,
  addressEditable: true,
  grade: 10,
  section: 'A',
  admissionNumber: '4521',
  employeeId: null,
  designation: null,
};

describe('badgeDetails', () => {
  it('shows grade and admission number for a student', () => {
    const d = badgeDetails(base);
    expect(d.detailLabel).toBe('GRADE');
    expect(d.detailValue).toBe('Grade 10 A');
    expect(d.numberLabel).toBe('ADMISSION NO.');
    expect(d.numberValue).toBe('4521');
    expect(d.fullName).toBe('Nimal Perera');
    expect(d.roleLabel).toBe('Student');
  });

  it('leaves out an empty section', () => {
    expect(badgeDetails({ ...base, section: null }).detailValue).toBe(
      'Grade 10',
    );
    expect(badgeDetails({ ...base, section: '  ' }).detailValue).toBe(
      'Grade 10',
    );
  });

  it('shows post and staff number for staff', () => {
    const d = badgeDetails({
      ...base,
      role: 'TEACHER',
      grade: null,
      section: null,
      admissionNumber: null,
      employeeId: 'T-102',
      designation: 'Teacher, Science',
    });
    expect(d.detailLabel).toBe('POST');
    expect(d.detailValue).toBe('Teacher, Science');
    expect(d.numberLabel).toBe('STAFF NO.');
    expect(d.numberValue).toBe('T-102');
  });

  it('falls back to the role name and a dash when the record has nothing', () => {
    const d = badgeDetails({
      ...base,
      role: 'LIBRARIAN',
      grade: null,
      section: null,
      admissionNumber: null,
    });
    expect(d.detailValue).toBe('Librarian');
    expect(d.numberValue).toBe('—');
  });
});

describe('initialsOf', () => {
  it('uses the first letter of each name, upper case', () => {
    expect(initialsOf('nimal', 'perera')).toBe('NP');
    expect(initialsOf('Nimal', '')).toBe('N');
    expect(initialsOf('', '')).toBe('?');
  });
});
