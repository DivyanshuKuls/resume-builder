/**
 * Zustand store reset helper for tests.
 * Call resetStore(useResumeStore) before each test that needs a clean slate.
 */
import { act } from '@testing-library/react'
import type { StoreApi } from 'zustand'

export function resetStore<T>(store: StoreApi<T> & { getInitialState?: () => T }) {
  act(() => {
    const initial = store.getInitialState?.()
    if (initial) store.setState(initial, true)
  })
}
