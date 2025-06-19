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
      value: optimizationResult.execution_time?.optimized ?? 'NA',
      original: optimizationResult.execution_time?.original ?? 'NA',
      improvement: optimizationResult.improvement_percentages?.execution_time ?? 'NA'
    },
    memoryUsage: {
      value: optimizationResult.memory_usage?.optimized ?? 'NA',
      original: optimizationResult.memory_usage?.original ?? 'NA',
      improvement: optimizationResult.improvement_percentages?.memory_usage ?? 'NA'
    },
    codeComplexity: {
      value: optimizationResult.code_complexity?.optimized ?? 'NA',
      original: optimizationResult.code_complexity?.original ?? 'NA',
      improvement: optimizationResult.improvement_percentages?.code_complexity ?? 'NA'
    }
  };

  // Prepare optimization details data
  const issuesResolved = optimizationResult.detailed_changes?.map(change => ({
    priority: 'NA' as const,
    category: change.metric ?? 'NA',
    issue: change.issue ?? 'NA',
    improvement: change.improvement ?? 'NA',
    status: 'NA' as const,
    location: change.location ?? 'NA',
    costSaving: 'NA'
  })) ?? [];

  const optimizationDetailsData = {
    highPriorityDetails: optimizationResult.detailed_changes?.map(change => ({
      title: change.metric ?? 'NA',
      description: change.improvement !== 'N/A' ? (change.improvement ?? 'NA') : (change.issue ?? 'NA'),
      icon: <Activity className="w-5 h-5 text-blue-500 mt-0.5" />
    })) ?? [],
    mediumPriorityDetails: (optimizationResult.future_optimization_suggestions ?? []).map(suggestion => ({
      title: suggestion,
      description: '',
      icon: <Activity className="w-5 h-5 text-orange-400/80 mt-0.5" />
    })),
    resourceSavings: optimizationResult.resource_savings ?? 'NA'
  };

  return (
    <div className="space-y-8">

      

      <PerformanceAnalysis
        scores={optimizationResult.optimized_code_scores.scores}
        overall_score={optimizationResult.optimized_code_scores.overall_score}
      />

      <FlowchartComparison 
        originalFlowchart={optimizationResult.original_code_flowchart}
        optimizedFlowchart={optimizationResult.optimized_code_flowchart}
      />

      <CodeQualityAnalysis 
        scores={optimizationResult.optimized_code_scores}
        metricsData={metricsData}
      />

      <ROIAnalysis 
        resourceSavings={optimizationResult.resource_savings}
        improvementPercentages={optimizationResult.improvement_percentages}
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
        suggestions={optimizationResult.future_optimization_suggestions}
      />
    </div>
  );
};

export default OptimisationTabs; 