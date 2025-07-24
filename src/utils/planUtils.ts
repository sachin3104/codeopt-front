// src/utils/planUtils.ts
// Utility functions for plan management

import { PlanType } from '@/api/subscription';

export interface Plan {
  id: number;
  plan_type: 'FREE' | 'PRO' | 'ULTIMATE' | 'ENTERPRISE' | 'CALL_WITH_EXPERT';
  name: string;
  description: string;
  price: number;
  currency: string;
  max_code_input_chars: number;
  max_daily_usage: number | null;
  max_monthly_usage: number | null;
  is_active: boolean;
  stripe_price_id?: string | null; 
  is_subscription: boolean;           
  action_type: 'subscribe' | 'email_contact' | 'book_consultation';  
  consultation_options?: {            
    duration: 'half_hour' | 'one_hour';
    duration_label: string;
    price: number;
    description: string;
  }[];
}

/**
 * Get plan hierarchy level for comparison
 */
export const getPlanLevel = (planType: string): number => {
  switch (planType) {
    case 'FREE':
      return 0;
    case 'PRO':
      return 1;
    case 'ULTIMATE':
      return 2;
    case 'ENTERPRISE':
      return 3;
    case 'CALL_WITH_EXPERT':
      return 4;
    default:
      return -1;
  }
};

/**
 * Check if a plan upgrade is valid
 */
export const isPlanUpgrade = (currentPlan: string, newPlan: string): boolean => {
  const currentLevel = getPlanLevel(currentPlan);
  const newLevel = getPlanLevel(newPlan);
  
  return currentLevel >= 0 && newLevel >= 0 && newLevel > currentLevel;
};

/**
 * Check if a plan downgrade is valid
 */
export const isPlanDowngrade = (currentPlan: string, newPlan: string): boolean => {
  const currentLevel = getPlanLevel(currentPlan);
  const newLevel = getPlanLevel(newPlan);
  
  return currentLevel >= 0 && newLevel >= 0 && newLevel < currentLevel;
};

/**
 * Get plan display name
 */
export const getPlanDisplayName = (planType: string): string => {
  switch (planType) {
    case 'FREE':
      return 'OPTQO FREE';
    case 'PRO':
      return 'OPTQO PRO';
    case 'ULTIMATE':
      return 'OPTQO ULTIMATE';
    case 'ENTERPRISE':
      return 'OPTQO ENTERPRISE';
    case 'CALL_WITH_EXPERT':
      return 'OPTQO EXPERT';
    default:
      return planType;
  }
};

/**
 * Check if a plan is unlimited (no character limits)
 */
export const isUnlimitedPlan = (plan: Plan): boolean => {
  return plan.max_code_input_chars === null || plan.max_code_input_chars === 0;
};

/**
 * Check if a plan has unlimited daily usage
 */
export const hasUnlimitedDailyUsage = (plan: Plan): boolean => {
  return plan.max_daily_usage === null;
};

/**
 * Check if a plan has unlimited monthly usage
 */
export const hasUnlimitedMonthlyUsage = (plan: Plan): boolean => {
  return plan.max_monthly_usage === null;
};

/**
 * Validate if a plan type is valid
 */
export const isValidPlanType = (planType: string): boolean => {
  const validPlans = ['FREE', 'PRO', 'ULTIMATE', 'ENTERPRISE', 'CALL_WITH_EXPERT'];
  return validPlans.includes(planType);
};

/**
 * Get plan features based on plan type
 */
export const getPlanFeatures = (planType: string) => {
  switch (planType) {
    case 'FREE':
      return {
        maxCodeInputChars: 15000,
        maxDailyUsage: 20,
        price: 0,
        features: ['Basic code optimization', 'Limited daily requests', 'Community support']
      };
    case 'PRO':
      return {
        maxCodeInputChars: 40000,
        maxDailyUsage: 100,
        price: 9.99,
        features: ['Advanced optimization', 'Increased daily limits', 'Priority support']
      };
    case 'ULTIMATE':
      return {
        maxCodeInputChars: 50000,
        maxDailyUsage: null,
        price: 30.00,
        features: ['Unlimited daily requests', 'Maximum character limits', 'Premium support']
      };
    case 'ENTERPRISE':
      return {
        maxCodeInputChars: null,
        maxDailyUsage: null,
        price: 0, // Custom pricing
        features: ['Custom solutions', 'Dedicated support', 'SLA guarantees']
      };
    case 'CALL_WITH_EXPERT':
      return {
        maxCodeInputChars: null,
        maxDailyUsage: null,
        price: 0, // Consultation pricing
        features: ['Expert consultation', 'Custom implementation', 'Direct support']
      };
    default:
      return {
        maxCodeInputChars: 0,
        maxDailyUsage: 0,
        price: 0,
        features: []
      };
  }
}; 