import { useMemo } from 'react'
import { useSubscription } from './use-subscription'
import { PlanType } from '@/api/subscription'

export interface CharacterLimitInfo {
  currentCount: number
  limit: number
  remaining: number
  isOverLimit: boolean
  percentageUsed: number
  planType: PlanType | null
}

export function useCharacterLimit(code: string): CharacterLimitInfo {
  const { subscription } = useSubscription()
  
  const currentCount = code.length
  const planType = subscription?.plan?.plan_type as PlanType | null
  
  // Use backend-provided limit only
  const limit = subscription?.plan?.max_code_input_chars || 0
  
  const remaining = Math.max(0, limit - currentCount)
  const isOverLimit = currentCount > limit
  const percentageUsed = limit > 0 ? Math.min(100, (currentCount / limit) * 100) : 0
  
  return useMemo(() => ({
    currentCount,
    limit,
    remaining,
    isOverLimit,
    percentageUsed,
    planType,
  }), [currentCount, limit, planType])
}

// Helper function to get limit for a specific plan (uses backend data only)
export function getCharacterLimitForPlan(planType: PlanType, subscription?: any): number {
  // If we have subscription data and it matches the requested plan, use backend limit
  if (subscription?.plan?.plan_type === planType && subscription?.plan?.max_code_input_chars) {
    return subscription.plan.max_code_input_chars
  }
  
  // Return 0 if no backend data available
  return 0
}

// Helper function to format character count
export function formatCharacterCount(count: number): string {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`
  } else if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`
  }
  return count.toString()
} 