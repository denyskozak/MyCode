import { useEffect } from 'react';
import { Grid } from '@radix-ui/themes';
import { ActionBar } from './action-bar';
import { MonacoEditorPanel } from './monaco-editor-panel';
import { ResultsPanel } from './results-panel';
import { TaskPanel } from './task-panel';
import { useChallengeStore } from '../../store/useChallengeStore';

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
    <Grid columns={{ initial: '1', lg: '40% 1fr' }} gap="3" style={{ minHeight: '90vh' }}>
      <TaskPanel />
      <div style={{ display: 'grid', gap: 12, minHeight: '70vh', gridTemplateRows: 'auto 1fr auto' }}>
        <ActionBar />
        <MonacoEditorPanel />
        <ResultsPanel />
      </div>
    </Grid>
  );
}
