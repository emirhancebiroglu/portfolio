import { cn } from '@/lib/utils';

interface CardProps {
  className?: string;
  children: React.ReactNode;
  hoverable?: boolean;
}

interface CardHeaderProps {
  className?: string;
  children: React.ReactNode;
}

interface CardBodyProps {
  className?: string;
  children: React.ReactNode;
}

interface CardFooterProps {
  className?: string;
  children: React.ReactNode;
}

export function Card({ className, children, hoverable = false }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6',
        hoverable &&
          'transition-colors duration-150 hover:border-[var(--color-accent)] hover:bg-[var(--color-surface-hover)]',
        className,
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children }: CardHeaderProps) {
  return <div className={cn('mb-4', className)}>{children}</div>;
}

export function CardBody({ className, children }: CardBodyProps) {
  return <div className={cn('text-[var(--color-text-secondary)]', className)}>{children}</div>;
}

export function CardFooter({ className, children }: CardFooterProps) {
  return (
    <div
      className={cn(
        'mt-4 border-t border-[var(--color-border)] pt-4',
        className,
      )}
    >
      {children}
    </div>
  );
}
