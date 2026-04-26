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

## API Details
- Claude model for task breakdown: claude-haiku-4-5-20251001
- API key env var: ANTHROPIC_API_KEY (server-side only)
- Rate limit: 20 requests/hour per IP (in-memory Map)

## Design
- Primary accent: #D4845A (terracotta)
- Dark BG: #0A0A0B
- Font: Inter (variable, via next/font)
- Max content width: 768px (prose), 1200px (tools)

## Dependencies
- next-themes for dark/light toggle
- @anthropic-ai/sdk for Claude API
- cron-parser for Tool #2
- reactflow + dagre for Tool #3
- lucide-react for icons
- clsx + tailwind-merge for cn() helper
- posthog-js for analytics