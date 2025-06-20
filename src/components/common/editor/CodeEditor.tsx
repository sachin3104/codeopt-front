import React, { useRef, useState } from 'react';
import Editor, { loader, OnMount } from '@monaco-editor/react';
import { Copy } from 'lucide-react';
import { useCode } from '@/hooks/use-code';
// import { useDetectedLanguage } from '@/hooks/use-detected-language';

// 1) Move this to module scope so it only ever runs once
loader.init().then(monaco => {
  // Glassmorphic Dark Theme
  monaco.editor.defineTheme('glassmorphic-dark', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      // Common tokens
      { token: 'comment', foreground: '6A9955', fontStyle: 'italic' },
      { token: 'keyword', foreground: '569CD6', fontStyle: 'bold' },
      { token: 'string', foreground: 'CE9178' },
      { token: 'number', foreground: 'B5CEA8' },
      { token: 'type', foreground: '4EC9B0' },
      { token: 'function', foreground: 'DCDCAA' },
      { token: 'variable', foreground: '9CDCFE' },
      
      // Python specific
      { token: 'keyword.python', foreground: 'FF79C6', fontStyle: 'bold' },
      { token: 'string.python', foreground: 'F1FA8C' },
      { token: 'decorator.python', foreground: 'BD93F9' },
      { token: 'builtin.python', foreground: '8BE9FD' },
      
      // R specific
      { token: 'keyword.r', foreground: 'FF79C6', fontStyle: 'bold' },
      { token: 'string.r', foreground: 'F1FA8C' },
      { token: 'operator.r', foreground: 'FF79C6' },
      { token: 'function.r', foreground: '50FA7B' },
      
      // SAS specific
      { token: 'keyword.sas', foreground: 'FF79C6', fontStyle: 'bold' },
      { token: 'string.sas', foreground: 'F1FA8C' },
      { token: 'operator.sas', foreground: 'FF79C6' },
      { token: 'function.sas', foreground: '50FA7B' },
    ],
    colors: {
      'editor.background': '#00000000',
      'editor.foreground': '#f8fafc',
      'editorCursor.foreground': '#00d4ff',
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

export interface CodeEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  height?: string;
  isReadOnly?: boolean;
  onEditorMount?: (editor: any) => void;
  title?: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  height = '500px',
  isReadOnly = false,
  onEditorMount,
  title,
}) => {
  const editorRef = useRef<any>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  
  // Only pull code + setter from the new hook
  const { code, setCode } = useCode();

  // If a `value` prop is passed, use it; otherwise the shared `code`
  const displayCode = value !== undefined ? value : code;

  // detect lang on every code change
  // const detectedLang = useDetectedLanguage(displayCode);

  const handleChange = (val?: string) => {
    const newText = val ?? ''
    if (value !== undefined) {
      onChange?.(newText)
      return
    }
    setCode(newText)
    onChange?.(newText)
  }

  const handleEditorMount: OnMount = editor => {
    editorRef.current = editor
  }

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(displayCode);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  

  return (
    <div
      className="relative backdrop-blur-md bg-gradient-to-br from-black/40 via-black/30 to-black/20
                 rounded-3xl border border-white/20 shadow-2xl overflow-hidden h-full flex flex-col"
      style={{ height }}
    >
      {/* Editor header with copy button */}
      <div className="flex items-center justify-between p-2 border-b border-white/20">
        {/* show the title on the left, if provided */}
        <div className="flex-1">
          {title && (
            <span className="text-sm font-medium text-white/90">
              {title}
            </span>
          )}
        </div>
        {/* show the detected language in center, if any */}
        <div className="flex-1 flex justify-center">
          {/* detectedLang && (
            <span className="text-sm font-medium text-white/80">
              {detectedLang.toUpperCase()}
            </span>
          ) */}
        </div>
        <button
          onClick={handleCopyCode}
          className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/20
                     border border-white/20 transition-colors text-white/80 hover:text-white"
          title="Copy code"
        >
          <Copy size={16} />
          <span className="text-sm">{copySuccess ? 'Copied!' : 'Copy Code'}</span>
        </button>
      </div>

      {/* Monaco Editor */}
      <div className="flex-1 min-h-0">
        <Editor
          height="100%"
          language="plaintext"
          theme="glassmorphic-dark"
          value={displayCode}
          onChange={handleChange}
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
            glyphMargin: true,
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
            placeholder: '// Start coding here...',
          }}
        />
      </div>

      {/* Status bar */}
      <div className="flex items-center justify-end px-4 py-2 bg-gradient-to-br from-black/40 via-black/30 to-black/20
                      border-t border-white/20 text-xs text-white/60">
        <div className="flex items-center space-x-4">
          <span>Lines: {displayCode.split('\n').length}</span>
          <span>Chars: {displayCode.length}</span>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;