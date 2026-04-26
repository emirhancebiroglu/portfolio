import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PROJECTS, type Project } from '@/lib/constants';

function statusVariant(status: Project['status']): 'success' | 'accent' | 'muted' {
  if (status === 'live') return 'success';
  if (status === 'building') return 'accent';
  return 'muted';
}

function statusLabel(status: Project['status']): string {
  if (status === 'live') return 'Live';
  if (status === 'building') return 'Building';
  return 'Planned';
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <Link href={project.href} className="group block focus:outline-none">
      <Card
        hoverable
        className="flex h-full flex-col transition-transform duration-150 group-focus-visible:ring-2 group-focus-visible:ring-[var(--color-accent)]"
      >
        <div className="mb-3 flex items-start justify-between gap-2">
          <h3 className="text-base font-semibold text-[var(--color-text-primary)]">
            {project.title}
          </h3>
          <ArrowUpRight
            className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-text-secondary)] transition-colors group-hover:text-[var(--color-accent)]"
            aria-hidden
          />
        </div>

        <p className="mb-4 flex-1 text-sm leading-relaxed text-[var(--color-text-secondary)]">
          {project.description}
        </p>

        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={statusVariant(project.status)}>
            {statusLabel(project.status)}
          </Badge>
          {project.tags.map((tag) => (
            <Badge key={tag} variant="default">
              {tag}
            </Badge>
          ))}
        </div>
      </Card>
    </Link>
  );
}

function EmptyState() {
  return (
    <div className="col-span-2 py-16 text-center">
      <p className="text-base text-[var(--color-text-secondary)]">
        Tools are being built. First one drops soon.
      </p>
    </div>
  );
}

export function Projects() {
  return (
    <section id="projects" className="scroll-mt-20 px-6 py-24">
      <div className="mx-auto w-full max-w-[768px]">
        <h2 className="mb-10 text-3xl font-bold tracking-tight text-[var(--color-text-primary)]">
          Projects
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {PROJECTS.length === 0 ? (
            <EmptyState />
          ) : (
            PROJECTS.map((project) => (
              <ProjectCard key={project.href} project={project} />
            ))
          )}
        </div>
      </div>
    </section>
  );
}
