import ts from 'typescript';
import { ChallengeTask, RunResult, RunnerLog, TestCase } from '../types/challenge';

type WorkerTestCase = TestCase & { hidden: boolean };

type WorkerResult = {
  status: RunResult['status'];
  passed: number;
  total: number;
  failedCase?: RunResult['failedCase'];
  errorMessage?: string;
  logs: RunnerLog[];
};

const WORKER_TIMEOUT_MS = 2500;

const runnerWorkerScript = `
self.onmessage = (event) => {
  const { code, functionName, tests } = event.data;
  const startedAt = Date.now();
  const logs = [];

  const safeStringify = (value) => {
    if (typeof value === 'string') return value;
    try {
      const seen = new WeakSet();
      return JSON.stringify(value, (key, item) => {
        if (typeof item === 'bigint') return item.toString();
        if (typeof item === 'function') return '[Function]';
        if (typeof item === 'object' && item !== null) {
          if (seen.has(item)) return '[Circular]';
          seen.add(item);
        }
        return item;
      });
    } catch {
      try {
        return String(value);
      } catch {
        return '[Unserializable value]';
      }
    }
  };

  const serializeLogArgs = (args) => args.map((arg) => safeStringify(arg)).join(' ');

  const originalConsole = {
    log: console.log,
    warn: console.warn,
    error: console.error,
  };

  console.log = (...args) => logs.push({ level: 'log', message: serializeLogArgs(args) });
  console.warn = (...args) => logs.push({ level: 'warn', message: serializeLogArgs(args) });
  console.error = (...args) => logs.push({ level: 'error', message: serializeLogArgs(args) });

  const restoreConsole = () => {
    console.log = originalConsole.log;
    console.warn = originalConsole.warn;
    console.error = originalConsole.error;
  };

  const parseCallArgs = (input, fnName) => {
    const prefix = fnName + '(';
    if (!input.startsWith(prefix) || !input.endsWith(')')) {
      throw new Error('Unsupported test call format: ' + input);
    }
    const argsSource = input.slice(prefix.length, -1);
    return Function('return [' + argsSource + '];')();
  };

  const parseExpected = (expected) => {
    try {
      return JSON.parse(expected);
    } catch {
      return expected;
    }
  };

  const toComparable = (value) => {
    if (typeof value === 'string') return value;
    return safeStringify(value);
  };

  try {
    const runtime = Function('"use strict"; const module = { exports: {} }; const exports = module.exports; ' + code + '; return module.exports["' + functionName + '"] || (typeof ' + functionName + ' !== "undefined" ? ' + functionName + ' : undefined);')();

    if (typeof runtime !== 'function') {
      restoreConsole();
      self.postMessage({
        status: 'runtime_error',
        passed: 0,
        total: tests.length,
        errorMessage: 'Runtime error: expected a function named ' + functionName + '.',
        logs,
      });
      return;
    }

    let passed = 0;
    let failedCase;

    for (const test of tests) {
      const args = parseCallArgs(test.input, functionName);
      try {
        const result = runtime(...args);
        const actualValue = typeof result === 'undefined' && Array.isArray(args[0]) ? args[0] : result;
        const expectedValue = parseExpected(test.expected);
        const isPass = toComparable(actualValue) === toComparable(expectedValue);

        if (!isPass && !failedCase) {
          failedCase = {
            input: test.hidden ? 'Hidden test case' : test.input,
            expected: expectedValue,
            actual: actualValue,
          };
        }

        if (isPass) passed += 1;
      } catch (err) {
        failedCase = {
          input: test.hidden ? 'Hidden test case' : test.input,
          expected: test.expected,
          actual: 'runtime_error',
        };

        restoreConsole();
        self.postMessage({
          status: 'runtime_error',
          passed,
          total: tests.length,
          failedCase,
          errorMessage: err instanceof Error ? err.message : String(err),
          logs,
        });
        return;
      }
    }

    restoreConsole();

    self.postMessage({
      status: passed === tests.length ? 'accepted' : 'failed',
      passed,
      total: tests.length,
      failedCase,
      logs,
    });
  } catch (err) {
    restoreConsole();
    self.postMessage({
      status: 'runtime_error',
      passed: 0,
      total: tests.length,
      errorMessage: err instanceof Error ? err.message : String(err),
      logs,
    });
  } finally {
    const finishedAt = Date.now();
    // Keep this no-op in case we want to inspect timing in worker later.
    void startedAt;
    void finishedAt;
  }
};
`;

const transpileUserCode = (code: string) =>
  ts.transpileModule(code.replace(/\bexport\s+/g, ''), {
    compilerOptions: {
      target: ts.ScriptTarget.ES2020,
      module: ts.ModuleKind.None,
      strict: false,
    },
  }).outputText;

const executeWithWorker = (code: string, functionName: string, tests: WorkerTestCase[]): Promise<WorkerResult> => {
  const blob = new Blob([runnerWorkerScript], { type: 'text/javascript' });
  const worker = new Worker(URL.createObjectURL(blob));

  return new Promise((resolve) => {
    const timeoutId = window.setTimeout(() => {
      worker.terminate();
      resolve({
        status: 'timeout',
        passed: 0,
        total: tests.length,
        errorMessage: 'Execution timed out. Check for infinite loops.',
        logs: [],
      });
    }, WORKER_TIMEOUT_MS);

    worker.onmessage = (event: MessageEvent<WorkerResult>) => {
      window.clearTimeout(timeoutId);
      worker.terminate();
      resolve(event.data);
    };

    worker.onerror = (event) => {
      window.clearTimeout(timeoutId);
      worker.terminate();
      resolve({
        status: 'runtime_error',
        passed: 0,
        total: tests.length,
        errorMessage: event.message,
        logs: [],
      });
    };

    worker.postMessage({ code, functionName, tests });
  });
};

export const executeTask = async (task: ChallengeTask, code: string, includeHidden = false): Promise<RunResult> => {
  const suite = includeHidden
    ? [...task.tests.map((test) => ({ ...test, hidden: false })), ...task.hiddenTests.map((test) => ({ ...test, hidden: true }))]
    : task.tests.map((test) => ({ ...test, hidden: false }));

  const startedAt = performance.now();
  const workerResult = await executeWithWorker(transpileUserCode(code), task.functionName, suite);
  const durationMs = Math.round(performance.now() - startedAt);

  return {
    status: workerResult.status,
    passed: workerResult.passed,
    total: workerResult.total,
    durationMs,
    failedCase: workerResult.failedCase,
    errorMessage: workerResult.errorMessage,
    logs: workerResult.logs,
  };
};
