import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Code } from 'lucide-react';

interface ConversionNotesProps {
  conversionNotes: string;
  sourceLanguage: string;
  targetLanguage: string;
}

const ConversionNotes: React.FC<ConversionNotesProps> = ({
  conversionNotes,
  sourceLanguage,
  targetLanguage
}) => {
  // Split notes into paragraphs for better formatting
  const notesParagraphs = conversionNotes
    ? conversionNotes.split('\n').filter(paragraph => paragraph.trim())
    : ['No conversion notes available.'];

  return (
    <Card className="bg-black/10 backdrop-blur-xl border border-white/10">
      <CardHeader>
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-400" />
          <CardTitle className="text-white/90">
            Conversion Notes ({sourceLanguage || 'N/A'} → {targetLanguage || 'N/A'})
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
        </div>
      </CardContent>
    </Card>
  );
};

export default ConversionNotes; 