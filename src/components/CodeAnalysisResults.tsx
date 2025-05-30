import React, { useState } from 'react';
import { AlertTriangle, CircleArrowDown } from "lucide-react";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { AnalysisResult } from '@/api/service';
import FlowchartVisualization from './FlowchartVisualization';
import ScoreCardDisplay from './ScoreCardDisplay';
import FunctionalityAnalysis from './FunctionalityAnalysis';

interface CodeAnalysisResultsProps {
  results: AnalysisResult | null;
  className?: string;
}

const CodeAnalysisResults: React.FC<CodeAnalysisResultsProps> = ({ results, className = "" }) => {
  const [openSections, setOpenSections] = useState({
    workflow: true,
    scores: true,
    issues: true,
    functionality: true
  });

  if (!results) {
    return <div className={`p-4 ${className}`}>No analysis results available</div>;
  }

  const { categories, detectedLanguage, workflow, scores, functionalityAnalysis } = results;
  
  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  return (
    <div className={`space-y-6 ${className} animate-fade-in`}>
      
      
      {/* Workflow Visualization */}
      {workflow && (
        <Collapsible open={openSections.workflow} onOpenChange={() => toggleSection('workflow')} className="w-full">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium">Code Flow Visualization</h3>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="p-0 h-8 w-8">
                <CircleArrowDown className={`h-5 w-5 transition-transform duration-200 ${openSections.workflow ? 'rotate-180' : ''}`} />
              </Button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent className="transition-all duration-300">
            <FlowchartVisualization workflow={workflow} />
          </CollapsibleContent>
        </Collapsible>
      )}
      
      {/* Score Cards */}
      {scores && (
        <Collapsible open={openSections.scores} onOpenChange={() => toggleSection('scores')} className="w-full">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium">Code Quality Scores</h3>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="p-0 h-8 w-8">
                <CircleArrowDown className={`h-5 w-5 transition-transform duration-200 ${openSections.scores ? 'rotate-180' : ''}`} />
              </Button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent className="transition-all duration-300">
            <ScoreCardDisplay scores={scores} />
          </CollapsibleContent>
        </Collapsible>
      )}

      {/* Issue Categories */}
      <Collapsible open={openSections.issues} onOpenChange={() => toggleSection('issues')} className="w-full">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-medium">Optimization Opportunities</h3>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="p-0 h-8 w-8">
              <CircleArrowDown className={`h-5 w-5 transition-transform duration-200 ${openSections.issues ? 'rotate-180' : ''}`} />
            </Button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent className="transition-all duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categories.map((category, index) => (
              <Card 
                key={index} 
                className={`border ${category.hasIssues ? 'border-amber-700/30 bg-amber-950/10' : 'border-border'} transition-all duration-300 hover:shadow-md`}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      {category.hasIssues && (
                        <AlertTriangle size={16} className="text-amber-500" />
                      )}
                      {category.name}
                    </CardTitle>
                    {category.hasIssues && (
                      <span className="text-xs px-2 py-0.5 bg-amber-500/20 text-amber-400 rounded-full">
                        {category.issues.length} {category.issues.length === 1 ? 'issue' : 'issues'}
                      </span>
                    )}
                  </div>
                  <CardDescription className="text-xs">
                    {category.hasIssues 
                      ? `${category.issues.length} optimization ${category.issues.length === 1 ? 'opportunity' : 'opportunities'} found`
                      : 'No optimization opportunities found'}
                  </CardDescription>
                </CardHeader>
                {category.hasIssues && (
                  <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                      {category.issues.map((issue, issueIndex) => (
                        <AccordionItem key={issueIndex} value={`issue-${issueIndex}`}>
                          <AccordionTrigger className="text-sm">{issue.title}</AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-3 text-sm">
                              <div>
                                <div className="font-medium text-xs text-muted-foreground mb-1">CODE LOCATION</div>
                                <div className="bg-secondary/50 px-3 py-1 rounded-sm">{issue.location}</div>
                              </div>
                              <div>
                                <div className="font-medium text-xs text-muted-foreground mb-1">REASON</div>
                                <p>{issue.reason}</p>
                              </div>
                              <div>
                                <div className="font-medium text-xs text-muted-foreground mb-1">SUGGESTION</div>
                                <p className="text-primary">{issue.suggestion}</p>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Functionality Analysis - Now displays content directly without accordions */}
      {functionalityAnalysis && (
        <Collapsible open={openSections.functionality} onOpenChange={() => toggleSection('functionality')} className="w-full">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium">Functionality Analysis</h3>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="p-0 h-8 w-8">
                <CircleArrowDown className={`h-5 w-5 transition-transform duration-200 ${openSections.functionality ? 'rotate-180' : ''}`} />
              </Button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent className="transition-all duration-300">
            <FunctionalityAnalysis content={functionalityAnalysis} />
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  );
};

export default CodeAnalysisResults;
