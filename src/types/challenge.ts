export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface TaskExample {
  input: string;
  output: string;
}

export interface TestCase {
  input: string;
  expected: string;
}

export interface ComplexityMeta {
  time: string;
  space: string;
}

export interface ChallengeTask {
  id: string;
  slug: string;
  title: string;
  difficulty: Difficulty;
  pattern: string;
  descriptionShort: string;
  narrative: string;
  objective: string;
  functionName: string;
  signature: string;
  examples: TaskExample[];
  constraints: string[];
  hints: string[];
  starterCode: string;
  tests: TestCase[];
  hiddenTests: TestCase[];
  solution: ComplexityMeta;
}

export type RunStatus = 'idle' | 'running' | 'accepted' | 'failed' | 'runtime_error' | 'timeout';

export type RunnerLog = {
  level: 'log' | 'warn' | 'error';
  message: string;
};

export type FailedCase = {
  input: unknown;
  expected: unknown;
  actual: unknown;
};

export type RunResult = {
  status: RunStatus;
  passed: number;
  total: number;
  durationMs: number;
  failedCase?: FailedCase;
  errorMessage?: string;
  logs: RunnerLog[];
};
