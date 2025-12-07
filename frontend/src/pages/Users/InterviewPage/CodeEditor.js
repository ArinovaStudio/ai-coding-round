import Editor from '@monaco-editor/react';
import React from 'react';

function CodeEditor({ codeLang, setCode, code }) {
  return (
    <div className="w-full h-[88%] bg-[#141414] rounded-2xl">
      <Editor
        height="100%"
        language={codeLang}
        defaultLanguage={codeLang}
        defaultValue="// Write your code here..."
        theme="vs-dark"
        value={code}
        onChange={(e) => setCode(e)}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: 'on',
          wordWrap: 'on'
        }}
      />
    </div>
  );
}

export default CodeEditor;