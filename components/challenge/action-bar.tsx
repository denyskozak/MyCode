'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { useChallengeStore } from '@/store/useChallengeStore';

export function ActionBar() {
  const runCode = useChallengeStore((s) => s.runCode);
  const submitCode = useChallengeStore((s) => s.submitCode);
  const runState = useChallengeStore((s) => s.runState);
  const submitState = useChallengeStore((s) => s.submitState);

  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-panel p-3">
      <div className="flex gap-2">
        <button
          onClick={() => void runCode()}
          disabled={runState === 'running'}
          className="rounded-md bg-slate-700 px-3 py-2 text-sm font-medium hover:bg-slate-600 disabled:opacity-60"
        >
          {runState === 'running' ? 'Running...' : 'Run'}
        </button>
        <button
          onClick={() => void submitCode()}
          disabled={submitState === 'submitting'}
          className="rounded-md bg-emerald-600 px-3 py-2 text-sm font-medium hover:bg-emerald-500 disabled:opacity-60"
        >
          {submitState === 'submitting' ? 'Submitting...' : 'Submit'}
        </button>
      </div>

      <Dialog.Root>
        <Dialog.Trigger className="text-xs text-slate-400 underline decoration-dotted">Shortcuts</Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50" />
          <Dialog.Content className="fixed left-1/2 top-1/2 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-lg border border-border bg-slate-900 p-4">
            <Dialog.Title className="text-sm font-semibold">Keyboard shortcuts</Dialog.Title>
            <Dialog.Description className="mt-2 text-xs text-slate-300">
              Cmd/Ctrl + Enter to run. Shift + Enter to submit.
            </Dialog.Description>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
