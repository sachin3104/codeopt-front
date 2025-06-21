import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useOptimize } from '@/hooks/use-optimize';

const ExecutiveSummary: React.FC = () => {
  const { result: optimizationResult } = useOptimize();

  if (!optimizationResult) {
    return null;
  }

  // Get summary content from the optimization result
  const summaryContent = optimizationResult.summary || '';

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
            <p key={elements.length} className="my-4 text-sm leading-relaxed text-white/80">
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
          <ul key={elements.length} className="list-disc pl-6 my-4 space-y-2">
            {currentList.map((item, i) => (
              <li key={i} className="text-sm text-white/80 leading-relaxed">
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
          <ol key={elements.length} className="list-decimal pl-6 my-4 space-y-2">
            {currentOrderedList.map((item, i) => (
              <li key={i} className="text-sm text-white/80 leading-relaxed">
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
            <pre key={elements.length} className="bg-white/5 p-4 rounded-md my-4 overflow-x-auto border border-white/10">
              <code className="text-sm text-white/90">{codeBlockContent.join('\n')}</code>
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

      // Handle headers
      if (trimmedLine.match(/^#{1,6}\s+/)) {
        flushCurrentParagraph();
        flushCurrentList();
        flushCurrentOrderedList();
        
        const level = (trimmedLine.match(/^(#+)/) || ['#'])[0].length;
        const text = trimmedLine.replace(/^#+\s+/, '');
        
        elements.push(
          <div key={elements.length} 
            className={`font-semibold my-6 text-white/90 ${
              level === 1 ? 'text-2xl border-b border-white/20 pb-3' : 
              level === 2 ? 'text-xl mt-8 mb-4' : 
              level === 3 ? 'text-lg mt-6 mb-3' : 
              'text-base mt-4 mb-2'
            }`}>
            {text}
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
          <hr key={elements.length} className="my-6 border-white/20" />
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
            <div key={elements.length} className="my-6">
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse border border-white/20">
                  <thead>
                    <tr className="bg-white/10">
                      {headers.map((header, idx) => (
                        <th key={idx} className="border border-white/20 px-4 py-3 text-left text-sm font-semibold text-white/90">
                          {formatInlineMarkdown(header)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {tableRows.map((row, idx) => (
                      <tr key={idx} className="hover:bg-white/5">
                        {row.map((cell, cellIdx) => (
                          <td key={cellIdx} className="border border-white/20 px-4 py-2 text-sm text-white/80">
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
    const parts = text.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={index} className="font-semibold text-white/90">
            {part.slice(2, -2)}
          </strong>
        );
      } else if (part.startsWith('*') && part.endsWith('*')) {
        return (
          <em key={index} className="text-white/70">
            {part.slice(1, -1)}
          </em>
        );
      } else if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code key={index} className="bg-white/10 px-1 py-0.5 rounded text-white/90">
            {part.slice(1, -1)}
          </code>
        );
      }
      return part;
    });
  };

  return (
    <Card className="bg-black/10 backdrop-blur-xl border border-white/10">
      <CardHeader>
        <CardTitle className="text-white/90">Optimization Executive Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {summaryContent && (
          <div className="prose prose-sm max-w-none">
            {parseMarkdown(summaryContent)}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ExecutiveSummary; 