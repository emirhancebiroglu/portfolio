'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

interface TooltipProps {
  content: string;
  side?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
  children: React.ReactNode;
}

export function Tooltip({ content, side = 'top', className, children }: TooltipProps) {
  const [visible, setVisible] = useState(false);

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      {children}
      {visible && (
        <span
          role="tooltip"
          className={cn(
            'pointer-events-none absolute z-50 whitespace-nowrap rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-2.5 py-1.5 text-xs text-[var(--color-text-primary)] shadow-lg',
            {
              'bottom-full left-1/2 mb-2 -translate-x-1/2': side === 'top',
              'top-full left-1/2 mt-2 -translate-x-1/2': side === 'bottom',
              'right-full top-1/2 mr-2 -translate-y-1/2': side === 'left',
              'left-full top-1/2 ml-2 -translate-y-1/2': side === 'right',
            },
            className,
          )}
        >
          {content}
        </span>
      )}
    </span>
  );
}
