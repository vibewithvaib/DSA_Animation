import React, { useRef } from 'react';
import MonacoEditor from '@monaco-editor/react';

export default function Editor({ value, onChange }) {
  const editorRef = useRef(null);
  function onMount(editor, monaco) {
    editorRef.current = editor;
  }
  function format() {
    if (editorRef.current) {
      editorRef.current.getAction('editor.action.formatDocument').run();
    }
  }
  return (
    <div className="h-[460px]">
      <div className="flex justify-end p-2 border-b border-slate-800">
        <button onClick={format} className="text-xs px-2 py-1 rounded bg-slate-800 hover:bg-slate-700">Format</button>
      </div>
      <MonacoEditor
        height="410px"
        defaultLanguage="javascript"
        theme="vs-dark"
        value={value}
        onChange={(v)=>onChange(v||'')}
        onMount={onMount}
        options={{ fontSize: 14, minimap: { enabled: false }, scrollBeyondLastLine: false, automaticLayout: true }}
      />
    </div>
  );
}


