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

  export interface ResourceSavings {
    monthly_server_cost_savings: number;
    annual_roi: number;
    daily_time_saved_per_execution: number;
    memory_saved_per_run: number;
  }

  export interface ConversionQuality {
    success_rate: number;
    syntax_conversion_status: 'complete' | 'partial' | 'incomplete';
    logic_preservation_status: 'verified' | 'not verified';
  }

  export interface EstimatedBenefits {
    processing_speed_improvement: string;
    memory_usage_reduction: string;
    license_cost_savings: string;
    cloud_readiness: string;
  }

  export interface EnvironmentSetup {
    installation_commands: string;
    version_compatibility: string;
  }

  export interface FlowchartData {
    steps: Array<{ id: string; label: string }>;
    dependencies: Array<{ from: string; to: string }>;
    optimizable_steps?: Array<{ id: string; reason: string }>;
  }

  export interface OptimizationMetrics {
    executionTime: {
      value: number;
      label: string;
      improvement: boolean;
    };
    memoryUsage: {
      value: number;
      label: string;
      improvement: boolean;
    };
    codeComplexity: {
      value: number;
      label: string;
      improvement: boolean;
    };
  }
  
  export interface OptimizationResult {
    optimizedCode: string;
    metrics: OptimizationMetrics;
    changedLines: any[];
    optimized_code_flowchart: FlowchartData | null;
    original_code_flowchart: FlowchartData | null;
    detailed_changes: DetailedChange[];
    improvement_summary: string;
    improvement_percentages: {
      execution_time: number;
      memory_usage: number;
      code_complexity: number;
    };
    resource_savings: ResourceSavings;
    future_optimization_suggestions: string[];
    optimized_code_scores: {
      scores: {
        readability: ScoreCategory;
        maintainability: ScoreCategory;
        performance_efficiency: ScoreCategory;
        security_vulnerability: ScoreCategory;
        test_coverage: ScoreCategory;
      };
      overall_score: number;
      summary: string;
    };
  }

  export interface ConversionResult {
    original_code: string;
    converted_code: string;
    source_language: string;
    target_language: string;
    conversion_notes: string;
    conversion_quality: ConversionQuality;
    estimated_benefits: EstimatedBenefits;
    environment_setup: EnvironmentSetup;
  }
  