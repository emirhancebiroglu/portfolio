import type { Metadata } from 'next';
import { inter, jetbrainsMono } from '@/lib/fonts';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Emirhan Cebiroğlu — Software Engineer',
    template: '%s | Emirhan Cebiroğlu',
  },
  description: 'Software engineer building tools people actually use.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-[var(--color-bg)] font-sans text-[var(--color-text-primary)] antialiased">
        {children}
      </body>
    </html>
  );
}
