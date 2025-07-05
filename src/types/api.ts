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

export interface ResourceSavings {
  monthly_server_cost_savings: number
  daily_time_saved_per_execution: number
  memory_saved_per_run: number
  "Expected Annual Shavings": number
}

export interface OptimizationMetrics {
  optimized: number
  original: number
  improvement_percentage: number
}

export interface PerformanceMetrics {
  cpu_utilization: OptimizationMetrics
  execution_time: OptimizationMetrics
  io_operations: OptimizationMetrics
  memory_usage: OptimizationMetrics
}

export interface CodeQualityMetrics {
  maintainability: OptimizationMetrics
  overall_score: OptimizationMetrics
  performance_efficiency: OptimizationMetrics
  readability: OptimizationMetrics
  security_vulnerability: OptimizationMetrics
  test_coverage: OptimizationMetrics
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
  optimizable_steps: string[]
}

export interface IssuesResolved {
  category: string
  improvement: string
  issue: string
  location: string
  priority: string
  status: string
}

export interface NextSteps {
  future_optimizations: string[]
  immediate_actions: string[]
}

export interface OptimizationResult {
  code_flowcharts: {
    optimized_code_flowchart: CodeFlowchart
    original_code_flowchart: CodeFlowchart
  }
  code_quality_analysis: {
    code_quality_metrics: CodeQualityMetrics
  }
  issues_resolved: IssuesResolved[]
  next_steps: NextSteps
  optimized_code: string
  performance_analysis: {
    performance_metrics: PerformanceMetrics
  }
  resource_savings: ResourceSavings
  summary: string
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

export interface ConversionQualityMetrics {
  data_type_mapping: { status: string }
  logic_preservation: { status: string }
  manual_review: { status: string }
  syntax_conversion: { status: string }
}

export interface ConversionBenefits {
  advantages: Array<{ text: string }>
  cloud_readiness: string
  license_cost_savings: string
  memory_usage_reduction: string
  metrics_grid: Array<{ label: string; value: string }>
  processing_speed_improvement: string
}

export interface ConversionCode {
  converted: string
  original: string
}

export interface ConversionEnvironment {
  installation_commands: string
  setup_steps: Array<{
    command: string
    description: string
    step: string
  }>
  version_compatibility: string
}

export interface ConversionMetadata {
  source_language: string
  target_language: string
  timestamp: string
}

export interface ConversionNotes {
  content: string
  key_changes: string[]
  paragraphs: string[]
}

export interface ConversionQualityData {
  logic_preservation_status: string
  metrics: ConversionQualityMetrics
  success_rate: number
  syntax_conversion_status: string
}

export interface ConversionData {
  benefits: ConversionBenefits
  code: ConversionCode
  environment: ConversionEnvironment
  metadata: ConversionMetadata
  notes: ConversionNotes
  quality: ConversionQualityData
}

export interface ConversionResult {
  conversion?: ConversionData
  converted_code?: string
  original_code?: string
  source_language?: string
  target_language?: string
  conversion_notes?: string
  quality?: {
    success_rate: number
    syntax_conversion_status: string
    logic_preservation_status: string
    data_type_mapping_status: string
  }
  benefits?: {
    processing_speed_improvement: string
    memory_usage_reduction: string
    license_cost_savings: string
    cloud_readiness: string
  }
  advantages?: string[]
  environment?: {
    installation_commands: string
    version_compatibility: string
  }
  setup_steps?: Array<{
    step: string
    command: string
    description: string
  }>
  key_changes?: string[]
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
