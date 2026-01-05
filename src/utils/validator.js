export const validator = {
  required(value) {
    return value !== undefined && value !== null && String(value).trim() !== ''
  },
  email(value) {
    if (!value) return true
    const regex = /[^@\s]+@[^@\s]+\.[^@\s]+/
    return regex.test(String(value))
  },
  minLength(value, len) {
    return String(value || '').length >= len
  },
}
