# Portfolio — Known Bugs & Solutions

> When Claude encounters or solves a bug, it logs it here.
> Future sessions can search this before re-debugging known issues.

## Format
BUG-NNN | Status (OPEN/RESOLVED) | Description | Solution (if resolved)

## Bugs

## BUG-003 | RESOLVED
**Description:** Task Breakdown tool accepts nonsense input (e.g. "adfads", "asdfghjkl") and returns fabricated steps
**Root Cause:** `validateInput` only rejected empty, too-long, and injection-pattern inputs — any other string reached the LLM which dutifully invented creative steps for gibberish.
**Solution:** Three-layer guard: (1) `looksLikeNonsense()` heuristic checks keyboard-mash sequences, vowel ratio <20% for single tokens, and repeated-char patterns before hitting the API; (2) System prompt instructs LLM to return `{ "error": "..." }` envelope for unrecognisable input; (3) API parser forwards `parsed.error` as HTTP 400. Frontend already handled `{ error }` from non-ok responses.
**Date resolved:** 2026-04-27

## BUG-002 | RESOLVED
**Description:** Nav links (About, Projects, Contact) do nothing when clicked from `/tools` or any non-home route
**Root Cause:** `NAV_ITEMS` used bare hash hrefs (`#about`, `#projects`, `#contact`). Browsers resolve these relative to the current URL, so on `/tools` they became `/tools#about` — a fragment that doesn't exist on that page.
**Solution:** Changed all homepage-section hrefs in `src/lib/constants.ts` to absolute anchors (`/#about`, `/#projects`, `/#contact`). This navigates to `/` first, then scrolls to the section. Tools link (`/tools`) unchanged.
**Date resolved:** 2026-04-27

## BUG-001 | RESOLVED
**Description:** Build failed — `Github`, `Linkedin`, `Twitter` icons imported from lucide-react do not exist
**Root Cause:** The version of lucide-react installed in this project does not export brand icons. The A-to-Z plan assumed they were available.
**Solution:** Replaced icon imports with inline SVG path components defined directly in footer.tsx and contact.tsx. No additional dependency needed.
**Date resolved:** 2026-04-26
