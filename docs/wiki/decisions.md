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

## DEC-006: Tailwind v4 CSS Config (no tailwind.config.ts)
- **Date:** 2026-04-26
- **Decision:** Keep Tailwind v4's CSS-based configuration in globals.css
- **Reasoning:** create-next-app@16 installed Tailwind v4 which uses @theme {} in CSS instead of tailwind.config.ts. Migrating back to v3 would be unnecessary churn. v4 config in globals.css achieves the same result — all design tokens (colors, fonts, max-widths) defined there.
- **Alternatives considered:** Downgrade to Tailwind v3 + tailwind.config.ts (matches A-to-Z plan exactly, but adds no real value and risks breaking the installed deps)
- **Status:** FINAL — do not revisit

## DEC-007: ESLint Flat Config (eslint.config.mjs)
- **Date:** 2026-04-26
- **Decision:** Use ESLint flat config format (eslint.config.mjs) not legacy .eslintrc.json
- **Reasoning:** create-next-app@16 generates flat config by default. The A-to-Z plan specified .eslintrc.json but that's the legacy format. Rules added to the flat config array produce identical linting behavior.
- **Alternatives considered:** Revert to .eslintrc.json (legacy, deprecated in ESLint 9+)
- **Status:** FINAL — do not revisit

## DEC-008: Inline SVG Brand Icons in Footer (no icon library for brands)
- **Date:** 2026-04-26
- **Decision:** Use inline SVG path components for GitHub, LinkedIn, X icons instead of a library
- **Reasoning:** The installed version of lucide-react has no brand icons (Github, Linkedin, Twitter exports do not exist). Adding a separate icon library (react-icons, simple-icons) for just 3 icons is unnecessary overhead. Inline SVGs are zero-dependency, tree-shakeable, and fully accessible via aria-label.
- **Alternatives considered:** react-icons package (adds ~200KB), simple-icons (brand-only lib, another dep), switching lucide-react version (risks breaking other icons already in use)
- **Status:** FINAL — do not revisit

## DEC-009: Edge Runtime for OG Image Route
- **Date:** 2026-04-26
- **Decision:** Use `export const runtime = 'edge'` on the /og route
- **Reasoning:** `@vercel/og` / `next/og` ImageResponse is designed for the edge runtime. It uses a WASM-based renderer that is incompatible with the Node.js runtime. Dynamic OG images for tool pages use ?title= and ?description= query params.
- **Alternatives considered:** Static pre-generated images (no per-page customization), Node.js runtime (incompatible with ImageResponse)
- **Status:** FINAL — do not revisit

## DEC-010: next-sitemap for Sitemap Generation
- **Date:** 2026-04-26
- **Decision:** Use next-sitemap package with postbuild script instead of Next.js built-in sitemap
- **Reasoning:** next-sitemap auto-generates both sitemap.xml and robots.txt in one step, configured via next-sitemap.config.js. Next.js built-in sitemap requires manual route enumeration in app/sitemap.ts.
- **Alternatives considered:** app/sitemap.ts (more code, manual maintenance), no sitemap (bad for SEO)
- **Status:** FINAL — do not revisit

## DEC-011: Groq + Llama 3.3 instead of Anthropic Claude for Task Breakdown
- **Date:** 2026-04-26
- **Decision:** Use Groq's `llama-3.3-70b-versatile` (via groq-sdk) for the AI Task Breakdown tool. Env var renamed to `GROQ_API_KEY`. The original A-to-Z plan specified Anthropic Claude.
- **Reasoning:** User-driven decision. Groq offers extremely fast inference (~10x faster than typical Claude latency for this workload), generous free tier suitable for a free public tool, and competitive quality on structured task-breakdown outputs. The model choice is invisible to end users; latency is not.
- **Alternatives considered:** Anthropic Claude Haiku (slower per-token, paid tier required earlier), OpenAI gpt-4o-mini (paid from request 1)
- **Status:** FINAL — do not revisit (this tool only). If quality drops on harder tasks, revisit model choice rather than provider.

## DEC-012: Few-Shot Prompting + JSON Mode + Banned-Phrase List for Task Breakdown Quality
- **Date:** 2026-04-26
- **Decision:** Use a 3-example few-shot system prompt, explicit banned-phrases list, Step 1 contract, and Groq's JSON mode (`response_format: { type: 'json_object' }`) to control output quality — instead of changing models or adding a multi-pass classifier.
- **Reasoning:** Initial output was heavy on meta-planning ("make a list", "create a checklist", "categorize") instead of concrete first actions. Few-shot examples are the strongest single lever for fixed-model quality; named bans are followed more reliably than abstract style rules; JSON mode eliminates markdown-fence parsing hacks. Single-call, no added latency. Task-type classification and validation/retry loops were considered and deferred until we measure whether few-shot alone is sufficient.
- **Alternatives considered:** (a) Switch to a stronger model — rejected per DEC-011 latency requirement; (b) Two-pass: classify task type, then type-specific prompt — 2x latency; (c) Validate output and retry on banned phrases — adds latency on bad outputs only, but added complexity
- **Status:** FINAL for now — revisit only if T1 manual testing reveals quality is still insufficient

## DEC-013: Tool Page Split — Server Component Wrapping Client Tool
- **Date:** 2026-04-26
- **Decision:** Tool pages are server components that export `metadata` and render a small `'use client'` child component that contains all interactivity. Pattern: `page.tsx` (server, metadata + h1 + FAQ) → `<ToolName>Tool.tsx` (client, useState/useRef/fetch).
- **Reasoning:** Next.js App Router forbids `export const metadata` from `'use client'` files. Splitting keeps SEO metadata + static FAQ on the server while isolating client-only state. The pattern will be reused for Cron Builder and Schema Visualizer.
- **Alternatives considered:** Generate metadata via `generateMetadata` from a server-only export — works but adds indirection; using metadata.json sibling files — not supported by App Router for dynamic content
- **Status:** FINAL — applies to all three tools
