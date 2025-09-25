// Auto-generated – do not edit manually.
// Source: packages/ui/scripts/generate-icons.js
import type React from 'react';

export interface SocialIconProps extends React.ComponentProps<'svg'> {
  /** xs=16px  sm=20px  md=24px  lg=32px  xl=48px  or any CSS value */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | (string & {});
  /** Override the SVG's baked-in brand colour (does not affect `currentColor` fills) */
  color?: string;
}

export const sizeMap: Record<string, string> = {
  xs: 'w-icon-sm h-icon-sm',
  sm: 'w-icon-md h-icon-md',
  md: 'w-icon-lg h-icon-lg',
  lg: 'w-icon-xl h-icon-xl',
  xl: 'w-size-12 h-size-12',
};
