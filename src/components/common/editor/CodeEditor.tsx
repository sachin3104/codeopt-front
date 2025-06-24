import React, { useRef, useState } from 'react';
import Editor, { loader, OnMount } from '@monaco-editor/react';
import { Copy, AlertTriangle } from 'lucide-react';
import { useCode } from '@/hooks/use-code';
import { useDetectedLanguage } from '@/hooks/use-detected-language';
import { useCharacterLimit, formatCharacterCount } from '@/hooks/use-character-limit';

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
  const detectedLang = useDetectedLanguage(displayCode);

  // Character limit information
  const { currentCount, limit, isOverLimit, percentageUsed } = useCharacterLimit(displayCode);

  // React.useEffect(() => {
  //   const style = document.createElement('style');
  //   style.innerHTML = `
  //     .monaco-editor,
  //     .monaco-editor *,
  //     .monaco-editor .inputarea.ime-input,
  //     .monaco-editor .monaco-editor-background,
  //     .monaco-editor textarea {
  //       outline: none !important;
  //       border: none !important;
  //     }
  //   `;
  //   document.head.appendChild(style);
    
  //   return () => {
  //     document.head.removeChild(style);
  //   };
  // }, []);


  const handleChange = (val?: string) => {
    const newText = val ?? ''
    if (value !== undefined) {
      onChange?.(newText)
    } else {
      setCode(newText)
      onChange?.(newText)
    }
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

  // Get character count styling based on limit status
  const getCharacterCountStyle = () => {
    if (isOverLimit) {
      return 'text-red-400 font-semibold'
    }
    return 'text-white/60'
  }

  // Get character count text with formatting
  const getCharacterCountText = () => {
    const formattedCount = formatCharacterCount(currentCount)
    const formattedLimit = formatCharacterCount(limit)
    return `${formattedCount} / ${formattedLimit}`
  }

  return (
    <div
      className="relative backdrop-blur-md bg-gradient-to-br from-black/40 via-black/30 to-black/20
                 rounded-3xl border border-white/20 shadow-2xl overflow-hidden h-full flex flex-col"
      style={{ height }}
    >
      {/* Editor header with copy button */}
      <div className="flex items-center justify-between p-3 border-b border-white/20 bg-gradient-to-r from-black/20 via-black/10 to-black/20">
        {/* show the title and detected language on the left */}
        <div className="flex-1 flex items-center gap-3">
          {title && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-white backdrop-blur-md transition-all duration-300 bg-gradient-to-br from-black/40 via-black/30 to-black/20 hover:from-black/50 hover:via-black/40 hover:to-black/30 border border-white/20 hover:border-white/30">
              <span className="text-sm font-medium text-white/90">
                {title}
              </span>
            </div>
          )}
          {/* show the detected language with enhanced styling */}
          {detectedLang && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg  border border-blue-400/30 backdrop-blur-sm">
              <span className="text-xs font-medium text-blue-500 uppercase tracking-wider">
                Language
              </span>
              <span className="text-sm font-semibold text-blue-200 uppercase tracking-wide">
                {detectedLang}
              </span>
            </div>
          )}
          {/* Character limit warning indicator - only show when over limit */}
          {isOverLimit && (
            <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-red-500/20 border border-red-500/30 backdrop-blur-sm">
              <AlertTriangle size={12} className="text-red-400" />
              <span className="text-xs font-medium text-red-400">
                Limit Exceeded
              </span>
            </div>
          )}
        </div>
        <button
          onClick={handleCopyCode}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-white backdrop-blur-md transition-all duration-300 bg-gradient-to-br from-black/40 via-black/30 to-black/20 hover:from-black/50 hover:via-black/40 hover:to-black/30 border border-white/20 hover:border-white/30"
          title="Copy code"
        >
          <Copy size={16} />
          <span className="text-sm">{copySuccess ? 'Copied!' : 'Copy Code'}</span>
        </button>
      </div>

      {/* Monaco Editor */}
      <div className="flex-1 min-h-0 [&_.monaco-editor]:!outline-none [&_.monaco-editor]:!border-none [&_.monaco-editor_*]:!outline-none [&_.monaco-editor_*]:!border-none [&_.monaco-editor_textarea]:!outline-none [&_.monaco-editor_textarea]:!border-none">
        <Editor
          height="100%"
          language={detectedLang || 'plaintext'}
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

      {/* Status bar with enhanced character count */}
      <div className="flex items-center justify-between px-4 py-2 bg-gradient-to-br from-black/40 via-black/30 to-black/20
                      border-t border-white/20 text-xs">
        <div className="flex items-center space-x-4 text-white/60">
          <span>Lines: {displayCode.split('\n').length}</span>
          <span>Chars: {displayCode.length}</span>
        </div>
        <div className="flex items-center space-x-3">
          {/* Character count with limit awareness */}
          <div className="flex items-center gap-2">
            <span className={getCharacterCountStyle()}>
              {getCharacterCountText()}
            </span>
            {/* Progress bar for character usage */}
            <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-300 ${
                  isOverLimit 
                    ? 'bg-red-500' 
                    : 'bg-green-500'
                }`}
                style={{ width: `${Math.min(100, percentageUsed)}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;