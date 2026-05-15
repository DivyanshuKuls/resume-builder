import { render } from '@testing-library/react'
import type { RenderOptions } from '@testing-library/react'
import type { ReactElement } from 'react'

/**
 * Thin wrapper around RTL render. Add providers here if the component tree
 * ever requires context (e.g. ToastProvider, router) so all tests stay in sync.
 */
export function renderWithProviders(ui: ReactElement, options?: RenderOptions) {
  return render(ui, { ...options })
}

export { screen, fireEvent, waitFor, within, act } from '@testing-library/react'
export { userEvent } from '@testing-library/user-event'
