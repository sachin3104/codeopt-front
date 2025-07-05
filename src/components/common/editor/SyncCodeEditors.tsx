import React, { useRef, useEffect } from 'react';
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
  originalTitle,
  convertedTitle,
  originalLanguage,
  convertedLanguage,
}) => {
  const leftEditorRef = useRef<any>(null);
  const rightEditorRef = useRef<any>(null);

  // Handle synchronized scrolling
  const handleScroll = (sourceEditor: any, targetEditor: any) => {
    if (!sourceEditor || !targetEditor) return;
    
    const sourceScrollInfo = sourceEditor.getScrollInfo();
    const targetScrollInfo = targetEditor.getScrollInfo();
    
    // Calculate scroll percentage
    const scrollPercentage = sourceScrollInfo.top / (sourceScrollInfo.height - sourceScrollInfo.clientHeight);
    
    // Apply the same scroll percentage to the target editor
    const targetScrollTop = scrollPercentage * (targetScrollInfo.height - targetScrollInfo.clientHeight);
    
    targetEditor.scrollTo(0, targetScrollTop);
  };

  // Set up scroll event listeners
  useEffect(() => {
    const leftEditor = leftEditorRef.current;
    const rightEditor = rightEditorRef.current;

    if (leftEditor && rightEditor) {
      const handleLeftScroll = () => handleScroll(leftEditor, rightEditor);
      const handleRightScroll = () => handleScroll(rightEditor, leftEditor);

      leftEditor.on('scroll', handleLeftScroll);
      rightEditor.on('scroll', handleRightScroll);

      return () => {
        leftEditor.off('scroll', handleLeftScroll);
        rightEditor.off('scroll', handleRightScroll);
      };
    }
  }, []);

  return (
    <div className="grid grid-cols-2 gap-4 h-full">
      <div className="h-full flex flex-col">
        <div className="flex-1 min-h-0">
          {/* Wrapper div with dashboard component styling */}
          <div className="bg-black/10 backdrop-blur-xl border border-white/10 rounded-lg overflow-hidden h-full">
            <CodeEditor
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
  );
};

export default SyncCodeEditors; 