// Simple test to verify password validation rules
// This is just for demonstration purposes

// Mock the validation function (simplified version)
function isStrongPassword(password, username, email) {
  const minLength = 8
  const hasValidLength = password.length >= minLength
  const hasUpperCase = /[A-Z]/.test(password)
  const hasLowerCase = /[a-z]/.test(password)
  const hasNumber = /[0-9]/.test(password)
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)
  
  // Check if password contains username (case insensitive)
  const containsUsername = username && password.toLowerCase().includes(username.toLowerCase())
  
  // Check if password contains email (case insensitive)
  const containsEmail = email && password.toLowerCase().includes(email.toLowerCase())
  
  return hasValidLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar && !containsUsername && !containsEmail
}

function validatePassword(password, username, email) {
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

// Test cases
console.log('=== Password Validation Tests ===\n')

const testCases = [
  {
    password: 'MyPassword123!',
    username: 'john',
    email: 'john@example.com',
    expected: '' // valid password
  },
  {
    password: 'johnPassword123!',
    username: 'john',
    email: 'john@example.com',
    expected: 'Password should not contain your username'
  },
  {
    password: 'MyPassword123!',
    username: 'john',
    email: 'john@example.com',
    expected: '' // valid password
  },
  {
    password: 'john@example.com123!',
    username: 'john',
    email: 'john@example.com',
    expected: 'Password should not contain your email address'
  },
  {
    password: 'JOHN@EXAMPLE.COM123!',
    username: 'john',
    email: 'john@example.com',
    expected: 'Password should not contain your email address'
  },
  {
    password: 'JOHN123!',
    username: 'john',
    email: 'john@example.com',
    expected: 'Password should not contain your username'
  },
  {
    password: 'MySecurePass123!',
    username: 'john',
    email: 'john@example.com',
    expected: '' // valid password
  },
  {
    password: 'john123!',
    username: 'john',
    email: 'john@example.com',
    expected: 'Password should not contain your username'
  }
]

testCases.forEach((testCase, index) => {
  const result = validatePassword(testCase.password, testCase.username, testCase.email)
  const passed = result === testCase.expected
  console.log(`Test ${index + 1}: ${passed ? '✅ PASS' : '❌ FAIL'}`)
  console.log(`  Password: "${testCase.password}"`)
  console.log(`  Username: "${testCase.username}"`)
  console.log(`  Email: "${testCase.email}"`)
  console.log(`  Expected: "${testCase.expected || 'valid'}"`)
  console.log(`  Got: "${result || 'valid'}"`)
  console.log('')
})

console.log('=== Test Complete ===') 