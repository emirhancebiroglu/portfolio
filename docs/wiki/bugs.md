# Portfolio — Known Bugs & Solutions

> When Claude encounters or solves a bug, it logs it here.
> Future sessions can search this before re-debugging known issues.

## Format
BUG-NNN | Status (OPEN/RESOLVED) | Description | Solution (if resolved)

## Bugs

## BUG-001 | RESOLVED
**Description:** Build failed — `Github`, `Linkedin`, `Twitter` icons imported from lucide-react do not exist
**Root Cause:** The version of lucide-react installed in this project does not export brand icons. The A-to-Z plan assumed they were available.
**Solution:** Replaced icon imports with inline SVG path components defined directly in footer.tsx. No additional dependency needed.
**Date resolved:** 2026-04-26
