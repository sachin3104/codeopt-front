import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info, CheckCircle } from 'lucide-react';
import type { ConversionResult } from '@/types/api';

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
  // Parse conversion notes into key transformations
  const notes = conversionNotes.split('\n').filter(line => line.trim());
  const keyTransformations = notes.filter(note => !note.toLowerCase().includes('consider'));

  return (
    <Card className="bg-black/10 backdrop-blur-xl border border-white/10">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Info className="w-6 h-6 text-blue-400" />
          <CardTitle className="text-white/90">Conversion Notes & Recommendations</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Key Transformations */}
          <div>
            <h3 className="text-base font-semibold mb-3 text-blue-400">Key Transformations</h3>
            <ol className="space-y-2 text-sm text-white/70">
              {keyTransformations.map((note, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-blue-400">{index + 1}.</span>
                  <span>{note}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Migration Roadmap */}
          <div className="bg-white/5 rounded-lg p-6 border border-white/10">
            <h3 className="text-base font-semibold mb-4 text-white/90">Migration Roadmap</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-black/20 rounded-lg p-4 border border-white/10">
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 bg-green-400/20 rounded-full flex items-center justify-center text-green-400 font-bold mr-3">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <h4 className="text-white/90 font-medium">Code Conversion</h4>
                </div>
                <p className="text-sm text-white/70">Successfully converted {sourceLanguage} logic to {targetLanguage}</p>
              </div>
              
              <div className="bg-black/20 rounded-lg p-4 border border-blue-400/20">
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 bg-blue-400/20 rounded-full flex items-center justify-center text-blue-400 font-bold mr-3">
                    2
                  </div>
                  <h4 className="text-white/90 font-medium">Testing & Validation</h4>
                </div>
                <p className="text-sm text-white/70">Verify output matches {sourceLanguage} results</p>
              </div>
              
              <div className="bg-black/20 rounded-lg p-4 border border-white/10">
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center text-white/70 font-bold mr-3">
                    3
                  </div>
                  <h4 className="text-white/90 font-medium">Production Deployment</h4>
                </div>
                <p className="text-sm text-white/70">Deploy and monitor performance</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ConversionNotes; 