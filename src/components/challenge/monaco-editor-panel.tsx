import { useEffect, useRef } from 'react';
import Editor, { Monaco, OnMount } from '@monaco-editor/react';
import { Card } from '@radix-ui/themes';
import { useActiveCode, useChallengeStore } from '../../store/useChallengeStore';

export function MonacoEditorPanel() {
  const activeTaskId = useChallengeStore((s) => s.activeTaskId);
  const code = useActiveCode();
  const updateCode = useChallengeStore((s) => s.updateCode);
  const pendingTemplateInsert = useChallengeStore((s) => s.pendingTemplateInsert);
  const clearPendingTemplateInsert = useChallengeStore((s) => s.clearPendingTemplateInsert);

  const editorRef = useRef<Parameters<OnMount>[0] | null>(null);
  const monacoRef = useRef<Monaco | null>(null);

  useEffect(() => {
    if (!pendingTemplateInsert || !editorRef.current || !monacoRef.current) return;

    const editor = editorRef.current;
    const monaco = monacoRef.current;
    const model = editor.getModel();
    const selection = editor.getSelection();

    if (!model || !selection) {
      clearPendingTemplateInsert();
      return;
    }

    editor.executeEdits('template-insert', [
      {
        range: selection,
        text: pendingTemplateInsert.snippet,
        forceMoveMarkers: true,
      },
    ]);

    const endPosition = selection.getStartPosition().delta(0, pendingTemplateInsert.snippet.length);
    editor.setPosition(endPosition);
    editor.focus();
    monaco.editor.setModelMarkers(model, 'template-insert', []);
    clearPendingTemplateInsert();
  }, [pendingTemplateInsert, clearPendingTemplateInsert]);

  return (
    <Card style={{ height: '100%', minHeight: 420, overflow: 'hidden' }}>
      <Editor
        height="100%"
        defaultLanguage="typescript"
        language="typescript"
        theme="vs-dark"
        value={code}
        onMount={(editor, monaco) => {
          editorRef.current = editor;
          monacoRef.current = monaco;
        }}
        onChange={(value) => updateCode(activeTaskId, value ?? '')}
        options={{
          minimap: { enabled: false },
          fontSize: 16,
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
