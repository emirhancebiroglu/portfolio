'use client';

import { useState, useRef, useCallback } from 'react';
import posthog from 'posthog-js';
import { TaskInput } from './TaskInput';
import { TaskResults, TaskResultsSkeleton } from './TaskResults';
import type { Step } from './TaskResults';

type Granularity = 'low' | 'medium' | 'high';

type ToolState =
  | { phase: 'idle' }
  | { phase: 'loading' }
  | { phase: 'results'; steps: Step[]; originalTask: string }
  | { phase: 'error'; message: string };

export function TaskBreakdownTool() {
  const [task, setTask] = useState('');
  const [granularity, setGranularity] = useState<Granularity>('medium');
  const [toolState, setToolState] = useState<ToolState>({ phase: 'idle' });
  const [inputError, setInputError] = useState<string | null>(null);
  const submittingRef = useRef(false);
  const textareaFocusRef = useRef<(() => void) | null>(null);

  const registerFocus = useCallback((fn: () => void) => {
    textareaFocusRef.current = fn;
  }, []);

  async function handleSubmit() {
    if (submittingRef.current) return;

    const trimmed = task.trim();
    if (!trimmed) {
      setInputError('Enter a task first.');
      textareaFocusRef.current?.();
      return;
    }
    if (trimmed.length > 500) {
      setInputError('Task must be under 500 characters.');
      return;
    }

    setInputError(null);
    submittingRef.current = true;
    setToolState({ phase: 'loading' });

    const startTime = Date.now();
    posthog.capture('task_breakdown_submitted', { granularity });

    try {
      const res = await fetch('/api/task-breakdown', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task: trimmed, granularity }),
      });

      const data = (await res.json()) as
        | { steps: Step[]; originalTask: string }
        | { error: string };

      if (!res.ok || 'error' in data) {
        const message = 'error' in data ? data.error : 'Something went wrong. Try again.';
        setToolState({ phase: 'error', message });
        posthog.capture('task_breakdown_error', { status: res.status });
      } else {
        setToolState({ phase: 'results', steps: data.steps, originalTask: data.originalTask });
        posthog.capture('task_breakdown_completed', {
          step_count: data.steps.length,
          response_ms: Date.now() - startTime,
          granularity,
        });
      }
    } catch {
      setToolState({ phase: 'error', message: 'Something went wrong. Try again in a moment.' });
      posthog.capture('task_breakdown_error', { status: 'network' });
    } finally {
      setTimeout(() => {
        submittingRef.current = false;
      }, 2000);
    }
  }

  function handleReset() {
    setTask('');
    setInputError(null);
    setToolState({ phase: 'idle' });
    submittingRef.current = false;
  }

  return (
    <div className="flex flex-col gap-6">
      <TaskInput
        task={task}
        granularity={granularity}
        loading={toolState.phase === 'loading'}
        error={inputError}
        onTaskChange={setTask}
        onGranularityChange={setGranularity}
        onSubmit={handleSubmit}
        registerFocus={registerFocus}
      />

      {toolState.phase === 'loading' && <TaskResultsSkeleton />}

      {toolState.phase === 'error' && (
        <div
          role="alert"
          className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-500"
        >
          {toolState.message}
        </div>
      )}

      {toolState.phase === 'results' && (
        <TaskResults
          steps={toolState.steps}
          originalTask={toolState.originalTask}
          onReset={handleReset}
          onCopied={() => posthog.capture('task_breakdown_copied')}
        />
      )}
    </div>
  );
}
