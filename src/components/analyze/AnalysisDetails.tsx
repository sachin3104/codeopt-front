import React from 'react';
import { CodeScoreSection, CodeFlowSection } from './analyze-components';

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
    <div className="h-full flex flex-col rounded-lg sm:rounded-xl md:rounded-2xl border border-white/20 space-y-3 xs:space-y-4 sm:space-y-4 md:space-y-6 lg:space-y-6">
      {analysisResult ? (
        <>
          {/* Code Quality Scores */}
          <div className="flex-1 min-h-0">
            <CodeScoreSection scores={normalizedScores} />
          </div>

          {/* Code Flow Visualization */}
          <div className="flex-1 min-h-0">
            <CodeFlowSection flowchart={normalizedFlowchart} />
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center h-full p-4 sm:p-6 md:p-8">
          <div className="text-white/60 text-center text-sm xs:text-base sm:text-lg">
            No analysis results available
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalysisDetails; 