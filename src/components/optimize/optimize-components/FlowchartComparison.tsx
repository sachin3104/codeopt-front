import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GitCompare } from 'lucide-react';
import FlowchartVisualization from '@/components/common/FlowchartVisualization';
import { useOptimize } from '@/hooks/use-optimize';
import { type WorkflowData, type CodeFlowchart } from '@/types/api';

const FlowchartComparison: React.FC = () => {
  const { result: optimizationResult } = useOptimize();

  useEffect(() => {
    console.log('=== FlowchartComparison Debug ===');
    console.log('Optimization Result:', optimizationResult);
    console.log('Optimized Code Flowchart:', optimizationResult?.code_flowcharts?.optimized_code_flowchart);
    console.log('Original Code Flowchart:', optimizationResult?.code_flowcharts?.original_code_flowchart);
  }, [optimizationResult]);

  if (!optimizationResult) {
    console.log('Missing optimization result');
    return null;
  }

  // Get flowchart data from the optimization result
  const originalFlowchart = optimizationResult.code_flowcharts?.original_code_flowchart;
  const optimizedFlowchart = optimizationResult.code_flowcharts?.optimized_code_flowchart;

  // Transform the workflow data to match the expected format
  const transformWorkflowData = (data: CodeFlowchart | undefined) => {
    if (!data) {
      console.log('No workflow data provided');
      return { steps: [], dependencies: [], optimizable_steps: [] };
    }
    
    console.log('Transforming workflow data:', data);
    
    // Transform optimizable_steps from string array to object array
    const transformedOptimizableSteps = (data.optimizable_steps || []).map(stepId => ({
      id: stepId,
      reason: 'Optimization opportunity identified'
    }));
    
    const transformed = {
      steps: data.steps || [],
      dependencies: data.dependencies || [],
      optimizable_steps: transformedOptimizableSteps
    };
    
    console.log('Transformed workflow data:', transformed);
    return transformed;
  };

  const originalWorkflow = transformWorkflowData(originalFlowchart);
  const optimizedWorkflow = transformWorkflowData(optimizedFlowchart);

  console.log('=== Final Workflow Data ===');
  console.log('Original Workflow:', originalWorkflow);
  console.log('Optimized Workflow:', optimizedWorkflow);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Original Code Flowchart */}
      <Card className="bg-black/10 backdrop-blur-xl border border-white/10 min-h-[340px]">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-white/90 flex items-center">
            <GitCompare className="w-4 h-4 text-blue-400/80 mr-2" />
            Original Code Flow
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="h-[500px]">
            <FlowchartVisualization workflow={originalWorkflow} />
          </div>
        </CardContent>
      </Card>

      {/* Optimized Code Flowchart */}
      <Card className="bg-black/10 backdrop-blur-xl border border-white/10 min-h-[340px]">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-white/90 flex items-center">
            <GitCompare className="w-4 h-4 text-emerald-400/80 mr-2" />
            Optimized Code Flow
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="h-[500px]">
            <FlowchartVisualization workflow={optimizedWorkflow} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FlowchartComparison; 