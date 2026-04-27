'use client';

import { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { CronField, type CronFieldMeta } from './CronField';
import { CronPresets } from './CronPresets';
import { CronPreview } from './CronPreview';
import {
  type CronFields,
  type CronFieldState,
  buildCronExpression,
  parseCronExpression,
  validateExpression,
  DEFAULT_FIELDS,
} from './cron-utils';

const FIELD_META: { key: keyof CronFields; meta: CronFieldMeta }[] = [
  { key: 'minute', meta: { label: 'Minute', min: 0, max: 59, unit: 'minute' } },
  { key: 'hour', meta: { label: 'Hour', min: 0, max: 23, unit: 'hour' } },
  {
    key: 'dayOfMonth',
    meta: { label: 'Day of Month', min: 1, max: 31, unit: 'day' },
  },
  {
    key: 'month',
    meta: {
      label: 'Month',
      min: 1,
      max: 12,
      unit: 'month',
      names: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    },
  },
  {
    key: 'dayOfWeek',
    meta: {
      label: 'Day of Week',
      min: 0,
      max: 6,
      unit: 'day',
      names: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    },
  },
];

export function CronBuilderTool() {
  const [fields, setFields] = useState<CronFields>(DEFAULT_FIELDS);
  const [reverseInput, setReverseInput] = useState('');
  const [reverseError, setReverseError] = useState('');

  function updateField(key: keyof CronFields, value: CronFieldState) {
    setFields((prev) => ({ ...prev, [key]: value }));
  }

  function applyExpression(expr: string) {
    const parsed = parseCronExpression(expr);
    if (!parsed) {
      setReverseError('Could not parse this expression.');
      return;
    }
    if (!validateExpression(expr)) {
      setReverseError('Invalid cron expression.');
      return;
    }
    setReverseError('');
    setFields(parsed);
    setReverseInput(expr);
  }

  function handleReverseChange(raw: string) {
    setReverseInput(raw);
    setReverseError('');
    const trimmed = raw.trim();
    if (trimmed === '') return;
    const parts = trimmed.split(/\s+/);
    if (parts.length === 5) applyExpression(trimmed);
  }

  const expression = buildCronExpression(fields);

  return (
    <div className="flex flex-col gap-6">
      {/* Reverse parser */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="reverse-input"
          className="text-xs font-semibold uppercase tracking-widest text-[var(--color-text-muted)]"
        >
          Paste an existing expression
        </label>
        <input
          id="reverse-input"
          type="text"
          value={reverseInput}
          onChange={(e) => handleReverseChange(e.target.value)}
          placeholder="e.g. 0 9 * * 1-5"
          className="w-full max-w-sm rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 font-mono text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-accent)] focus:outline-none"
        />
        {reverseError && (
          <p className="flex items-center gap-1 text-xs text-red-500">
            <AlertCircle size={12} />
            {reverseError}
          </p>
        )}
      </div>

      {/* Fields grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {FIELD_META.map(({ key, meta }) => (
          <CronField
            key={key}
            meta={meta}
            value={fields[key]}
            onChange={(v) => updateField(key, v)}
          />
        ))}
      </div>

      {/* Presets */}
      <CronPresets onSelect={applyExpression} />

      {/* Live preview */}
      <CronPreview expression={expression} />
    </div>
  );
}
