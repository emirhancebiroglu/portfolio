import { CronExpressionParser } from 'cron-parser';

// ─── Types ────────────────────────────────────────────────────────────────────

export type FieldMode = 'every' | 'everyN' | 'specific' | 'range';

export interface CronFieldState {
  mode: FieldMode;
  everyN: number;
  specific: number[];
  rangeFrom: number;
  rangeTo: number;
}

export interface CronFields {
  minute: CronFieldState;
  hour: CronFieldState;
  dayOfMonth: CronFieldState;
  month: CronFieldState;
  dayOfWeek: CronFieldState;
}

// ─── Defaults ─────────────────────────────────────────────────────────────────

export function defaultField(everyN = 5, rangeFrom = 0, rangeTo = 1): CronFieldState {
  return { mode: 'every', everyN, specific: [], rangeFrom, rangeTo };
}

export const DEFAULT_FIELDS: CronFields = {
  minute: defaultField(5, 0, 5),
  hour: defaultField(2, 9, 17),
  dayOfMonth: defaultField(2, 1, 15),
  month: defaultField(3, 1, 6),
  dayOfWeek: defaultField(1, 1, 5),
};

// ─── Field serialisation ──────────────────────────────────────────────────────

export function fieldToString(state: CronFieldState): string {
  switch (state.mode) {
    case 'every':
      return '*';
    case 'everyN':
      return `*/${state.everyN}`;
    case 'specific':
      return state.specific.length > 0
        ? [...state.specific].sort((a, b) => a - b).join(',')
        : '*';
    case 'range':
      return `${state.rangeFrom}-${state.rangeTo}`;
  }
}

export function buildCronExpression(fields: CronFields): string {
  return [
    fieldToString(fields.minute),
    fieldToString(fields.hour),
    fieldToString(fields.dayOfMonth),
    fieldToString(fields.month),
    fieldToString(fields.dayOfWeek),
  ].join(' ');
}

// ─── Field parsing ────────────────────────────────────────────────────────────

export function parseFieldPart(str: string): CronFieldState {
  const s = str.trim();
  if (s === '*') return defaultField();
  if (s.startsWith('*/')) {
    const n = parseInt(s.slice(2), 10);
    return { mode: 'everyN', everyN: isNaN(n) ? 5 : n, specific: [], rangeFrom: 0, rangeTo: 1 };
  }
  if (/^\d+-\d+$/.test(s)) {
    const [a, b] = s.split('-').map(Number);
    return { mode: 'range', everyN: 5, specific: [], rangeFrom: a!, rangeTo: b! };
  }
  const values = s
    .split(',')
    .map(Number)
    .filter((n) => !isNaN(n));
  return { mode: 'specific', everyN: 5, specific: values, rangeFrom: 0, rangeTo: 1 };
}

export function parseCronExpression(expr: string): CronFields | null {
  const parts = expr.trim().split(/\s+/);
  if (parts.length !== 5) return null;
  const [min, hour, dom, month, dow] = parts as [string, string, string, string, string];
  try {
    return {
      minute: parseFieldPart(min),
      hour: parseFieldPart(hour),
      dayOfMonth: parseFieldPart(dom),
      month: parseFieldPart(month),
      dayOfWeek: parseFieldPart(dow),
    };
  } catch {
    return null;
  }
}

// ─── Validation ───────────────────────────────────────────────────────────────

export function validateExpression(expr: string): boolean {
  try {
    CronExpressionParser.parse(expr);
    return true;
  } catch {
    return false;
  }
}

// ─── Next executions ──────────────────────────────────────────────────────────

export function getNextExecutions(expr: string, count: number): Date[] {
  try {
    const interval = CronExpressionParser.parse(expr);
    const results: Date[] = [];
    for (let i = 0; i < count; i++) {
      results.push(interval.next().toDate());
    }
    return results;
  } catch {
    return [];
  }
}

// ─── Human-readable description ───────────────────────────────────────────────

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const DOW_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function joinList(items: string[]): string {
  if (items.length === 0) return '';
  if (items.length === 1) return items[0]!;
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(', ')}, and ${items[items.length - 1]}`;
}

function ordinal(n: number): string {
  const v = n % 100;
  const suffix = v >= 11 && v <= 13 ? 'th' : ['th', 'st', 'nd', 'rd'][n % 10] ?? 'th';
  return `${n}${suffix}`;
}

function formatTime(hour: number, minute: number): string {
  const h = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  const ampm = hour < 12 ? 'AM' : 'PM';
  return `${h}:${String(minute).padStart(2, '0')} ${ampm}`;
}

function expandNums(part: string, min: number, max: number): number[] {
  if (part === '*') return Array.from({ length: max - min + 1 }, (_, i) => i + min);
  if (part.startsWith('*/')) {
    const step = parseInt(part.slice(2), 10);
    const out: number[] = [];
    for (let i = min; i <= max; i += step) out.push(i);
    return out;
  }
  if (/^\d+-\d+$/.test(part)) {
    const [a, b] = part.split('-').map(Number);
    return Array.from({ length: b! - a! + 1 }, (_, i) => i + a!);
  }
  return part.split(',').map(Number);
}

function describeTimePart(minPart: string, hourPart: string): string {
  // every minute
  if (minPart === '*' && hourPart === '*') return 'every minute';
  // every N minutes
  if (minPart.startsWith('*/') && hourPart === '*')
    return `every ${minPart.slice(2)} minutes`;
  // every hour at :MM
  if (hourPart === '*') {
    if (minPart === '0') return 'at the start of every hour';
    const mins = expandNums(minPart, 0, 59);
    return `at minute ${joinList(mins.map(String))} of every hour`;
  }
  // specific hour(s)
  const hours = expandNums(hourPart, 0, 23);
  const mins = expandNums(minPart, 0, 59);
  const times = hours.flatMap((h) => mins.map((m) => formatTime(h, m)));
  return `at ${joinList(times)}`;
}

function describeDowPart(part: string): string {
  if (part === '*') return '';
  if (/^\d+-\d+$/.test(part)) {
    const [a, b] = part.split('-').map(Number);
    return `${DOW_NAMES[a!]} through ${DOW_NAMES[b!]}`;
  }
  const days = part.split(',').map((n) => DOW_NAMES[Number(n)] ?? n);
  return joinList(days);
}

function describeDomPart(part: string): string {
  if (part === '*') return '';
  if (part.startsWith('*/')) return `every ${part.slice(2)} days`;
  if (/^\d+-\d+$/.test(part)) {
    const [a, b] = part.split('-').map(Number);
    return `the ${ordinal(a!)} through the ${ordinal(b!)}`;
  }
  const days = part.split(',').map((n) => `the ${ordinal(Number(n))}`);
  return joinList(days);
}

function describeMonthPart(part: string): string {
  if (part === '*') return '';
  if (/^\d+-\d+$/.test(part)) {
    const [a, b] = part.split('-').map(Number);
    return `${MONTH_NAMES[a! - 1]} through ${MONTH_NAMES[b! - 1]}`;
  }
  const months = part.split(',').map((n) => MONTH_NAMES[Number(n) - 1] ?? n);
  return joinList(months);
}

export function describeExpression(expr: string): string {
  const parts = expr.trim().split(/\s+/);
  if (parts.length !== 5) return 'Invalid expression';
  const [min, hour, dom, month, dow] = parts as [string, string, string, string, string];

  if (parts.every((p) => p === '*')) return 'Every minute';

  const time = describeTimePart(min, hour);

  const dayParts: string[] = [];
  const dowDesc = describeDowPart(dow);
  const domDesc = describeDomPart(dom);
  if (dowDesc) dayParts.push(dowDesc);
  if (domDesc && dom !== '*') dayParts.push(domDesc);
  const dayClause = dayParts.length > 0 ? `on ${dayParts.join(' or ')}` : '';

  const monthDesc = describeMonthPart(month);
  const monthClause = monthDesc ? `in ${monthDesc}` : '';

  return [time, dayClause, monthClause]
    .filter(Boolean)
    .join(', ')
    .replace(/^at 12:00 AM,?/, 'at midnight,')
    .replace(/^at 12:00 PM,?/, 'at noon,')
    // Capitalise first letter
    .replace(/^./, (c) => c.toUpperCase());
}
