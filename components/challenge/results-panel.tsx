'use client';

import * as ScrollArea from '@radix-ui/react-scroll-area';
import * as Progress from '@radix-ui/react-progress';
import { useChallengeStore } from '@/store/useChallengeStore';
import { StatusBadge } from '@/components/ui/status-badge';

export function ResultsPanel() {
  const results = useChallengeStore((s) => s.results);
  const runState = useChallengeStore((s) => s.runState);
  const submitState = useChallengeStore((s) => s.submitState);

  if (!results) {
    return <div className="rounded-lg border border-dashed border-border p-4 text-sm text-slate-400">No runs yet.</div>;
  }

  const percent = Math.round((results.passedCount / Math.max(1, results.totalCount)) * 100);

  return (
    <div className="space-y-3 rounded-lg border border-border bg-panel p-4">
      <div className="flex items-center justify-between">
        <StatusBadge status={results.status} />
        <div className="text-xs text-slate-400">
          Runner: {runState} · Submit: {submitState}
        </div>
      </div>

      <Progress.Root className="h-2 overflow-hidden rounded-full bg-slate-700/50" value={percent}>
        <Progress.Indicator
          className="h-full bg-emerald-400 transition-all"
          style={{ transform: `translateX(-${100 - percent}%)` }}
        />
      </Progress.Root>

      <p className="text-sm text-slate-200">
        Passed {results.passedCount}/{results.totalCount} tests
      </p>

      {results.error && <p className="rounded border border-rose-800 bg-rose-950/40 p-2 text-sm text-rose-200">{results.error}</p>}

      <ScrollArea.Root className="h-44 overflow-hidden rounded border border-border">
        <ScrollArea.Viewport className="h-full w-full p-3">
          <div className="space-y-2 text-xs">
            {results.details.map((detail) => (
              <div key={detail.id} className="rounded border border-border bg-slate-900/70 p-2">
                <p className="font-medium text-slate-200">{detail.hidden ? 'Hidden test' : 'Input'}: {detail.input}</p>
                <p className="text-slate-400">Expected: {detail.expected}</p>
                <p className={detail.passed ? 'text-emerald-300' : 'text-amber-300'}>Actual: {detail.actual ?? 'n/a'}</p>
                {!detail.passed && detail.error && <p className="text-rose-300">Error: {detail.error}</p>}
              </div>
            ))}
          </div>
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar orientation="vertical" className="w-2 bg-slate-800">
          <ScrollArea.Thumb className="rounded bg-slate-600" />
        </ScrollArea.Scrollbar>
      </ScrollArea.Root>
    </div>
  );
}
