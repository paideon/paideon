import { formatCardNumber, formatPaideonId } from './paideon-ids.service';

describe('Paideon ids', () => {
  it('formats the ID and the library card', () => {
    expect(formatPaideonId('KCCM', 'STUDENT', 7)).toBe('KCCM-STU-00007');
    expect(formatCardNumber('KCCM', 'STUDENT', 7)).toBe('KCCM-LIB-S00007');
  });

  it('keeps cards of different kinds apart', () => {
    expect(formatCardNumber('KCCM', 'TEACHER', 7)).not.toBe(
      formatCardNumber('KCCM', 'STUDENT', 7),
    );
  });
});
