// src/types/api.ts

// Raw response from /api/analysis_result
export interface AnalysisResponse {
  status: 'success' | 'error'
  language: string
  analysis: Record<
    string,
    {
      name: string
      issues: Array<{
        title: string
        location: string
        reason: string
        suggestion: string
      }>
    }
  >
  flowchart: WorkflowData
  scores: ScoreData
  functionality_analysis: string
}

// Types for optimizeCode
export interface DetailedChange {
  improvement: string
  issue: string
  location: string
  metric: string
}

export interface ResourceSavings {
  monthly_server_cost_savings: number
  annual_roi: number
  daily_time_saved_per_execution: number
  memory_saved_per_run: number
}

export interface OptimizationMetrics {
  optimized: number
  original: number
}

export interface ImprovementPercentages {
  code_complexity: number
  execution_time: number
  memory_usage: number
}

export interface CodeScores {
  maintainability: { explanation: string; score: number }
  performance_efficiency: { explanation: string; score: number }
  readability: { explanation: string; score: number }
  security_vulnerability: { explanation: string; score: number }
  test_coverage: { explanation: string; score: number }
}

export interface OptimizedCodeScores {
  overall_score: number
  scores: CodeScores
  summary: string
}

export interface FlowchartStep {
  id: string
  label: string
}

export interface FlowchartDependency {
  from: string
  to: string
}

export interface CodeFlowchart {
  steps: FlowchartStep[]
  dependencies: FlowchartDependency[]
}

export interface OptimizationResult {
  status: string
  code_complexity: OptimizationMetrics
  detailed_changes: DetailedChange[]
  execution_time: OptimizationMetrics
  future_optimization_suggestions: string[]
  improvement_percentages: ImprovementPercentages
  improvement_summary: string
  language: string
  memory_usage: OptimizationMetrics
  metrics_improved: string[]
  optimized_code: string
  optimized_code_flowchart: CodeFlowchart
  optimized_code_scores: OptimizedCodeScores
  original_code: string
  original_code_flowchart: CodeFlowchart
  resource_savings: ResourceSavings
}

// Types for documentCode
export interface DocumentResult {
  original_code: string
  documented_code: string
}

// Types for convertCode
export interface ConversionQuality {
  success_rate: number
  syntax_conversion_status: 'complete' | 'partial' | 'incomplete'
  logic_preservation_status: 'verified' | 'not verified'
}

export interface EstimatedBenefits {
  processing_speed_improvement: string
  memory_usage_reduction: string
  license_cost_savings: string
  cloud_readiness: string
}

export interface EnvironmentSetup {
  installation_commands: string
  version_compatibility: string
}

export interface ConversionResult {
  original_code: string
  converted_code: string
  source_language: string
  target_language: string
  conversion_notes: string
  conversion_quality: ConversionQuality
  estimated_benefits: EstimatedBenefits
  environment_setup: EnvironmentSetup
}

// Shared helpers

export interface WorkflowData {
  steps?: { id: string; label: string }[]
  dependencies?: { from: string; to: string }[]
  optimizable_steps?: { id: string; reason: string }[]
}

export interface ScoreCategory {
  score: number
  explanation: string
}

export interface ScoreData {
  overall: number
  categories: {
    maintainability: ScoreCategory
    performance: ScoreCategory
    readability: ScoreCategory
    security: ScoreCategory
    testCoverage: ScoreCategory
  }
}
