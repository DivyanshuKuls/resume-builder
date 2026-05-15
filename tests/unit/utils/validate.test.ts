import { describe, it, expect } from 'vitest'
import { isValidEmail, isValidUrl, isValidDate } from '@/utils/validate'

describe('isValidEmail', () => {
  it('accepts valid email addresses', () => {
    expect(isValidEmail('user@example.com')).toBe(true)
    expect(isValidEmail('user+tag@sub.domain.org')).toBe(true)
    expect(isValidEmail('  jane@test.io  ')).toBe(true) // trims whitespace
  })

  it('rejects malformed email addresses', () => {
    expect(isValidEmail('')).toBe(false)
    expect(isValidEmail('notanemail')).toBe(false)
    expect(isValidEmail('@nodomain.com')).toBe(false)
    expect(isValidEmail('user@')).toBe(false)
    expect(isValidEmail('user @example.com')).toBe(false)
  })
})

describe('isValidUrl', () => {
  it('accepts empty/blank strings (optional field)', () => {
    expect(isValidUrl('')).toBe(true)
    expect(isValidUrl('   ')).toBe(true)
  })

  it('accepts full URLs with protocol', () => {
    expect(isValidUrl('https://example.com')).toBe(true)
    expect(isValidUrl('http://example.com/path?q=1')).toBe(true)
  })

  it('accepts URLs without protocol (auto-prefixes https)', () => {
    expect(isValidUrl('example.com')).toBe(true)
    expect(isValidUrl('github.com/user/repo')).toBe(true)
  })

  it('rejects strings that are not valid URLs', () => {
    expect(isValidUrl('not a url at all')).toBe(false)
    expect(isValidUrl('://broken')).toBe(false)
  })
})

describe('isValidDate', () => {
  it('accepts empty string (optional field)', () => {
    expect(isValidDate('')).toBe(true)
  })

  it('accepts valid YYYY-MM dates', () => {
    expect(isValidDate('2024-01')).toBe(true)
    expect(isValidDate('2000-12')).toBe(true)
    expect(isValidDate('1999-06')).toBe(true)
  })

  it('rejects invalid date formats', () => {
    expect(isValidDate('2024-1')).toBe(false)    // single-digit month
    expect(isValidDate('2024-13')).toBe(false)   // month > 12
    expect(isValidDate('2024-00')).toBe(false)   // month 00
    expect(isValidDate('24-01')).toBe(false)     // short year
    expect(isValidDate('January 2024')).toBe(false)
    expect(isValidDate('2024/01')).toBe(false)
  })
})
