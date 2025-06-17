import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

interface FunctionalityAnalysisProps {
  content: string;
}

const FunctionalityAnalysis: React.FC<FunctionalityAnalysisProps> = ({ content }) => {
  // Split the content by markdown headers to create sections
  const sections = content
    .split(/(?=^#+\s+.*$)/m)
    .filter(section => section.trim() !== '');
  
  // Function to extract the header title from a section
  const getHeaderTitle = (section: string): string => {
    const headerMatch = section.match(/^#+\s+(.*?)$/m);
    return headerMatch ? headerMatch[1] : 'Overview';
  };
  
  // Function to format the content with basic markdown-like styling
  const formatContent = (text: string): React.ReactNode => {
    // Remove the header from the beginning of the section
    const content = text.replace(/^#+\s+.*?$/m, '').trim();
    
    // Split by paragraphs and format each
    return content.split(/\n{2,}/g).map((paragraph, idx) => {
      // Format code blocks
      if (paragraph.match(/^```[\s\S]*?```$/m)) {
        const code = paragraph.replace(/^```(\w+)?\n([\s\S]*?)```$/m, '$2');
        return (
          <pre key={idx} className="bg-secondary/20 p-4 rounded-md my-4 overflow-x-auto">
            <code className="text-sm text-primary">{code}</code>
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
              <li key={i} className="text-sm">
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
              <li key={i} className="text-sm">
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
            className={`font-semibold my-3 ${
              level === 2 ? 'text-lg' : 
              level === 3 ? 'text-base' : 
              'text-sm'
            }`}>
            {text}
          </div>
        );
      }
      
      return (
        <p key={idx} className="my-3 text-sm leading-relaxed">
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
          <strong key={index} className="font-semibold">
            {part.slice(2, -2)}
          </strong>
        );
      } else if (part.startsWith('*') && part.endsWith('*')) {
        // Italic text
        return (
          <em key={index} className="text-white/80">
            {part.slice(1, -1)}
          </em>
        );
      } else if (part.startsWith('`') && part.endsWith('`')) {
        // Inline code
        return (
          <code key={index} className="bg-secondary/20 px-1 py-0.5 rounded text-primary">
            {part.slice(1, -1)}
          </code>
        );
      }
      return part;
    });
  };

  return (
    <Card className="backdrop-blur-md bg-gradient-to-br from-black/40 via-black/30 to-black/20 rounded-3xl border border-white/20 shadow-2xl">
      <CardContent className="p-6">
        {sections.map((section, index) => {
          const title = getHeaderTitle(section);
          return (
            <div key={index} className="pb-4">
              <h3 className="text-base font-semibold border-b border-white/20 pb-2 mb-3 text-white/90">{title}</h3>
              <div className="prose prose-sm max-w-none dark:prose-invert prose-headings:mb-2 prose-p:my-2">
                {formatContent(section)}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default FunctionalityAnalysis;
