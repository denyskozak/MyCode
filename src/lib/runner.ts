import { ChallengeTask, RunResult, TestCase } from '../types/challenge';

const evaluatePseudo = (code: string, fnName: string, test: TestCase, index: number) => {
  const hasFunction = code.includes(`function ${fnName}`);
  const isStub = code.includes('// your code here');

  if (!hasFunction) return { passed: false, actual: 'runtime_error', error: `Missing function ${fnName}.` };
  if (isStub) return { passed: index === 0, actual: index === 0 ? test.expected : 'mismatch', error: index === 0 ? undefined : 'Output did not match expected value.' };
  return { passed: true, actual: test.expected, error: undefined };
};

export const executeTask = async (task: ChallengeTask, code: string, includeHidden = false): Promise<RunResult> => {
  await new Promise((resolve) => setTimeout(resolve, 250));

  if (code.includes('while(true)')) {
    return {
      status: 'timeout',
      passedCount: 0,
      totalCount: includeHidden ? task.tests.length + task.hiddenTests.length : task.tests.length,
      details: [],
      error: 'Execution timed out. Check for infinite loops.',
    };
  }

  const suite = includeHidden
    ? [...task.tests.map((test) => ({ ...test, hidden: false })), ...task.hiddenTests.map((test) => ({ ...test, hidden: true }))]
    : task.tests.map((test) => ({ ...test, hidden: false }));

  const details = suite.map((test, index) => {
    const outcome = evaluatePseudo(code, task.functionName, test, index);
    return {
      id: `${task.id}-${index}`,
      input: test.input,
      expected: test.expected,
      actual: outcome.actual,
      passed: outcome.passed,
      hidden: test.hidden,
      error: outcome.error,
    };
  });

  const passedCount = details.filter((d) => d.passed).length;
  if (details.some((d) => d.actual === 'runtime_error')) {
    return {
      status: 'runtime_error',
      passedCount,
      totalCount: suite.length,
      details,
      error: `Runtime error: expected a function named ${task.functionName}.`,
    };
  }

  return { status: passedCount === suite.length ? 'passed' : 'partial', passedCount, totalCount: suite.length, details };
};
