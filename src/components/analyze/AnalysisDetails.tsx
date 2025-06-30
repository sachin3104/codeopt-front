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
    <div className="h-full flex flex-col rounded-lg border border-white/20 ">
      {analysisResult ? (
        <>
          {/* Code Quality Scores */}
          <CodeScoreSection scores={normalizedScores} />

          {/* Code Flow Visualization */}
          <CodeFlowSection flowchart={normalizedFlowchart} />
        </>
      ) : (
        <div className="flex items-center justify-center h-full">
          <div className="text-white/60 text-center">
            No analysis results available
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalysisDetails; 