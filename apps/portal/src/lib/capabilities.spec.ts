import { can, canAny } from './capabilities';

const school = {
  capabilities: [{ capability: 'library.desk', scope: 'SCHOOL' }],
};
const grade7 = {
  capabilities: [{ capability: 'people.read', scope: 'GRADE:7' }],
};
const none = { capabilities: [] };

describe('can', () => {
  it('is false for a person with no grants', () => {
    expect(can(none as never, 'people.read')).toBe(false);
  });

  it('without a scope asks "anywhere?"', () => {
    expect(can(school as never, 'library.desk')).toBe(true);
    expect(can(grade7 as never, 'people.read')).toBe(true);
    expect(can(school as never, 'library.manage')).toBe(false);
  });

  it('a SCHOOL grant covers every grade and class', () => {
    const user = {
      capabilities: [{ capability: 'people.read', scope: 'SCHOOL' }],
    };
    expect(can(user as never, 'people.read', 'GRADE:9')).toBe(true);
    expect(can(user as never, 'people.read', 'CLASS:abc')).toBe(true);
  });

  it('a GRADE grant covers only that grade', () => {
    expect(can(grade7 as never, 'people.read', 'GRADE:7')).toBe(true);
    expect(can(grade7 as never, 'people.read', 'GRADE:8')).toBe(false);
    expect(can(grade7 as never, 'people.read', 'CLASS:abc')).toBe(false);
  });
});

describe('canAny', () => {
  it('is true when one of them is held', () => {
    expect(canAny(school as never, ['library.manage', 'library.desk'])).toBe(
      true,
    );
    expect(canAny(school as never, ['library.manage'])).toBe(false);
    expect(canAny(school as never, [])).toBe(false);
  });
});
