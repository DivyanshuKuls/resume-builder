import '@testing-library/jest-dom'
import { vi, afterEach } from 'vitest'

// Polyfill crypto.randomUUID for jsdom
if (!globalThis.crypto.randomUUID) {
  globalThis.crypto.randomUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0
      const v = c === 'x' ? r : (r & 0x3) | 0x8
      return v.toString(16)
    }) as `${string}-${string}-${string}-${string}-${string}`
  }
}

// Polyfill URL.createObjectURL / revokeObjectURL (not in jsdom)
globalThis.URL.createObjectURL = vi.fn(() => 'blob:mock')
globalThis.URL.revokeObjectURL = vi.fn()

// localStorage auto-clear between tests so store state doesn't leak
afterEach(() => {
  localStorage.clear()
})
