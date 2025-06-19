import React from 'react';
import {  Info } from 'lucide-react';
import { Card,  CardContent } from "@/components/ui/card";
import FunctionalityAnalysis from './FunctionalityAnalysis';
import { useAnalyze } from '@/hooks/use-analyze';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";



// Local type for the new API/context shape
interface AnalysisIssue {
  title: string;
  location: string;
  reason: string;
  suggestion: string;
}
interface AnalysisCategory {
  name: string;
  hasIssues: boolean;
  issues: AnalysisIssue[];
}
interface AnalysisResultWithCategories {
  categories: AnalysisCategory[];
  functionalityAnalysis?: string | null;
}

// Type guard to check if result matches the new shape
function isAnalysisResultWithCategories(result: any): result is AnalysisResultWithCategories {
  return (
    result &&
    Array.isArray(result.categories) &&
    (typeof result.functionalityAnalysis === 'string' || result.functionalityAnalysis === null || result.functionalityAnalysis === undefined)
  );
}

const AnalysisResultTabs: React.FC = () => {
  const { result } = useAnalyze();

  // Normalize backend data to expected format
  let categories: AnalysisCategory[] = [];
  let functionalityAnalysis: string | null = null;

  if (result && result.analysis) {
    categories = Object.entries(result.analysis).map(([key, value]: [string, any]) => ({
      name: value.name || key,
      hasIssues: Array.isArray(value.issues) && value.issues.some((issue: any) => issue.issue && issue.issue !== 'No significant data throughput issues' && issue.issue !== 'No machine learning models present' && issue.issue !== 'No database queries present' && issue.issue !== 'No reporting or visualization present'),
      issues: (value.issues || []).map((issue: any) => ({
        title: issue.issue,
        location: issue.code_location,
        reason: issue.reason,
        suggestion: issue.suggestion,
      })),
    }));
  }
  if (result && typeof result.functionality_analysis === 'string') {
    functionalityAnalysis = result.functionality_analysis;
  }

  const categoriesWithIssues = categories.filter(cat => cat.hasIssues);
  const totalIssues = categoriesWithIssues.reduce((total, cat) => total + (cat.issues?.length || 0), 0);

  // Function to determine priority based on issue reason
  const getPriority = (reason: string) => {
    if (reason?.toLowerCase().includes('high')) return 'High';
    if (reason?.toLowerCase().includes('medium')) return 'Medium';
    return 'Low';
  };

  // Get all issues from all categories
  const allIssues = categoriesWithIssues.flatMap(category =>
    (category.issues || []).map(issue => ({
      ...issue,
      category: category.name,
      priority: getPriority(issue.reason || '')
    }))
  );

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
            <Card className="bg-gray-800/20 backdrop-blur-sm border border-gray-700 rounded-2xl">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Priority</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Issue Description</TableHead>
                      <TableHead>Location</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categoriesWithIssues.flatMap(category =>
                      (category.issues || []).map((issue, index) => {
                        const priority = getPriority(issue.reason || '');
                        return (
                          <TableRow key={category.name + '-' + index}>
                            <TableCell>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                priority === 'High' 
                                  ? 'bg-red-500/20 text-red-400' 
                                  : priority === 'Medium'
                                  ? 'bg-yellow-500/20 text-yellow-400'
                                  : 'bg-green-500/20 text-green-400'
                              }`}>
                                {priority}
                              </span>
                            </TableCell>
                            <TableCell className="font-medium">{category.name}</TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <p className="font-medium">{issue.title}</p>
                                {issue.reason && (
                                  <p className="text-sm text-gray-400">{issue.reason}</p>
                                )}
                                {issue.suggestion && (
                                  <p className="text-sm text-primary">{issue.suggestion}</p>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>{issue.location || 'Not specified'}</TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Functionality Analysis Section */}
        <h2 className="text-lg font-medium text-white mb-4">Functionality Analysis</h2>
        <div>
          {functionalityAnalysis ? (
            <FunctionalityAnalysis content={functionalityAnalysis} />
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