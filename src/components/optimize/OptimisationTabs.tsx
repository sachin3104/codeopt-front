import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FlowchartVisualization from '@/components/common/FlowchartVisualization';
import MetricsDashboard from '@/components/optimize/MetricsDashboard';
import DetailedChanges from '@/components/optimize/DetailedChanges';
import OptimizationImprovementSummary from '@/components/optimize/OptimizationImprovementSummary';
import { type OptimizationResult } from '@/api/service';

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

  // Prepare detailed changes data
  const detailedChanges = optimizationResult.detailed_changes?.map(change => ({
    issue: change.issue,
    improvement: change.improvement,
    location: change.location,
    metric: change.metric
  })) || [];

  return (
    <Tabs defaultValue="summary" className="w-full">
      <TabsList className="grid w-full grid-cols-4 bg-black/20 backdrop-blur-xl border border-white/10 rounded-lg p-1">
        <TabsTrigger 
          value="summary"
          className="data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=active]:shadow-sm transition-all duration-200"
        >
          Summary
        </TabsTrigger>
        <TabsTrigger 
          value="metrics"
          className="data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=active]:shadow-sm transition-all duration-200"
        >
          Metrics
        </TabsTrigger>
        <TabsTrigger 
          value="changes"
          className="data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=active]:shadow-sm transition-all duration-200"
        >
          Changes
        </TabsTrigger>
        <TabsTrigger 
          value="flowchart"
          className="data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=active]:shadow-sm transition-all duration-200"
        >
          Flowchart
        </TabsTrigger>
      </TabsList>

      <div className="mt-4">
        <TabsContent value="summary" className="mt-0">
          <OptimizationImprovementSummary 
            content={optimizationResult.improvement_summary || ''} 
          />
        </TabsContent>

        <TabsContent value="metrics" className="mt-0">
          <MetricsDashboard
            executionTime={metricsData.executionTime}
            memoryUsage={metricsData.memoryUsage}
            codeComplexity={metricsData.codeComplexity}
          />
        </TabsContent>

        <TabsContent value="changes" className="mt-0">
          <DetailedChanges changes={detailedChanges} />
        </TabsContent>

        <TabsContent value="flowchart" className="mt-0">
          <FlowchartVisualization 
            workflow={optimizationResult.optimized_code_flowchart || {}} 
          />
        </TabsContent>
      </div>
    </Tabs>
  );
};

export default OptimisationTabs; 