// Utility functions for handling authentication errors with user-friendly messages

export interface AuthError {
  status?: number;
  message?: string;
  response?: {
    status?: number;
    data?: {
      message?: string;
      error?: string;
    };
  };
}

export const getAuthErrorMessage = (error: AuthError): string => {
  const status = error.status || error.response?.status;
  const message = error.message || error.response?.data?.message || error.response?.data?.error;

  // Handle specific HTTP status codes
  switch (status) {
    case 400:
      if (message?.toLowerCase().includes('username')) {
        return 'Username is required. Please enter a valid username.';
      }
      if (message?.toLowerCase().includes('email')) {
        return 'Please enter a valid email address.';
      }
      if (message?.toLowerCase().includes('password')) {
        return 'Password is required. Please enter a valid password.';
      }
      if (message?.toLowerCase().includes('already exists')) {
        return 'An account with this email or username already exists. Please try logging in instead.';
      }
      if (message?.toLowerCase().includes('invalid')) {
        return 'Invalid input. Please check your information and try again.';
      }
      return 'Please check your information and try again.';
      
    case 401:
      if (message?.toLowerCase().includes('invalid credentials')) {
        return 'Invalid username or password. Please check your credentials and try again.';
      }
      if (message?.toLowerCase().includes('unauthorized')) {
        return 'Invalid username or password. Please check your credentials and try again.';
      }
      return 'Invalid username or password. Please check your credentials and try again.';
      
    case 403:
      return 'Access denied. Your account may be suspended or you may not have permission to perform this action.';
      
    case 404:
      return 'Account not found. Please check your username or email and try again.';
      
    case 409:
      if (message?.toLowerCase().includes('username')) {
        return 'This username is already taken. Please choose a different username.';
      }
      if (message?.toLowerCase().includes('email')) {
        return 'An account with this email already exists. Please try logging in instead.';
      }
      return 'Account already exists. Please try logging in instead.';
      
    case 422:
      if (message?.toLowerCase().includes('validation')) {
        return 'Please check your information and ensure all fields are filled correctly.';
      }
      return 'Invalid information provided. Please check your details and try again.';
      
    case 429:
      return 'Too many attempts. Please wait a few minutes before trying again.';
      
    case 500:
    case 502:
    case 503:
    case 504:
      return 'Server error. Please try again in a few moments.';
      
    default:
      // Handle specific error messages
      if (message?.toLowerCase().includes('network')) {
        return 'Network error. Please check your internet connection and try again.';
      }
      if (message?.toLowerCase().includes('timeout')) {
        return 'Request timed out. Please try again.';
      }
      if (message?.toLowerCase().includes('otp')) {
        return 'OTP verification failed. Please check your code and try again.';
      }
      if (message?.toLowerCase().includes('google')) {
        return 'Google authentication failed. Please try again or use email signup.';
      }
      
      // Return the original message if it's user-friendly, otherwise provide a generic message
      if (message && !message.includes('Error') && !message.includes('error')) {
        return message;
      }
      
      return 'An unexpected error occurred. Please try again.';
  }
};

export const getSignupErrorMessage = (error: AuthError): string => {
  const status = error.status || error.response?.status;
  const message = error.message || error.response?.data?.message || error.response?.data?.error;

  // Handle specific signup errors
  switch (status) {
    case 400:
      if (message?.toLowerCase().includes('username')) {
        return 'Username is required and must be at least 3 characters long.';
      }
      if (message?.toLowerCase().includes('email')) {
        return 'Please enter a valid email address.';
      }
      if (message?.toLowerCase().includes('password')) {
        return 'Password must be at least 8 characters long and contain letters and numbers.';
      }
      return 'Please check your information and ensure all fields are filled correctly.';
      
    case 409:
      if (message?.toLowerCase().includes('username')) {
        return 'This username is already taken. Please choose a different username.';
      }
      if (message?.toLowerCase().includes('email')) {
        return 'An account with this email already exists. Please try logging in instead.';
      }
      return 'Account already exists. Please try logging in instead.';
      
    case 422:
      return 'Please ensure your password meets the requirements and all fields are valid.';
      
    default:
      return getAuthErrorMessage(error);
  }
};

export const getLoginErrorMessage = (error: AuthError): string => {
  const status = error.status || error.response?.status;
  const message = error.message || error.response?.data?.message || error.response?.data?.error;

  // Handle specific login errors
  switch (status) {
    case 401:
      return 'Invalid username or password. Please check your credentials and try again.';
      
    case 404:
      return 'Account not found. Please check your username or email and try again.';
      
    case 429:
      return 'Too many login attempts. Please wait a few minutes before trying again.';
      
    default:
      return getAuthErrorMessage(error);
  }
}; 