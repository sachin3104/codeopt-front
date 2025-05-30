// src/types/api.ts

// Types for analyzeCode
export interface AnalysisCategory {
    name: string;
    hasIssues: boolean;
    issues: {
      title: string;
      location: string;
      reason: string;
      suggestion: string;
    }[];
  }
  
  export interface LanguageInfo {
    name: string;
    confidence: number;
    color: string;
  }
  
  export interface WorkflowData {
    steps?: { id: string; label: string }[];
    dependencies?: { from: string; to: string }[];
    optimizable_steps?: { id: string; reason: string }[];
  }
  
  export interface ScoreCategory {
    score: number;
    explanation: string;
  }
  
  export interface ScoreData {
    overall: number;
    categories: {
      maintainability: ScoreCategory;
      performance: ScoreCategory;
      readability: ScoreCategory;
      security: ScoreCategory;
      testCoverage: ScoreCategory;
    };
  }
  
  export interface AnalysisResult {
    categories: AnalysisCategory[];
    detectedLanguage: LanguageInfo;
    workflow?: WorkflowData;
    scores?: ScoreData;
    functionalityAnalysis?: string;
  }
  
  // Types for optimizeCode
  export interface DetailedChange {
    issue: string;
    improvement: string;
    location: string;
    metric: string;
  }
  
  export interface OptimizationResult {
    optimizedCode: string;
    metrics: {
      executionTime: { value: number; label: string; improvement: boolean };
      memoryUsage: { value: number; label: string; improvement: boolean };
      codeComplexity: { value: number; label: string; improvement: boolean };
    };
    changedLines: number[];
    optimized_code_flowchart?: WorkflowData;
    detailed_changes?: DetailedChange[];
    improvement_summary?: string;
    improvement_percentages?: {
      execution_time: number;
      memory_usage: number;
      code_complexity: number;
    };
  }
  