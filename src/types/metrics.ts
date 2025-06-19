export interface MetricsData {
  executionTime: {
    value: number | string;
    original: number | string;
    improvement: number | string;
  };
  memoryUsage: {
    value: number | string;
    original: number | string;
    improvement: number | string;
  };
  codeComplexity: {
    value: number | string;
    original: number | string;
    improvement: number | string;
  };
} 