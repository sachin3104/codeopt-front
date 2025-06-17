import React from 'react';
import { 
  MemoryStick, 
  Activity, 
  Zap, 
  Cpu, 
  HardDrive, 
  Database, 
  TrendingUp, 
  CheckCircle,
  AlertCircle,
  Code2,
  FileCode,
  Bug,
  Workflow,
  FileCheck,
  FileSearch,
  FileBarChart,
  FileSpreadsheet,
  FileText
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCode } from '@/context/CodeContext';

const OptimizationDetails: React.FC = () => {
  const { optimizationResult } = useCode();

  if (!optimizationResult) {
    return null;
  }

  // Transform optimization metrics into issues resolved format
  const issuesResolved = [
    {
      priority: 'High' as const,
      category: 'Execution Time',
      issue: optimizationResult.metrics.executionTime.label,
      status: 'Resolved' as const,
      savings: `$${Math.round(Number(optimizationResult.metrics.executionTime.improvement) * 100)}/mo`
    },
    {
      priority: 'High' as const,
      category: 'Memory Usage',
      issue: optimizationResult.metrics.memoryUsage.label,
      status: 'Resolved' as const,
      savings: `$${Math.round(Number(optimizationResult.metrics.memoryUsage.improvement) * 100)}/mo`
    },
    {
      priority: 'High' as const,
      category: 'Code Complexity',
      issue: optimizationResult.metrics.codeComplexity.label,
      status: 'Resolved' as const,
      savings: `$${Math.round(Number(optimizationResult.metrics.codeComplexity.improvement) * 100)}/mo`
    }
  ];

  // Transform optimization metrics into high priority details
  const highPriorityDetails = [
    {
      title: 'Execution Time',
      description: optimizationResult.metrics.executionTime.label,
      icon: <Activity className="w-5 h-5 text-orange-400/80 mt-0.5" />
    },
    {
      title: 'Memory Usage',
      description: optimizationResult.metrics.memoryUsage.label,
      icon: <MemoryStick className="w-5 h-5 text-red-400/80 mt-0.5" />
    },
    {
      title: 'Code Complexity',
      description: optimizationResult.metrics.codeComplexity.label,
      icon: <Cpu className="w-5 h-5 text-blue-400/80 mt-0.5" />
    }
  ];

  // Get appropriate icon for each improvement
  const getImprovementIcon = (improvement: string) => {
    if (improvement.toLowerCase().includes('cpu')) return <Cpu className="w-5 h-5 text-blue-400/80" />;
    if (improvement.toLowerCase().includes('data')) return <Database className="w-5 h-5 text-emerald-400/80" />;
    if (improvement.toLowerCase().includes('i/o')) return <HardDrive className="w-5 h-5 text-amber-400/80" />;
    if (improvement.toLowerCase().includes('where')) return <FileSearch className="w-5 h-5 text-violet-400/80" />;
    if (improvement.toLowerCase().includes('error')) return <Bug className="w-5 h-5 text-red-400/80" />;
    if (improvement.toLowerCase().includes('macro')) return <Code2 className="w-5 h-5 text-indigo-400/80" />;
    if (improvement.toLowerCase().includes('proc')) return <Workflow className="w-5 h-5 text-cyan-400/80" />;
    if (improvement.toLowerCase().includes('report')) return <FileBarChart className="w-5 h-5 text-pink-400/80" />;
    if (improvement.toLowerCase().includes('sas')) return <FileSpreadsheet className="w-5 h-5 text-orange-400/80" />;
    return <FileText className="w-5 h-5 text-gray-400/80" />;
  };

  // Transform detailed changes into medium priority details with icons
  const mediumPriorityDetails = optimizationResult.detailed_changes?.map(change => ({
    title: change.issue,
    description: change.improvement,
    icon: getImprovementIcon(change.issue)
  })) || [];

  // Calculate total savings
  const totalHighPrioritySavings = `$${Math.round(
    (Number(optimizationResult.metrics.executionTime.improvement) +
    Number(optimizationResult.metrics.memoryUsage.improvement) +
    Number(optimizationResult.metrics.codeComplexity.improvement)) * 100
  )}/mo saved`;

  const totalMediumPrioritySavings = `$${Math.round(
    (Number(optimizationResult.improvement_percentages?.execution_time || 0) +
    Number(optimizationResult.improvement_percentages?.memory_usage || 0))
  )}/mo saved`;

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

  return (
    <Card className="bg-black/10 backdrop-blur-xl border border-white/10">
      <CardHeader>
        <CardTitle className="text-white/90 flex items-center justify-between">
          <div className="flex items-center">
            <AlertCircle className="w-4 h-4 text-amber-400/80 mr-2" />
            Optimization Details
          </div>
          <div className="text-sm text-white/70">
            Total Savings: <span className="text-emerald-400/90 font-bold">{totalHighPrioritySavings}</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* High Priority Issues */}
          <div className="grid grid-cols-2 gap-6">
            {highPriorityDetails.map((detail, index) => (
              <div key={index} className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="flex items-start space-x-3">
                  {detail.icon}
                  <div>
                    <p className="font-medium text-white/90">{detail.title}</p>
                    <p className="text-sm text-white/60">{detail.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Issues Resolved Table */}
          <div className="bg-white/5 rounded-lg border border-white/10 overflow-hidden">
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
                    <th className="text-right p-4">Savings</th>
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
                        <CheckCircle className="w-4 h-4 text-emerald-400/80 mx-auto" />
                      </td>
                      <td className="p-4 text-right text-emerald-400/90 font-medium">{issue.savings}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Medium Priority Issues */}
          <div className="bg-white/5 rounded-lg border border-white/10 p-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-orange-400/90 font-medium">Medium Priority Improvements</h4>
              <span className="text-emerald-400/90 text-sm">{totalMediumPrioritySavings}</span>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {mediumPriorityDetails.map((detail, index) => (
                <div key={index} className="bg-white/5 rounded-lg p-3 border border-white/10">
                  <div className="flex items-start space-x-3">
                    {detail.icon}
                    <div>
                      <p className="font-medium text-white/90 text-sm">{detail.title}</p>
                      <p className="text-xs text-white/60">{detail.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OptimizationDetails; 