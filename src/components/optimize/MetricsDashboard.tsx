
import React from 'react';
import MetricsCard from './MetricsCard';

interface MetricData {
  value: number;
  label: string;
  improvement: boolean;
}

interface MetricsDashboardProps {
  executionTime: MetricData;
  memoryUsage: MetricData;
  codeComplexity: MetricData;
}

const MetricsDashboard: React.FC<MetricsDashboardProps> = ({
  executionTime,
  memoryUsage,
  codeComplexity
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <MetricsCard 
        title="Execution Time" 
        value={executionTime.value} 
        label={executionTime.label}
        description="Time required to execute the code"
        tooltipText="Lower execution time means your code runs more efficiently, saving computational resources."
        improvement={executionTime.improvement}
      />
      <MetricsCard 
        title="Memory Usage" 
        value={memoryUsage.value} 
        label={memoryUsage.label}
        description="Memory consumed during execution"
        tooltipText="Reduced memory usage means your application requires fewer resources to run."
        color="bg-blue-500"
        improvement={memoryUsage.improvement}
      />
      <MetricsCard 
        title="Code Complexity" 
        value={codeComplexity.value} 
        label={codeComplexity.label}
        description="Cyclomatic complexity score"
        tooltipText="Lower complexity scores indicate code that is easier to understand, test, and maintain."
        color="bg-purple-500"
        improvement={codeComplexity.improvement}
      />
    </div>
  );
};

export default MetricsDashboard;
