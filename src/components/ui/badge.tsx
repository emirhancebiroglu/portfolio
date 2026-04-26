import { cn } from '@/lib/utils';

interface BadgeProps {
  variant?: 'default' | 'accent' | 'success' | 'muted';
  className?: string;
  children: React.ReactNode;
}

export function Badge({ variant = 'default', className, children }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        {
          'border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)]':
            variant === 'default',
          'bg-[var(--color-accent-subtle)] text-[var(--color-accent)]':
            variant === 'accent',
          'bg-[rgba(139,171,141,0.12)] text-[#8BAB8D]': variant === 'success',
          'bg-[var(--color-surface-hover)] text-[var(--color-text-secondary)]':
            variant === 'muted',
        },
        className,
      )}
    >
      {children}
    </span>
  );
}
