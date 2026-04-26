# Portfolio — Architectural Decisions

> Every significant decision is logged here with reasoning.
> Claude reads this to avoid re-debating settled decisions.

## DEC-001: Next.js over Astro
- **Date:** 2026-04-26
- **Decision:** Use Next.js 15 (App Router) for the portfolio
- **Reasoning:** Emirhan's core stack is React/Next.js. The portfolio
  itself demonstrates his primary framework. Tools need API routes
  (Claude API), which Next.js handles natively. Astro would mean
  learning a new framework for no benefit.
- **Alternatives considered:** Astro (faster static sites, but no
  native API routes), plain React + Vite (no SSR/SEO)
- **Status:** FINAL — do not revisit

## DEC-002: Tailwind CSS over CSS Modules
- **Date:** 2026-04-26
- **Decision:** Tailwind CSS for all styling
- **Reasoning:** Faster to write, consistent with Rudder's approach,
  no context-switching between CSS files and components. Tailwind
  plugin for Prettier auto-sorts classes.
- **Alternatives considered:** CSS Modules (more isolation but slower),
  styled-components (runtime CSS-in-JS, bad for performance)
- **Status:** FINAL — do not revisit

## DEC-003: Dark Mode as Default
- **Date:** 2026-04-26
- **Decision:** Portfolio defaults to dark mode
- **Reasoning:** 2026 portfolio trend. Developer audience prefers dark.
  Terracotta accent (#D4845A) pops better on dark backgrounds. Light
  mode available via toggle but dark is the default experience.
- **Alternatives considered:** Light default (too generic, every
  portfolio is white), system preference (unpredictable first impression)
- **Status:** FINAL — do not revisit

## DEC-004: Standalone Tool Pages over Embedded Demos
- **Date:** 2026-04-26
- **Decision:** Each tool lives at /tools/[name] as a full page
- **Reasoning:** Individual URLs for SEO indexing, social sharing,
  and Product Hunt launches. Each page can have its own metadata,
  OG image, and FAQ section. Embedded demos limit shareability.
- **Alternatives considered:** Embedded in homepage (no individual
  URLs, can't share or SEO-optimize individually)
- **Status:** FINAL — do not revisit

## DEC-005: PostHog over Google Analytics
- **Date:** 2026-04-26
- **Decision:** PostHog for all analytics (cookieless mode)
- **Reasoning:** Same tool as Rudder — learn once. Open source.
  Cookieless mode means no cookie banner needed. Better developer
  UX than GA4. Free tier is generous (1M events/month).
- **Alternatives considered:** Google Analytics 4 (requires cookie
  consent, worse DX), Plausible (simpler but less flexible)
- **Status:** FINAL — do not revisit