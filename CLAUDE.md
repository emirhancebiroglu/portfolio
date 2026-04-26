# Emirhan Portfolio — Developer Showcase + Tool Platform

## What This Is
Personal portfolio and tool platform. Next.js 15 (App Router). Deployed on Vercel.
Hosts interactive micro-tools that people can use directly in the browser.
Dark mode default. Minimal design. Product builder aesthetic, not creative developer.

## Tech Stack
- Framework: Next.js 15 (App Router), TypeScript strict
- Styling: Tailwind CSS (utility-first, NEVER styled-components or CSS modules)
- Fonts: Inter (sans) + JetBrains Mono (code), loaded via next/font
- Analytics: PostHog (cookieless mode)
- AI: Claude API via @anthropic-ai/sdk (server-side only, NEVER client-side)
- Icons: lucide-react (NEVER Font Awesome or icon sprites)
- Hosting: Vercel (auto-deploy from GitHub main branch)
- Theme: next-themes (dark/light toggle)

## Commands
- `npm run dev` — start dev server (http://localhost:3000)
- `npm run build` — production build
- `npm run lint` — ESLint check
- `npx tsc --noEmit` — type check
- `npx prettier --write .` — format all files

## Architecture
- `src/app/` — Pages (App Router, file-based routing)
- `src/app/api/` — API routes (server-side only, Claude API calls here)
- `src/components/layout/` — Header, footer, theme provider
- `src/components/sections/` — Homepage sections (hero, about, projects, contact)
- `src/components/ui/` — Reusable UI components (button, card, badge, input)
- `src/components/tools/` — Tool-specific components (one subfolder per tool)
- `src/lib/` — Utilities, constants, PostHog client, font config
- `src/hooks/` — Custom React hooks
- `src/types/` — Shared TypeScript types
- `docs/wiki/` — Project state wiki (READ on /resume, UPDATE on /checkpoint)

## IMPORTANT Rules
- NEVER use `any` type. Use `unknown` and narrow, or define proper types.
- NEVER expose ANTHROPIC_API_KEY client-side. All AI calls go through src/app/api/ routes.
- NEVER use CSS modules, styled-components, or Emotion. Tailwind only.
- NEVER add dependencies without checking if Tailwind or native browser APIs can do it.
- Every component must work in both dark and light mode.
- All user-facing tools require: input validation, error handling, loading states, mobile layout.
- Use `cn()` helper from src/lib/utils.ts for conditional Tailwind classes.
- Prefer Server Components. Use 'use client' only when hooks or interactivity are needed.

## Design Tokens
Dark BG: #0A0A0B | Surface: #141415 | Border: #2A2A2D
Light BG: #FAFAF9 | Surface: #FFFFFF | Border: #E5E5E3
Accent: #D4845A (terracotta) | Success: #8BAB8D (sage green)
Font: Inter | Body: 16px | Heading: 32px | Border radius: 12px cards, 8px buttons
Max content width: 768px (prose), 1200px (tools)

## Tools (Status)
- /tools/task-breakdown — AI task breakdown tool (status in wiki)
- /tools/cron-builder — Cron expression builder (status in wiki)
- /tools/schema-visualizer — Supabase/Postgres ERD generator (status in wiki)

## Current State
@docs/wiki/progress.md