export function validateEmail(email) {
  if (!email) return 'Email is required'
  if (email.length >= 255) return 'Email must be less than 255 characters'
  if (email.includes(' ')) return 'Email cannot contain spaces'
  if (/[();:]/.test(email)) return 'Email contains prohibited characters ( ) ; :'
  const parts = email.split('@')
  if (parts.length !== 2) return 'Email must contain exactly one @ symbol. Example: user@example.com'
  if (!parts[1].includes('.')) return 'Email must contain at least one dot after @. Example: user@example.com'
  return null
}

export function validatePassword(password) {
  const errors = []
  if (!password || password.length < 8) errors.push('At least 8 characters')
  if (!/\d/.test(password)) errors.push('At least 1 number')
  if (!/[!@#$%^&*(),.?":{}|<>$#@!]/.test(password)) errors.push('At least 1 special character (e.g. $#@!)')
  if (!/[A-Z]/.test(password)) errors.push('At least 1 capitalized letter')
  if (errors.length) {
    return `Password does not meet requirements: ${errors.join(', ')}. Example: MyPass@123`
  }
  return null
}

export function validateUsername(username) {
  if (!username) return 'Username is required'
  if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
    return 'Username allows only English alphabets, numbers, underscore (_) and hyphen (-). Example: lan_nguyen'
  }
  return null
}

export function validateCompanyName(name) {
  if (!name) return 'Company name is required'
  if (!/^[a-zA-ZÀ-ỹ0-9 -]+$/.test(name)) {
    return 'Company name allows Vietnamese alphabets, numbers, space and hyphen (-). Example: Công ty ABC'
  }
  return null
}

export function validateTaxCode(taxCode) {
  if (!taxCode) return 'Tax code is required'
  if (!/^\d{10,13}$/.test(taxCode)) {
    return 'Tax code must contain 10 to 13 digits. Example: 0123456789'
  }
  return null
}

export function validateConfirmPassword(password, confirm) {
  if (password !== confirm) return 'Passwords do not match'
  return null
}

export function formatPrice(price) {
  if (price === 0 || price === '0') return 'Free'
  return `${Number(price).toLocaleString('vi-VN')} VND`
}

export function formatDate(dateStr) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
