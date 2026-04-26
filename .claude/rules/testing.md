---
paths:
  - **/*.test.ts
  - **/*.test.tsx
  - **/*.spec.ts
---

# Testing Rules

- Use the test runner included with Next.js (Jest or Vitest, depending on project setup)
- Test API routes with mock requests — verify input validation, rate limiting, error handling
- Test utility functions (cron parser, SQL parser, cn helper) with unit tests
- Test edge cases: empty input, max-length input, special characters, unicode
- Do NOT mock the Claude API in tests — test everything around it (validation, parsing, rate limiting)
- Accessibility: every tool page should pass axe-core checks