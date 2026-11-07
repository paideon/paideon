import {
  countStudentFilters,
  parseStudentSearch,
  studentQueryString,
} from './student-query';

const parse = (text: string) => parseStudentSearch(new URLSearchParams(text));

describe('parseStudentSearch', () => {
  it('gives the default list for an empty address', () => {
    const q = parse('');
    expect(q).toMatchObject({
      page: 1,
      status: 'ACTIVE',
      sort: 'name',
      dir: 'asc',
    });
  });

  it('reads filters, flags and paging', () => {
    const q = parse('grade=10&medium=TAMIL&missingPhoto=true&page=3&q=nimal');
    expect(q.grade).toBe(10);
    expect(q.medium).toBe('TAMIL');
    expect(q.missingPhoto).toBe(true);
    expect(q.page).toBe(3);
    expect(q.q).toBe('nimal');
  });

  it('ignores a bad value and keeps the good ones', () => {
    const q = parse('grade=99&medium=TAMIL&page=abc');
    expect(q.grade).toBeUndefined();
    expect(q.medium).toBe('TAMIL');
    expect(q.page).toBe(1);
  });

  it('ignores keys it does not own', () => {
    expect(parse('ids=a,b&pageSize=500').pageSize).toBe(25);
  });
});

describe('studentQueryString', () => {
  it('leaves out defaults so the plain list has a plain address', () => {
    expect(studentQueryString(parse(''))).toBe('');
  });

  it('round-trips a filtered list', () => {
    const q = parse('grade=7&status=ALL&sort=class&dir=desc&page=2');
    expect(studentQueryString(q)).toBe(
      'grade=7&status=ALL&sort=class&dir=desc&page=2',
    );
    expect(parse(studentQueryString(q))).toEqual(q);
  });

  it('adds extra keys', () => {
    expect(studentQueryString({ grade: 7 }, { ids: 'a,b' })).toBe(
      'grade=7&ids=a%2Cb',
    );
  });
});

describe('countStudentFilters', () => {
  it('counts filters but not search, sort or paging', () => {
    expect(countStudentFilters(parse('q=x&sort=class&page=4'))).toBe(0);
    expect(
      countStudentFilters(
        parse('grade=7&gender=MALE&status=LEFT&missingPhoto=true'),
      ),
    ).toBe(4);
  });
});
