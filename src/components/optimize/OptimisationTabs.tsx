import React from 'react';
import PerformanceAnalysis from '@/components/optimize/PerformanceAnalysis';
import ROIAnalysis from './ROIAnalysis';
import FlowchartComparison from './FlowchartComparison';
import CodeQualityAnalysis from './CodeQualityAnalysis';
import OptimizationDetails from './OptimizationDetails';
import ExecutiveSummary from './ExecutiveSummary';
import NextSteps from './NextSteps';
import { type OptimizationResult } from '@/types/api';
import { type MetricsData } from '@/types/metrics';
import { Activity } from 'lucide-react';
import IssuesResolvedTable from './IssuesResolvedTable';

interface OptimisationTabsProps {
  optimizationResult: OptimizationResult;
  originalCode: string;
}

const OptimisationTabs: React.FC<OptimisationTabsProps> = ({
  optimizationResult,
  originalCode
}) => {
  // Prepare metrics data for the dashboard
  const metricsData: MetricsData = {
    executionTime: {
      value: optimizationResult.performance_analysis?.performance_metrics?.execution_time?.optimized ?? 'NA',
      original: optimizationResult.performance_analysis?.performance_metrics?.execution_time?.original ?? 'NA',
      improvement: optimizationResult.performance_analysis?.performance_metrics?.execution_time?.improvement_percentage ?? 'NA'
    },
    memoryUsage: {
      value: optimizationResult.performance_analysis?.performance_metrics?.memory_usage?.optimized ?? 'NA',
      original: optimizationResult.performance_analysis?.performance_metrics?.memory_usage?.original ?? 'NA',
      improvement: optimizationResult.performance_analysis?.performance_metrics?.memory_usage?.improvement_percentage ?? 'NA'
    },
    codeComplexity: {
      value: optimizationResult.code_quality_analysis?.code_quality_metrics?.overall_score?.optimized ?? 'NA',
      original: optimizationResult.code_quality_analysis?.code_quality_metrics?.overall_score?.original ?? 'NA',
      improvement: optimizationResult.code_quality_analysis?.code_quality_metrics?.overall_score?.improvement_percentage ?? 'NA'
    }
  };

  // Prepare optimization details data
  const issuesResolved = optimizationResult.issues_resolved?.map(issue => ({
    priority: (issue.priority ?? 'NA') as 'High' | 'Medium' | 'NA',
    category: issue.category ?? 'NA',
    issue: issue.issue ?? 'NA',
    improvement: issue.improvement ?? 'NA',
    status: (issue.status ?? 'NA') as 'Resolved' | 'NA',
    location: issue.location ?? 'NA',
    costSaving: 'NA'
  })) ?? [];

  const optimizationDetailsData = {
    highPriorityDetails: optimizationResult.issues_resolved?.filter(issue => issue.priority === 'High').map(issue => ({
      title: issue.category ?? 'NA',
      description: issue.improvement ?? 'NA',
      icon: <Activity className="w-5 h-5 text-blue-500 mt-0.5" />
    })) ?? [],
    mediumPriorityDetails: optimizationResult.issues_resolved?.filter(issue => issue.priority === 'Medium').map(issue => ({
      title: issue.category ?? 'NA',
      description: issue.improvement ?? 'NA',
      icon: <Activity className="w-5 h-5 text-orange-400/80 mt-0.5" />
    })) ?? [],
    resourceSavings: optimizationResult.resource_savings ?? 'NA'
  };

  return (
    <div className="space-y-8">
      <PerformanceAnalysis
        scores={{
          readability: { explanation: 'NA', score: optimizationResult.code_quality_analysis?.code_quality_metrics?.readability?.optimized ?? 0 },
          maintainability: { explanation: 'NA', score: optimizationResult.code_quality_analysis?.code_quality_metrics?.maintainability?.optimized ?? 0 },
          performance_efficiency: { explanation: 'NA', score: optimizationResult.code_quality_analysis?.code_quality_metrics?.performance_efficiency?.optimized ?? 0 },
          security_vulnerability: { explanation: 'NA', score: optimizationResult.code_quality_analysis?.code_quality_metrics?.security_vulnerability?.optimized ?? 0 },
          test_coverage: { explanation: 'NA', score: optimizationResult.code_quality_analysis?.code_quality_metrics?.test_coverage?.optimized ?? 0 }
        }}
        overall_score={optimizationResult.code_quality_analysis?.code_quality_metrics?.overall_score?.optimized ?? 0}
      />

      <FlowchartComparison 
        originalFlowchart={optimizationResult.code_flowcharts?.original_code_flowchart}
        optimizedFlowchart={optimizationResult.code_flowcharts?.optimized_code_flowchart}
      />

      <CodeQualityAnalysis 
        scores={{
          overall_score: optimizationResult.code_quality_analysis?.code_quality_metrics?.overall_score?.optimized ?? 0,
          scores: {
            readability: { explanation: 'NA', score: optimizationResult.code_quality_analysis?.code_quality_metrics?.readability?.optimized ?? 0 },
            maintainability: { explanation: 'NA', score: optimizationResult.code_quality_analysis?.code_quality_metrics?.maintainability?.optimized ?? 0 },
            performance_efficiency: { explanation: 'NA', score: optimizationResult.code_quality_analysis?.code_quality_metrics?.performance_efficiency?.optimized ?? 0 },
            security_vulnerability: { explanation: 'NA', score: optimizationResult.code_quality_analysis?.code_quality_metrics?.security_vulnerability?.optimized ?? 0 },
            test_coverage: { explanation: 'NA', score: optimizationResult.code_quality_analysis?.code_quality_metrics?.test_coverage?.optimized ?? 0 }
          },
          summary: 'NA'
        }}
        metricsData={metricsData}
      />

      <ROIAnalysis 
        resourceSavings={optimizationResult.resource_savings}
        improvementPercentages={{
          code_complexity: optimizationResult.code_quality_analysis?.code_quality_metrics?.overall_score?.improvement_percentage ?? 0,
          execution_time: optimizationResult.performance_analysis?.performance_metrics?.execution_time?.improvement_percentage ?? 0,
          memory_usage: optimizationResult.performance_analysis?.performance_metrics?.memory_usage?.improvement_percentage ?? 0
        }}
      />

      <IssuesResolvedTable 
        issuesResolved={issuesResolved}
      />

      <ExecutiveSummary 
        metricsData={metricsData}
      />

      <OptimizationDetails 
        detailsData={optimizationDetailsData}
      />

      <NextSteps 
        suggestions={optimizationResult.next_steps?.future_optimizations ?? []}
      />
    </div>
  );
};

export default OptimisationTabs; 