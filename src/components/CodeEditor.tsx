import React, { useRef, useState, useEffect } from 'react';
import { Copy, Check, ChevronDown } from 'lucide-react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { json } from '@codemirror/lang-json';
import { markdown } from '@codemirror/lang-markdown';
import { createTheme } from '@uiw/codemirror-themes';
import { tags as t } from '@lezer/highlight';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CodeEditorProps {
  title: string;
  code: string;
  language?: string;
  editable?: boolean;
  onCodeChange?: (code: string) => void;
  onCopy?: () => void;
  onLanguageChange?: (lang: 'r' | 'python' | 'sas') => void;
  onDetectedLanguageChange?: (lang: 'r' | 'python' | 'sas') => void;
  className?: string;
  sourceLanguage?: 'r' | 'python' | 'sas';
}

type SupportedLanguage = 'r' | 'python' | 'sas';

const SUPPORTED_LANGUAGES: Record<SupportedLanguage, string> = {
  r: 'R',
  python: 'Python',
  sas: 'SAS'
} as const;

const VALID_CONVERSIONS: Record<SupportedLanguage, SupportedLanguage[]> = {
  r: ['python', 'sas'],
  python: ['r', 'sas'],
  sas: ['r', 'python']
} as const;

// Language detection patterns
const LANGUAGE_PATTERNS = {
  r: [
    /<-/, // Assignment operator
    /function\s*\(/, // Function definition
    /library\(/, // Library loading
    /data\.frame\(/, // Data frame creation
    /%>%/ // Pipe operator
  ],
  python: [
    /def\s+\w+\s*\(/, // Function definition
    /import\s+\w+/, // Import statement
    /from\s+\w+\s+import/, // From import
    /print\s*\(/, // Print function
    /if\s+\w+:/, // If statement
    /for\s+\w+\s+in/ // For loop
  ],
  sas: [
    /data\s+\w+;/, // Data step
    /proc\s+\w+;/, // Proc step
    /input\s+/, // Input statement
    /set\s+\w+;/, // Set statement
    /run;/ // Run statement
  ]
} as const;

const detectLanguage = (code: string): SupportedLanguage | null => {
  const scores: Record<SupportedLanguage, number> = {
    r: 0,
    python: 0,
    sas: 0
  };

  // Check each pattern for each language
  Object.entries(LANGUAGE_PATTERNS).forEach(([lang, patterns]) => {
    patterns.forEach(pattern => {
      if (pattern.test(code)) {
        scores[lang as SupportedLanguage]++;
      }
    });
  });

  // Find the language with the highest score
  const maxScore = Math.max(...Object.values(scores));
  if (maxScore === 0) return null;

  const detectedLang = Object.entries(scores).find(([_, score]) => score === maxScore)?.[0] as SupportedLanguage;
  return detectedLang;
};

const CodeEditor: React.FC<CodeEditorProps> = ({
  title,
  code,
  language = 'javascript',
  editable = false,
  onCodeChange,
  onCopy,
  onLanguageChange,
  onDetectedLanguageChange,
  className = '',
  sourceLanguage
}) => {
  const [value, setValue] = useState(code);
  const [copied, setCopied] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [detectedLanguage, setDetectedLanguage] = useState<SupportedLanguage | null>(null);

  useEffect(() => {
    setValue(code);
  }, [code]);

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  // Detect language when code changes
  useEffect(() => {
    const detected = detectLanguage(value);
    if (detected && detected !== detectedLanguage) {
      setDetectedLanguage(detected);
      onDetectedLanguageChange?.(detected);
    }
  }, [value, onDetectedLanguageChange]);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    onCopy && onCopy();
  };

  const handleLanguageChange = (newLang: SupportedLanguage) => {
    if (sourceLanguage && VALID_CONVERSIONS[sourceLanguage].includes(newLang)) {
      onLanguageChange && onLanguageChange(newLang);
    }
  };

  const getAvailableTargetLanguages = (): SupportedLanguage[] => {
    if (!sourceLanguage) return [];
    return VALID_CONVERSIONS[sourceLanguage].filter(lang => lang !== sourceLanguage);
  };

  const extensions = {
    javascript: javascript({ jsx: true }),
    js: javascript({ jsx: true }),
    python: python(),
    py: python(),
    html: html(),
    css: css(),
    json: json(),
    markdown: markdown(),
  };

  const theme = createTheme({
    theme: 'dark',
    settings: {
      background: 'transparent',
      foreground: 'rgba(255,255,255,0.85)',
      caret: '#fff',
      selection: 'rgba(255,255,255,0.2)',
      selectionMatch: 'rgba(255,255,255,0.2)',
      lineHighlight: 'rgba(255,255,255,0.05)',
    },
    styles: [
      { tag: t.keyword, color: '#ff79c6' },
      { tag: t.operator, color: '#ff79c6' },
      { tag: t.operatorKeyword, color: '#ff79c6' },
      { tag: t.atom, color: '#bd93f9' },
      { tag: t.number, color: '#bd93f9' },
      { tag: t.string, color: '#f1fa8c' },
      { tag: t.special(t.string), color: '#f1fa8c' },
      { tag: t.comment, color: '#6272a4' },
      { tag: t.variableName, color: '#f8f8f2' },
      { tag: t.special(t.variableName), color: '#ff79c6' },
      { tag: t.definition(t.variableName), color: '#50fa7b' },
      { tag: t.function(t.variableName), color: '#50fa7b' },
      { tag: t.propertyName, color: '#8be9fd' },
      { tag: t.typeName, color: '#8be9fd' },
      { tag: t.className, color: '#8be9fd' },
      { tag: t.labelName, color: '#8be9fd' },
      { tag: t.namespace, color: '#8be9fd' },
      { tag: t.macroName, color: '#ff79c6' },
      { tag: t.modifier, color: '#ff79c6' },
      { tag: t.definition(t.variableName), color: '#ff79c6' },
      { tag: t.tagName, color: '#ff79c6' },
      { tag: t.attributeName, color: '#8be9fd' },
      { tag: t.attributeValue, color: '#f1fa8c' },
      { tag: t.bracket, color: '#f8f8f2' },
      { tag: t.meta, color: '#6272a4' },
      { tag: t.invalid, color: '#ff5555' }
    ]
  });

  return (
    <div className={`glass-editor-container ${className}`}>
      <style>{`
        .glass-editor-container {
          backdrop-filter: blur(10px);
          background-color: rgba(15, 15, 30, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
          display: flex;
          flex-direction: column;
          height: 100%;
          overflow: hidden;
          transition: all 0.3s ease;
        }
        .glass-editor-container:hover {
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.25);
          border-color: rgba(255, 255, 255, 0.15);
          background-color: rgba(15, 15, 30, 0.35);
        }
        .glass-editor-header {
          background-color: rgba(255, 255, 255, 0.03);
          border-bottom: 1px solid rgba(255, 255, 255, 0.07);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 16px;
          backdrop-filter: blur(12px);
          flex-shrink: 0;
        }
        .glass-editor-title {
          color: rgba(255, 255, 255, 0.85);
          font-size: 14px;
          font-weight: 500;
        }
        .glass-editor-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .glass-editor-language-btn {
          display: flex;
          align-items: center;
          gap: 4px;
          background-color: rgba(255, 255, 255, 0.07);
          border: none;
          border-radius: 6px;
          color: rgba(255, 255, 255, 0.85);
          cursor: pointer;
          font-size: 13px;
          padding: 6px 10px;
          transition: all 0.2s ease;
        }
        .glass-editor-language-btn:hover {
          background-color: rgba(255, 255, 255, 0.12);
        }
        .glass-editor-copy-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: rgba(255, 255, 255, 0.07);
          border: none;
          border-radius: 9999px;
          cursor: pointer;
          width: 32px;
          height: 32px;
          transition: all 0.2s ease;
        }
        .glass-editor-copy-btn:hover {
          background-color: rgba(255, 255, 255, 0.12);
          transform: translateY(-1px);
        }
        .glass-editor-copy-icon,
        .glass-editor-success-icon {
          width: 16px;
          height: 16px;
        }
        .glass-editor-success-icon {
          color: #4ade80;
        }
        .glass-editor-content {
          position: relative;
          flex: 1;
          min-height: 0;
          overflow: hidden;
        }
        .glass-editor-instance {
          height: 100%;
        }
        .glass-editor-instance .cm-editor {
          background: transparent !important;
          height: 100% !important;
        }
        .glass-editor-instance .cm-scroller {
          background-color: rgba(0, 0, 0, 0.15) !important;
          overflow: auto !important;
        }
        .glass-editor-instance .cm-gutters {
          background: rgba(0, 0, 0, 0.2) !important;
          border-right: 1px solid rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.4);
        }
        .glass-editor-instance .cm-cursor {
          border-left: 2px solid rgba(255,255,255,0.8) !important;
        }
        .glass-editor-instance .cm-selectionBackground {
          background: rgba(255,255,255,0.2) !important;
        }
        .glass-editor-instance .cm-activeLine {
          background: rgba(255,255,255,0.05) !important;
        }
        /* Glassmorphic dropdown styles */
        [data-radix-popper-content-wrapper] {
          backdrop-filter: blur(10px) !important;
          background-color: rgba(15, 15, 30, 0.95) !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2) !important;
        }
        [data-radix-popper-content-wrapper] [role="menuitem"] {
          color: rgba(255, 255, 255, 0.85) !important;
          transition: all 0.2s ease !important;
        }
        [data-radix-popper-content-wrapper] [role="menuitem"]:hover {
          background-color: rgba(255, 255, 255, 0.1) !important;
        }
      `}</style>

      <div className="glass-editor-header">
        <h3 className="glass-editor-title">
          {title}
          {detectedLanguage && (
            <span className="text-sm text-muted-foreground ml-2">
              (Detected: {SUPPORTED_LANGUAGES[detectedLanguage]})
            </span>
          )}
        </h3>
        <div className="glass-editor-actions">
          {/* <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="glass-editor-language-btn">
                {SUPPORTED_LANGUAGES[language as SupportedLanguage] || language}
                <ChevronDown className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {getAvailableTargetLanguages().map((lang) => (
                <DropdownMenuItem
                  key={lang}
                  onClick={() => handleLanguageChange(lang)}
                >
                  {SUPPORTED_LANGUAGES[lang]}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu> */}
          <button onClick={handleCopy} className="glass-editor-copy-btn" title="Copy code">
            {copied ? <Check className="glass-editor-success-icon" /> : <Copy className="glass-editor-copy-icon" />}
          </button>
        </div>
      </div>

      <div className="glass-editor-content">
        <CodeMirror
          value={value}
          editable={editable}
          height="100%"
          extensions={[extensions[language] || extensions.javascript]}
          onChange={(val) => {
            setValue(val);
            onCodeChange && onCodeChange(val);
          }}
          theme={theme}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          basicSetup={{
            lineNumbers: true,
            highlightActiveLineGutter: true,
            foldGutter: true,
            dropCursor: true,
            allowMultipleSelections: true,
            indentOnInput: true,
            bracketMatching: true,
            closeBrackets: true,
            autocompletion: true,
            rectangularSelection: true,
            highlightActiveLine: true,
            highlightSelectionMatches: true,
            searchKeymap: true
          }}
          className="glass-editor-instance"
        />
      </div>
    </div>
  );
};

export default CodeEditor;
