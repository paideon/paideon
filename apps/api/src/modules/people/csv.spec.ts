import { csvCell } from './csv';

describe('csvCell', () => {
  it('leaves plain text alone', () => {
    expect(csvCell('Nimal Perera')).toBe('Nimal Perera');
  });

  it('quotes commas, quotes and line breaks', () => {
    expect(csvCell('Perera, N.')).toBe('"Perera, N."');
    expect(csvCell('say "hi"')).toBe('"say ""hi"""');
    expect(csvCell('a\nb')).toBe('"a\nb"');
  });

  it('defuses spreadsheet formulas', () => {
    expect(csvCell('=SUM(A1)')).toBe("'=SUM(A1)");
    expect(csvCell('+94771234567')).toBe("'+94771234567");
    expect(csvCell('@cmd')).toBe("'@cmd");
  });
});
