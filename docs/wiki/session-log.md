# Portfolio — Session Log

> Chronological record of every Claude Code work session.
> Each entry captures what was done, what broke, and what's next.

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
