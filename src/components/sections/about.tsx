import { Badge } from '@/components/ui/badge';

const STACK = [
  {
    category: 'Frontend',
    items: ['React', 'Next.js', 'TypeScript', 'Tailwind'],
  },
  {
    category: 'Backend',
    items: ['Java Spring Boot', 'Node.js', 'Python'],
  },
  {
    category: 'Data',
    items: ['PostgreSQL', 'Supabase', 'Firebase', 'Oracle'],
  },
  {
    category: 'Tools',
    items: ['Docker', 'GitHub', 'Claude Code', 'Cursor'],
  },
] as const;

export function About() {
  return (
    <section id="about" className="scroll-mt-20 px-6 py-24">
      <div className="mx-auto w-full max-w-[768px]">
        <h2 className="mb-10 text-3xl font-bold tracking-tight text-[var(--color-text-primary)]">
          About
        </h2>

        {/* I1 — bio paragraphs */}
        <div className="space-y-4 text-base leading-relaxed text-[var(--color-text-secondary)]">
          <p>
            I&apos;m a software engineer at Toyota (via 32bit), where I work on backend
            microservices and internal tooling for automotive logistics systems. Most of
            my day is Java Spring Boot, event-driven architecture, and making sure
            high-stakes workflows don&apos;t break.
          </p>
          <p>
            On the side I&apos;m building micro-SaaS products — small, focused tools that
            solve one problem well. I&apos;m drawn to the product side of engineering:
            distribution, retention, and the gap between what developers build and what
            people actually need.
          </p>
          <p>
            My philosophy: ship fast, but handle edge cases. Write code that reads like
            prose. Don&apos;t mistake activity for progress — one well-scoped feature beats
            five half-finished ones.
          </p>
        </div>

        {/* I2 — tech stack */}
        <div className="mt-12 space-y-4">
          {STACK.map(({ category, items }) => (
            <div key={category} className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
              <span className="w-24 shrink-0 text-xs font-medium uppercase tracking-widest text-[var(--color-text-secondary)]">
                {category}
              </span>
              <div className="flex flex-wrap gap-2">
                {items.map((item) => (
                  <Badge key={item} variant="default">
                    {item}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
