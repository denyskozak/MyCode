'use client';

import { useEffect } from 'react';
import { ActionBar } from '@/components/challenge/action-bar';
import { MonacoEditorPanel } from '@/components/challenge/monaco-editor-panel';
import { ResultsPanel } from '@/components/challenge/results-panel';
import { TaskPanel } from '@/components/challenge/task-panel';
import { useChallengeStore } from '@/store/useChallengeStore';

export function ChallengeWorkspace() {
  const runCode = useChallengeStore((s) => s.runCode);
  const submitCode = useChallengeStore((s) => s.submitCode);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        void runCode();
      }
      if (event.shiftKey && event.key === 'Enter') {
        event.preventDefault();
        void submitCode();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [runCode, submitCode]);

  return (
    <section className="grid flex-1 gap-4 lg:grid-cols-[minmax(360px,40%)_1fr]">
      <TaskPanel />

      <div className="flex min-h-[70vh] flex-col gap-3">
        <ActionBar />
        <div className="min-h-0 flex-1">
          <MonacoEditorPanel />
        </div>
        <ResultsPanel />
      </div>
    </section>
  );
}
