import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { useAnalyze } from '@/hooks/use-analyze';

const FunctionalityAnalysis: React.FC = () => {
  const { result } = useAnalyze();

  // Get functionality analysis from result
  let functionalityAnalysis: string | null = null;
  if (result && typeof result.functionality_analysis === 'string') {
    functionalityAnalysis = result.functionality_analysis;
  }

  // Function to check if content looks like a table
  const isTableContent = (text: string): boolean => {
    const lines = text.split('\n').filter(line => line.trim() !== '');
    if (lines.length < 2) return false;
    
    // Check if most lines contain tabs
    const linesWithTabs = lines.filter(line => line.includes('\t'));
    const tabPercentage = linesWithTabs.length / lines.length;
    
    // Check if the structure is consistent (same number of columns)
    const columnCounts = lines.map(line => line.split('\t').length);
    const firstColumnCount = columnCounts[0];
    const consistentColumns = columnCounts.every(count => count === firstColumnCount);
    
    return tabPercentage > 0.7 && consistentColumns && firstColumnCount > 1;
  };

  // Function to parse and format markdown content
  const parseMarkdown = (text: string): React.ReactNode => {
    const lines = text.split('\n');
    const elements: React.ReactNode[] = [];
    let currentList: string[] = [];
    let currentOrderedList: string[] = [];
    let currentParagraph: string[] = [];
    let inCodeBlock = false;
    let codeBlockContent: string[] = [];

    const flushCurrentParagraph = () => {
      if (currentParagraph.length > 0) {
        const paragraphText = currentParagraph.join(' ');
        if (paragraphText.trim()) {
          elements.push(
            <p key={elements.length} className="my-3 xs:my-4 sm:my-4 text-xs xs:text-sm leading-relaxed text-white/80">
              {formatInlineMarkdown(paragraphText)}
            </p>
          );
        }
        currentParagraph = [];
      }
    };

    const flushCurrentList = () => {
      if (currentList.length > 0) {
        elements.push(
          <ul key={elements.length} className="list-disc pl-4 xs:pl-6 sm:pl-6 my-3 xs:my-4 sm:my-4 space-y-1 xs:space-y-2 sm:space-y-2">
            {currentList.map((item, i) => (
              <li key={i} className="text-xs xs:text-sm text-white/80 leading-relaxed">
                {formatInlineMarkdown(item)}
              </li>
            ))}
          </ul>
        );
        currentList = [];
      }
    };

    const flushCurrentOrderedList = () => {
      if (currentOrderedList.length > 0) {
        elements.push(
          <ol key={elements.length} className="list-decimal pl-4 xs:pl-6 sm:pl-6 my-3 xs:my-4 sm:my-4 space-y-1 xs:space-y-2 sm:space-y-2">
            {currentOrderedList.map((item, i) => (
              <li key={i} className="text-xs xs:text-sm text-white/80 leading-relaxed">
                {formatInlineMarkdown(item)}
              </li>
            ))}
          </ol>
        );
        currentOrderedList = [];
      }
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmedLine = line.trim();

      // Handle code blocks
      if (trimmedLine.startsWith('```')) {
        if (inCodeBlock) {
          // End code block
          flushCurrentParagraph();
          flushCurrentList();
          flushCurrentOrderedList();
          elements.push(
            <pre key={elements.length} className="bg-white/5 p-2 xs:p-3 sm:p-4 rounded-md my-3 xs:my-4 sm:my-4 overflow-x-auto border border-white/10">
              <code className="text-xs xs:text-sm text-white/90">{codeBlockContent.join('\n')}</code>
            </pre>
          );
          codeBlockContent = [];
          inCodeBlock = false;
        } else {
          // Start code block
          flushCurrentParagraph();
          flushCurrentList();
          flushCurrentOrderedList();
          inCodeBlock = true;
        }
        continue;
      }

      if (inCodeBlock) {
        codeBlockContent.push(line);
        continue;
      }

      // Handle headers - Standardized heading hierarchy
      if (trimmedLine.match(/^#{1,6}\s+/)) {
        flushCurrentParagraph();
        flushCurrentList();
        flushCurrentOrderedList();
        
        const level = (trimmedLine.match(/^(#+)/) || ['#'])[0].length;
        const text = trimmedLine.replace(/^#+\s+/, '');
        
        elements.push(
          <div key={elements.length} 
            className={`font-semibold my-4 xs:my-6 sm:my-6 text-white/90 ${
              level === 1 ? 'text-lg xs:text-xl sm:text-xl border-b border-white/20 pb-2 xs:pb-3 sm:pb-3' : 
              level === 2 ? 'text-base xs:text-lg sm:text-lg mt-6 xs:mt-8 sm:mt-8 mb-3 xs:mb-4 sm:mb-4' : 
              level === 3 ? 'text-sm xs:text-base sm:text-base mt-4 xs:mt-6 sm:mt-6 mb-2 xs:mb-3 sm:mb-3' : 
              'text-xs xs:text-sm sm:text-sm mt-3 xs:mt-4 sm:mt-4 mb-1 xs:mb-2 sm:mb-2'
            }`}>
            {formatInlineMarkdown(text)}
          </div>
        );
        continue;
      }

      // Handle horizontal rules
      if (trimmedLine === '---' || trimmedLine === '***' || trimmedLine === '___') {
        flushCurrentParagraph();
        flushCurrentList();
        flushCurrentOrderedList();
        elements.push(
          <hr key={elements.length} className="my-4 xs:my-6 sm:my-6 border-white/20" />
        );
        continue;
      }

      // Handle bullet lists
      if (trimmedLine.match(/^\s*[-*●]\s+/)) {
        flushCurrentParagraph();
        flushCurrentOrderedList();
        const item = trimmedLine.replace(/^\s*[-*●]\s+/, '');
        currentList.push(item);
        continue;
      }

      // Handle numbered lists
      if (trimmedLine.match(/^\s*\d+\.\s+/)) {
        flushCurrentParagraph();
        flushCurrentList();
        const item = trimmedLine.replace(/^\s*\d+\.\s+/, '');
        currentOrderedList.push(item);
        continue;
      }

      // Handle tables
      if (trimmedLine.includes('\t')) {
        flushCurrentParagraph();
        flushCurrentList();
        flushCurrentOrderedList();
        
        // Collect table lines
        const tableLines = [trimmedLine];
        let j = i + 1;
        while (j < lines.length && lines[j].trim().includes('\t')) {
          tableLines.push(lines[j].trim());
          j++;
        }
        i = j - 1; // Adjust index
        
        if (isTableContent(tableLines.join('\n'))) {
          const tableData = tableLines.map(line => line.split('\t'));
          const headers = tableData[0];
          const tableRows = tableData.slice(1);
          
          elements.push(
            <div key={elements.length} className="my-4 xs:my-6 sm:my-6">
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse border border-white/20">
                  <thead>
                    <tr className="bg-white/10">
                      {headers.map((header, idx) => (
                        <th key={idx} className="border border-white/20 px-2 py-2 xs:px-3 xs:py-3 sm:px-4 sm:py-3 text-left text-xs xs:text-sm font-semibold text-white/90">
                          {formatInlineMarkdown(header)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {tableRows.map((row, idx) => (
                      <tr key={idx} className="hover:bg-white/5">
                        {row.map((cell, cellIdx) => (
                          <td key={cellIdx} className="border border-white/20 px-2 py-1.5 xs:px-3 xs:py-2 sm:px-4 sm:py-2 text-xs xs:text-sm text-white/80">
                            {formatInlineMarkdown(cell)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        }
        continue;
      }

      // Handle empty lines
      if (trimmedLine === '') {
        flushCurrentParagraph();
        flushCurrentList();
        flushCurrentOrderedList();
        continue;
      }

      // Handle regular text
      currentParagraph.push(trimmedLine);
    }

    // Flush any remaining content
    flushCurrentParagraph();
    flushCurrentList();
    flushCurrentOrderedList();

    return elements;
  };

  // Function to format inline markdown (bold, italic, code)
  const formatInlineMarkdown = (text: string): React.ReactNode => {
    // More robust regex that handles nested and overlapping patterns
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    
    // Combined regex for all inline patterns
    const regex = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g;
    let match;
    
    while ((match = regex.exec(text)) !== null) {
      // Add text before the match
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }
      
      const matchedText = match[0];
      
      if (matchedText.startsWith('**') && matchedText.endsWith('**')) {
        parts.push(
          <strong key={`bold-${match.index}`} className="font-bold text-white">
            {matchedText.slice(2, -2)}
          </strong>
        );
      } else if (matchedText.startsWith('*') && matchedText.endsWith('*') && !matchedText.startsWith('**')) {
        parts.push(
          <em key={`italic-${match.index}`} className="italic text-white/90">
            {matchedText.slice(1, -1)}
          </em>
        );
      } else if (matchedText.startsWith('`') && matchedText.endsWith('`')) {
        parts.push(
          <code key={`code-${match.index}`} className="bg-white/10 px-1 py-0.5 rounded text-white/90 font-mono text-xs">
            {matchedText.slice(1, -1)}
          </code>
        );
      }
      
      lastIndex = match.index + matchedText.length;
    }
    
    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }
    
    return parts.length > 0 ? parts : text;
  };

  return (
    <div>
      {functionalityAnalysis ? (
        <Card className="bg-black/10 backdrop-blur-xl border border-white/10 min-h-[280px] xs:min-h-[320px] sm:min-h-[340px] md:min-h-[400px]">
          <CardContent className="p-3 xs:p-4 sm:p-6 md:p-6">
            <div className="prose prose-sm max-w-none">
              {parseMarkdown(functionalityAnalysis)}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="text-center py-6 xs:py-8 sm:py-8 md:py-8 px-4">
          <div className="mx-auto h-8 w-8 xs:h-10 xs:w-10 sm:h-12 sm:w-12 text-gray-400 mb-3 xs:mb-4 sm:mb-4">
            <svg className="h-8 w-8 xs:h-10 xs:w-10 sm:h-12 sm:w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-base xs:text-lg sm:text-lg font-medium text-white mb-2">No Functionality Analysis</h3>
          <p className="text-gray-400 text-sm xs:text-base">Functionality analysis data is not available.</p>
        </div>
      )}
    </div>
  );
};

export default FunctionalityAnalysis;