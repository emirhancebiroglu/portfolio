import type { Metadata } from 'next';
import { inter, jetbrainsMono } from '@/lib/fonts';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ThemeProvider } from '@/components/layout/theme-provider';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Emirhan Cebiroğlu — Software Engineer',
    template: '%s | Emirhan Cebiroğlu',
  },
  description:
    'Software engineer building tools people actually use. React, Next.js, TypeScript, Spring Boot.',
  metadataBase: new URL('https://emirhancebiroglu.dev'),
  openGraph: {
    title: 'Emirhan Cebiroğlu — Software Engineer',
    description: 'Software engineer building tools people actually use.',
    url: 'https://emirhancebiroglu.dev',
    siteName: 'Emirhan Cebiroğlu',
    locale: 'en_US',
    type: 'website',
    images: [{ url: '/og-default.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Emirhan Cebiroğlu — Software Engineer',
    description: 'Software engineer building tools people actually use.',
    images: ['/og-default.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-[var(--color-bg)] font-sans text-[var(--color-text-primary)] antialiased">
        <ThemeProvider>
          <Header />
          <main className="min-h-screen pt-16">{children}</main>
          <Footer />
        </ThemeProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              name: 'Emirhan Cebiroğlu',
              url: 'https://emirhancebiroglu.dev',
              jobTitle: 'Software Engineer',
              sameAs: [
                'https://github.com/emirhan-cebiroglu',
                'https://linkedin.com/in/emirhan-cebiroglu',
              ],
            }),
          }}
        />
      </body>
    </html>
  );
}
