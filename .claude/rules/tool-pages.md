---
paths:
  - src/app/tools/**
  - src/components/tools/**
---

# Tool Page Rules

- Every tool page exports metadata (title, description) for SEO
- Every tool must work without login or signup — completely free, zero friction
- Every tool must handle: empty input, invalid input, API errors, loading states, mobile layout
- Loading states use skeleton or spinner — never block the UI without feedback
- Results must be copyable (clipboard API)
- Each tool page includes a FAQ section at the bottom (3-4 questions) for SEO
- PostHog events: [tool]_submitted, [tool]_completed, [tool]_copied, [tool]_error
- Tool pages use max-w-[768px] for input, max-w-wide for visual tools (schema viz)
- No tool should auto-submit on page load — user initiates every action
- Cross-tool navigation at the bottom: "More tools" section with cards for other tools