import React from 'react';
import { CheckCircle, Activity, MemoryStick, Cpu, Zap, Database, PauseCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface IssueResolved {
  priority: 'High' | 'Medium' | 'NA';
  category: string;
  issue: string;
  improvement: string;
  status: 'Resolved' | 'NA';
  location: string;
  costSaving: string;
}

interface IssuesResolvedTableProps {
  issuesResolved: IssueResolved[];
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'High':
      return 'bg-red-400/20 text-red-400';
    case 'Medium':
      return 'bg-orange-400/20 text-orange-400';
    default:
      return 'bg-blue-400/20 text-blue-400';
  }
};

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'Memory Usage':
      return <MemoryStick className="w-4 h-4 text-red-400/80 mr-2" />;
    case 'Execution Time':
      return <Activity className="w-4 h-4 text-orange-400/80 mr-2" />;
    case 'Code Complexity':
      return <Cpu className="w-4 h-4 text-blue-400/80 mr-2" />;
    case 'Query Optimization':
      return <Zap className="w-4 h-4 text-yellow-400/80 mr-2" />;
    default:
      return <Database className="w-4 h-4 text-gray-400/80 mr-2" />;
  }
};

const IssuesResolvedTable: React.FC<IssuesResolvedTableProps> = ({ issuesResolved }) => (
  <Card className="bg-black/10 backdrop-blur-xl border border-white/10 overflow-hidden my-6">
    <div className="p-4 border-b border-white/10">
      <h3 className="text-white/90 font-medium">Issues Resolved ({issuesResolved.length})</h3>
    </div>
    <div className="overflow-auto" style={{ maxHeight: '300px' }}>
      <table className="w-full">
        <thead className="sticky top-0 bg-black/20 backdrop-blur-xl">
          <tr className="text-xs text-white/60 uppercase border-b border-white/10">
            <th className="text-left p-4">Priority</th>
            <th className="text-left p-4">Category</th>
            <th className="text-left p-4">Issue Resolved</th>
            <th className="text-center p-4">Status</th>
            <th className="text-left p-4">Location</th>
            <th className="text-left p-4">Cost Saving</th>
          </tr>
        </thead>
        <tbody>
          {issuesResolved.map((issue, index) => (
            <tr key={index} className="border-b border-white/5 hover:bg-white/5 transition-colors">
              <td className="p-4">
                <span className={`px-2 py-0.5 ${getPriorityColor(issue.priority)} text-xs rounded-full`}>
                  {issue.priority}
                </span>
              </td>
              <td className="p-4">
                <div className="flex items-center text-white/80">
                  {getCategoryIcon(issue.category)}
                  {issue.category}
                </div>
              </td>
              <td className="p-4 text-white/80">{issue.issue}</td>
              <td className="p-4 text-center">
                {issue.status === 'Resolved' ? (
                  <CheckCircle className="w-4 h-4 text-emerald-400/80 mx-auto" />
                ) : (
                  <PauseCircle className="w-4 h-4 text-yellow-400/80 mx-auto" />
                )}
              </td>
              <td className="p-4 text-left text-white/70">{issue.location}</td>
              <td className="p-4 text-left text-white/70">{issue.costSaving}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </Card>
);

export default IssuesResolvedTable; 