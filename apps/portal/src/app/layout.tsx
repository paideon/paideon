import type { Metadata } from 'next';
import './global.css';

export const metadata: Metadata = {
  title: 'Paideon Library',
  description: 'School library circulation portal',
};

// Runs before first paint so the page never flashes the wrong theme.
// Order: saved choice, then the device's setting, then light.
const themeInit = `(function(){try{var s=localStorage.getItem('paideon-theme');var t=(s==='light'||s==='dark')?s:(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.setAttribute('data-theme',t);}catch(e){document.documentElement.setAttribute('data-theme','light');}})();`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // suppressHydrationWarning: the script above sets data-theme before React hydrates.
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
