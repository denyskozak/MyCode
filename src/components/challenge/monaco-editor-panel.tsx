import Editor from '@monaco-editor/react';
import { Card } from '@radix-ui/themes';
import { useActiveCode, useChallengeStore } from '../../store/useChallengeStore';

export function MonacoEditorPanel() {
  const activeTaskId = useChallengeStore((s) => s.activeTaskId);
  const code = useActiveCode();
  const updateCode = useChallengeStore((s) => s.updateCode);

  return (
    <Card style={{ height: '100%', minHeight: 420, overflow: 'hidden' }}>
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
          quickSuggestions: true,
          suggestOnTriggerCharacters: true,
          formatOnPaste: true,
          formatOnType: true,
          scrollBeyondLastLine: false,
        }}
      />
    </Card>
  );
}
