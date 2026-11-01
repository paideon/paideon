import {
  CODE128_PATTERNS,
  canEncodeCode128,
  code128Bars,
  code128Symbols,
  code128Widths,
} from './code128';

describe('Code 128 tables', () => {
  it('has 106 symbols plus stop, all distinct', () => {
    expect(CODE128_PATTERNS).toHaveLength(107);
    expect(new Set(CODE128_PATTERNS).size).toBe(107);
  });

  it('gives every symbol 11 modules (stop: 13)', () => {
    CODE128_PATTERNS.forEach((pattern, symbol) => {
      const sum = pattern.split('').reduce((a, b) => a + Number(b), 0);
      expect(sum).toBe(symbol === 106 ? 13 : 11);
    });
  });
});

describe('code128Symbols', () => {
  it('matches the worked example "PJJ123C" (start B, data, checksum 55, stop)', () => {
    // 104 + 48*1 + 42*2 + 42*3 + 17*4 + 18*5 + 19*6 + 35*7 = 879; 879 mod 103 = 55.
    // (P=48, J=42, 1=17, 2=18, 3=19, C=35 in set B.)
    expect(code128Symbols('PJJ123C')).toEqual([
      104, 48, 42, 42, 17, 18, 19, 35, 55, 106,
    ]);
  });

  it('refuses text set B cannot hold', () => {
    expect(canEncodeCode128('')).toBe(false);
    expect(canEncodeCode128('වාර්තා')).toBe(false);
    expect(canEncodeCode128('tab\there')).toBe(false);
    expect(canEncodeCode128('KCCM-LIB-00000')).toBe(true);
    expect(() => code128Symbols('é')).toThrow();
  });
});

describe('code128Widths and bars', () => {
  it('starts with a bar and ends with the 7-element stop', () => {
    const widths = code128Widths('A');
    expect(widths.slice(0, 6)).toEqual([2, 1, 1, 2, 1, 4]); // start B
    expect(widths.slice(-7)).toEqual([2, 3, 3, 1, 1, 1, 2]); // stop
  });

  it('has an even number of elements before the final bar, so bars and spaces alternate', () => {
    // 3 symbols x 6 + stop 7 = 25 elements: bar first, bar last.
    expect(code128Widths('A')).toHaveLength(25);
  });

  it('reports total modules = 11 per symbol + 13 for stop', () => {
    const { modules, bars } = code128Bars('KCCM-LIB-00000');
    expect(modules).toBe((1 + 14 + 1) * 11 + 13);
    expect(bars[0]).toEqual({ x: 0, width: 2 });
    expect(bars.length).toBeGreaterThan(14);
  });
});
