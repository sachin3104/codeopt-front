
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

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
              <table className="min-w-full divide-y divide-border">
                <thead>
                  <tr>
                    {headers.map((header, i) => (
                      <th key={i} className="px-4 py-2 text-left text-sm font-medium text-muted-foreground bg-secondary/50">{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {rows.slice(2).map((row, rowIdx) => {
                    const cells = row.split('|').filter(cell => cell.trim() !== '').map(cell => cell.trim());
                    return (
                      <tr key={rowIdx}>
                        {cells.map((cell, cellIdx) => (
                          <td key={cellIdx} className="px-4 py-2 text-sm">{cell}</td>
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
              <li key={i} className="text-sm">{item}</li>
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
              <li key={i} className="text-sm">{item}</li>
            ))}
          </ol>
        );
      }
      
      // Format bold text
      let formatted = paragraph.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      
      // Format italic text
      formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');
      
      // Format inline code
      formatted = formatted.replace(/`(.*?)`/g, '<code>$1</code>');
      
      // Secondary headers
      if (formatted.match(/^#+\s+/)) {
        const level = (formatted.match(/^(#+)/) || ['#'])[0].length;
        const text = formatted.replace(/^#+\s+/, '');
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
        <p key={idx} 
           className="my-3 text-sm leading-relaxed" 
           dangerouslySetInnerHTML={{ __html: formatted }} />
      );
    });
  };

  return (
    <Card className="border border-border">
      <CardContent className="p-6">
        <div className="space-y-6">
          {sections.map((section, index) => {
            const title = getHeaderTitle(section);
            return (
              <div key={index} className="pb-4">
                <h3 className="text-base font-semibold border-b border-border pb-2 mb-3">{title}</h3>
                <div className="prose prose-sm max-w-none dark:prose-invert prose-headings:mb-2 prose-p:my-2">
                  {formatContent(section)}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default OptimizationImprovementSummary;
