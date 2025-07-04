import React, { useMemo } from 'react';
import { Infinity } from 'lucide-react';
import { useCode } from '@/hooks/use-code';
import { useDetectedLanguage } from '@/hooks/use-detected-language';
import { useCharacterLimit, formatCharacterCount, isUnlimitedPlan } from '@/hooks/use-character-limit';
import { useSubscription } from '@/hooks/use-subscription';
import MonacoEditorWrapper from './MonacoEditorWrapper';
import { CopyButton } from '@/components/ui/copy-button';

export interface CodeEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  height?: string;
  isReadOnly?: boolean;
  onEditorMount?: (editor: any) => void;
  title?: string;
  variant?: 'homepage' | 'results'; // 'homepage' shows only character limit, 'results' shows title/copy button
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  height = '500px',
  isReadOnly = false,
  onEditorMount,
  title,
  variant = 'homepage',
}) => {
  // Only pull code + setter from the new hook
  const { code, setCode } = useCode();

  // If a `value` prop is passed, use it; otherwise the shared `code`
  const displayCode = value !== undefined ? value : code;

  // detect lang on every code change (async)
  const {
    language: detectedLang,
    loading: isDetectingLanguage,
    error: detectLanguageError
  } = useDetectedLanguage(displayCode);

  // Character limit information - fetched from backend via use-subscription
  const { currentCount, limit, isOverLimit, percentageUsed } = useCharacterLimit(displayCode);
  const { subscription } = useSubscription();

  const handleChange = (val?: string) => {
    const newText = val ?? ''
    if (value !== undefined) {
      onChange?.(newText)
    } else {
      setCode(newText)
      onChange?.(newText)
    }
  }

  // Get character count styling based on limit status
  const getCharacterCountStyle = () => {
    return 'text-white/60'
  }

  // Capitalize first letter (or show "Unknown")
  const getLanguageDisplayName = (lang: string) =>
    lang
      ? lang.charAt(0).toUpperCase() + lang.slice(1).toLowerCase()
      : 'Unknown'

  // Get character count text with formatting - memoized to prevent unnecessary re-computations
  const getCharacterCountText = useMemo(() => {
    const formattedCount = formatCharacterCount(currentCount)
    if (isUnlimitedPlan(subscription)) {
      return `${formattedCount} / ∞`
    }
    const formattedLimit = formatCharacterCount(limit)
    return `${formattedCount} / ${formattedLimit}`
  }, [currentCount, limit, subscription])

  // Conditional styling based on variant
  const containerClasses = variant === 'homepage' 
    ? "relative backdrop-blur-md bg-gradient-to-br from-black/40 via-black/30 to-black/20 rounded-3xl border border-white/20 shadow-2xl overflow-hidden h-full flex flex-col"
    : "relative overflow-hidden h-full flex flex-col";

  return (
    <div
      className={containerClasses}
      style={{ height }}
    >
      {/* Editor header - always present but content varies by variant */}
      <div className="flex items-center justify-between p-3 border-white/20 bg-gradient-to-r from-black/20 via-black/10 to-black/20">
        {variant === 'results' ? (
          <>
            <div className="flex-1 flex items-center gap-3">
              {title && (
                <span className="text-m font-medium text-white/90 ml-2">
                  {title}
                </span>
              )}
            </div>
            <CopyButton text={displayCode} />
          </>
        ) : (
          // Homepage variant - empty top bar
          <div className="flex-1"></div>
        )}
      </div>

      {/* Monaco Editor Wrapper */}
      <MonacoEditorWrapper
        value={displayCode}
        onChange={handleChange}
        language={detectedLang || 'plaintext'}
        isReadOnly={isReadOnly}
        onEditorMount={onEditorMount}
        height="100%"
      />

      {/* Status bar - always present but content varies by variant */}
      <div className="flex items-center justify-between px-4 py-2 bg-gradient-to-br from-black/40 via-black/30 to-black/20 border-white/20 text-xs">
        {variant === 'homepage' ? (
          <>
            <div className="flex items-center space-x-4 text-white/60">
              {/* Language detection status */}
              {displayCode.trim() && (
                <div className="flex items-center gap-2">
                  {isDetectingLanguage ? (
                    <>
                      <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></div>
                    </>
                  ) : detectedLang ? (
                    <>
                      <span className="text-xs">{getLanguageDisplayName(detectedLang)}</span>
                    </>
                  ) : null}
                </div>
              )}
            </div>
            {/* Only show character count when there's actual content */}
            {displayCode.trim() && (
              <div className="flex items-center space-x-3">
                {/* Character count with limit awareness */}
                <div className="flex items-center gap-2">
                  <span className={getCharacterCountStyle()}>
                    {getCharacterCountText}
                  </span>
                  {/* Progress bar for character usage - only show if there's a limit */}
                  {!isUnlimitedPlan(subscription) && (
                    <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-300 bg-blue-500"
                        style={{ width: `${Math.min(100, percentageUsed)}%` }}
                      />
                    </div>
                  )}
                  {/* Show infinity icon for unlimited plans */}
                  {isUnlimitedPlan(subscription) && (
                    <Infinity className="w-4 h-4 text-green-400" />
                  )}
                </div>
              </div>
            )}
          </>
        ) : (
          // Results variant - empty bottom bar
          <div className="flex-1"></div>
        )}
      </div>
    </div>
  );
};

export default CodeEditor;