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

export type RunStatus = 'idle' | 'running' | 'passed' | 'partial' | 'runtime_error' | 'timeout' | 'accepted';

export interface TestResultItem {
  id: string;
  input: string;
  expected: string;
  actual?: string;
  passed: boolean;
  hidden?: boolean;
  error?: string;
}

export interface RunResult {
  status: RunStatus;
  passedCount: number;
  totalCount: number;
  details: TestResultItem[];
  error?: string;
}
