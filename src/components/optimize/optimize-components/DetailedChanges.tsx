import React from 'react';
import { AlertTriangle } from "lucide-react";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type IssuesResolved } from '@/types/api';

interface DetailedChangesProps {
  changes: IssuesResolved[];
}

const DetailedChanges: React.FC<DetailedChangesProps> = ({ changes }) => {
  if (!changes || changes.length === 0) {
    return <div className="p-4">No detailed changes available</div>;
  }

  // Group changes by category (previously metric)
  const changesByCategory: Record<string, IssuesResolved[]> = {};
  
  changes.forEach(change => {
    const category = change.category || 'Other';
    if (!changesByCategory[category]) {
      changesByCategory[category] = [];
    }
    changesByCategory[category].push(change);
  });
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {Object.entries(changesByCategory).map(([category, categoryChanges], index) => (
        <Card 
          key={index} 
          className="bg-black/10 backdrop-blur-xl border border-white/10 transition-all duration-300 hover:shadow-md min-h-[340px]"
        >
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-white/90 flex items-center gap-2">
                <AlertTriangle size={16} className="text-blue-400/80" />
                {category}
              </CardTitle>
              <span className="text-xs px-2 py-0.5 bg-blue-400/20 text-blue-400/90 rounded-full">
                {categoryChanges.length} {categoryChanges.length === 1 ? 'change' : 'changes'}
              </span>
            </div>
            <CardDescription className="text-xs text-white/70">
              {categoryChanges.length} optimization {categoryChanges.length === 1 ? 'change' : 'changes'} applied
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {categoryChanges.map((change, issueIndex) => (
                <AccordionItem key={issueIndex} value={`issue-${issueIndex}`}>
                  <AccordionTrigger className="text-sm text-white/80">{change.issue}</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3 text-sm">
                      <div>
                        <div className="font-medium text-xs text-white/60 mb-1">PRIORITY</div>
                        <div className="bg-white/5 px-3 py-1 rounded-sm text-white/80">{change.priority || 'NA'}</div>
                      </div>
                      <div>
                        <div className="font-medium text-xs text-white/60 mb-1">CODE LOCATION</div>
                        <div className="bg-white/5 px-3 py-1 rounded-sm text-white/80">{change.location || 'NA'}</div>
                      </div>
                      <div>
                        <div className="font-medium text-xs text-white/60 mb-1">IMPROVEMENT</div>
                        <p className="text-white/90">{change.improvement || 'NA'}</p>
                      </div>
                      <div>
                        <div className="font-medium text-xs text-white/60 mb-1">STATUS</div>
                        <div className="bg-white/5 px-3 py-1 rounded-sm text-white/80">{change.status || 'NA'}</div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DetailedChanges;
