import React from 'react';
import FlowchartVisualization from '@/components/common/FlowchartVisualization';
import OptimizationImprovementSummary from '@/components/optimize/OptimizationImprovementSummary';
import PerformanceAnalysis from '@/components/optimize/PerformanceAnalysis';
import ROIAnalysis from './ROIAnalysis';
import FlowchartComparison from './FlowchartComparison';
import CodeQualityAnalysis from './CodeQualityAnalysis';
import OptimizationDetails from './OptimizationDetails';
import ExecutiveSummary from './ExecutiveSummary';
import NextSteps from './NextSteps';
import { type OptimizationResult } from '@/types/api';
import { MemoryStick, Activity, Zap, Cpu, HardDrive, Database, TrendingUp } from 'lucide-react';

interface OptimisationTabsProps {
  optimizationResult: OptimizationResult;
  originalCode: string;
}

const OptimisationTabs: React.FC<OptimisationTabsProps> = ({
  optimizationResult,
  originalCode
}) => {
  // Prepare metrics data for the dashboard
  const metricsData = {
    executionTime: {
      value: optimizationResult.metrics.executionTime.value,
      label: optimizationResult.metrics.executionTime.label,
      improvement: optimizationResult.metrics.executionTime.improvement
    },
    memoryUsage: {
      value: optimizationResult.metrics.memoryUsage.value,
      label: optimizationResult.metrics.memoryUsage.label,
      improvement: optimizationResult.metrics.memoryUsage.improvement
    },
    codeComplexity: {
      value: optimizationResult.metrics.codeComplexity.value,
      label: optimizationResult.metrics.codeComplexity.label,
      improvement: optimizationResult.metrics.codeComplexity.improvement
    }
  };

  // Sample data for OptimizationDetails
  const optimizationDetailsData = {
    issuesResolved: [
      {
        priority: 'High' as const,
        category: 'Memory Usage',
        issue: 'Optimized dataset operations',
        status: 'Resolved' as const,
        savings: '$50/mo'
      },
      {
        priority: 'High' as const,
        category: 'Data Throughput',
        issue: 'Implemented parallel processing',
        status: 'Resolved' as const,
        savings: '$40/mo'
      },
      {
        priority: 'High' as const,
        category: 'Query Optimization',
        issue: 'Added indexes to key columns',
        status: 'Resolved' as const,
        savings: '$30/mo'
      },
      {
        priority: 'Medium' as const,
        category: 'CPU Utilization',
        issue: 'Optimized loop structures',
        status: 'Resolved' as const,
        savings: '$30/mo'
      }
    ],
    highPriorityDetails: [
      {
        title: 'Memory Usage',
        description: 'Reduced from 120MB to 90MB',
        icon: <MemoryStick className="w-5 h-5 text-red-500 mt-0.5" />
      },
      {
        title: 'Data Throughput',
        description: '40% faster processing',
        icon: <HardDrive className="w-5 h-5 text-orange-500 mt-0.5" />
      },
      {
        title: 'Query Optimization',
        description: 'Added indexes and optimized joins',
        icon: <Database className="w-5 h-5 text-yellow-500 mt-0.5" />
      },
      {
        title: 'SQL Optimization',
        description: 'Replaced data steps with PROC SQL',
        icon: <Database className="w-5 h-5 text-yellow-500 mt-0.5" />
      },
      {
        title: 'Scalability',
        description: 'Now handles 10x larger datasets',
        icon: <TrendingUp className="w-5 h-5 text-red-500 mt-0.5" />
      }
    ],
    mediumPriorityDetails: [
      'CPU Utilization optimized',
      'Data Step Efficiency improved',
      'I/O Operations reduced',
      'WHERE vs IF optimized',
      'Error Handling added',
      'Macro Efficiency improved',
      'Proc Efficiency enhanced',
      'Reporting Latency reduced',
      'SAS Memory optimized'
    ],
    totalHighPrioritySavings: '$120/mo saved',
    totalMediumPrioritySavings: '$80/mo saved'
  };

  return (
    <div className="space-y-8">
      <PerformanceAnalysis
        scores={optimizationResult.optimized_code_scores.scores}
        overall_score={optimizationResult.optimized_code_scores.overall_score}
      />

      <CodeQualityAnalysis />

      <ROIAnalysis />

      <FlowchartComparison />

      <ExecutiveSummary />
      <OptimizationDetails />


      <NextSteps />
    </div>
  );
};

export default OptimisationTabs; 