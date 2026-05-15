const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const DATE_RE  = /^\d{4}-(0[1-9]|1[0-2])$/

export function isValidEmail(v: string): boolean {
  return EMAIL_RE.test(v.trim())
}

export function isValidUrl(v: string): boolean {
  if (!v.trim()) return true
  try {
    new URL(v.startsWith('http') ? v : `https://${v}`)
    return true
  } catch {
    return false
  }
}

export function isValidDate(v: string): boolean {
  return v === '' || DATE_RE.test(v)
}
