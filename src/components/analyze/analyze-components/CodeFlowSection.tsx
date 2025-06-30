import React from 'react';
import FlowchartVisualization from '../../common/FlowchartVisualization';

interface CodeFlowSectionProps {
  flowchart: any;
}

const CodeFlowSection: React.FC<CodeFlowSectionProps> = ({ flowchart }) => {
  return (
    <div className="backdrop-blur-md bg-gradient-to-br from-black/40 via-black/30 to-black/20 rounded-lg  shadow-2xl p-4">
      <h2 className="text-base font-medium text-white/90 mb-4">Code Flow Analysis</h2>
      <div className="rounded-lg h-[345px]">
        <FlowchartVisualization workflow={flowchart} />
      </div>
    </div>
  );
};

export default CodeFlowSection; 