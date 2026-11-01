// Code 128 (set B) barcode encoder. Pure maths, no DOM: the <Barcode>
// component turns the result into SVG. Set B covers ASCII 32 to 126, which
// includes the letters, digits and dashes of card numbers like KCCM-LIB-00000.

// Widths of the bar/space/bar/space/bar/space elements of each symbol, in
// modules. Index = symbol value (0 to 105), then the STOP symbol at 106.
const PATTERNS = [
  '212222',
  '222122',
  '222221',
  '121223',
  '121322',
  '131222',
  '122213',
  '122312',
  '132212',
  '221213',
  '221312',
  '231212',
  '112232',
  '122132',
  '122231',
  '113222',
  '123122',
  '123221',
  '223211',
  '221132',
  '221231',
  '213212',
  '223112',
  '312131',
  '311222',
  '321122',
  '321221',
  '312212',
  '322112',
  '322211',
  '212123',
  '212321',
  '232121',
  '111323',
  '131123',
  '131321',
  '112313',
  '132113',
  '132311',
  '211313',
  '231113',
  '231311',
  '112133',
  '112331',
  '132131',
  '113123',
  '113321',
  '133121',
  '313121',
  '211331',
  '231131',
  '213113',
  '213311',
  '213131',
  '311123',
  '311321',
  '331121',
  '312113',
  '312311',
  '332111',
  '314111',
  '221411',
  '431111',
  '111224',
  '111422',
  '121124',
  '121421',
  '141122',
  '141221',
  '112214',
  '112412',
  '122114',
  '122411',
  '142112',
  '142211',
  '241211',
  '221114',
  '413111',
  '241112',
  '134111',
  '111242',
  '121142',
  '121241',
  '114212',
  '124112',
  '124211',
  '411212',
  '421112',
  '421211',
  '212141',
  '214121',
  '412121',
  '111143',
  '111341',
  '131141',
  '114113',
  '114311',
  '411113',
  '411311',
  '113141',
  '114131',
  '311141',
  '411131',
  '211412',
  '211214',
  '211232',
  '2331112',
] as const;

const START_B = 104;
const STOP = 106;

export const CODE128_PATTERNS = PATTERNS;

/** Can this text be written in set B? (Printable ASCII, not empty.) */
export function canEncodeCode128(value: string): boolean {
  if (value.length === 0) return false;
  for (let i = 0; i < value.length; i++) {
    const code = value.charCodeAt(i);
    if (code < 32 || code > 126) return false;
  }
  return true;
}

/** Symbol values: start, one per character, checksum, stop. */
export function code128Symbols(value: string): number[] {
  if (!canEncodeCode128(value)) {
    throw new Error('Code 128 set B can only encode printable ASCII.');
  }
  const data = Array.from(value, (char) => char.charCodeAt(0) - 32);
  const checksum =
    (START_B + data.reduce((sum, symbol, i) => sum + symbol * (i + 1), 0)) %
    103;
  return [START_B, ...data, checksum, STOP];
}

/** Alternating bar, space, bar, ... widths in modules. The first is a bar. */
export function code128Widths(value: string): number[] {
  return code128Symbols(value).flatMap((symbol) =>
    PATTERNS[symbol]!.split('').map(Number),
  );
}

export type Code128Bar = { x: number; width: number };

/** The black bars with their position, plus the total width in modules (no quiet zone). */
export function code128Bars(value: string): {
  bars: Code128Bar[];
  modules: number;
} {
  const widths = code128Widths(value);
  const bars: Code128Bar[] = [];
  let x = 0;
  widths.forEach((width, index) => {
    if (index % 2 === 0) bars.push({ x, width });
    x += width;
  });
  return { bars, modules: x };
}
