import React from 'react';
import FlowchartVisualization from '../FlowchartVisualization';
import { AnalysisResult } from '@/api/service';

interface AnalysisViewProps {
  analysisResults: AnalysisResult;
}

const AnalysisView: React.FC<AnalysisViewProps> = ({
  analysisResults
}) => {
  return (
    <div className="h-full flex flex-col">
      <div className="bg-gray-800/30 p-3 sm:p-4 rounded-lg mb-3 sm:mb-4">
        <h3 className="text-base sm:text-lg font-medium mb-2">
          Overall Score: {analysisResults.scores.overall}
        </h3>
        <ul className="space-y-1 sm:space-y-2 overflow-auto max-h-24 sm:max-h-32 text-sm sm:text-base">
          {Object.entries(analysisResults.scores.categories).map(([key, cat]) => (
            <li key={key} className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-2">
              <span className="font-medium min-w-0 sm:min-w-[120px]">
                {key.charAt(0).toUpperCase() + key.slice(1)}:
              </span>
              <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                <span className="text-blue-400">{cat.score}</span>
                <span className="text-xs sm:text-sm text-gray-400">({cat.explanation})</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex-1 overflow-auto bg-gray-800/30 rounded-lg p-3 sm:p-4 min-h-0">
        <FlowchartVisualization workflow={analysisResults.workflow} />
      </div>
    </div>
  );
};

export default AnalysisView;