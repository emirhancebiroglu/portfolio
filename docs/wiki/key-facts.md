# Portfolio — Key Facts

> Non-obvious facts about the project that Claude should know.
> Updated as we learn things during development.

## URLs
- Production: https://emirhancebiroglu.dev
- Vercel project: (fill in after Vercel setup)
- GitHub repo: https://github.com/emirhan-cebiroglu/portfolio

## Accounts
- Vercel: connected via GitHub
- PostHog project: "Emirhan Portfolio"
- Anthropic API: pay-as-you-go, $10/month limit
- Domain registrar: (Cloudflare or Namecheap — fill in)

## Versions (as of Session 3)
- Next.js: 16 (create-next-app@16.2.4 installed this — plan said 15)
- Tailwind CSS: v4 (CSS-based config, NOT tailwind.config.ts)
- Node.js: v24.14.0
- npm: 11.9.0

## Tailwind v4 Important Notes
- Config is in src/app/globals.css via @theme {} block — no tailwind.config.ts
- Use @plugin "@tailwindcss/typography" in globals.css (not plugins array in config)
- darkMode: 'class' is not needed — handled via CSS .dark selector in @layer base
- Custom colors/fonts defined as CSS custom properties in @theme {}

## API Details
- Claude model for task breakdown: claude-haiku-4-5-20251001
- API key env var: ANTHROPIC_API_KEY (server-side only)
- Rate limit: 20 requests/hour per IP (in-memory Map)

## Design
- Primary accent: #D4845A (terracotta)
- Dark BG: #0A0A0B
- Font: Inter (variable, via next/font — var --font-inter)
- Mono font: JetBrains Mono (variable — var --font-jetbrains)
- Max content width: 768px (prose), 1200px (tools)

## lucide-react Icon Notes
- This version does NOT export brand icons: Github, Linkedin, Twitter do not exist
- Available social-adjacent icons: ExternalLink, X (the letter X icon, not the brand)
- Brand icons (GitHub, LinkedIn, X/Twitter) are implemented as inline SVG components in footer.tsx
- Do NOT attempt to import Github/Linkedin/Twitter from lucide-react — build will fail

## Component Architecture (as of Session 3)
- fonts.ts owns font configuration — layout.tsx imports from there
- ThemeProvider uses next-themes, attribute="class", defaultTheme="dark", enableSystem=false
- ThemeToggle is hydration-safe: renders an invisible placeholder div during SSR
- Header scroll detection threshold: 8px (window.scrollY > 8)
- Main content has pt-16 to offset the fixed header height

## Dependencies (installed)
- next-themes for dark/light toggle
- @anthropic-ai/sdk for Claude API (installed, not yet used)
- lucide-react for icons (NO brand icons — see note above)
- clsx + tailwind-merge for cn() helper
- posthog-js for analytics
- next-mdx-remote + gray-matter + reading-time for content
- date-fns for date formatting
- @tailwindcss/typography (dev) for prose styles
- prettier + prettier-plugin-tailwindcss (dev)
- cron-parser for Tool #2 (not yet installed — add when building Tool #2)
- reactflow + dagre for Tool #3 (not yet installed — add when building Tool #3)
