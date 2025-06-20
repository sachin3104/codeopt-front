import React from 'react';
import { CheckCircle, Activity, MemoryStick, Cpu, Zap, Database, PauseCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
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
      return <MemoryStick className="w-4 h-4 text-red-400/80" />;
    case 'Execution Time':
      return <Activity className="w-4 h-4 text-orange-400/80" />;
    case 'Code Complexity':
      return <Cpu className="w-4 h-4 text-blue-400/80" />;
    case 'Query Optimization':
      return <Zap className="w-4 h-4 text-yellow-400/80" />;
    default:
      return <Database className="w-4 h-4 text-gray-400/80" />;
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
    <Card className="bg-black/10 backdrop-blur-xl border border-white/10 overflow-hidden my-6">
      <div className="p-6 border-b border-white/10 bg-black/5">
        <h3 className="text-white/90 font-semibold text-lg flex items-center">
          <CheckCircle className="w-5 h-5 text-emerald-400/80 mr-3" />
          Issues Resolved
          <span className="ml-2 px-3 py-1 bg-emerald-400/20 text-emerald-400/90 text-sm rounded-full font-medium">
            {issuesResolved.length}
          </span>
        </h3>
      </div>
      <div className="overflow-auto" style={{ maxHeight: '400px' }}>
        <table className="w-full">
          <thead className="sticky top-0 bg-black/30 backdrop-blur-xl border-b border-white/10">
            <tr className="text-xs text-white/60 uppercase tracking-wider">
              <th className="text-left p-4 w-20">Priority</th>
              <th className="text-left p-4 w-32">Category</th>
              <th className="text-left p-4">Issue Description</th>
              <th className="text-center p-4 w-24">Status</th>
              <th className="text-left p-4 w-48">Location</th>
            </tr>
          </thead>
          <tbody>
            {issuesResolved.map((issue, index) => (
              <tr key={index} className="border-b border-white/5 hover:bg-white/5 transition-all duration-200 group">
                <td className="p-4">
                  <span className={`px-3 py-1.5 ${getPriorityColor(issue.priority)} text-xs rounded-full font-medium border`}>
                    {issue.priority}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center text-white/80 font-medium">
                    <div className="mr-3 p-1.5 bg-white/5 rounded-lg group-hover:bg-white/10 transition-colors">
                      {getCategoryIcon(issue.category)}
                    </div>
                    <span className="text-sm">{issue.category}</span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="space-y-2">
                    <div className="text-white/90 font-medium text-sm leading-relaxed">
                      {issue.issue}
                    </div>
                    <div className="text-white/60 text-xs leading-relaxed bg-white/5 rounded-lg p-2 border border-white/10">
                      <span className="text-emerald-400/80 font-medium">Improvement:</span> {issue.improvement}
                    </div>
                  </div>
                </td>
                <td className="p-4 text-center">
                  <div className="flex justify-center">
                    {issue.status === 'Resolved' ? (
                      <div className="flex items-center space-x-2 px-3 py-1.5 bg-emerald-400/20 text-emerald-400/90 rounded-full border border-emerald-400/30">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-xs font-medium">Resolved</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2 px-3 py-1.5 bg-yellow-400/20 text-yellow-400/90 rounded-full border border-yellow-400/30">
                        <PauseCircle className="w-4 h-4" />
                        <span className="text-xs font-medium">Pending</span>
                      </div>
                    )}
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center">
                    <div className="px-3 py-1.5 bg-white/5 text-white/70 text-xs rounded-lg border border-white/10 font-mono">
                      {issue.location}
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default IssuesResolvedTable; 