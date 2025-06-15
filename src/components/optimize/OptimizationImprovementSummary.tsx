import React from 'react';

interface OptimizationImprovementSummaryProps {
  content: string;
}

const OptimizationImprovementSummary: React.FC<OptimizationImprovementSummaryProps> = ({ content }) => {
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
      // Format table
      if (paragraph.match(/\|\s*-+\s*\|/)) {
        const rows = paragraph.split('\n').filter(row => row.trim() !== '');
        if (rows.length >= 2) {
          const headers = rows[0].split('|').filter(cell => cell.trim() !== '').map(cell => cell.trim());
          
          return (
            <div key={idx} className="overflow-x-auto my-4">
              <table className="min-w-full divide-y divide-white/10">
                <thead>
                  <tr>
                    {headers.map((header, i) => (
                      <th key={i} className="px-4 py-2 text-left text-sm font-medium text-white/70 bg-white/5">{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {rows.slice(2).map((row, rowIdx) => {
                    const cells = row.split('|').filter(cell => cell.trim() !== '').map(cell => cell.trim());
                    return (
                      <tr key={rowIdx}>
                        {cells.map((cell, cellIdx) => (
                          <td key={cellIdx} className="px-4 py-2 text-sm text-white/90">{cell}</td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          );
        }
      }
      
      // Format code blocks
      if (paragraph.match(/^```[\s\S]*?```$/m)) {
        const code = paragraph.replace(/^```(\w+)?\n([\s\S]*?)```$/m, '$2');
        const language = paragraph.match(/^```(\w+)?/)?.[1] || '';
        return (
          <pre key={idx} className="bg-black/20 p-4 rounded-md my-4 overflow-x-auto border border-white/10">
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
              <li key={i} className="text-sm text-white/90">
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
              <li key={i} className="text-sm text-white/90">
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
            className={`font-semibold my-3 text-white ${
              level === 2 ? 'text-lg' : 
              level === 3 ? 'text-base' : 
              'text-sm'
            }`}>
            {text}
          </div>
        );
      }
      
      return (
        <p key={idx} className="my-3 text-sm leading-relaxed text-white/90">
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
          <strong key={index} className="text-white font-semibold">
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
          <code key={index} className="bg-black/20 px-1 py-0.5 rounded text-white/90">
            {part.slice(1, -1)}
          </code>
        );
      }
      return part;
    });
  };

  return (
    <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-lg p-6">
      <div className="space-y-6">
        {sections.map((section, index) => {
          const title = getHeaderTitle(section);
          return (
            <div key={index} className="pb-4">
              <h3 className="text-base font-semibold border-b border-white/10 pb-2 mb-3 text-white">{title}</h3>
              <div className="prose prose-sm max-w-none dark:prose-invert prose-headings:mb-2 prose-p:my-2">
                {formatContent(section)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OptimizationImprovementSummary;
