import React from 'react';
import FlowchartVisualization from '../../common/FlowchartVisualization';

interface CodeFlowSectionProps {
  flowchart: any;
}

const CodeFlowSection: React.FC<CodeFlowSectionProps> = ({ flowchart }) => {
  return (
    <div className="backdrop-blur-md bg-gradient-to-br from-black/40 via-black/30 to-black/20 rounded-lg sm:rounded-xl md:rounded-2xl shadow-2xl p-3 xs:p-4 sm:p-4 md:p-6">
      <h2 className="text-sm xs:text-base sm:text-lg font-medium text-white/90 mb-3 xs:mb-4 sm:mb-4">Code Flow Analysis</h2>
      <div className="rounded-lg h-[250px] xs:h-[300px] sm:h-[345px] md:h-[400px] lg:h-[450px]">
        <FlowchartVisualization workflow={flowchart} />
      </div>
    </div>
  );
};

export default CodeFlowSection; 