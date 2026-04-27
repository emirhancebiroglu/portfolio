# Portfolio — Project Progress

## Last Updated
2026-04-27 | Session 6: Nav bug fix, nonsense-input guard (Task Breakdown), Cron Expression Builder (U1–U9)

## Current Phase
Phase 1: Portfolio Build (Week 1-2) — wrapping up

## Current Focus
Section V: Schema Visualizer (Tool #3) — next up

## Completed Tasks
- [x] Session 1: Project planning, roadmap, A-to-Z task plan
- [x] C1–C8: Codebase initialization (Next.js 16, Tailwind v4, TypeScript strict, ESLint flat, Prettier, design tokens, cn helper, fonts, env)
- [x] D1–D3+: Directory structure, placeholder files, constants.ts, fonts.ts, posthog.ts stub, types/index.ts
- [x] F1–F7: Foundation layout — fonts wired, ThemeProvider, Header (sticky, blur, mobile drawer), ThemeToggle (SSR-safe), Footer (inline SVG brands)
- [x] G1–G6: Global UI components — Button, Card, Badge, Input, Textarea, Tooltip
- [x] H1–H2: Hero section + scroll indicator
- [x] I1–I2: About section + tech stack grid
- [x] J1–J3: Projects grid (data-driven from PROJECTS array)
- [x] K1: Contact section
- [x] L1+: Homepage assembled with scroll-mt offsets
- [x] M1–M5: Metadata, dynamic OG image (edge runtime), JSON-LD Person, next-sitemap, 404
- [x] N: PostHog Analytics Integration — PostHogProvider client component, pageview tracking on route change via usePathname/useSearchParams (Suspense-wrapped), cookieless memory persistence, autocapture off
- [x] Q: AI Task Breakdown planning — user flow, API contract, prompt design, error handling, analytics events
- [x] R1: groq-sdk installed (replaces anthropic-sdk for this tool)
- [x] R2: API route src/app/api/task-breakdown/route.ts — POST handler, Groq llama-3.3-70b-versatile, JSON-mode, validated input
- [x] R3: In-memory rate limiting (20 req/hour per IP, x-forwarded-for parsing)
- [x] R4: Input sanitization — trim, length cap, 7 prompt-injection patterns blocked
- [x] S1: Tool page src/app/tools/task-breakdown/page.tsx — server component with metadata, mounts client tool
- [x] S2: TaskInput component — textarea with char counter, granularity selector (Fewer/Balanced/More detail), ⌘Enter shortcut, focus-on-error via registerFocus callback
- [x] S3: TaskResults component — numbered cards, estimatedMinutes badges, skeleton loader
- [x] S4: Copy-to-clipboard with 2-second "Copied!" feedback
- [x] S5: All edge cases — empty input focus, char-limit validation, error display, 2s submit debounce
- [x] S6: PostHog events wired — task_breakdown_submitted/completed/copied/error
- [x] S7: Tools index page src/app/tools/page.tsx — auto-populated from PROJECTS array
- [x] S8: SEO — h1 + meta description + 4-question FAQ section in <details> elements
- [x] T2: PROJECTS array updated — AI Task Breakdown live entry
- [x] Quality Optimization Pass: Rewrote SYSTEM_PROMPT with 3 few-shot examples, 12 banned phrases, Step 1 contract; switched to Groq JSON mode (response_format: json_object); strengthened user message with overwhelmed-user framing
- [x] BUG FIX: Nav anchor links changed from `#about` to `/#about` — fixes broken scrolling when on non-home routes (/tools, /tools/task-breakdown, etc.)
- [x] BUG FIX: Nonsense-input guard for Task Breakdown — looksLikeNonsense() heuristic (keyboard mash + vowel ratio + repeated chars) + LLM error envelope in system prompt + API forwards error as 400
- [x] U1–U9: Cron Expression Builder — full build:
  - cron-utils.ts: parseCronExpression, buildCronExpression, describeExpression, getNextExecutions, validateExpression
  - CronField.tsx: 4-mode field (Every/Every N/Specific grid/Range) for all 5 cron positions
  - CronPresets.tsx: 8 one-click preset buttons
  - CronPreview.tsx: live expression display, plain-English description, next 10 runs with relative labels, copy button
  - CronBuilderTool.tsx: main client state, reverse-parser input, responsive 2-col field grid
  - page.tsx: server component, metadata, h1, 4-question FAQ
  - PROJECTS array updated — Cron Builder live entry
  - cron-parser npm package installed

## In Progress
(nothing — U complete, V not yet started)

## Blocked
(nothing currently blocked)

## Next Up
- O: Vercel Deployment — connect repo, set GROQ_API_KEY + NEXT_PUBLIC_POSTHOG_KEY env vars, push to main
- T1/T3: Manual quality testing of Task Breakdown + Cron Builder on live URL after deploy
- T4: Launch posts (LinkedIn, X, etc.)
- V: Schema Visualizer — Supabase/Postgres ERD generator (reactflow + dagre, SQL parser)

## Tool Status
| Tool | Status | Section |
|------|--------|---------|
| AI Task Breakdown | Built + nonsense guard, pending deploy | Q–T |
| Cron Expression Builder | Built (U1–U9 complete), pending deploy | U |
| Schema Visualizer | Not started | V |

## Key Metrics
- Total tasks from A-Z plan: 140
- Completed: ~85 (C1–C8, D1–D3+, F1–F7, G1–G6, H1–H2, I1–I2, J1–J3, K1, L1+, M1–M5, N, Q, R1–R4, S1–S8, T2, quality optimization, 2 bug fixes, U1–U9)
- Remaining: ~55
- Phase 1 target: Week 2
- Phase 2 target: Week 10
- Phase 3 target: Week 12
