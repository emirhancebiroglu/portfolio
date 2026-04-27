# Portfolio — Key Facts

> Non-obvious facts about the project that Claude should know.
> Updated as we learn things during development.

## URLs
- Production: https://emirhancebiroglu.dev
- Vercel project: (fill in after Vercel setup)
- GitHub repo: https://github.com/emirhancebiroglu/portfolio

## Accounts
- Vercel: connected via GitHub
- PostHog project: "Emirhan Portfolio"
- Groq API: free tier (replaced Anthropic per DEC-011)
- Domain registrar: (Cloudflare or Namecheap — fill in)

## Versions (as of Session 4)
- Next.js: 16 (create-next-app@16.2.4 installed this — plan said 15)
- Tailwind CSS: v4 (CSS-based config, NOT tailwind.config.ts)
- Node.js: v24.14.0
- npm: 11.9.0
- next-sitemap: ^4.2.3

## Tailwind v4 Important Notes
- Config is in src/app/globals.css via @theme {} block — no tailwind.config.ts
- Use @plugin "@tailwindcss/typography" in globals.css (not plugins array in config)
- darkMode: 'class' is not needed — handled via CSS .dark selector in @layer base
- Custom colors/fonts defined as CSS custom properties in @theme {}

## API Details
- LLM provider: Groq (not Anthropic/Claude — see DEC-011)
- Groq model for task breakdown: llama-3.3-70b-versatile
- API key env var: GROQ_API_KEY (server-side only)
- SDK: groq-sdk (npm)
- Rate limit: 20 requests/hour per IP (in-memory Map, resets on cold start)
- Output mode: JSON object (`response_format: { type: 'json_object' }`) — requires "json" appearing in system prompt
- JSON envelope: `{ "steps": [...] }` (json_object mode requires object root, not array)
- max_tokens: 1500
- temperature: 0.4

## Task Breakdown Tool Architecture (as of Session 5)
- Page split: `src/app/tools/task-breakdown/page.tsx` (server, metadata + h1 + FAQ) wraps `src/components/tools/task-breakdown/TaskBreakdownTool.tsx` (client) — see DEC-013
- TaskBreakdownTool uses discriminated-union state: idle | loading | results | error
- 2-second submit debounce via `submittingRef` (not state) to avoid re-render churn
- Focus-on-empty-error implemented via `registerFocus` callback pattern (parent calls child's exposed focus fn)
- ⌘/Ctrl+Enter submits from textarea
- PostHog events: task_breakdown_submitted (granularity), task_breakdown_completed (step_count, response_ms, granularity), task_breakdown_copied, task_breakdown_error (status)
- Copy format: `Task: <task>\n\n1. <step>\n2. <step>...`
- System prompt has 12 banned phrases + 3 few-shot examples — see DEC-012

## PostHog Setup
- Provider: src/components/layout/posthog-provider.tsx (client component)
- Init: cookieless (`persistence: 'memory'`), autocapture off, capture_pageview off (manual)
- Pageview capture: usePathname + useSearchParams in PostHogPageView, Suspense-wrapped (App Router requirement for useSearchParams)
- Default api_host: https://us.i.posthog.com (overridable via NEXT_PUBLIC_POSTHOG_HOST)
- No-ops silently when NEXT_PUBLIC_POSTHOG_KEY is unset

## OG Image Route
- Path: /og (src/app/og/route.tsx)
- Runtime: edge (required for ImageResponse / next/og)
- Params: ?title= and ?description= for per-page overrides
- Default: name + tagline on #0A0A0B background with #D4845A accent bar

## Design
- Primary accent: #D4845A (terracotta)
- Dark BG: #0A0A0B
- Font: Inter (variable, via next/font — var --font-inter)
- Mono font: JetBrains Mono (variable — var --font-jetbrains)
- Max content width: 768px (prose), 1200px (tools)

## lucide-react Icon Notes
- This version does NOT export brand icons: Github, Linkedin, Twitter do not exist
- Available social-adjacent icons: ExternalLink, X (the letter X icon, not the brand)
- Brand icons (GitHub, LinkedIn, X/Twitter) are implemented as inline SVG components in footer.tsx and contact.tsx
- Do NOT attempt to import Github/Linkedin/Twitter from lucide-react — build will fail

## Cron Builder Architecture (as of Session 6)
- Page split: `src/app/tools/cron-builder/page.tsx` (server, metadata + h1 + FAQ) wraps `CronBuilderTool.tsx` (client) — same DEC-013 pattern as Task Breakdown
- `cron-utils.ts` is pure (no React) — all cron logic lives here, imported by both client components and tested independently
- `CronFieldState` has 4 modes: every (*), everyN (*/N), specific (comma list), range (N-M)
- Reverse parser auto-triggers when input has exactly 5 whitespace-separated tokens
- `CronPreview` refreshes "now" every 30s via setInterval so relative labels ("in 3 hours") stay accurate
- Nav anchor bug fix: NAV_ITEMS hrefs changed from `#about` to `/#about` (absolute) so they work from any route

## Component Architecture (as of Session 4)
- fonts.ts owns font configuration — layout.tsx imports from there
- ThemeProvider uses next-themes, attribute="class", defaultTheme="dark", enableSystem=false
- ThemeToggle is hydration-safe: renders an invisible placeholder div during SSR
- Header scroll detection threshold: 8px (window.scrollY > 8)
- Main content has pt-16 to offset the fixed header height
- All anchor sections (#about, #projects, #contact) have scroll-mt-20 for sticky header offset
- Hero scroll indicator fades after window.scrollY > 40

## Sitemap & SEO
- next-sitemap runs as postbuild script, generates public/sitemap.xml + public/robots.txt
- Config: next-sitemap.config.js at project root
- JSON-LD Person structured data injected in layout.tsx body

## Dependencies (installed)
- next-themes for dark/light toggle
- groq-sdk for LLM (Tool #1) — replaces Anthropic per DEC-011
- @anthropic-ai/sdk (installed but unused — kept in case of future swap)
- lucide-react for icons (NO brand icons — see note above)
- clsx + tailwind-merge for cn() helper
- posthog-js + posthog-js/react for analytics
- next-mdx-remote + gray-matter + reading-time for content
- date-fns for date formatting
- @tailwindcss/typography (dev) for prose styles
- prettier + prettier-plugin-tailwindcss (dev)
- next-sitemap for sitemap + robots.txt generation
- cron-parser v5 (ESM) for Tool #2 — INSTALLED. API: `CronExpressionParser.parse(expr).next().toDate()`
- reactflow + dagre for Tool #3 (not yet installed — add when building Tool #3)
