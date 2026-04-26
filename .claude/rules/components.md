---
paths:
  - src/components/**
---

# Component Rules

- Functional components only. NEVER class components.
- Export named exports, not default exports (except page.tsx files)
- Props interface defined above the component, named [ComponentName]Props
- Use cn() from @/lib/utils for conditional class names
- All interactive components must be marked 'use client'
- Layout components (header, footer) handle their own responsive behavior
- UI components (button, card) accept className prop for overrides
- Tool components live in src/components/tools/[tool-name]/
- Every component that displays text must respect dark/light mode via CSS variables or Tailwind dark: prefix
- Destructure props in the function signature, not in the body