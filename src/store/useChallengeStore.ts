import { create } from 'zustand';
import { challengeTasks } from '../data/tasks';
import { codeTemplates } from '../data/templates';
import { executeTask } from '../lib/runner';
import { ChallengeTask, RunResult, RunnerLog } from '../types/challenge';

interface ProgressState {
  completedTaskIds: string[];
  submittedCount: number;
}

interface TemplateInsertRequest {
  id: number;
  snippet: string;
}

interface ChallengeState {
  tasks: ChallengeTask[];
  activeTaskId: string;
  codesByTaskId: Record<string, string>;
  runState: 'idle' | 'running';
  submitState: 'idle' | 'submitting';
  results: RunResult | null;
  currentLogs: RunnerLog[];
  activeTab: 'description' | 'results';
  isHintsOpen: boolean;
  progress: ProgressState;
  pendingTemplateInsert: TemplateInsertRequest | null;
  setActiveTask: (taskId: string) => void;
  updateCode: (taskId: string, code: string) => void;
  runCode: () => Promise<void>;
  submitCode: () => Promise<void>;
  setActiveTab: (tab: 'description' | 'results') => void;
  setHintsOpen: (open: boolean) => void;
  requestTemplateInsert: (templateKey: string) => void;
  clearPendingTemplateInsert: () => void;
}

const initialCodes = challengeTasks.reduce<Record<string, string>>((acc, task) => {
  acc[task.id] = task.starterCode;
  return acc;
}, {});

let templateInsertId = 0;

export const useChallengeStore = create<ChallengeState>((set, get) => ({
  tasks: challengeTasks,
  activeTaskId: challengeTasks[0].id,
  codesByTaskId: initialCodes,
  runState: 'idle',
  submitState: 'idle',
  results: null,
  currentLogs: [],
  activeTab: 'description',
  isHintsOpen: false,
  progress: { completedTaskIds: [], submittedCount: 0 },
  pendingTemplateInsert: null,
  setActiveTask: (taskId) => set({ activeTaskId: taskId, results: null, currentLogs: [], activeTab: 'description', isHintsOpen: false }),
  updateCode: (taskId, code) =>
    set((state) => ({
      codesByTaskId: { ...state.codesByTaskId, [taskId]: code },
    })),
  runCode: async () => {
    const { tasks, activeTaskId, codesByTaskId } = get();
    const task = tasks.find((t) => t.id === activeTaskId);
    if (!task) return;
    set({ runState: 'running', results: { status: 'running', passed: 0, total: task.tests.length, durationMs: 0, logs: [] }, currentLogs: [] });
    const result = await executeTask(task, codesByTaskId[activeTaskId], false);
    set({ runState: 'idle', results: result, currentLogs: result.logs, activeTab: 'results' });
  },
  submitCode: async () => {
    const { tasks, activeTaskId, codesByTaskId, progress } = get();
    const task = tasks.find((t) => t.id === activeTaskId);
    if (!task) return;
    const totalTests = task.tests.length + task.hiddenTests.length;
    set({ submitState: 'submitting', results: { status: 'running', passed: 0, total: totalTests, durationMs: 0, logs: [] }, currentLogs: [] });
    const result = await executeTask(task, codesByTaskId[activeTaskId], true);
    const isAccepted = result.status === 'accepted';
    set({
      submitState: 'idle',
      results: result,
      currentLogs: result.logs,
      activeTab: 'results',
      progress: {
        submittedCount: progress.submittedCount + 1,
        completedTaskIds: isAccepted ? Array.from(new Set([...progress.completedTaskIds, activeTaskId])) : progress.completedTaskIds,
      },
    });
  },
  setActiveTab: (tab) => set({ activeTab: tab }),
  setHintsOpen: (open) => set({ isHintsOpen: open }),
  requestTemplateInsert: (templateKey) => {
    const template = codeTemplates.find((item) => item.key === templateKey);
    if (!template) return;
    templateInsertId += 1;
    set({ pendingTemplateInsert: { id: templateInsertId, snippet: template.snippet } });
  },
  clearPendingTemplateInsert: () => set({ pendingTemplateInsert: null }),
}));

export const useActiveTask = () => useChallengeStore((state) => state.tasks.find((task) => task.id === state.activeTaskId));
export const useActiveCode = () => useChallengeStore((state) => state.codesByTaskId[state.activeTaskId] ?? '');
