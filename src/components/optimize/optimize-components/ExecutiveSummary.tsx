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

  // Function to format the content with basic markdown-like styling
  const formatContent = (text: string): React.ReactNode => {
    // Split by paragraphs and format each
    return text.split(/\n{2,}/g).map((paragraph, idx) => {
      // Format code blocks
      if (paragraph.match(/^```[\s\S]*?```$/m)) {
        const code = paragraph.replace(/^```(\w+)?\n([\s\S]*?)```$/m, '$2');
        return (
          <pre key={idx} className="bg-white/5 p-4 rounded-md my-4 overflow-x-auto border border-white/10">
            <code className="text-sm text-white/90">{code}</code>
          </pre>
        );
      }
      
      // Format bullet points
      if (paragraph.match(/^\s*[-*]\s+/m)) {
        const items = paragraph
          .split(/\n/)
          .filter(line => line.trim() !== '')
          .map(line => line.replace(/^\s*[-*]\s+/, ''));
        
        return (
          <ul key={idx} className="list-disc pl-5 my-3 space-y-1">
            {items.map((item, i) => (
              <li key={i} className="text-sm text-white/80">
                {formatMarkdownText(item)}
              </li>
            ))}
          </ul>
        );
      }
      
      // Format numbered lists
      if (paragraph.match(/^\s*\d+\.\s+/m)) {
        const items = paragraph
          .split(/\n/)
          .filter(line => line.trim() !== '')
          .map(line => line.replace(/^\s*\d+\.\s+/, ''));
        
        return (
          <ol key={idx} className="list-decimal pl-5 my-3 space-y-1">
            {items.map((item, i) => (
              <li key={i} className="text-sm text-white/80">
                {formatMarkdownText(item)}
              </li>
            ))}
          </ol>
        );
      }
      
      // Secondary headers
      if (paragraph.match(/^#+\s+/)) {
        const level = (paragraph.match(/^(#+)/) || ['#'])[0].length;
        const text = paragraph.replace(/^#+\s+/, '');
        return (
          <div key={idx} 
            className={`font-semibold my-3 text-white/90 ${
              level === 2 ? 'text-lg' : 
              level === 3 ? 'text-base' : 
              'text-sm'
            }`}>
            {text}
          </div>
        );
      }
      
      return (
        <p key={idx} className="my-3 text-sm leading-relaxed text-white/80">
          {formatMarkdownText(paragraph)}
        </p>
      );
    });
  };

  // Function to format markdown text with proper styling
  const formatMarkdownText = (text: string): React.ReactNode => {
    // Split the text into parts based on markdown syntax
    const parts = text.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        // Bold text
        return (
          <strong key={index} className="font-semibold text-white/90">
            {part.slice(2, -2)}
          </strong>
        );
      } else if (part.startsWith('*') && part.endsWith('*')) {
        // Italic text
        return (
          <em key={index} className="text-white/70">
            {part.slice(1, -1)}
          </em>
        );
      } else if (part.startsWith('`') && part.endsWith('`')) {
        // Inline code
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
      <CardContent>
        {summaryContent && (
          <div className="prose prose-sm max-w-none">
            {formatContent(summaryContent)}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ExecutiveSummary; 