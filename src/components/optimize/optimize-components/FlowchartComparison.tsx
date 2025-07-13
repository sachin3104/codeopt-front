import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GitCompare } from 'lucide-react';
import FlowchartVisualization from '@/components/common/FlowchartVisualization';
import { useOptimize } from '@/hooks/use-optimize';
import { type WorkflowData, type CodeFlowchart } from '@/types/api';

const FlowchartComparison: React.FC = () => {
  const { result: optimizationResult } = useOptimize();
  const [activeTab, setActiveTab] = useState<'original' | 'optimized'>('optimized');

  if (!optimizationResult) {
    return null;
  }

  // Get flowchart data from the optimization result
  const originalFlowchart = optimizationResult.code_flowcharts?.original_code_flowchart;
  const optimizedFlowchart = optimizationResult.code_flowcharts?.optimized_code_flowchart;

  // Transform the workflow data to match the expected format
  const transformWorkflowData = (data: CodeFlowchart | undefined) => {
    if (!data) {
      return { steps: [], dependencies: [], optimizable_steps: [] };
    }
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
    return transformed;
  };

  const originalWorkflow = transformWorkflowData(originalFlowchart);
  const optimizedWorkflow = transformWorkflowData(optimizedFlowchart);

  return (
    <>
      {/* Mobile view with tabs (hidden on lg and above) */}
      <div className="lg:hidden">
        <Card className="bg-black/10 backdrop-blur-xl border border-white/10 min-h-[280px] xs:min-h-[320px] sm:min-h-[340px] md:min-h-[400px]">
          <CardHeader className="p-3 xs:p-4 sm:p-4 md:p-6">
            <CardTitle className="text-base xs:text-lg sm:text-xl font-semibold text-white/90 flex items-center mb-4">
              <GitCompare className="w-3 h-3 xs:w-4 xs:h-4 text-blue-400/80 mr-2" />
              Code Flow Comparison
            </CardTitle>
            
            {/* Tabs for mobile */}
            <div className="flex space-x-1 bg-white/5 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('original')}
                className={`flex-1 py-2 px-3 rounded-md text-xs xs:text-sm font-medium transition-colors ${
                  activeTab === 'original'
                    ? 'bg-blue-500 text-white'
                    : 'text-white/70 hover:text-white/90'
                }`}
              >
                Original Flow
              </button>
              <button
                onClick={() => setActiveTab('optimized')}
                className={`flex-1 py-2 px-3 rounded-md text-xs xs:text-sm font-medium transition-colors ${
                  activeTab === 'optimized'
                    ? 'bg-emerald-500 text-white'
                    : 'text-white/70 hover:text-white/90'
                }`}
              >
                Optimized Flow
              </button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-[300px] xs:h-[350px] sm:h-[400px] md:h-[450px]">
              {activeTab === 'original' ? (
                <FlowchartVisualization 
                  key="original-flowchart"
                  workflow={originalWorkflow} 
                />
              ) : (
                <FlowchartVisualization 
                  key="optimized-flowchart"
                  workflow={optimizedWorkflow} 
                />
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Desktop/Tablet view with side-by-side layout (hidden below lg) */}
      <div className="hidden lg:grid lg:grid-cols-2 gap-3 xs:gap-4 sm:gap-4 md:gap-6 lg:gap-6">
        {/* Original Code Flowchart */}
        <Card className="bg-black/10 backdrop-blur-xl border border-white/10 min-h-[280px] xs:min-h-[320px] sm:min-h-[340px] md:min-h-[400px]">
          <CardHeader className="p-3 xs:p-4 sm:p-4 md:p-6">
            <CardTitle className="text-base xs:text-lg sm:text-xl font-semibold text-white/90 flex items-center">
              <GitCompare className="w-3 h-3 xs:w-4 xs:h-4 text-blue-400/80 mr-2" />
              Original Code Flow
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-[300px] xs:h-[350px] sm:h-[400px] md:h-[450px] lg:h-[500px]">
              <FlowchartVisualization 
                key="original-flowchart-desktop"
                workflow={originalWorkflow} 
              />
            </div>
          </CardContent>
        </Card>

        {/* Optimized Code Flowchart */}
        <Card className="bg-black/10 backdrop-blur-xl border border-white/10 min-h-[280px] xs:min-h-[320px] sm:min-h-[340px] md:min-h-[400px]">
          <CardHeader className="p-3 xs:p-4 sm:p-4 md:p-6">
            <CardTitle className="text-base xs:text-lg sm:text-xl font-semibold text-white/90 flex items-center">
              <GitCompare className="w-3 h-3 xs:w-4 xs:h-4 text-emerald-400/80 mr-2" />
              Optimized Code Flow
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-[300px] xs:h-[350px] sm:h-[400px] md:h-[450px] lg:h-[500px]">
              <FlowchartVisualization 
                key="optimized-flowchart-desktop"
                workflow={optimizedWorkflow} 
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default FlowchartComparison; 