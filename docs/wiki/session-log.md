# Portfolio — Session Log

> Chronological record of every Claude Code work session.
> Each entry captures what was done, what broke, and what's next.

## Session 5 | 2026-04-26
**Focus:** Section N (PostHog) + Section Q (Task Breakdown planning) + Section R (API route, Groq) + Section S (UI/UX) + T2 (PROJECTS update) + Output quality optimization pass
**Completed:**
- N: PostHogProvider client component (`src/components/layout/posthog-provider.tsx`) — initializes posthog-js on mount with cookieless memory persistence, autocapture off; PostHogPageView inner component fires `$pageview` on every route change via usePathname + useSearchParams (Suspense-wrapped because useSearchParams requires it in App Router); silently no-ops when NEXT_PUBLIC_POSTHOG_KEY is unset
- N: layout.tsx wraps Header + main + Footer with PostHogProvider inside ThemeProvider
- Q: Read sections 1090–1172 of A-to-Z plan, internalized user flow, API contract, prompt design, error handling, analytics events
- R1: Installed `groq-sdk` (user requested Groq instead of Anthropic — env var renamed to GROQ_API_KEY)
- R2: Built `src/app/api/task-breakdown/route.ts` — Groq llama-3.3-70b-versatile, max_tokens 1024 (later bumped to 1500), temperature 0.4
- R3: In-memory rate limiter (20 req/hour per IP, parses x-forwarded-for first segment)
- R4: validateInput function — type check, trim, empty/length-500 reject, 7 prompt-injection pattern reject, granularity enum check
- S: Created tool component tree under `src/components/tools/task-breakdown/`
  - TaskBreakdownTool.tsx — discriminated-union state (idle/loading/results/error), submitting ref for 2s debounce, registerFocus pattern to forward textarea focus from parent error handler, fires all 4 PostHog events with relevant properties
  - TaskInput.tsx — textarea with char counter (red when >500), 3-button granularity selector, ⌘/Ctrl+Enter shortcut, kbd hint, refs to expose focus()
  - TaskResults.tsx — numbered cards with accent-colored circle + step text + estimatedMinutes Badge; skeleton loader with 4 animated rows; Copy button with 2s "Copied!" + Check icon swap
- S: Tool page split into server component (metadata + h1 + FAQ) wrapping client TaskBreakdownTool — fixes "use client cannot export metadata" issue
- S: FAQ section — 4 native <details> for SEO (no JS dependencies)
- S: Tools index page (`src/app/tools/page.tsx`) — Link cards driven by PROJECTS array, status badges (live/building/planned), tag badges
- T2: PROJECTS array updated in constants.ts — AI Task Breakdown entry, status: live
- Quality optimization (after reviewing 6 sample outputs that were heavy on meta-planning anti-patterns):
  - Rewrote SYSTEM_PROMPT with explicit Step 1 contract, 12 banned phrases ("make a list of", "create a checklist", "categorize", "prioritize tasks", "plan your", "research" without specifics, "break down", "gather all", "take a break", "focus on one X at a time", "start with a small task", "just"), and 3 worked few-shot examples (cleaning chore, full-stack web app with data flow first, job interview prep with STAR method)
  - Switched to Groq JSON mode: `response_format: { type: 'json_object' }` — schema wrapped as `{ steps: [...] }` because json_object mode requires an object root; markdown-fence parse fallback removed; single JSON.parse path with steps-array validation
  - Strengthened user message: re-anchors "user feels overwhelmed, wants to START in 5 minutes" framing on every request, names specifics requirement, restates Step 1 contract inline
  - Bumped max_tokens 1024 → 1500 to fit longer prompt's output
**Issues:**
- First attempt at TaskBreakdownPage used 'use client' with `export const metadata` — Next.js doesn't allow that. Refactored: page.tsx is server component (metadata + h1 + FAQ), the interactive part lives in TaskBreakdownTool client component.
- 0 TypeScript errors throughout. Production build passes (9 routes, sitemap regenerated).
**Next session should:**
- T1: Manually test all 6 sample tasks (cleaning, full-stack, exams, YouTube, mixed-procrastination, interview) at medium + high granularity. Verify Step 1 contract, no banned phrases, estimatedMinutes always present, modern technical tooling, no recursive vague steps.
- If any output still falls into anti-patterns, iterate the system prompt before deploy.
- O: Vercel deployment — set GROQ_API_KEY and NEXT_PUBLIC_POSTHOG_KEY env vars, push to main, verify live URL.
- T3–T4: Live verification + launch posts.

## Session 4 | 2026-04-26
**Focus:** Sections G (UI Components) + H (Hero) + I (About) + J (Projects) + K (Contact) + L (Homepage Assembly) + M (SEO/Meta)
**Completed:**
- G: Built all 6 global UI components — Button (3 variants, 3 sizes, loading state), Card + CardHeader/Body/Footer (hoverable), Badge (4 variants), Input (label/error/hint/aria), Textarea (same API), Tooltip (4 sides, focus-accessible)
- H: Hero section — name at 48-60px, tagline, description, two CTA buttons smooth-scrolling to #projects/#contact, bouncing chevron scroll indicator that fades after 40px
- I: About section — 3 bio paragraphs (~180 words covering role/side work/philosophy), tech stack grid (Frontend/Backend/Data/Tools) using Badge components
- J: Projects grid — 2-col desktop/1-col mobile, Card-based with title/desc/status badge/tags/ArrowUpRight; empty state shown while PROJECTS array is empty; data wired from constants.ts
- K: Contact section — mailto link, GitHub/LinkedIn/X social icons (same SVG paths as footer)
- L: Homepage assembled (Hero → About → Projects → Contact), scroll-mt-20 on all anchor sections
- M: Full metadata (OG, Twitter card, robots), edge-runtime OG image route with ?title/?description params, JSON-LD Person structured data, next-sitemap installed with postbuild script (generates sitemap.xml + robots.txt)
**Issues:** None — all builds clean, 0 TypeScript errors throughout
**Next session should:** Build Section N (PostHog analytics integration — PostHogProvider client component, pageview tracking, usePostHog hook)

## Session 3 | 2026-04-26
**Focus:** Section D (Directory Structure) + Section F (Foundation Layout)
**Completed:**
- Created full src/ directory tree: components/sections, components/layout, components/ui, components/tools (task-breakdown, cron-builder, schema-viz), hooks, types, app routes
- Placeholder files for all components (hero, about, projects, contact, header, footer, theme-toggle, all UI components)
- All app route pages: /tools, /tools/task-breakdown, /tools/cron-builder, /tools/schema-visualizer, /api/task-breakdown, /og, not-found.tsx
- src/lib/constants.ts — SITE_CONFIG, NAV_ITEMS, PROJECTS array, Project type
- src/lib/fonts.ts — Inter + JetBrains Mono exports (layout.tsx updated to import from here)
- src/lib/posthog.ts — PostHog init stub
- src/types/index.ts — re-exports Project type
- ThemeProvider (next-themes, dark default)
- ThemeToggle — Sun/Moon, hydration-safe (renders invisible div on SSR to avoid mismatch)
- Header — fixed/sticky, backdrop-blur + border appears after 8px scroll, EC logo, desktop nav, ThemeToggle; mobile hamburger + slide-down drawer with Escape key, click-outside, and body scroll lock
- Footer — inline SVG brand icons for GitHub, LinkedIn, X (no extra dependency)
- layout.tsx rewired: ThemeProvider > Header > main (pt-16) > Footer
- Build: 10/10 routes, 0 TypeScript errors
**Issues:**
- lucide-react in this project has no brand icons (Github, Linkedin, Twitter exports don't exist). Fixed by inlining SVG paths directly in footer.tsx. No dependency added.
**Next session should:** Build Section G — real implementations of Button, Card, Badge, Input, Textarea, Tooltip components.

## Session 2 | 2026-04-26
**Focus:** Section C — Codebase Initialization (C1–C8)
**Completed:**
- Scaffolded Next.js 16 into a temp directory (portfolio-scaffold), then merged into portfolio/ — required because create-next-app refused to scaffold into a non-empty directory (CLAUDE.md was present)
- Installed all runtime and dev dependencies
- Configured TypeScript strict mode (noUncheckedIndexedAccess, noUnusedLocals, noUnusedParameters)
- Created .prettierrc with prettier-plugin-tailwindcss
- Updated ESLint config (flat config format — eslint.config.mjs, not .eslintrc.json, because Next.js 16 uses the new ESLint flat config)
- Replaced globals.css with Tailwind v4 @theme block + full light/dark CSS custom properties
- Created src/lib/utils.ts with cn() helper
- Replaced layout.tsx (Inter + JetBrains Mono fonts, removed Geist)
- Replaced page.tsx with "Coming soon." placeholder
- Deleted default public/ SVGs
- Created .gitignore and .env.example
- Zero TypeScript errors, zero lint errors
**Issues:**
- create-next-app installed Next.js 16 (not 15) with Tailwind v4. Tailwind v4 uses CSS-based config (@import "tailwindcss" + @theme {}) instead of tailwind.config.ts. Design tokens adapted to globals.css accordingly.
- ESLint uses flat config (eslint.config.mjs) not .eslintrc.json — added rules block directly into the flat config array.
**Next session should:** Start Section D (directory structure, placeholder components, constants.ts), then move into F (Foundation Layout — Header, Footer, ThemeProvider)

## Session 1 | 2026-04-26
**Focus:** Project planning and documentation
**Completed:**
- Created portfolio roadmap
- Created A-to-Z task plan
- Created Claude Code agency setup guide
**Issues:** None
**Next session should:** Start with tasks A (Accounts & Domain Setup) and C (Codebase Init)
