import type { Metadata, Viewport } from 'next';
import { DM_Sans, Cormorant_Garamond } from 'next/font/google';
import { TopNav } from '@/components/top-nav';
import { SiteFooter } from '@/components/site-footer';
import { PageTransition } from '@/components/page-transition';
import './globals.css';

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
  weight: ['300', '400', '500'],
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-cormorant',
  display: 'swap',
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
});

export const metadata: Metadata = {
  title: 'Manual Plantas Vivas — Easy Chile',
  description:
    'Manual operativo digital para vendedores del área de plantas vivas en Easy Chile. 572 plantas, 42 tiendas, 6 zonas climáticas.',
  robots: { index: false, follow: false },
  applicationName: 'Manual Plantas Vivas',
  icons: {
    icon: '/MPV/v2/favicon.svg',
    shortcut: '/MPV/v2/favicon.svg',
  },
};

export const viewport: Viewport = {
  themeColor: '#2D5A3D',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${dmSans.variable} ${cormorant.variable}`}>
      <body>
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-[var(--color-green-deep)] focus:text-[var(--color-cream)] focus:px-4 focus:py-2 focus:rounded-md"
        >
          Saltar al contenido
        </a>
        <TopNav />
        <main id="contenido" className="mx-auto max-w-6xl px-5 sm:px-8 pb-40 pt-12">
          <PageTransition>{children}</PageTransition>
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
