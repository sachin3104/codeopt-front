import React, { useRef } from 'react';
import Editor, { loader, OnMount } from '@monaco-editor/react';

// 1) Move this to module scope so it only ever runs once
loader.init().then(monaco => {
  // Glassmorphic Dark Theme with Updated Text Colors
  monaco.editor.defineTheme('glassmorphic-dark', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      // Common tokens - Updated for better readability
      { token: 'comment', foreground: '7F8C8D', fontStyle: 'italic' },
      { token: 'keyword', foreground: '3498DB', fontStyle: 'bold' },
      { token: 'string', foreground: '27AE60' },
      { token: 'number', foreground: 'E67E22' },
      { token: 'type', foreground: '9B59B6' },
      { token: 'function', foreground: 'E74C3C' },
      { token: 'variable', foreground: '16A085' },
      
      // Python specific - Updated colors
      { token: 'keyword.python', foreground: '3498DB', fontStyle: 'bold' },
      { token: 'string.python', foreground: '27AE60' },
      { token: 'decorator.python', foreground: '9B59B6' },
      { token: 'builtin.python', foreground: '16A085' },
      
      // R specific - Updated colors
      { token: 'keyword.r', foreground: '3498DB', fontStyle: 'bold' },
      { token: 'string.r', foreground: '27AE60' },
      { token: 'operator.r', foreground: 'E74C3C' },
      { token: 'function.r', foreground: 'E67E22' },
      
      // SAS specific - Updated colors
      { token: 'keyword.sas', foreground: '3498DB', fontStyle: 'bold' },
      { token: 'string.sas', foreground: '27AE60' },
      { token: 'operator.sas', foreground: 'E74C3C' },
      { token: 'function.sas', foreground: 'E67E22' },
    ],
    colors: {
      'editor.background': '#00000000',
      'editor.foreground': '#f8fafc',  
      'editorCursor.foreground': '#ffffff',
      'editor.lineHighlightBackground': '#ffffff08',
      'editorLineNumber.foreground': '#64748b',
      'editor.selectionBackground': '#0ea5e926',
      'editor.inactiveSelectionBackground': '#0ea5e915',
      'editorIndentGuide.background': '#374151',
      'editorIndentGuide.activeBackground': '#6b7280',
      'editorWidget.background': '#1e293b80',
      'editorWidget.border': '#475569',
    }
  });
});

export interface MonacoEditorWrapperProps {
  value: string;
  onChange?: (value: string) => void;
  language?: string;
  isReadOnly?: boolean;
  onEditorMount?: (editor: any) => void;
  height?: string;
}

const MonacoEditorWrapper: React.FC<MonacoEditorWrapperProps> = ({
  value,
  onChange,
  language = 'plaintext',
  isReadOnly = false,
  onEditorMount,
  height = '100%',
}) => {
  const editorRef = useRef<any>(null);


  const handleEditorMount: OnMount = editor => {
    editorRef.current = editor;
    onEditorMount?.(editor);
  };

  

  return (
    <div className="flex-1 min-h-0 [&_.monaco-editor]:!outline-none [&_.monaco-editor]:!border-none [&_.monaco-editor_*]:!outline-none [&_.monaco-editor_*]:!border-none [&_.monaco-editor_textarea]:!outline-none [&_.monaco-editor_textarea]:!border-none">
      
      <Editor
        height={height}
        language={language}
        theme="glassmorphic-dark"
        value={value}
        onChange={(value) => {
          if (!editorRef.current) {
            onChange?.(value ?? '');
            return;
          }

          const editor = editorRef.current;
          const scrollTop = editor.getScrollTop();
          const scrollLeft = editor.getScrollLeft();

          // Call the actual parent onChange
          onChange?.(value ?? '');

          // Restore scroll position after frame
          requestAnimationFrame(() => {
            editor.setScrollTop(scrollTop);
            editor.setScrollLeft(scrollLeft);
          });
        }}
        onMount={handleEditorMount}
        options={{
          readOnly: isReadOnly,
          automaticLayout: true,
          wordWrap: 'on',
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          fontSize: 14,
          fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
          fontLigatures: true,
          lineNumbers: 'on',
          glyphMargin: false,
          folding: true,
          renderWhitespace: 'selection',
          cursorBlinking: 'smooth',
          cursorSmoothCaretAnimation: 'on',
          smoothScrolling: true,
          tabSize: 2,
          insertSpaces: true,
          bracketPairColorization: { enabled: true },
          guides: { bracketPairs: true, indentation: true },
          suggest: { showKeywords: true, showSnippets: true },
          parameterHints: { enabled: true },
          autoClosingBrackets: 'always',
          autoClosingQuotes: 'always',
          formatOnPaste: true,
          formatOnType: true,
          stickyScroll: { enabled: false },
          placeholder: 'Paste in your code, choose what you need—Code Sage for deep analysis, Optimus for peak performance, \nTransformer for seamless conversion, or Scribe for instant documentation',
        }}
      />
    </div>
  );
};

export default MonacoEditorWrapper;