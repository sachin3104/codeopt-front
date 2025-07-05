import { useState } from 'react'
import { isValidEmail, isStrongPassword } from '../utils/validators'

interface ValidationErrors {
  email?: string
  password?: string
}

interface FieldValues {
  email: string
  password: string
  username?: string
}

export const useValidation = () => {
  const [errors, setErrors] = useState<ValidationErrors>({})

  const validateEmail = (email: string): string => {
    if (!email) return 'Email is required'
    if (!isValidEmail(email)) return 'Invalid email address'
    return ''
  }

  const validatePassword = (password: string, username?: string, email?: string): string => {
    if (!password) return 'Password is required'
    
    // Check basic password strength
    const minLength = 8
    const hasValidLength = password.length >= minLength
    const hasUpperCase = /[A-Z]/.test(password)
    const hasLowerCase = /[a-z]/.test(password)
    const hasNumber = /[0-9]/.test(password)
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)
    
    if (!hasValidLength || !hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecialChar) {
      return 'Password must be at least 8 characters and include uppercase, lowercase, number & special character'
    }
    
    // Check if password contains username (case insensitive)
    if (username && password.toLowerCase().includes(username.toLowerCase())) {
      return 'Password should not contain your username'
    }
    
    // Check if password contains email (case insensitive)
    if (email && password.toLowerCase().includes(email.toLowerCase())) {
      return 'Password should not contain your email address'
    }
    
    return ''
  }

  const validateForm = (fields: FieldValues): ValidationErrors => {
    const newErrors: ValidationErrors = {}
    const eErr = validateEmail(fields.email)
    const pErr = validatePassword(fields.password, fields.username, fields.email)
    if (eErr) newErrors.email = eErr
    if (pErr) newErrors.password = pErr
    setErrors(newErrors)
    return newErrors
  }

  return { errors, validateEmail, validatePassword, validateForm }
} 