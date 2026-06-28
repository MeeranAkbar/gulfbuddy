import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';

import { Providers } from '../components/providers';

export const metadata: Metadata = {
  metadataBase: new URL('https://gulfhabibi.com'),
  title: {
    default: 'GulfHabibi',
    template: '%s'
  },
  description: 'Trust-first UAE marketplace for property, motors, jobs, services, classifieds, and business profiles.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script id="gh-theme-init" strategy="beforeInteractive">{`
          (function() {
            try {
              var stored = localStorage.getItem('gh-theme') || 'system';
              var root = document.documentElement;
              root.dataset.theme = stored;
              var resolved = stored === 'system'
                ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
                : stored;
              root.style.colorScheme = resolved;
            } catch (error) {}
          })();
        `}</Script>
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
