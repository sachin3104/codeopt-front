import React from 'react';
import ScoreCardDisplay from './ScoreCardDisplay';
import FlowchartVisualization from '../FlowchartVisualization';

interface AnalysisDetailsProps {
  analysisResult: any; // You might want to type this properly based on your data structure
}

const AnalysisDetails: React.FC<AnalysisDetailsProps> = ({ analysisResult }) => {
  return (
    <div className="backdrop-blur-md bg-gradient-to-br from-black/40 via-black/30 to-black/20 rounded-3xl border border-white/20 shadow-2xl p-6 h-full flex flex-col">
      <h2 className="text-lg font-semibold text-white/90 mb-4">Analysis Details</h2>
      <div className="flex-1 overflow-y-auto pr-2 space-y-6">
        {analysisResult ? (
          <>
            {/* Code Quality Scores */}
            <div>
              <h3 className="text-base font-medium text-white/90 mb-4">Code Quality Analysis</h3>
              <ScoreCardDisplay scores={analysisResult.scores} />
            </div>

            {/* Code Flow Visualization */}
            <div>
              <h3 className="text-base font-medium text-white/90 mb-4">Code Flow Analysis</h3>
              <div className="rounded-lg">
                <FlowchartVisualization workflow={analysisResult.workflow} />
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