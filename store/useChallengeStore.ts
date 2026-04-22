'use client';

import { challengeTasks } from '@/data/tasks';
import { executeTask } from '@/lib/runner';
import { ChallengeTask, RunResult } from '@/types/challenge';
import { create } from 'zustand';

interface ProgressState {
  completedTaskIds: string[];
  submittedCount: number;
}

interface ChallengeState {
  tasks: ChallengeTask[];
  activeTaskId: string;
  codesByTaskId: Record<string, string>;
  runState: 'idle' | 'running';
  submitState: 'idle' | 'submitting';
  results: RunResult | null;
  activeTab: 'description' | 'results';
  isHintsOpen: boolean;
  progress: ProgressState;
  setActiveTask: (taskId: string) => void;
  updateCode: (taskId: string, code: string) => void;
  runCode: () => Promise<void>;
  submitCode: () => Promise<void>;
  setActiveTab: (tab: 'description' | 'results') => void;
  setHintsOpen: (open: boolean) => void;
}

const initialCodes = challengeTasks.reduce<Record<string, string>>((acc, task) => {
  acc[task.id] = task.starterCode;
  return acc;
}, {});

export const useChallengeStore = create<ChallengeState>((set, get) => ({
  tasks: challengeTasks,
  activeTaskId: challengeTasks[0].id,
  codesByTaskId: initialCodes,
  runState: 'idle',
  submitState: 'idle',
  results: null,
  activeTab: 'description',
  isHintsOpen: false,
  progress: {
    completedTaskIds: [],
    submittedCount: 0,
  },
  setActiveTask: (taskId) => set({ activeTaskId: taskId, results: null, activeTab: 'description', isHintsOpen: false }),
  updateCode: (taskId, code) =>
    set((state) => ({
      codesByTaskId: {
        ...state.codesByTaskId,
        [taskId]: code,
      },
    })),
  runCode: async () => {
    const { tasks, activeTaskId, codesByTaskId } = get();
    const task = tasks.find((t) => t.id === activeTaskId);
    if (!task) return;

    set({ runState: 'running' });
    const result = await executeTask(task, codesByTaskId[activeTaskId], false);
    set({ runState: 'idle', results: result, activeTab: 'results' });
  },
  submitCode: async () => {
    const { tasks, activeTaskId, codesByTaskId, progress } = get();
    const task = tasks.find((t) => t.id === activeTaskId);
    if (!task) return;

    set({ submitState: 'submitting' });
    const result = await executeTask(task, codesByTaskId[activeTaskId], true);

    const isAccepted = result.status === 'passed';
    set({
      submitState: 'idle',
      results: { ...result, status: isAccepted ? 'accepted' : result.status },
      activeTab: 'results',
      progress: {
        submittedCount: progress.submittedCount + 1,
        completedTaskIds: isAccepted
          ? Array.from(new Set([...progress.completedTaskIds, activeTaskId]))
          : progress.completedTaskIds,
      },
    });
  },
  setActiveTab: (tab) => set({ activeTab: tab }),
  setHintsOpen: (open) => set({ isHintsOpen: open }),
}));

export const useActiveTask = () =>
  useChallengeStore((state) => state.tasks.find((task) => task.id === state.activeTaskId));

export const useActiveCode = () =>
  useChallengeStore((state) => state.codesByTaskId[state.activeTaskId] ?? '');
