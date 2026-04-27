'use client';

import { cn } from '@/lib/utils';
import type { CronFieldState, FieldMode } from './cron-utils';

export interface CronFieldMeta {
  label: string;
  min: number;
  max: number;
  names?: string[];
  unit: string;
}

interface CronFieldProps {
  meta: CronFieldMeta;
  value: CronFieldState;
  onChange: (value: CronFieldState) => void;
}

const MODES: { key: FieldMode; label: string }[] = [
  { key: 'every', label: 'Every' },
  { key: 'everyN', label: 'Every N' },
  { key: 'specific', label: 'Specific' },
  { key: 'range', label: 'Range' },
];

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export function CronField({ meta, value, onChange }: CronFieldProps) {
  const { label, min, max, names, unit } = meta;
  const totalValues = max - min + 1;

  function setMode(mode: FieldMode) {
    onChange({ ...value, mode });
  }

  function toggleSpecific(n: number) {
    const next = value.specific.includes(n)
      ? value.specific.filter((v) => v !== n)
      : [...value.specific, n];
    onChange({ ...value, specific: next });
  }

  function setEveryN(raw: string) {
    const n = parseInt(raw, 10);
    if (!isNaN(n)) onChange({ ...value, everyN: clamp(n, 2, max) });
  }

  function setRangeFrom(raw: string) {
    const n = parseInt(raw, 10);
    if (!isNaN(n)) onChange({ ...value, rangeFrom: clamp(n, min, value.rangeTo) });
  }

  function setRangeTo(raw: string) {
    const n = parseInt(raw, 10);
    if (!isNaN(n)) onChange({ ...value, rangeTo: clamp(n, value.rangeFrom, max) });
  }

  const gridCols =
    totalValues <= 7
      ? 'grid-cols-7'
      : totalValues <= 12
        ? 'grid-cols-6'
        : totalValues <= 24
          ? 'grid-cols-6'
          : 'grid-cols-10';

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
      <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">
        {label}
      </p>

      {/* Mode tabs */}
      <div className="flex gap-1 rounded-lg bg-[var(--color-bg)] p-1">
        {MODES.map(({ key, label: ml }) => (
          <button
            key={key}
            type="button"
            onClick={() => setMode(key)}
            className={cn(
              'flex-1 rounded-md px-2 py-1 text-xs font-medium transition-colors',
              value.mode === key
                ? 'bg-[var(--color-accent)] text-white'
                : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]',
            )}
          >
            {ml}
          </button>
        ))}
      </div>

      {/* Mode-specific controls */}
      {value.mode === 'every' && (
        <p className="text-sm text-[var(--color-text-secondary)]">
          Any {unit} — <span className="font-mono text-[var(--color-accent)]">*</span>
        </p>
      )}

      {value.mode === 'everyN' && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-[var(--color-text-secondary)]">Every</span>
          <input
            type="number"
            min={2}
            max={max}
            value={value.everyN}
            onChange={(e) => setEveryN(e.target.value)}
            className="w-16 rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] px-2 py-1 text-center text-sm text-[var(--color-text-primary)] focus:border-[var(--color-accent)] focus:outline-none"
          />
          <span className="text-sm text-[var(--color-text-secondary)]">{unit}s</span>
        </div>
      )}

      {value.mode === 'specific' && (
        <div className={cn('grid gap-1', gridCols)}>
          {Array.from({ length: totalValues }, (_, i) => i + min).map((n) => {
            const selected = value.specific.includes(n);
            const displayName = names ? names[n - min] : String(n);
            return (
              <button
                key={n}
                type="button"
                onClick={() => toggleSpecific(n)}
                title={names ? `${n} — ${displayName}` : undefined}
                className={cn(
                  'rounded p-1 text-center text-xs font-medium transition-colors',
                  totalValues > 24 ? 'text-[10px]' : '',
                  selected
                    ? 'bg-[var(--color-accent)] text-white'
                    : 'bg-[var(--color-bg)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-primary)]',
                )}
              >
                {displayName ?? String(n)}
              </button>
            );
          })}
        </div>
      )}

      {value.mode === 'range' && (
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={min}
            max={value.rangeTo}
            value={value.rangeFrom}
            onChange={(e) => setRangeFrom(e.target.value)}
            className="w-16 rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] px-2 py-1 text-center text-sm text-[var(--color-text-primary)] focus:border-[var(--color-accent)] focus:outline-none"
          />
          <span className="text-sm text-[var(--color-text-secondary)]">to</span>
          <input
            type="number"
            min={value.rangeFrom}
            max={max}
            value={value.rangeTo}
            onChange={(e) => setRangeTo(e.target.value)}
            className="w-16 rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] px-2 py-1 text-center text-sm text-[var(--color-text-primary)] focus:border-[var(--color-accent)] focus:outline-none"
          />
          {names && (
            <span className="text-xs text-[var(--color-text-muted)]">
              ({names[value.rangeFrom - min]} – {names[value.rangeTo - min]})
            </span>
          )}
        </div>
      )}
    </div>
  );
}
