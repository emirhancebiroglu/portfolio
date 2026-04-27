import type { Metadata } from 'next';
import { CronBuilderTool } from '@/components/tools/cron-builder/CronBuilderTool';

export const metadata: Metadata = {
  title: 'Cron Expression Builder — Emirhan Cebiroğlu',
  description:
    'Build, test, and understand cron expressions visually. See human-readable descriptions and next execution times. Free, no signup.',
  openGraph: {
    title: 'Cron Expression Builder',
    description:
      'Visual cron expression builder with live preview, human-readable descriptions, and next 10 run times.',
    images: [
      {
        url: '/og?title=Cron+Expression+Builder&description=Visual+builder+with+live+preview+and+next+run+times',
      },
    ],
  },
};

export default function CronBuilderPage() {
  return (
    <main className="mx-auto max-w-[1200px] px-6 pb-20 pt-28">
      <div className="mb-8">
        <h1 className="mb-3 text-3xl font-semibold text-[var(--color-text-primary)]">
          Cron Expression Builder
        </h1>
        <p className="max-w-[600px] text-[var(--color-text-secondary)]">
          Build any cron schedule visually. Pick values per field, see the expression update live,
          get a plain-English description, and preview the next 10 run times.
        </p>
      </div>

      <CronBuilderTool />

      {/* FAQ — static HTML for SEO */}
      <section className="mt-16 max-w-[768px]">
        <h2 className="mb-6 text-xl font-semibold text-[var(--color-text-primary)]">
          Frequently asked questions
        </h2>
        <div className="flex flex-col gap-3">
          {[
            {
              q: 'What is a cron expression?',
              a: 'A cron expression is a string of five fields that defines a recurring schedule for automated tasks. Each field represents a unit of time: minute, hour, day of month, month, and day of week. Cron is used in Unix systems, Kubernetes, CI/CD pipelines, and databases like Postgres via pg_cron.',
            },
            {
              q: 'How do I read a cron expression?',
              a: 'Read each field left to right: minute (0–59), hour (0–23), day of month (1–31), month (1–12), day of week (0–6, Sunday=0). An asterisk (*) means "every value". For example, "0 9 * * 1-5" means "at 9:00 AM, Monday through Friday".',
            },
            {
              q: 'What are the five fields in a cron expression?',
              a: 'The five fields are: (1) Minute — 0 to 59, (2) Hour — 0 to 23, (3) Day of Month — 1 to 31, (4) Month — 1 to 12, (5) Day of Week — 0 to 6 (Sunday to Saturday). Special characters: * (every), */N (every N), N-M (range), N,M (list).',
            },
            {
              q: 'What does * mean in cron?',
              a: 'An asterisk (*) in a cron field means "every possible value". For example, * in the hour field means every hour; * in the day-of-week field means every day of the week. Use */N to match every Nth value — e.g., */5 in the minute field runs every 5 minutes.',
            },
          ].map(({ q, a }) => (
            <details
              key={q}
              className="group rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]"
            >
              <summary className="cursor-pointer list-none px-5 py-4 text-sm font-medium text-[var(--color-text-primary)]">
                {q}
              </summary>
              <p className="border-t border-[var(--color-border)] px-5 py-4 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                {a}
              </p>
            </details>
          ))}
        </div>
      </section>
    </main>
  );
}
