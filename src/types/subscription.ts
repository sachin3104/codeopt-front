// src/types/subscription.ts
// Types for subscription data

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

export interface Subscription {
  id: number;
  plan: Plan;
  status: 'active' | 'cancelled' | 'past_due' | 'unpaid' | 'incomplete' | 'trialing' | 'paused';
  current_period_start: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  cancelled_at: string | null;
  days_until_renewal: number | null;
  is_active: boolean;
  is_expired: boolean;
}

export interface UsageData {
  daily: {
    usage_count: number;
    characters_processed: number;
    limit: number | null;
    remaining: number | null;
  };
  monthly: {
    usage_count: number;
    characters_processed: number;
    limit: number | null;
    remaining: number | null;
  };
}

export interface SubscriptionStatusResponse {
  status: 'success' | 'error';
  subscription: Subscription;
  usage: UsageData;
  plan_limits: {
    max_code_input_chars: number;
    max_daily_usage: number | null;
    max_monthly_usage: number | null;
  };
  stripe_customer: {
    stripe_customer_id: string;
    customer_data: any;
    created_at: string;
  } | null;
  message?: string;
}

export interface PlansResponse {
  status: 'success' | 'error';
  plans: Plan[];
  message?: string;
}

export interface CheckoutResponse {
  status: 'success' | 'error';
  checkout_url: string;
  message?: string;
}

export interface BillingPortalResponse {
  status: 'success' | 'error';
  portal_url: string;
  message?: string;
}

export interface UsageRecord {
  id: number;
  usage_date: string;
  usage_count: number;
  characters_processed: number;
  endpoint: string;
  request_metadata: any;
  created_at: string;
}

export interface UsageHistoryResponse {
  status: 'success' | 'error';
  current_usage: {
    daily_usage: number;
    monthly_usage: number;
    daily_characters: number;
    monthly_characters: number;
  };
  usage_history: {
    records: UsageRecord[];
    pagination: {
      page: number;
      per_page: number;
      total: number;
      pages: number;
      has_next: boolean;
      has_prev: boolean;
    };
  };
  plan_limits: {
    max_code_input_chars: number | null;
    max_daily_usage: number | null;
    max_monthly_usage: number | null;
  };
  message?: string;
}

export interface SubscriptionActionResponse {
  status: 'success' | 'error';
  message?: string;
  subscription: Subscription;
}

export interface ApiErrorResponse {
  status: string;
  message: string;
  current_plan?: string;
  required_plans?: string[];
  usage_info?: any;
  rate_limit_info?: any;
}


// Consultation booking model returned by backend
export interface ConsultationBooking {
  id: number;
  consultation_type: 'half_hour' | 'one_hour';
  consultation_duration: string;
  user_email: string;
  selected_date: string;    // ISO date
  description?: string;
  amount: number;
  currency: string;
  payment_status: 'pending' | 'completed' | 'failed' | 'cancelled';
  booking_status: 'pending' | 'confirmed' | 'cancelled';
  stripe_payment_intent_id?: string;
  created_at: string;       // ISO timestamp
  updated_at: string;       // ISO timestamp
}


// Responses for consultation endpoints
export interface ConsultationPlansResponse {
  status: 'success' | 'error';
  consultation_plans: Plan[];
  message?: string;
}

export interface ConsultationCheckoutResponse {
  status: 'success' | 'error';
  booking_id: number;
  checkout_url: string;
  booking: ConsultationBooking;
  message?: string;
}

export interface ConsultationBookingStatusResponse {
  status: 'success' | 'error';
  booking: ConsultationBooking;
  message?: string;
}

export interface ConsultationBookingsResponse {
  status: 'success' | 'error';
  bookings: ConsultationBooking[];
  pagination: {
    page: number;
    per_page: number;
    total: number;
    pages: number;
    has_next: boolean;
    has_prev: boolean;
  };
  message?: string;
} 