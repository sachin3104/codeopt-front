import { useState, useEffect, useCallback } from 'react'
import { isValidEmail, isStrongPassword } from '../utils/validators'

interface ValidationErrors {
  email?: string
  password?: string
  username?: string
}

interface FieldValues {
  email: string
  password: string
  username?: string
}

export const useValidation = () => {
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [debouncedEmail, setDebouncedEmail] = useState('')
  const [debouncedPassword, setDebouncedPassword] = useState('')
  const [debouncedUsername, setDebouncedUsername] = useState('')

  const validateEmail = (email: string): string => {
    if (!email) return 'Email is required'
    if (!isValidEmail(email)) return 'Invalid email address'
    return ''
  }

  const validateUsername = (username: string): string => {
    if (!username) return 'Username is required'
    if (username.length < 3) return 'Username must be at least 3 characters'
    if (username.length > 20) return 'Username must be less than 20 characters'
    if (!/^[a-zA-Z0-9_]+$/.test(username)) return 'Username can only contain letters, numbers, and underscores'
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

  // Debounced validation for real-time feedback
  const debouncedValidateEmail = useCallback(
    debounce((email: string) => {
      const error = validateEmail(email)
      setErrors(prev => ({
        ...prev,
        email: error || undefined
      }))
    }, 300),
    []
  )

  const debouncedValidatePassword = useCallback(
    debounce((password: string, username?: string, email?: string) => {
      const error = validatePassword(password, username, email)
      setErrors(prev => ({
        ...prev,
        password: error || undefined
      }))
    }, 300),
    []
  )

  const debouncedValidateUsername = useCallback(
    debounce((username: string) => {
      const error = validateUsername(username)
      setErrors(prev => ({
        ...prev,
        username: error || undefined
      }))
    }, 300),
    []
  )

  // Effect to handle debounced email validation
  useEffect(() => {
    if (debouncedEmail !== '') {
      debouncedValidateEmail(debouncedEmail)
    }
  }, [debouncedEmail, debouncedValidateEmail])

  // Effect to handle debounced password validation
  useEffect(() => {
    if (debouncedPassword !== '') {
      debouncedValidatePassword(debouncedPassword, debouncedUsername, debouncedEmail)
    }
  }, [debouncedPassword, debouncedUsername, debouncedEmail, debouncedValidatePassword])

  // Effect to handle debounced username validation
  useEffect(() => {
    if (debouncedUsername !== '') {
      debouncedValidateUsername(debouncedUsername)
    }
  }, [debouncedUsername, debouncedValidateUsername])

  const validateForm = (fields: FieldValues): ValidationErrors => {
    const newErrors: ValidationErrors = {}
    const uErr = validateUsername(fields.username || '')
    const eErr = validateEmail(fields.email)
    const pErr = validatePassword(fields.password, fields.username, fields.email)
    if (uErr) newErrors.username = uErr
    if (eErr) newErrors.email = eErr
    if (pErr) newErrors.password = pErr
    setErrors(newErrors)
    return newErrors
  }

  // Real-time validation setters
  const setEmailForValidation = (email: string) => {
    setDebouncedEmail(email)
  }

  const setPasswordForValidation = (password: string, username?: string, email?: string) => {
    setDebouncedPassword(password)
    setDebouncedUsername(username || '')
    setDebouncedEmail(email || '')
  }

  const setUsernameForValidation = (username: string) => {
    setDebouncedUsername(username)
  }

  return { 
    errors, 
    validateEmail, 
    validatePassword, 
    validateUsername,
    validateForm,
    setEmailForValidation,
    setPasswordForValidation,
    setUsernameForValidation
  }
}

// Debounce utility function
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
} 