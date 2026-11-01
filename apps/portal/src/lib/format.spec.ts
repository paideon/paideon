import { daysUntil, describeDevice, dueText, greetingFor } from './format';

const noon = (y: number, m: number, d: number) =>
  new Date(y, m - 1, d, 12, 0, 0);

describe('daysUntil', () => {
  const now = noon(2026, 11, 1);
  it('counts calendar days, not 24-hour blocks', () => {
    expect(daysUntil(noon(2026, 11, 1).toISOString(), now)).toBe(0);
    expect(daysUntil(new Date(2026, 10, 2, 0, 5).toISOString(), now)).toBe(1);
    expect(daysUntil(new Date(2026, 10, 1, 23, 59).toISOString(), now)).toBe(0);
    expect(daysUntil(noon(2026, 10, 29).toISOString(), now)).toBe(-3);
  });
});

describe('dueText', () => {
  const now = noon(2026, 11, 1);
  it('reads naturally', () => {
    expect(dueText(noon(2026, 11, 1).toISOString(), now)).toBe('Due today');
    expect(dueText(noon(2026, 11, 2).toISOString(), now)).toBe('Due tomorrow');
    expect(dueText(noon(2026, 11, 6).toISOString(), now)).toBe('Due in 5 days');
    expect(dueText(noon(2026, 10, 31).toISOString(), now)).toBe(
      '1 day overdue',
    );
    expect(dueText(noon(2026, 10, 28).toISOString(), now)).toBe(
      '4 days overdue',
    );
  });
});

describe('describeDevice', () => {
  it('names browser and system', () => {
    expect(
      describeDevice(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36',
      ),
    ).toBe('Chrome on Windows');
    expect(
      describeDevice(
        'Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 Chrome/130.0 Safari/537.36 Edg/130.0',
      ),
    ).toBe('Edge on Windows');
    expect(
      describeDevice(
        'Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 Chrome/130.0 Mobile Safari/537.36',
      ),
    ).toBe('Chrome on Android');
    expect(
      describeDevice(
        'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Version/17.0 Mobile Safari/604.1',
      ),
    ).toBe('Safari on iOS');
  });
  it('copes with nothing useful', () => {
    expect(describeDevice(null)).toBe('Unknown device');
    expect(describeDevice('curl/8.0')).toBe('Unknown device');
  });
});

describe('greetingFor', () => {
  it('changes at noon and at six', () => {
    expect(greetingFor(0)).toBe('Good morning');
    expect(greetingFor(11)).toBe('Good morning');
    expect(greetingFor(12)).toBe('Good afternoon');
    expect(greetingFor(17)).toBe('Good afternoon');
    expect(greetingFor(18)).toBe('Good evening');
  });
});
