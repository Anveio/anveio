import { NavBar } from '@/components/custom/Navbar/NavBar';
import { NetworkLayer } from '@/components/custom/NetworkLayer/NetworkLayer';
import { Toaster } from '@/components/ui/toaster';
import { CustomAnalytics } from '@/lib/analytics/analytics.client';
import { HtmlElement } from '@/lib/theming/ThemeProvider';
import { getThemeCookieValue } from '@/lib/theming/theming.server';
import '@/lib/toasts/toast-styles.css';
import { cn } from '@/lib/utils';
import { Analytics } from '@vercel/analytics/react';
import { Inter } from 'next/font/google';
import { cookies } from 'next/headers';
import * as React from 'react';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Anveio - Shovon Hasan - Blog',
  description:
    'Thoughts on software engineering, culture, and science from Shovon Hasan (Anveio).',
  'view-transition': 'same-origin',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();

  const themeCookieValue = getThemeCookieValue(cookieStore);

  return (
    <NetworkLayer>
      <HtmlElement initialTheme={themeCookieValue}>
        <body
          className={cn(
            inter.className,
            'bg-slate-100 min-h-screen static dark:bg-black transition-colors duration-500'
          )}
        >
          <React.Suspense>
            <NavBar />
            {children}
            <Toaster />
            <Analytics />
            <CustomAnalytics />
          </React.Suspense>
        </body>
      </HtmlElement>
    </NetworkLayer>
  );
}
