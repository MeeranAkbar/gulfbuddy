import type { Metadata } from 'next';
import Script from 'next/script';
import { Inter } from 'next/font/google';
import './globals.css';

import { Providers } from '../components/providers';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

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
    <html lang="en" suppressHydrationWarning className={`${inter.variable}`}>
      <head>
        <Script id="gh-theme-init" strategy="beforeInteractive">{`
          (function() {
            try {
              var root = document.documentElement;
              root.dataset.theme = 'light';
              root.style.colorScheme = 'light';
            } catch (error) {}
          })();
        `}</Script>
      </head>
      <body className="font-sans antialiased text-[var(--text-primary)] bg-[var(--background)]">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
