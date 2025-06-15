import React, { useRef, useState } from 'react';
import Editor from '@monaco-editor/react';
import { loader } from '@monaco-editor/react';
import { Copy } from 'lucide-react';
import { useCode } from '@/context/CodeContext';

export interface CodeEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  height?: string;
  isReadOnly?: boolean;
  onEditorMount?: (editor: any) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  value = '',
  onChange,
  height = '500px',
  isReadOnly = false,
  onEditorMount,
}) => {
  const editorRef = useRef<any>(null);
  const [theme] = useState('glassmorphic-dark');
  const [copySuccess, setCopySuccess] = useState(false);
  
  // Use context directly
  const { code, setCode, documentedCode } = useCode();

  // Use provided value if available, otherwise use documented code or regular code
  const displayCode = value || documentedCode || code;

  // Debug log for code state
  React.useEffect(() => {
    console.log('CodeEditor - Current code state:', {
      hasValue: !!value,
      hasDocumentedCode: !!documentedCode,
      hasCode: !!code,
      displayCodeLength: displayCode?.length
    });
  }, [value, documentedCode, code, displayCode]);

  React.useEffect(() => {
    // Define custom glassmorphic themes
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
  }, []);

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
    onEditorMount?.(editor);
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(displayCode);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const handleChange = (value: string | undefined) => {
    const newValue = value || '';
    setCode(newValue);
    onChange?.(newValue);
  };

  return (
    <div className="relative backdrop-blur-md bg-gradient-to-br from-black/40 via-black/30 to-black/20 rounded-3xl border border-white/20 shadow-2xl overflow-hidden h-full flex flex-col">
      {/* Editor header with copy button */}
      <div className="flex items-center justify-end p-2 border-b border-white/20 bg-gradient-to-br from-black/40 via-black/30 to-black/20">
        <button
          onClick={handleCopyCode}
          className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/20 border border-white/20 transition-colors text-white/80 hover:text-white"
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
          onMount={handleEditorDidMount}
          options={{
            fontSize: 14,
            fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
            fontLigatures: true,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            wordWrap: 'on',
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
            readOnly: isReadOnly,
            placeholder: '// Start coding here...',
          }}
        />
      </div>

      {/* Status bar */}
      <div className="flex items-center justify-end px-4 py-2 bg-gradient-to-br from-black/40 via-black/30 to-black/20 border-t border-white/20 text-xs text-white/60">
        <div className="flex items-center space-x-4">
          <span>Lines: {displayCode.split('\n').length}</span>
          <span>Chars: {displayCode.length}</span>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;