
// File: src/api/services.ts
// Centralized API service with auth-protected endpoints, timeout handling, and retry logic

// Import types from shared definitions
import type { AnalysisResult, OptimizationResult, ScoreData } from '@/types/api';

// Re-export types for convenience
export type { AnalysisResult, OptimizationResult, ScoreData };

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
          console.log('Detailed analysis data:', detailedData);
          
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
        console.warn('Failed to get detailed analysis:', error);
        // Don't throw here, continue with basic analysis
      }

      // Debug logging
      console.log('Analysis response:', analysisData);
      console.log('Categories with issues:', categoriesWithIssues);

      return {
        categories: categoriesWithIssues,
        detectedLanguage: {
          name: analysisData.language || 'unknown',
          confidence: 1.0,
          color: analysisData.language === 'r' ? '#1984c8' : '#ccc',
        },
        workflow: {
          steps: analysisData.flowchart?.steps || [],
          dependencies: analysisData.flowchart?.dependencies || [],
          optimizable_steps: analysisData.flowchart?.optimizable_steps || [],
        },
        scores: {
          overall: analysisData.scores?.overall_score || 0,
          categories: {
            maintainability: {
              score: analysisData.scores?.scores?.maintainability?.score || 0,
              explanation: analysisData.scores?.scores?.maintainability?.explanation || 'No data available',
            },
            performance: {
              score: analysisData.scores?.scores?.performance_efficiency?.score || 0,
              explanation: analysisData.scores?.scores?.performance_efficiency?.explanation || 'No data available',
            },
            readability: {
              score: analysisData.scores?.scores?.readability?.score || 0,
              explanation: analysisData.scores?.scores?.readability?.explanation || 'No data available',
            },
            security: {
              score: analysisData.scores?.scores?.security_vulnerability?.score || 0,
              explanation: analysisData.scores?.scores?.security_vulnerability?.explanation || 'No data available',
            },
            testCoverage: {
              score: analysisData.scores?.scores?.test_coverage?.score || 0,
              explanation: analysisData.scores?.scores?.test_coverage?.explanation || 'No data available',
            },
          },
        },
        functionalityAnalysis: analysisData.functionality_analysis || null,
      };
    } catch (error) {
      console.error('Analysis API Error:', error);
      throw error;
    }
  }, 0, 'Code analysis');
};

/**
 * Optimize code using the backend service - Enhanced with timeout and retry
 */
export const optimizeCode = async (code: string): Promise<OptimizationResult> => {
  return withRetry(async () => {
    // Use longer timeout for optimization as it's a heavy operation
    const response = await fetchWithTimeout(`${BACKEND_URL}/api/optimize`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    }, API_CONFIG.timeout); // Full 5-minute timeout

    await handleApiError(response);
    const data = await response.json();
    
    return {
      optimizedCode: data.optimized_code,
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
      changedLines: data.changed_lines ?? [],
      optimized_code_flowchart: data.optimized_code_flowchart || null,
      detailed_changes: data.detailed_changes ?? [],
      improvement_summary: data.improvement_summary ?? '',
      improvement_percentages: data.improvement_percentages || {},
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
    }, API_CONFIG.timeout); // Documentation can also take time
    
    await handleApiError(response);
    const data = await response.json();
    
    return {
      original_code: data.original_code || code,
      documented_code: data.documented_code || '',
    };
  }, 0, 'Code documentation');
};

/**
 * Convert code between languages - Enhanced
 */
export const convertCode = async (
  code: string,
  sourceLanguage: string,
  targetLanguage: string
): Promise<{ 
  original_code: string; 
  converted_code: string; 
  source_language: string; 
  target_language: string; 
  conversion_notes: string 
}> => {
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
    }, API_CONFIG.timeout); // Conversion can take time for complex code

    await handleApiError(response);
    const data = await response.json();
    
    return {
      original_code: data.original_code || code,
      converted_code: data.converted_code || '',
      source_language: data.source_language || sourceLanguage,
      target_language: data.target_language || targetLanguage,
      conversion_notes: data.conversion_notes || '',
    };
  }, 0, 'Code conversion');
};

// Helper function to check if backend is reachable
export const healthCheck = async (): Promise<boolean> => {
  try {
    const response = await fetchWithTimeout(`${BACKEND_URL}/health`, {
      method: 'GET',
      credentials: 'include',
    }, 5000); // 5 second timeout for health check
    
    return response.ok;
  } catch (error) {
    console.error('Backend health check failed:', error);
    return false;
  }
};

// Export configuration for use in components if needed
export { API_CONFIG };