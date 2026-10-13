import { paideonTheme } from '@paideon/tokens';
import type { Config } from 'tailwindcss';

export const paideonPreset: Partial<Config> = {
  theme: {
    extend: paideonTheme as NonNullable<Config['theme']>['extend'],
  },
  plugins: [],
};
