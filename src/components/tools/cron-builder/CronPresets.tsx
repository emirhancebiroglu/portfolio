'use client';

interface Preset {
  label: string;
  expr: string;
  description: string;
}

const PRESETS: Preset[] = [
  { label: 'Every minute', expr: '* * * * *', description: '* * * * *' },
  { label: 'Every hour', expr: '0 * * * *', description: '0 * * * *' },
  { label: 'Daily at midnight', expr: '0 0 * * *', description: '0 0 * * *' },
  { label: 'Weekdays at 9 AM', expr: '0 9 * * 1-5', description: '0 9 * * 1-5' },
  { label: 'Every Sunday', expr: '0 0 * * 0', description: '0 0 * * 0' },
  { label: 'First of month', expr: '0 0 1 * *', description: '0 0 1 * *' },
  { label: 'Every 5 minutes', expr: '*/5 * * * *', description: '*/5 * * * *' },
  { label: 'Twice daily', expr: '0 9,17 * * *', description: '0 9,17 * * *' },
];

interface CronPresetsProps {
  onSelect: (expr: string) => void;
}

export function CronPresets({ onSelect }: CronPresetsProps) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">
        Presets
      </p>
      <div className="flex flex-wrap gap-2">
        {PRESETS.map((preset) => (
          <button
            key={preset.expr}
            type="button"
            onClick={() => onSelect(preset.expr)}
            className="group flex items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-left transition-colors hover:border-[var(--color-accent)]/50 hover:bg-[var(--color-surface-hover)]"
          >
            <span className="text-sm font-medium text-[var(--color-text-primary)] group-hover:text-[var(--color-accent)]">
              {preset.label}
            </span>
            <span className="font-mono text-xs text-[var(--color-text-muted)]">
              {preset.description}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
