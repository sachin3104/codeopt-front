import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GitCompare } from 'lucide-react';
import FlowchartVisualization from '@/components/common/FlowchartVisualization';
import { useOptimize } from '@/hooks/use-optimize';
import { type WorkflowData, type CodeFlowchart } from '@/types/api';

interface FlowchartComparisonProps {
  originalFlowchart: CodeFlowchart;
  optimizedFlowchart: CodeFlowchart;
}

const FlowchartComparison: React.FC<FlowchartComparisonProps> = ({
  originalFlowchart,
  optimizedFlowchart
}) => {
  const { result: optimizationResult } = useOptimize();

  useEffect(() => {
    console.log('=== FlowchartComparison Debug ===');
    console.log('Optimization Result:', optimizationResult);
    console.log('Optimized Code Flowchart:', optimizationResult?.optimized_code_flowchart);
    console.log('Original Code Flowchart:', optimizationResult?.original_code_flowchart);
  }, [optimizationResult]);

  if (!optimizationResult) {
    console.log('Missing optimization result');
    return null;
  }

  // Transform the workflow data to match the expected format
  const transformWorkflowData = (data: WorkflowData | null) => {
    if (!data) {
      console.log('No workflow data provided');
      return { steps: [], dependencies: [] };
    }
    
    console.log('Transforming workflow data:', data);
    
    const transformed = {
      steps: data.steps || [],
      dependencies: data.dependencies || [],
      optimizable_steps: data.optimizable_steps || []
    };
    
    console.log('Transformed workflow data:', transformed);
    return transformed;
  };

  const originalWorkflow = transformWorkflowData(optimizationResult.original_code_flowchart);
  const optimizedWorkflow = transformWorkflowData(optimizationResult.optimized_code_flowchart);

  console.log('=== Final Workflow Data ===');
  console.log('Original Workflow:', originalWorkflow);
  console.log('Optimized Workflow:', optimizedWorkflow);

  return (
    <div className="grid grid-cols-2 gap-6">
      {/* Original Code Flowchart */}
      <Card className="bg-black/10 backdrop-blur-xl border border-white/10">
        <CardHeader>
          <CardTitle className="text-white/90 flex items-center">
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
      <Card className="bg-black/10 backdrop-blur-xl border border-white/10">
        <CardHeader>
          <CardTitle className="text-white/90 flex items-center">
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