import { useMemo } from 'react'
import { useSubscription } from './use-subscription'

export interface RemainingRequestsInfo {
  hasRemainingRequests: boolean
  remainingRequests: number | null
  totalRequests: number | null
  usedRequests: number
  periodType: 'daily' | 'monthly'
  isOverLimit: boolean
}

export function useRemainingRequests(): RemainingRequestsInfo {
  const { subscription, usageData } = useSubscription()
  
  const info = useMemo(() => {
    if (!subscription?.plan || !usageData) {
      return {
        hasRemainingRequests: true, // Assume unlimited if no data
        remainingRequests: null,
        totalRequests: null,
        usedRequests: 0,
        periodType: 'daily' as const,
        isOverLimit: false
      }
    }

    const { plan } = subscription
    const { current_usage, plan_limits } = usageData
    const isFreePlan = plan.plan_type === 'optqo_free'
    
    const periodType: 'daily' | 'monthly' = isFreePlan ? 'daily' : 'monthly'
    const usedRequests = isFreePlan ? current_usage.daily_usage : current_usage.monthly_usage
    const totalRequests = isFreePlan ? plan_limits.max_daily_usage : plan_limits.max_monthly_usage
    
    // If no limit is set, user has unlimited requests
    if (totalRequests === null) {
      return {
        hasRemainingRequests: true,
        remainingRequests: null,
        totalRequests: null,
        usedRequests,
        periodType,
        isOverLimit: false
      }
    }
    
    const remainingRequests = Math.max(0, totalRequests - usedRequests)
    const hasRemainingRequests = remainingRequests > 0
    const isOverLimit = usedRequests >= totalRequests
    
    return {
      hasRemainingRequests,
      remainingRequests,
      totalRequests,
      usedRequests,
      periodType,
      isOverLimit
    }
  }, [subscription, usageData])
  
  return info
} 