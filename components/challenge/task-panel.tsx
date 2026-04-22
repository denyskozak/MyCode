'use client';

import * as Collapsible from '@radix-ui/react-collapsible';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import * as ScrollArea from '@radix-ui/react-scroll-area';
import * as Separator from '@radix-ui/react-separator';
import * as Tabs from '@radix-ui/react-tabs';
import * as Tooltip from '@radix-ui/react-tooltip';
import { ChevronDown, Lightbulb, ListChecks } from 'lucide-react';
import { useActiveTask, useChallengeStore } from '@/store/useChallengeStore';
import { ResultsPanel } from '@/components/challenge/results-panel';

export function TaskPanel() {
  const task = useActiveTask();
  const tasks = useChallengeStore((s) => s.tasks);
  const activeTaskId = useChallengeStore((s) => s.activeTaskId);
  const setActiveTask = useChallengeStore((s) => s.setActiveTask);
  const activeTab = useChallengeStore((s) => s.activeTab);
  const setActiveTab = useChallengeStore((s) => s.setActiveTab);
  const isHintsOpen = useChallengeStore((s) => s.isHintsOpen);
  const setHintsOpen = useChallengeStore((s) => s.setHintsOpen);
  const progress = useChallengeStore((s) => s.progress);

  if (!task) return null;

  return (
    <div className="flex h-full flex-col rounded-xl border border-border bg-panel">
      <div className="flex items-center justify-between gap-3 border-b border-border p-4">
        <div>
          <h2 className="text-xl font-semibold">{task.title}</h2>
          <p className="text-xs text-slate-400">
            {task.pattern} · {task.difficulty}
          </p>
          <p className="mt-1 text-xs text-slate-300">{task.descriptionShort}</p>
        </div>

        <DropdownMenu.Root>
          <DropdownMenu.Trigger className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm hover:bg-slate-800">
            <ListChecks className="h-4 w-4" /> Tasks <ChevronDown className="h-4 w-4" />
          </DropdownMenu.Trigger>
          <DropdownMenu.Content className="z-40 min-w-52 rounded-md border border-border bg-slate-900 p-1 shadow-lg">
            {tasks.map((item) => (
              <DropdownMenu.Item
                key={item.id}
                className="cursor-pointer rounded px-2 py-1.5 text-sm outline-none hover:bg-slate-800"
                onSelect={() => setActiveTask(item.id)}
              >
                {item.title}
                {activeTaskId === item.id ? ' ✓' : ''}
              </DropdownMenu.Item>
            ))}
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </div>

      <Tabs.Root value={activeTab} onValueChange={(v) => setActiveTab(v as 'description' | 'results')} className="flex min-h-0 flex-1 flex-col">
        <Tabs.List className="grid grid-cols-2 border-b border-border">
          <Tabs.Trigger value="description" className="px-3 py-2 text-sm data-[state=active]:bg-slate-800">
            Mission
          </Tabs.Trigger>
          <Tabs.Trigger value="results" className="px-3 py-2 text-sm data-[state=active]:bg-slate-800">
            Results
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="description" className="min-h-0 flex-1">
          <ScrollArea.Root className="h-full overflow-hidden">
            <ScrollArea.Viewport className="h-full w-full p-4">
              <p className="text-sm text-slate-200">{task.narrative}</p>
              <p className="mt-2 rounded border border-border bg-slate-900/80 p-2 text-xs text-slate-300">🎯 {task.objective}</p>
              <p className="mt-2 text-xs text-slate-400">Signature: {task.signature}</p>

              <Separator.Root className="my-4 h-px bg-border" />
              <h3 className="mb-2 text-sm font-semibold">Examples</h3>
              {task.examples.map((example, idx) => (
                <div key={`${task.id}-ex-${idx}`} className="mb-2 rounded border border-border bg-slate-900/80 p-3 text-xs">
                  <p>Input: {example.input}</p>
                  <p>Output: {example.output}</p>
                </div>
              ))}

              <h3 className="mb-2 mt-3 text-sm font-semibold">Constraints</h3>
              <ul className="list-disc space-y-1 pl-5 text-xs text-slate-300">
                {task.constraints.map((rule) => (
                  <li key={rule}>{rule}</li>
                ))}
              </ul>

              <Collapsible.Root open={isHintsOpen} onOpenChange={setHintsOpen}>
                <Collapsible.Trigger className="mt-3 inline-flex items-center gap-2 rounded-md border border-border px-2 py-1 text-xs hover:bg-slate-800">
                  <Lightbulb className="h-4 w-4 text-amber-300" /> Hints
                </Collapsible.Trigger>
                <Collapsible.Content className="space-y-2 pt-2">
                  {task.hints.map((hint) => (
                    <p key={hint} className="rounded border border-border bg-slate-900/80 p-2 text-xs text-slate-300">
                      {hint}
                    </p>
                  ))}
                </Collapsible.Content>
              </Collapsible.Root>
            </ScrollArea.Viewport>
          </ScrollArea.Root>
        </Tabs.Content>

        <Tabs.Content value="results" className="p-4">
          <ResultsPanel />
        </Tabs.Content>
      </Tabs.Root>

      <Tooltip.Provider>
        <Tooltip.Root>
          <Tooltip.Trigger className="border-t border-border p-3 text-left text-xs text-slate-400">
            Session progress: {progress.completedTaskIds.length}/{tasks.length} solved · {progress.submittedCount} submits · {task.solution.time}
          </Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content sideOffset={5} className="rounded bg-slate-950 px-2 py-1 text-xs text-slate-200 shadow-lg">
              Complexity target: {task.solution.time} time, {task.solution.space} space.
              <Tooltip.Arrow className="fill-slate-950" />
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>
      </Tooltip.Provider>
    </div>
  );
}
