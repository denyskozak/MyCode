'use client';

import Editor from '@monaco-editor/react';
import { useActiveCode, useChallengeStore } from '@/store/useChallengeStore';

export function MonacoEditorPanel() {
  const activeTaskId = useChallengeStore((s) => s.activeTaskId);
  const code = useActiveCode();
  const updateCode = useChallengeStore((s) => s.updateCode);

  return (
    <div className="h-full min-h-[420px] overflow-hidden rounded-lg border border-border bg-[#0f172a]">
      <Editor
        height="100%"
        defaultLanguage="typescript"
        language="typescript"
        theme="vs-dark"
        value={code}
        onChange={(value) => updateCode(activeTaskId, value ?? '')}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: 'on',
          bracketPairColorization: { enabled: true },
          automaticLayout: true,
          tabSize: 2,
          formatOnType: true,
          formatOnPaste: true,
          quickSuggestions: true,
          suggestOnTriggerCharacters: true,
          scrollBeyondLastLine: false,
        }}
      />
    </div>
  );
}
