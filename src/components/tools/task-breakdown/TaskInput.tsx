'use client';

import { useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

type Granularity = 'low' | 'medium' | 'high';

const GRANULARITY_OPTIONS: { value: Granularity; label: string }[] = [
  { value: 'low', label: 'Fewer steps' },
  { value: 'medium', label: 'Balanced' },
  { value: 'high', label: 'More detail' },
];

interface TaskInputProps {
  task: string;
  granularity: Granularity;
  loading: boolean;
  error: string | null;
  onTaskChange: (value: string) => void;
  onGranularityChange: (value: Granularity) => void;
  onSubmit: () => void;
  registerFocus?: (fn: () => void) => void;
}

export function TaskInput({
  task,
  granularity,
  loading,
  error,
  onTaskChange,
  onGranularityChange,
  onSubmit,
  registerFocus,
}: TaskInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const charCount = task.length;
  const overLimit = charCount > 500;

  useEffect(() => {
    registerFocus?.(() => textareaRef.current?.focus());
  }, [registerFocus]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      onSubmit();
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={task}
          onChange={(e) => onTaskChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Describe a task that feels overwhelming..."
          rows={4}
          maxLength={600}
          aria-label="Task to break down"
          aria-describedby={error ? 'task-error' : undefined}
          aria-invalid={!!error || overLimit}
          className={cn(
            'w-full resize-y rounded-xl border bg-[var(--color-surface)] px-4 py-3 text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] transition-colors',
            overLimit
              ? 'border-red-500 focus:ring-red-500'
              : 'border-[var(--color-border)]',
          )}
        />
        <span
          className={cn(
            'absolute bottom-3 right-3 text-xs tabular-nums',
            overLimit ? 'text-red-500' : 'text-[var(--color-text-tertiary)]',
          )}
        >
          {charCount} / 500
        </span>
      </div>

      {error && (
        <p id="task-error" className="text-sm text-red-500" role="alert">
          {error}
        </p>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2" role="group" aria-label="Granularity">
          {GRANULARITY_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onGranularityChange(opt.value)}
              className={cn(
                'rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors',
                granularity === opt.value
                  ? 'border-[var(--color-accent)] bg-[var(--color-accent-subtle)] text-[var(--color-accent)]'
                  : 'border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]',
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <Button
          variant="primary"
          size="lg"
          loading={loading}
          disabled={overLimit}
          onClick={onSubmit}
          className="w-full sm:w-auto"
        >
          Break it down
        </Button>
      </div>
      <p className="text-xs text-[var(--color-text-tertiary)]">
        Tip: Press <kbd className="rounded border border-[var(--color-border)] px-1 py-0.5 font-mono text-[10px]">⌘ Enter</kbd> to submit
      </p>
    </div>
  );
}
