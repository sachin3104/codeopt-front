// src/api/service.ts
import api from './client'
import type {
  AnalysisResponse,
  OptimizationResult,
  DocumentResult,
  ConversionResult
} from '../types/api'



export interface DetectLanguageResponse {
  status: 'success' | 'error'
  language: string
  message: string
}



// Analyze code
export const analyzeCode = async (
  code: string
): Promise<AnalysisResponse> => {
  if (!code) {
    throw new Error('No code provided for analysis')
  }
  try {
    const { data } = await api.post<AnalysisResponse>(
      '/api/analysis_result',
      { code }
    )
    return data
  } catch (err: any) {
    const message = err.response?.data?.message || err.message
    throw new Error(message)
  }
}

// Optimize code
export const optimizeCode = async (
  code: string
): Promise<OptimizationResult> => {
  if (!code) {
    throw new Error('No code provided for optimization')
  }

  try {
    const { data } = await api.post<OptimizationResult>('/api/optimize', { code })
    return data
  } catch (err: any) {
    const message = err.response?.data?.message || err.message
    throw new Error(message)
  }
}

// Document code
export const documentCode = async (
  code: string
): Promise<DocumentResult> => {
  if (!code) {
    throw new Error('No code provided for documentation')
  }

  try {
    const { data } = await api.post<DocumentResult>('/api/document', { code })
    return data
  } catch (err: any) {
    const message = err.response?.data?.message || err.message
    throw new Error(message)
  }
}

// Convert code 
export const convertCode = async (
  code: string,
  sourceLanguage: string,
  targetLanguage: string
): Promise<ConversionResult> => {
  if (!code) {
    throw new Error('No code provided for conversion')
  }
  if (!sourceLanguage) {
    throw new Error('Source language must be specified')
  }
  if (!targetLanguage) {
    throw new Error('Target language must be specified')
  }

  try {
    const { data } = await api.post<ConversionResult>('/api/convert', {
      code,
      source_language: sourceLanguage,
      target_language: targetLanguage
    })
    return data
  } catch (err: any) {
    const message = err.response?.data?.message || err.message
    throw new Error(message)
  }
}


export const detectLanguage = async (
  code: string
): Promise<DetectLanguageResponse> => {
  if (!code) {
    throw new Error('No code provided for language detection')
  }

  try {
    const { data } = await api.post<DetectLanguageResponse>(
      '/api/detect-language',
      { code }
    )
    return data
  } catch (err: any) {
    const message = err.response?.data?.message || err.message
    throw new Error(message)
  }
}

