export const isValidEmail = (email: string): boolean => {
  // simple RFC-like email regex
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

export const isStrongPassword = (password: string): boolean => {
  const minLength = 8
  const hasValidLength = password.length >= minLength
  const hasUpperCase    = /[A-Z]/.test(password)
  const hasLowerCase    = /[a-z]/.test(password)
  const hasNumber       = /[0-9]/.test(password)
  const hasSpecialChar  = /[!@#$%^&*(),.?":{}|<>]/.test(password)
  return hasValidLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar
} 