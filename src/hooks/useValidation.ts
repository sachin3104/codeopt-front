import { useState } from 'react'
import { isValidEmail, isStrongPassword } from '../utils/validators'

interface ValidationErrors {
  email?: string
  password?: string
}

interface FieldValues {
  email: string
  password: string
}

export const useValidation = () => {
  const [errors, setErrors] = useState<ValidationErrors>({})

  const validateEmail = (email: string): string => {
    if (!email) return 'Email is required'
    if (!isValidEmail(email)) return 'Invalid email address'
    return ''
  }

  const validatePassword = (password: string): string => {
    if (!password) return 'Password is required'
    if (!isStrongPassword(password)) {
      return 'Password must be at least 8 characters and include uppercase, lowercase, number & special character'
    }
    return ''
  }

  const validateForm = (fields: FieldValues): ValidationErrors => {
    const newErrors: ValidationErrors = {}
    const eErr = validateEmail(fields.email)
    const pErr = validatePassword(fields.password)
    if (eErr) newErrors.email = eErr
    if (pErr) newErrors.password = pErr
    setErrors(newErrors)
    return newErrors
  }

  return { errors, validateEmail, validatePassword, validateForm }
} 