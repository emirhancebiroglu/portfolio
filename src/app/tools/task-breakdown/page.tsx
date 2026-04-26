import type { Metadata } from 'next';
import { TaskBreakdownTool } from '@/components/tools/task-breakdown/TaskBreakdownTool';

export const metadata: Metadata = {
  title: 'AI Task Breakdown Tool',
  description:
    'Paste any overwhelming task and get concrete micro-steps you can start immediately. Free, no signup required.',
};

export default function TaskBreakdownPage() {
  return (
    <div className="mx-auto max-w-[768px] px-4 py-16 sm:px-6">
      <div className="mb-10 flex flex-col gap-3">
        <h1 className="text-3xl font-bold tracking-tight text-[var(--color-text-primary)] sm:text-4xl">
          AI Task Breakdown Tool
        </h1>
        <p className="text-lg text-[var(--color-text-secondary)]">
          Paste any overwhelming task and get concrete micro-steps you can start immediately.
          Free, no signup required.
        </p>
      </div>

      <TaskBreakdownTool />

      {/* FAQ — SEO */}
      <div className="mt-20 flex flex-col gap-6 border-t border-[var(--color-border)] pt-12">
        <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">
          Frequently Asked Questions
        </h2>
        <div className="flex flex-col gap-5">
          {FAQ.map((item) => (
            <details
              key={item.q}
              className="group rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-sm font-medium text-[var(--color-text-primary)]">
                {item.q}
                <span className="ml-4 shrink-0 text-[var(--color-text-tertiary)] transition-transform group-open:rotate-180">
                  ▾
                </span>
              </summary>
              <p className="px-4 pb-4 text-sm text-[var(--color-text-secondary)]">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}

const FAQ = [
  {
    q: 'What is task breakdown?',
    a: 'Task breakdown is the process of splitting a large or vague goal into small, concrete actions you can take one at a time. It removes the mental friction of "where do I start?" by making each next step obvious.',
  },
  {
    q: 'Is this tool free?',
    a: 'Yes — completely free, no account or signup required. Just type your task and get your steps.',
  },
  {
    q: 'What AI model powers this?',
    a: "This tool uses Llama 3.3 70B running on Groq's infrastructure — one of the fastest and most capable open-source models available.",
  },
  {
    q: 'Can I use this for work tasks?',
    a: 'Absolutely. It works for anything from "write a project proposal" to "refactor this codebase" to "prepare for a difficult conversation." The more specific your input, the more useful the steps.',
  },
];
