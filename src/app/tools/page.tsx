import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { PROJECTS } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Free Developer Tools',
  description:
    'Free browser-based tools for developers. No signup, no account, no nonsense.',
};

export default function ToolsPage() {
  return (
    <div className="mx-auto max-w-[768px] px-4 py-16 sm:px-6">
      <div className="mb-10 flex flex-col gap-3">
        <h1 className="text-3xl font-bold tracking-tight text-[var(--color-text-primary)] sm:text-4xl">
          Free Developer Tools
        </h1>
        <p className="text-lg text-[var(--color-text-secondary)]">
          Browser-based tools you can use right now. No signup, no account, no nonsense.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {PROJECTS.map((project) => (
          <Link
            key={project.href}
            href={project.href}
            className="group flex flex-col gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 transition-colors hover:border-[var(--color-accent)] hover:border-opacity-60"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-1.5">
                <span className="font-semibold text-[var(--color-text-primary)] group-hover:text-[var(--color-accent)] transition-colors">
                  {project.title}
                </span>
                <p className="text-sm text-[var(--color-text-secondary)]">{project.description}</p>
              </div>
              <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-text-tertiary)] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--color-accent)]" />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant={
                  project.status === 'live'
                    ? 'success'
                    : project.status === 'building'
                      ? 'accent'
                      : 'muted'
                }
              >
                {project.status === 'live' ? 'Live' : project.status === 'building' ? 'Building' : 'Planned'}
              </Badge>
              {project.tags.map((tag) => (
                <Badge key={tag} variant="default">
                  {tag}
                </Badge>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
