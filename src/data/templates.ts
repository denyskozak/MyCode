export type CodeTemplate = {
  key: string;
  label: string;
  snippet: string;
};

export const codeTemplates: CodeTemplate[] = [
  {
    key: 'function-skeleton',
    label: 'Function Skeleton',
    snippet: `function solve(input: number[]): number {
  // your logic here
  return 0;
}
`,
  },
  {
    key: 'for-loop',
    label: 'For Loop',
    snippet: `for (let i = 0; i < arr.length; i++) {
  const item = arr[i];
  // your logic here
}
`,
  },
  {
    key: 'while-loop',
    label: 'While Loop',
    snippet: `let i = 0;

while (i < arr.length) {
  const item = arr[i];
  // your logic here
  i++;
}
`,
  },
  {
    key: 'array-traversal',
    label: 'Array Traversal',
    snippet: `for (const item of arr) {
  // your logic here
}
`,
  },
  {
    key: 'two-pointer',
    label: 'Two Pointer',
    snippet: `let left = 0;
let right = arr.length - 1;

while (left < right) {
  // your logic here
  left++;
  right--;
}
`,
  },
];
