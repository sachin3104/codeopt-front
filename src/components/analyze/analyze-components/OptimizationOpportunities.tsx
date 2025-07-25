import React from 'react';
import { Info, CheckCircle, Activity, MemoryStick, Cpu, Zap, Database } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

const getCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case 'memory usage':
    case 'memory':
      return <MemoryStick className="w-3 h-3 xs:w-4 xs:h-4 text-red-400/80" />;
    case 'execution time':
    case 'performance':
      return <Activity className="w-3 h-3 xs:w-4 xs:h-4 text-orange-400/80" />;
    case 'code complexity':
    case 'complexity':
      return <Cpu className="w-3 h-3 xs:w-4 xs:h-4 text-blue-400/80" />;
    case 'query optimization':
    case 'database':
      return <Zap className="w-3 h-3 xs:w-4 xs:h-4 text-amber-400/80" />;
    default:
      return <Database className="w-3 h-3 xs:w-4 xs:h-4 text-gray-400/80" />;
  }
};

const OptimizationOpportunities: React.FC = () => {
  const { result } = useAnalyze();

  // Function to format category names
  const formatCategoryName = (name: string) => {
    return name
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  // Normalize backend data to expected format
  let categories: AnalysisCategory[] = [];

  if (result && result.analysis) {
    categories = Object.entries(result.analysis).map(([key, value]: [string, any]) => ({
      name: formatCategoryName(value.name || key),
      hasIssues: Array.isArray(value.issues) && value.issues.some((issue: any) => issue.issue && issue.issue !== 'No significant data throughput issues' && issue.issue !== 'No machine learning models present' && issue.issue !== 'No database queries present' && issue.issue !== 'No reporting or visualization present'),
      issues: (value.issues || []).map((issue: any) => ({
        title: issue.issue,
        location: issue.code_location,
        reason: issue.reason,
        suggestion: issue.suggestion,
      })),
    }));
  }

  const categoriesWithIssues = categories.filter(cat => cat.hasIssues);
  const totalIssues = categoriesWithIssues.reduce((total, cat) => total + (cat.issues?.length || 0), 0);

  // Function to determine priority based on issue reason
  const getPriority = (reason: string) => {
    if (reason?.toLowerCase().includes('high')) return 'High';
    if (reason?.toLowerCase().includes('medium')) return 'Medium';
    return 'Low';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-red-400/20 text-red-400 border-red-400/30';
      case 'Medium':
        return 'bg-orange-400/20 text-orange-400 border-orange-400/30';
      default:
        return 'bg-green-400/20 text-green-400 border-green-400/30';
    }
  };

  return (
    <Card className="bg-black/10 backdrop-blur-xl border border-white/10 overflow-hidden my-3 xs:my-4 sm:my-4 md:my-6 min-h-[280px] xs:min-h-[320px] sm:min-h-[340px] md:min-h-[400px]">
      <CardHeader className="p-3 xs:p-4 sm:p-4 md:p-6">
        <CardTitle className="text-base xs:text-lg sm:text-xl font-semibold text-white/90 flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2 xs:gap-0">
          <div className="flex items-center">
            <Activity className="w-3 h-3 xs:w-4 xs:h-4 text-blue-400/80 mr-2" />
            Optimization Opportunities
          </div>
          {totalIssues > 0 && (
            <span className="text-xs xs:text-sm text-white/70">
              {totalIssues} issues found in {categoriesWithIssues.length} categories
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {categories.length === 0 ? (
          <div className="text-center py-6 xs:py-8 sm:py-8 md:py-8 px-4">
            <Info className="mx-auto h-8 w-8 xs:h-10 xs:w-10 sm:h-12 sm:w-12 text-gray-400 mb-3 xs:mb-4 sm:mb-4" />
            <h3 className="text-base xs:text-lg sm:text-lg font-medium text-white mb-2">No Analysis Data</h3>
            <p className="text-gray-400 text-sm xs:text-base">No categories found in the analysis results.</p>
          </div>
        ) : categoriesWithIssues.length === 0 ? (
          <div className="text-center py-6 xs:py-8 sm:py-8 md:py-8 px-4">
            <div className="mx-auto h-8 w-8 xs:h-10 xs:w-10 sm:h-12 sm:w-12 bg-green-500/20 rounded-full flex items-center justify-center mb-3 xs:mb-4 sm:mb-4">
              <CheckCircle className="h-4 w-4 xs:h-5 xs:w-5 sm:h-6 sm:w-6 text-green-400" />
            </div>
            <h3 className="text-base xs:text-lg sm:text-lg font-medium text-white mb-2">Great Code Quality!</h3>
            <p className="text-gray-400 text-sm xs:text-base">No optimization opportunities found. Your code looks good!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-black/80 backdrop-blur-6xl border-b border-white/10">
                <tr className="text-xs text-white/80 uppercase tracking-wider">
                  <th className="text-left p-2 xs:p-3 sm:p-4 w-16 xs:w-20">Priority</th>
                  <th className="text-left p-2 xs:p-3 sm:p-4 w-32 xs:w-40 sm:w-48">Category</th>
                  <th className="text-left p-2 xs:p-3 sm:p-4">Issue Description</th>
                  <th className="text-left p-2 xs:p-3 sm:p-4 w-32 xs:w-40 sm:w-48">Location</th>
                </tr>
              </thead>
              <tbody>
                {categoriesWithIssues.flatMap(category =>
                  (category.issues || []).map((issue, index) => {
                    const priority = getPriority(issue.reason || '');
                    return (
                      <tr key={category.name + '-' + index} className="border-b border-white/5 hover:bg-white/5 transition-all duration-200 group">
                        <td className="p-2 xs:p-3 sm:p-4">
                          <span className={`px-2 py-1 xs:px-3 xs:py-1.5 ${getPriorityColor(priority)} text-xs rounded-full font-medium border`}>
                            {priority}
                          </span>
                        </td>
                        <td className="p-2 xs:p-3 sm:p-4">
                          <div className="flex items-center text-white/80 font-medium">
                            <div className="mr-2 xs:mr-3 p-1 xs:p-1.5 bg-white/5 rounded-lg group-hover:bg-white/10 transition-colors">
                              {getCategoryIcon(category.name)}
                            </div>
                            <span className="text-xs xs:text-sm sm:text-base">{category.name}</span>
                          </div>
                        </td>
                        <td className="p-2 xs:p-3 sm:p-4">
                          <div className="space-y-1 xs:space-y-2">
                            <div className="text-white/90 font-medium text-xs xs:text-sm leading-relaxed">
                              {issue.title}
                            </div>
                            {issue.reason && (
                              <div className="text-white/60 text-xs leading-relaxed">
                                <span className="text-orange-400/80 font-medium">Reason:</span> {issue.reason}
                              </div>
                            )}
                            {issue.suggestion && (
                              <div className="text-white/60 text-xs leading-relaxed bg-white/5 rounded-lg p-1.5 xs:p-2 border border-white/10">
                                <span className="text-emerald-400/80 font-medium">Suggestion:</span> {issue.suggestion}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="p-2 xs:p-3 sm:p-4">
                          <div className="flex items-center">
                            <div className="px-2 py-1 xs:px-3 xs:py-1.5 bg-white/5 text-white/70 text-xs rounded-lg border border-white/10 font-mono">
                              {issue.location || 'Not specified'}
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OptimizationOpportunities; 