'use client';

import { useState, useEffect } from 'react';
import { Copy, Check } from 'lucide-react';
import { getNextExecutions, describeExpression, validateExpression } from './cron-utils';

interface CronPreviewProps {
  expression: string;
}

function formatRelative(date: Date, now: Date): string {
  const diffMs = date.getTime() - now.getTime();
  const diffMin = Math.round(diffMs / 60_000);
  const diffHrs = Math.round(diffMs / 3_600_000);
  const diffDays = Math.round(diffMs / 86_400_000);

  if (diffMin < 2) return 'in moments';
  if (diffMin < 60) return `in ${diffMin} minutes`;
  if (diffHrs < 24) return `in ${diffHrs} hour${diffHrs !== 1 ? 's' : ''}`;
  if (diffDays === 1) return 'tomorrow';
  if (diffDays < 7) return `in ${diffDays} days`;
  return `in ${Math.round(diffDays / 7)} week${Math.round(diffDays / 7) !== 1 ? 's' : ''}`;
}

function formatAbsolute(date: Date): string {
  return date.toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

export function CronPreview({ expression }: CronPreviewProps) {
  const [copied, setCopied] = useState(false);
  const [now, setNow] = useState<Date>(() => new Date());

  // Refresh "now" every 30 s so relative labels stay accurate
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);

  const valid = validateExpression(expression);
  const description = valid ? describeExpression(expression) : null;
  const nextRuns = valid ? getNextExecutions(expression, 10) : [];

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(expression);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
      {/* Expression row */}
      <div className="flex items-center justify-between gap-4">
        <code className="flex-1 overflow-x-auto whitespace-nowrap font-mono text-2xl font-semibold text-[var(--color-accent)]">
          {expression}
        </code>
        <button
          type="button"
          onClick={handleCopy}
          disabled={!valid}
          aria-label="Copy expression"
          className="flex shrink-0 items-center gap-1.5 rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm text-[var(--color-text-secondary)] transition-colors hover:border-[var(--color-accent)]/50 hover:text-[var(--color-accent)] disabled:opacity-40"
        >
          {copied ? <Check size={15} className="text-green-500" /> : <Copy size={15} />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>

      {/* Human description */}
      {description && (
        <p className="text-base text-[var(--color-text-primary)]">{description}</p>
      )}
      {!valid && (
        <p className="text-sm text-red-500">Invalid cron expression</p>
      )}

      {/* Next executions */}
      {nextRuns.length > 0 && (
        <div className="flex flex-col gap-1">
          <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">
            Next 10 runs
          </p>
          {nextRuns.map((date, i) => (
            <div key={i} className="flex items-center justify-between gap-4 py-1">
              <span className="text-sm text-[var(--color-text-primary)]">
                {formatAbsolute(date)}
              </span>
              <span className="text-xs text-[var(--color-text-muted)]">
                {formatRelative(date, now)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
