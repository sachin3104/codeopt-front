import React, { useState } from 'react';
import FlowchartVisualization from './FlowchartVisualization';
import MetricsDashboard from './MetricsDashboard';
import DetailedChanges from './DetailedChanges';
import OptimizationImprovementSummary from './OptimizationImprovementSummary';
import { OptimizationResult } from '@/api/service';

interface OptimizationResultTabsProps {
  results: OptimizationResult;
}

const OptimizationResultTabs: React.FC<OptimizationResultTabsProps> = ({ results }) => {
  const [activeTab, setActiveTab] = useState<'flowchart' | 'stats' | 'report'>('flowchart');

  return (
    <div className="border border-gray-800 rounded-2xl p-3 sm:p-0 lg:p-6">
      {/* Top Tabs */}
      <div className="flex border-b border-gray-700 mb-3 sm:mb-4 lg:mb-6 overflow-x-auto scrollbar-hide">
        <div className="flex min-w-full sm:min-w-0 gap-1 sm:gap-0">
          <button
            type="button"
            onClick={() => setActiveTab('flowchart')}
            className={`px-3 sm:px-4 py-2 -mb-px focus:outline-none transition-colors whitespace-nowrap text-sm sm:text-base ${
              activeTab === 'flowchart'
                ? 'border-b-2 border-indigo-400 text-white font-medium'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Flowchart
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('stats')}
            className={`px-3 sm:px-4 py-2 -mb-px focus:outline-none transition-colors whitespace-nowrap text-sm sm:text-base ${
              activeTab === 'stats'
                ? 'border-b-2 border-indigo-400 text-white font-medium'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Stats
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('report')}
            className={`px-3 sm:px-4 py-2 -mb-px focus:outline-none transition-colors whitespace-nowrap text-sm sm:text-base ${
              activeTab === 'report'
                ? 'border-b-2 border-indigo-400 text-white font-medium'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Report
          </button>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'flowchart' && (
        <div className="bg-gray-800/20 backdrop-blur-sm border border-gray-700 rounded-xl sm:rounded-2xl p-3 sm:p-0">
          <FlowchartVisualization workflow={results.optimized_code_flowchart} />
        </div>
      )}

      {activeTab === 'stats' && results.metrics && (
        <div className="bg-gray-800/20 backdrop-blur-sm border border-gray-700 rounded-xl sm:rounded-2xl p-3 sm:p-0">
          <MetricsDashboard
            executionTime={{
              value:
                results.improvement_percentages?.execution_time ||
                results.metrics.executionTime.value,
              label: 'faster',
              improvement: true,
            }}
            memoryUsage={{
              value:
                results.improvement_percentages?.memory_usage ||
                results.metrics.memoryUsage.value,
              label: 'less memory',
              improvement: true,
            }}
            codeComplexity={{
              value:
                results.improvement_percentages?.code_complexity ||
                results.metrics.codeComplexity.value,
              label: 'complexity reduction',
              improvement: true,
            }}
          />
        </div>
      )}

      {activeTab === 'report' && (
        <div className="space-y-3 sm:space-y-4">
          {results.detailed_changes && (
            <div className="bg-gray-800/20 backdrop-blur-sm border border-gray-700 rounded-xl sm:rounded-2xl p-3 sm:p-0">
              <DetailedChanges changes={results.detailed_changes} />
            </div>
          )}
          {results.improvement_summary && (
            <div className="bg-gray-800/20 backdrop-blur-sm border border-gray-700 rounded-xl sm:rounded-2xl p-3 sm:p-0">
              <OptimizationImprovementSummary content={results.improvement_summary} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OptimizationResultTabs;