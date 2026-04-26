'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

export function Hero() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section
      id="hero"
      className="flex min-h-[90vh] flex-col items-center justify-center px-6 py-24"
    >
      <div className="mx-auto w-full max-w-[768px]">
        <p className="mb-4 text-sm font-medium text-[var(--color-accent)]">
          Software Engineer
        </p>

        <h1 className="mb-6 text-4xl font-bold tracking-tight text-[var(--color-text-primary)] sm:text-5xl md:text-6xl">
          Emirhan Cebiroğlu
        </h1>

        <p className="mb-4 text-xl font-medium text-[var(--color-text-primary)] sm:text-2xl">
          I build tools people actually use.
        </p>

        <p className="mb-10 max-w-[560px] text-base leading-relaxed text-[var(--color-text-secondary)] sm:text-lg">
          Software engineer at Toyota. Building micro-SaaS products on the side.
          I believe in shipping fast, handling edge cases, and writing code that
          reads like prose.
        </p>

        <div className="flex flex-wrap gap-3">
          <Button
            size="lg"
            variant="primary"
            onClick={() =>
              document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })
            }
          >
            See my work
          </Button>
          <Button
            size="lg"
            variant="secondary"
            onClick={() =>
              document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
            }
          >
            Get in touch
          </Button>
        </div>
      </div>

      {/* H2 — scroll indicator */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 transition-opacity duration-500"
        style={{ opacity: scrolled ? 0 : 1 }}
        aria-hidden="true"
      >
        <svg
          className="h-6 w-6 animate-bounce text-[var(--color-text-secondary)]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </section>
  );
}
