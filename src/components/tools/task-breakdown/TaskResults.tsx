'use client';

import { useState } from 'react';
import { Copy, Check, RotateCcw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface Step {
  number: number;
  text: string;
  estimatedMinutes?: number;
}

interface TaskResultsProps {
  steps: Step[];
  originalTask: string;
  onReset: () => void;
  onCopied: () => void;
}

export function TaskResults({ steps, originalTask, onReset, onCopied }: TaskResultsProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    const text = `Task: ${originalTask}\n\n` + steps.map((s) => `${s.number}. ${s.text}`).join('\n');
    await navigator.clipboard.writeText(text);
    setCopied(true);
    onCopied();
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        {steps.map((step) => (
          <div
            key={step.number}
            className="flex gap-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 transition-colors hover:border-[var(--color-accent)] hover:border-opacity-40"
          >
            <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent-subtle)] text-sm font-bold text-[var(--color-accent)]">
              {step.number}
            </span>
            <div className="flex flex-1 flex-col gap-1.5">
              <p className="text-[var(--color-text-primary)]">{step.text}</p>
              {step.estimatedMinutes !== undefined && (
                <Badge variant="muted" className="w-fit">
                  ~{step.estimatedMinutes} min
                </Badge>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          variant="primary"
          size="md"
          onClick={handleCopy}
          className={cn('gap-2', copied && 'opacity-80')}
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? 'Copied!' : 'Copy all steps'}
        </Button>
        <Button variant="secondary" size="md" onClick={onReset} className="gap-2">
          <RotateCcw className="h-4 w-4" />
          Try another task
        </Button>
      </div>
    </div>
  );
}

export function TaskResultsSkeleton() {
  return (
    <div className="flex flex-col gap-3" aria-label="Loading results" aria-busy="true">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="flex gap-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4"
        >
          <div className="h-7 w-7 shrink-0 animate-pulse rounded-full bg-[var(--color-surface-hover)]" />
          <div className="flex flex-1 flex-col gap-2 pt-1">
            <div
              className="h-4 animate-pulse rounded bg-[var(--color-surface-hover)]"
              style={{ width: `${60 + (i % 3) * 15}%` }}
            />
            <div className="h-3 w-12 animate-pulse rounded bg-[var(--color-surface-hover)]" />
          </div>
        </div>
      ))}
      <p className="text-center text-sm text-[var(--color-text-tertiary)]">Breaking it down…</p>
    </div>
  );
}
