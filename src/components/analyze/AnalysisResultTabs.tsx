import React from 'react';
import { AlertTriangle, Info } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import FunctionalityAnalysis from './FunctionalityAnalysis';
import { useCode } from '@/context/CodeContext';

const AnalysisResultTabs: React.FC = () => {
  const { analysisResult } = useCode();

  // Safely get categories with fallback
  const categories = analysisResult?.categories || [];
  const categoriesWithIssues = categories.filter(cat => cat.hasIssues);
  const totalIssues = categoriesWithIssues.reduce((total, cat) => total + (cat.issues?.length || 0), 0);

  return (
    <div className="backdrop-blur-md bg-gradient-to-br from-black/40 via-black/30 to-black/20 rounded-3xl border border-white/20 shadow-2xl p-6">
      <h2 className="text-lg font-semibold text-white/90 mb-4">Analysis Results</h2>
      <div className="space-y-8">
        {/* Optimization Opportunities Section */}
        <div>
          <h2 className="text-lg font-medium text-white mb-4">Optimization Opportunities {totalIssues > 0 && `(${totalIssues})`}</h2>
          {categories.length === 0 ? (
            <div className="text-center py-8">
              <Info className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No Analysis Data</h3>
              <p className="text-gray-400">No categories found in the analysis results.</p>
            </div>
          ) : categoriesWithIssues.length === 0 ? (
            <div className="text-center py-8">
              <div className="mx-auto h-12 w-12 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-white mb-2">Great Code Quality!</h3>
              <p className="text-gray-400">No optimization opportunities found. Your code looks good!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categories.map((category, idx) => (
                <Card
                  key={idx}
                  className={`bg-gray-800/20 backdrop-blur-sm border border-gray-700 rounded-2xl hover:shadow-lg transition-shadow ${
                    category.hasIssues ? 'border-amber-700/30 bg-amber-950/10' : ''
                  }`}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium flex items-center gap-2 text-white">
                        {category.hasIssues && (
                          <AlertTriangle size={16} className="text-amber-500" />
                        )}
                        {category.name}
                      </CardTitle>
                      {category.hasIssues && (
                        <span className="text-xs px-2 py-0.5 bg-amber-500/20 text-amber-400 rounded-full">
                          {category.issues?.length || 0} {(category.issues?.length || 0) === 1 ? 'issue' : 'issues'}
                        </span>
                      )}
                    </div>
                    <CardDescription className="text-xs text-gray-300">
                      {category.hasIssues
                        ? `${category.issues?.length || 0} optimization ${
                            (category.issues?.length || 0) === 1 ? 'opportunity' : 'opportunities'
                          } found`
                        : 'No optimization opportunities found'}
                    </CardDescription>
                  </CardHeader>

                  {category.hasIssues && category.issues && category.issues.length > 0 && (
                    <CardContent>
                      <Accordion type="single" collapsible className="w-full bg-transparent">
                        {category.issues.map((issue, i) => (
                          <AccordionItem key={i} value={`issue-${i}`}>
                            <AccordionTrigger className="text-sm text-white hover:text-gray-200">
                              {issue.title || `Issue ${i + 1}`}
                            </AccordionTrigger>
                            <AccordionContent>
                              <div className="space-y-3 text-sm text-gray-200">
                                {issue.location && (
                                  <div>
                                    <div className="font-medium text-xs text-muted-foreground mb-1">CODE LOCATION</div>
                                    <div className="bg-secondary/50 px-3 py-1 rounded-sm text-white">
                                      {issue.location}
                                    </div>
                                  </div>
                                )}
                                {issue.reason && (
                                  <div>
                                    <div className="font-medium text-xs text-muted-foreground mb-1">REASON</div>
                                    <p>{issue.reason}</p>
                                  </div>
                                )}
                                {issue.suggestion && (
                                  <div>
                                    <div className="font-medium text-xs text-muted-foreground mb-1">SUGGESTION</div>
                                    <p className="text-primary">{issue.suggestion}</p>
                                  </div>
                                )}
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
          )}
        </div>

        {/* Functionality Analysis Section */}
        <h2 className="text-lg font-medium text-white mb-4">Functionality Analysis</h2>
        <div>
          {analysisResult?.functionalityAnalysis ? (
            <FunctionalityAnalysis content={analysisResult.functionalityAnalysis} />
          ) : (
            <div className="text-center py-8">
              <Info className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No Functionality Analysis</h3>
              <p className="text-gray-400">Functionality analysis data is not available.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalysisResultTabs; 