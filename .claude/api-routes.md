---
paths:
  - src/app/api/**
---

# API Route Rules

- All API routes use Next.js Route Handlers (export async function POST/GET)
- ALWAYS validate input before calling external APIs
- ALWAYS implement rate limiting (in-memory Map is fine for this project scale)
- ALWAYS return proper HTTP status codes: 400 for bad input, 429 for rate limit, 500 for server error
- ALWAYS wrap external API calls in try/catch
- Error responses follow this shape: { error: string }
- Success responses are tool-specific but always valid JSON
- Log errors to console.error with context (don't swallow errors silently)
- NEVER return raw error messages from Claude API to the user
- Max input length for task breakdown: 500 characters
- Rate limit: 20 requests per hour per IP