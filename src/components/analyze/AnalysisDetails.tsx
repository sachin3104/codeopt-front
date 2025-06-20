import React from 'react';
import ScoreCardDisplay from './ScoreCardDisplay';
import FlowchartVisualization from '../common/FlowchartVisualization';

interface AnalysisDetailsProps {
  analysisResult: any; // You might want to type this properly based on your data structure
}

const normalizeScores = (scores: any) => {
  if (!scores || !scores.scores) return null;
  const raw = scores.scores;
  return {
    overall: scores.overall_score || scores.overall || null,
    categories: {
      maintainability: raw.maintainability || null,
      performance: raw.performance_efficiency || raw.performance || null,
      readability: raw.readability || null,
      security: raw.security_vulnerability || raw.security || null,
      testCoverage: raw.test_coverage || raw.testCoverage || null,
    }
  };
};

const normalizeFlowchart = (data: any) => {
  if (!data) return { steps: [], dependencies: [], optimizable_steps: [] };
  return {
    steps: data.steps || [],
    dependencies: data.dependencies || [],
    optimizable_steps: data.optimizable_steps || []
  };
};

const AnalysisDetails: React.FC<AnalysisDetailsProps> = ({ analysisResult }) => {
  const normalizedScores = normalizeScores(analysisResult?.scores);
  const normalizedFlowchart = normalizeFlowchart(analysisResult?.flowchart);

  return (
    <div className="backdrop-blur-md bg-gradient-to-br from-black/40 via-black/30 to-black/20 rounded-3xl border border-white/20 shadow-2xl p-6 h-full flex flex-col">
      
      <div className="flex-1 overflow-y-auto pr-2 space-y-6">
        {analysisResult ? (
          <>
            {/* Code Quality Scores */}
            <div>
              <h2 className="text-base font-medium text-white/90 mb-4">Code Quality Analysis</h2>
              <ScoreCardDisplay scores={normalizedScores} />
            </div>

            {/* Code Flow Visualization */}
            <div>
              <h2 className="text-base font-medium text-white/90 mb-4">Code Flow Analysis</h2>
              <div className="rounded-lg h-[400px]">
                <FlowchartVisualization workflow={normalizedFlowchart} />
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-white/60 text-center">
              No analysis results available
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalysisDetails; 