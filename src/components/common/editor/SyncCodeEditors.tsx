import React, { useRef, useEffect, useState } from 'react';
import CodeEditor from './CodeEditor';

interface SyncCodeEditorsProps {
  originalCode: string;
  convertedCode: string;
  isReadOnly?: boolean;
  originalTitle?: string;
  convertedTitle?: string;
  originalLanguage?: string;
  convertedLanguage?: string;
}

const SyncCodeEditors: React.FC<SyncCodeEditorsProps> = ({
  originalCode,
  convertedCode,
  isReadOnly = true,
  originalTitle = "Original Code",
  convertedTitle = "Converted Code",
  originalLanguage,
  convertedLanguage,
}) => {
  const leftEditorRef = useRef<any>(null);
  const rightEditorRef = useRef<any>(null);
  const [activeTab, setActiveTab] = useState<'original' | 'converted'>('converted');

  // Handle synchronized scrolling
  const handleScroll = (sourceEditor: any, targetEditor: any) => {
    if (!sourceEditor || !targetEditor) return;
    
    try {
      const sourceScrollInfo = sourceEditor.getScrollInfo();
      const targetScrollInfo = targetEditor.getScrollInfo();
      
      // Calculate scroll percentage
      const scrollPercentage = sourceScrollInfo.top / (sourceScrollInfo.height - sourceScrollInfo.clientHeight);
      
      // Apply the same scroll percentage to the target editor
      const targetScrollTop = scrollPercentage * (targetScrollInfo.height - targetScrollInfo.clientHeight);
      
      targetEditor.scrollTo(0, targetScrollTop);
          } catch (error) {
        // Silently handle any scroll errors
      }
  };

  // Set up scroll event listeners
  useEffect(() => {
    const leftEditor = leftEditorRef.current;
    const rightEditor = rightEditorRef.current;

    if (leftEditor && rightEditor && typeof leftEditor.on === 'function' && typeof rightEditor.on === 'function') {
      const handleLeftScroll = () => handleScroll(leftEditor, rightEditor);
      const handleRightScroll = () => handleScroll(rightEditor, leftEditor);

      try {
        leftEditor.on('scroll', handleLeftScroll);
        rightEditor.on('scroll', handleRightScroll);

        return () => {
          try {
            if (typeof leftEditor.off === 'function') {
              leftEditor.off('scroll', handleLeftScroll);
            }
            if (typeof rightEditor.off === 'function') {
              rightEditor.off('scroll', handleRightScroll);
            }
          } catch (error) {
            // Silently handle cleanup errors
          }
        };
              } catch (error) {
          // Silently handle setup errors
        }
    }
  }, []);

  return (
    <>
      {/* Mobile/Tablet view with tabs (hidden on lg and above) */}
      <div className="lg:hidden h-full">
        <div className="h-full flex flex-col">
          {/* Tabs for mobile/tablet */}
          <div className="flex space-x-1 bg-white/5 rounded-lg p-1 mb-4">
            <button
              onClick={() => setActiveTab('original')}
              className={`flex-1 py-2 px-3 rounded-md text-xs xs:text-sm font-medium transition-colors ${
                activeTab === 'original'
                  ? 'bg-blue-500 text-white'
                  : 'text-white/70 hover:text-white/90'
              }`}
            >
              {originalTitle}
            </button>
            <button
              onClick={() => setActiveTab('converted')}
              className={`flex-1 py-2 px-3 rounded-md text-xs xs:text-sm font-medium transition-colors ${
                activeTab === 'converted'
                  ? 'bg-emerald-500 text-white'
                  : 'text-white/70 hover:text-white/90'
              }`}
            >
              {convertedTitle}
            </button>
          </div>
          
          {/* Single editor container */}
          <div className="flex-1 min-h-0">
            <div className="bg-black/10 backdrop-blur-xl border border-white/10 rounded-lg overflow-hidden h-full">
              {activeTab === 'original' ? (
                <CodeEditor
                  key="original-editor-mobile"
                  value={originalCode}
                  isReadOnly={isReadOnly}
                  height="100%"
                  title={originalTitle}
                  variant="results"
                  language={originalLanguage}
                  onEditorMount={(editor) => {
                    leftEditorRef.current = editor;
                  }}
                />
              ) : (
                <CodeEditor
                  key="converted-editor-mobile"
                  value={convertedCode}
                  isReadOnly={isReadOnly}
                  height="100%"
                  title={convertedTitle}
                  variant="results"
                  language={convertedLanguage}
                  onEditorMount={(editor) => {
                    rightEditorRef.current = editor;
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Laptop/Desktop view with side-by-side layout (hidden below lg) */}
      <div className="hidden lg:grid lg:grid-cols-2 gap-4 h-full">
        <div className="h-full flex flex-col">
          <div className="flex-1 min-h-0">
            {/* Wrapper div with dashboard component styling */}
            <div className="bg-black/10 backdrop-blur-xl border border-white/10 rounded-lg overflow-hidden h-full">
              <CodeEditor
                key="original-editor-desktop"
                value={originalCode}
                isReadOnly={isReadOnly}
                height="100%"
                title={originalTitle}
                variant="results"
                language={originalLanguage}
                onEditorMount={(editor) => {
                  leftEditorRef.current = editor;
                }}
              />
            </div>
          </div>
        </div>
        <div className="h-full flex flex-col">
          <div className="flex-1 min-h-0">
            {/* Wrapper div with dashboard component styling */}
            <div className="bg-black/10 backdrop-blur-xl border border-white/10 rounded-lg overflow-hidden h-full">
              <CodeEditor
                key="converted-editor-desktop"
                value={convertedCode}
                isReadOnly={isReadOnly}
                height="100%"
                title={convertedTitle}
                variant="results"
                language={convertedLanguage}
                onEditorMount={(editor) => {
                  rightEditorRef.current = editor;
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SyncCodeEditors; 