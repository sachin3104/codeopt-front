// File: src/api/services.ts
// Centralized API service with auth-protected endpoints, timeout handling, and enhanced response mapping

import {
  ResourceSavings,
  ConversionQuality,
  EstimatedBenefits,
  EnvironmentSetup,
  FlowchartData,
  ScoreCategory,
  ScoreData,
  DetailedChange,
  AnalysisCategory,
  AnalysisResult,
  OptimizationMetrics,
  OptimizationResult,
  ConversionResult
} from '../types/api';

// Backend URL from Vite env
const BACKEND_URL = import.meta.env.VITE_API_URL as string;

// API Configuration
const API_CONFIG = {
  timeout: 600000, // 10 minutes for all operations
  retries: 0, // No retries
  retryDelay: 0, // No delay needed
  shortTimeout: 180000, // 3 minutes for all operations
};

// Enhanced error handler with better error messages
const handleApiError = async (response: Response) => {
  if (response.status === 401) {
    console.error('Authentication required. Please log in.');
    throw new Error('Authentication required. Please log in.');
  }
  
  if (response.status === 504) {
    throw new Error('Server timeout. The operation is taking longer than expected. Please try again.');
  }
  
  if (response.status === 503) {
    throw new Error('Service temporarily unavailable. Please try again in a few moments.');
  }
  
  if (response.status === 429) {
    throw new Error('Too many requests. Please wait a moment before trying again.');
  }
  
  if (!response.ok) {
    let errorMessage = `API Error ${response.status}: ${response.statusText}`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.error || errorMessage;
    } catch {
      // If response is not JSON, use default message
      if (response.status >= 500) {
        errorMessage = 'Server error occurred. Please try again later.';
      } else if (response.status >= 400) {
        errorMessage = 'Request error. Please check your input and try again.';
      }
    }
    throw new Error(errorMessage);
  }
};

// Enhanced fetch with timeout and abort controller
const fetchWithTimeout = async (
  url: string, 
  options: RequestInit, 
  timeout = API_CONFIG.timeout
): Promise<Response> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error(`Request timed out after ${timeout / 1000} seconds. Please try again.`);
      }
      
      // Handle network errors
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        throw new Error('Network error. Please check your connection and try again.');
      }
    }
    
    throw error;
  }
};

// Simplified wrapper without retry logic
const withRetry = async <T>(
  operation: () => Promise<T>,
  maxRetries = API_CONFIG.retries,
  operationName = 'API call'
): Promise<T> => {
  try {
    return await operation();
  } catch (error) {
    console.error(`${operationName} failed:`, error);
    throw error;
  }
};

/**
 * Analyze code using the backend service
 */
export const analyzeCode = async (code: string): Promise<AnalysisResult> => {
  return withRetry(async () => {
    try {
      // First try the comprehensive analysis endpoint with longer timeout
      const analysisResponse = await fetchWithTimeout(`${BACKEND_URL}/api/analysis_result`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      }, API_CONFIG.timeout);

      await handleApiError(analysisResponse);
      const analysisData = await analysisResponse.json();
      
      console.log('Analysis Response Data:', analysisData);
      console.log('Analysis Workflow Data:', analysisData.workflow);
      
      // Get detailed analysis with issues from the separate analyze endpoint
      let categoriesWithIssues: any[] = [];
      try {
        const detailedResponse = await fetchWithTimeout(`${BACKEND_URL}/api/analyze`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code }),
        }, API_CONFIG.timeout);

        if (detailedResponse.ok) {
          const detailedData = await detailedResponse.json();
          console.log('Detailed Analysis Data:', detailedData);
          
          // Transform the detailed analysis data
          if (detailedData.analysis) {
            categoriesWithIssues = Object.entries(detailedData.analysis).map(([key, value]: [string, any]) => ({
              name: value.name || key,
              hasIssues: Array.isArray(value.issues) && value.issues.length > 0,
              issues: value.issues || []
            }));
          }
        }
      } catch (error) {
        console.error('Error fetching detailed analysis:', error);
      }

      return {
        categories: categoriesWithIssues,
        detectedLanguage: analysisData.detected_language || { name: 'Unknown', confidence: 0, color: '#000000' },
        workflow: analysisData.workflow || null,
        scores: analysisData.scores || null,
        functionalityAnalysis: analysisData.functionality_analysis || null,
      };
    } catch (error) {
      console.error('Error in analyzeCode:', error);
      throw error;
    }
  }, 0, 'Code analysis');
};

/**
 * Optimize code using the backend service - Enhanced with all new backend data
 */
export const optimizeCode = async (code: string): Promise<OptimizationResult> => {
  return withRetry(async () => {
    // Use longer timeout for optimization as it's a heavy operation
    const response = await fetchWithTimeout(`${BACKEND_URL}/api/optimize`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    }, API_CONFIG.timeout);

    await handleApiError(response);
    const data = await response.json();
    
    console.log('Optimization Response Data:', data);
    console.log('Optimized Code Flowchart:', data.optimized_code_flowchart);
    console.log('Original Code Flowchart:', data.original_code_flowchart);
    
    // Extract resource savings with proper fallbacks
    const resourceSavings: ResourceSavings = {
      monthly_server_cost_savings: data.resource_savings?.monthly_server_cost_savings || 0,
      annual_roi: data.resource_savings?.annual_roi || 0,
      daily_time_saved_per_execution: data.resource_savings?.daily_time_saved_per_execution || 0,
      memory_saved_per_run: data.resource_savings?.memory_saved_per_run || 0,
    };

    // Extract optimized code scores with proper fallbacks
    const optimizedCodeScores = {
      scores: {
        readability: {
          score: data.optimized_code_scores?.scores?.readability?.score || 0,
          explanation: data.optimized_code_scores?.scores?.readability?.explanation || 'No data available',
        },
        maintainability: {
          score: data.optimized_code_scores?.scores?.maintainability?.score || 0,
          explanation: data.optimized_code_scores?.scores?.maintainability?.explanation || 'No data available',
        },
        performance_efficiency: {
          score: data.optimized_code_scores?.scores?.performance_efficiency?.score || 0,
          explanation: data.optimized_code_scores?.scores?.performance_efficiency?.explanation || 'No data available',
        },
        security_vulnerability: {
          score: data.optimized_code_scores?.scores?.security_vulnerability?.score || 0,
          explanation: data.optimized_code_scores?.scores?.security_vulnerability?.explanation || 'No data available',
        },
        test_coverage: {
          score: data.optimized_code_scores?.scores?.test_coverage?.score || 0,
          explanation: data.optimized_code_scores?.scores?.test_coverage?.explanation || 'No data available',
        },
      },
      overall_score: data.optimized_code_scores?.overall_score || 0,
      summary: data.optimized_code_scores?.summary || 'No summary available',
    };
    
    return {
      optimizedCode: data.optimized_code || '',
      metrics: {
        executionTime: {
          value: data.improvement_percentages?.execution_time || 0,
          label: '% faster',
          improvement: (data.improvement_percentages?.execution_time || 0) > 0,
        },
        memoryUsage: {
          value: data.improvement_percentages?.memory_usage || 0,
          label: '% reduction',  
          improvement: (data.improvement_percentages?.memory_usage || 0) > 0,
        },
        codeComplexity: {
          value: data.improvement_percentages?.code_complexity || 0,
          label: '% simpler',
          improvement: (data.improvement_percentages?.code_complexity || 0) > 0,
        },
      },
      changedLines: data.changed_lines || [],
      optimized_code_flowchart: data.optimized_code_flowchart || null,
      original_code_flowchart: data.original_code_flowchart || null,
      detailed_changes: data.detailed_changes || [],
      improvement_summary: data.improvement_summary || '',
      improvement_percentages: data.improvement_percentages || {
        execution_time: 0,
        memory_usage: 0,
        code_complexity: 0,
      },
      resource_savings: resourceSavings,
      future_optimization_suggestions: data.future_optimization_suggestions || [],
      optimized_code_scores: optimizedCodeScores,
    };
  }, 0, 'Code optimization');
};

/**
 * Generate documentation for code - Enhanced
 */
export const documentCode = async (
  code: string
): Promise<{ original_code: string; documented_code: string }> => {
  return withRetry(async () => {
    const response = await fetchWithTimeout(`${BACKEND_URL}/api/document`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    }, API_CONFIG.timeout);
    
    await handleApiError(response);
    const data = await response.json();
    
    return {
      original_code: data.original_code || code,
      documented_code: data.documented_code || '',
    };
  }, 0, 'Code documentation');
};

/**
 * Convert code between languages - Enhanced with all new conversion data
 */
export const convertCode = async (
  code: string,
  sourceLanguage: string,
  targetLanguage: string
): Promise<ConversionResult> => {
  return withRetry(async () => {
    const response = await fetchWithTimeout(`${BACKEND_URL}/api/convert`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        code, 
        source_language: sourceLanguage, 
        target_language: targetLanguage 
      }),
    }, API_CONFIG.timeout);

    await handleApiError(response);
    const data = await response.json();
    
    console.log('Conversion response data:', data); // Debug logging
    
    // Extract conversion quality with proper fallbacks
    const conversionQuality: ConversionQuality = {
      success_rate: data.conversion_quality?.success_rate || 0,
      syntax_conversion_status: data.conversion_quality?.syntax_conversion_status || 'incomplete',
      logic_preservation_status: data.conversion_quality?.logic_preservation_status || 'not verified',
    };

    // Extract estimated benefits with proper fallbacks
    const estimatedBenefits: EstimatedBenefits = {
      processing_speed_improvement: data.estimated_benefits?.processing_speed_improvement || '0%',
      memory_usage_reduction: data.estimated_benefits?.memory_usage_reduction || '0%',
      license_cost_savings: data.estimated_benefits?.license_cost_savings || '$0',
      cloud_readiness: data.estimated_benefits?.cloud_readiness || '0%',
    };

    // Extract environment setup with proper fallbacks
    const environmentSetup: EnvironmentSetup = {
      installation_commands: data.environment_setup?.installation_commands || '',
      version_compatibility: data.environment_setup?.version_compatibility || '',
    };
    
    return {
      original_code: data.original_code || code,
      converted_code: data.converted_code || '',
      source_language: data.source_language || sourceLanguage,
      target_language: data.target_language || targetLanguage,
      conversion_notes: data.conversion_notes || '',
      conversion_quality: conversionQuality,
      estimated_benefits: estimatedBenefits,
      environment_setup: environmentSetup,
    };
  }, 0, 'Code conversion');
};

// Helper function to check if backend is reachable
export const healthCheck = async (): Promise<boolean> => {
  try {
    const response = await fetchWithTimeout(`${BACKEND_URL}/health`, {
      method: 'GET',
      credentials: 'include',
    }, 5000);
    
    return response.ok;
  } catch (error) {
    console.error('Backend health check failed:', error);
    return false;
  }
};

// Export configuration for use in components if needed
export { API_CONFIG };