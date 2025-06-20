import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Code } from 'lucide-react';
import type { ConversionNotes as ConversionNotesType } from '@/types/api';

interface ConversionNotesProps {
  conversionNotes: ConversionNotesType | undefined;
  sourceLanguage: string | undefined;
  targetLanguage: string | undefined;
}

const ConversionNotes: React.FC<ConversionNotesProps> = ({
  conversionNotes,
  sourceLanguage,
  targetLanguage
}) => {
  // Use the content from the new structure or fallback to paragraphs
  const notesContent = conversionNotes?.content || 
    (conversionNotes?.paragraphs && conversionNotes.paragraphs.length > 0 
      ? conversionNotes.paragraphs.join('\n\n') 
      : 'No conversion notes available.');

  // Split notes into paragraphs for better formatting
  const notesParagraphs = notesContent
    ? notesContent.split('\n').filter(paragraph => paragraph.trim())
    : ['No conversion notes available.'];

  return (
    <Card className="bg-black/10 backdrop-blur-xl border border-white/10">
      <CardHeader>
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-400" />
          <CardTitle className="text-white/90">
            Conversion Notes ({sourceLanguage || 'NA'} → {targetLanguage || 'NA'})
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="bg-white/5 rounded-lg p-4">
          <div className="space-y-3">
            {notesParagraphs.map((paragraph, index) => (
              <div key={index} className="flex items-start gap-3">
                <Code className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-white/80 leading-relaxed">
                  {paragraph}
                </p>
              </div>
            ))}
          </div>
          
          {/* Key Changes Section */}
          {conversionNotes?.key_changes && conversionNotes.key_changes.length > 0 && (
            <div className="mt-6 pt-4 border-t border-white/10">
              <h4 className="text-sm font-semibold text-white/90 mb-3">Key Changes:</h4>
              <ul className="space-y-2">
                {conversionNotes.key_changes.map((change, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-blue-400 text-xs mt-1">•</span>
                    <span className="text-sm text-white/70">{change}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ConversionNotes; 