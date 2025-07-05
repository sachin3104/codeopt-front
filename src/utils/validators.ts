export const isValidEmail = (email: string): boolean => {
  // simple RFC-like email regex
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

export const isStrongPassword = (password: string, username?: string, email?: string): boolean => {
  const minLength = 8
  const hasValidLength = password.length >= minLength
  const hasUpperCase    = /[A-Z]/.test(password)
  const hasLowerCase    = /[a-z]/.test(password)
  const hasNumber       = /[0-9]/.test(password)
  const hasSpecialChar  = /[!@#$%^&*(),.?":{}|<>]/.test(password)
  
  // Check if password contains username (case insensitive)
  const containsUsername = username && password.toLowerCase().includes(username.toLowerCase())
  
  // Check if password contains email (case insensitive)
  const containsEmail = email && password.toLowerCase().includes(email.toLowerCase())
  
  return hasValidLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar && !containsUsername && !containsEmail
} 