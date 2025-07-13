import React from 'react';
import { CheckCircle, Activity, MemoryStick, Cpu, Zap, Database, PauseCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useOptimize } from '@/hooks/use-optimize';

interface IssueResolved {
  priority: 'High' | 'Medium' | 'NA';
  category: string;
  issue: string;
  improvement: string;
  status: 'Resolved' | 'NA';
  location: string;
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'High':
      return 'bg-red-400/20 text-red-400 border-red-400/30';
    case 'Medium':
      return 'bg-orange-400/20 text-orange-400 border-orange-400/30';
    default:
      return 'bg-blue-400/20 text-blue-400 border-blue-400/30';
  }
};

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'Memory Usage':
      return <MemoryStick className="w-3 h-3 xs:w-4 xs:h-4 text-red-400/80" />;
    case 'Execution Time':
      return <Activity className="w-3 h-3 xs:w-4 xs:h-4 text-orange-400/80" />;
    case 'Code Complexity':
      return <Cpu className="w-3 h-3 xs:w-4 xs:h-4 text-blue-400/80" />;
    case 'Query Optimization':
      return <Zap className="w-3 h-3 xs:w-4 xs:h-4 text-amber-400/80" />;
    default:
      return <Database className="w-3 h-3 xs:w-4 xs:h-4 text-gray-400/80" />;
  }
};

const IssuesResolvedTable: React.FC = () => {
  const { result: optimizationResult } = useOptimize();

  if (!optimizationResult) {
    return null;
  }

  // Transform issues data from the optimization result
  const issuesResolved: IssueResolved[] = optimizationResult.issues_resolved?.map(issue => ({
    priority: (issue.priority ?? 'NA') as 'High' | 'Medium' | 'NA',
    category: issue.category ?? 'NA',
    issue: issue.issue ?? 'NA',
    improvement: issue.improvement ?? 'NA',
    status: (issue.status ?? 'NA') as 'Resolved' | 'NA',
    location: issue.location ?? 'NA'
  })) ?? [];

  return (
    <Card className="bg-black/10 backdrop-blur-xl border border-white/10 overflow-hidden my-3 xs:my-4 sm:my-4 md:my-6 min-h-[280px] xs:min-h-[320px] sm:min-h-[340px] md:min-h-[400px]">
      <CardHeader className="p-3 xs:p-4 sm:p-4 md:p-6">
        <CardTitle className="text-base xs:text-lg sm:text-xl font-semibold text-white/90 flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2 xs:gap-0">
          <div className="flex items-center">
            <CheckCircle className="w-3 h-3 xs:w-4 xs:h-4 text-blue-400/80 mr-2" />
            Issues Resolved
          </div>
          <span className="text-xs xs:text-sm text-white/70">
            {issuesResolved.length} issues resolved in {new Set(issuesResolved.map(issue => issue.category)).size} categories
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-black/80 backdrop-blur-6xl border-b border-white/10">
              <tr className="text-xs text-white/80 uppercase tracking-wider">
                <th className="text-left p-2 xs:p-3 sm:p-4 w-16 xs:w-20">Priority</th>
                <th className="text-left p-2 xs:p-3 sm:p-4 w-32 xs:w-40 sm:w-48">Category</th>
                <th className="text-left p-2 xs:p-3 sm:p-4">Issue Description</th>
                <th className="text-center p-2 xs:p-3 sm:p-4 w-20 xs:w-24">Status</th>
                <th className="text-left p-2 xs:p-3 sm:p-4 w-32 xs:w-40 sm:w-48">Location</th>
              </tr>
            </thead>
            <tbody>
              {issuesResolved.map((issue, index) => (
                <tr key={index} className="border-b border-white/5 hover:bg-white/5 transition-all duration-200 group">
                  <td className="p-2 xs:p-3 sm:p-4">
                    <span className={`px-2 py-1 xs:px-3 xs:py-1.5 ${getPriorityColor(issue.priority)} text-xs rounded-full font-medium border`}>
                      {issue.priority}
                    </span>
                  </td>
                  <td className="p-2 xs:p-3 sm:p-4">
                    <div className="flex items-center text-white/80 font-medium">
                      <div className="mr-2 xs:mr-3 p-1 xs:p-1.5 bg-white/5 rounded-lg group-hover:bg-white/10 transition-colors">
                        {getCategoryIcon(issue.category)}
                      </div>
                      <span className="text-xs xs:text-sm sm:text-base">{issue.category}</span>
                    </div>
                  </td>
                  <td className="p-2 xs:p-3 sm:p-4">
                    <div className="space-y-1 xs:space-y-2">
                      <div className="text-white/90 font-medium text-xs xs:text-sm leading-relaxed">
                        {issue.issue}
                      </div>
                      <div className="text-white/60 text-xs leading-relaxed bg-white/5 rounded-lg p-1.5 xs:p-2 border border-white/10">
                        <span className="text-emerald-400/80 font-medium">Improvement:</span> {issue.improvement}
                      </div>
                    </div>
                  </td>
                  <td className="p-2 xs:p-3 sm:p-4 text-center">
                    <div className="flex justify-center">
                      {issue.status === 'Resolved' ? (
                        <div className="flex items-center space-x-1 xs:space-x-2 px-2 py-1 xs:px-3 xs:py-1.5 bg-emerald-400/20 text-emerald-400/90 rounded-full border border-emerald-400/30">
                          <CheckCircle className="w-3 h-3 xs:w-4 xs:h-4" />
                          <span className="text-xs font-medium">Resolved</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-1 xs:space-x-2 px-2 py-1 xs:px-3 xs:py-1.5 bg-yellow-400/20 text-yellow-400/90 rounded-full border border-yellow-400/30">
                          <PauseCircle className="w-3 h-3 xs:w-4 xs:h-4" />
                          <span className="text-xs font-medium">Pending</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="p-2 xs:p-3 sm:p-4">
                    <div className="flex items-center">
                      <div className="px-2 py-1 xs:px-3 xs:py-1.5 bg-white/5 text-white/70 text-xs rounded-lg border border-white/10 font-mono">
                        {issue.location}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default IssuesResolvedTable; 