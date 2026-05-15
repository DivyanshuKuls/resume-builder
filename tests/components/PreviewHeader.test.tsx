import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PreviewHeader } from '@/preview/sections/PreviewHeader'
import { makePersonalInfo } from '../utils/resumeBuilders'

describe('PreviewHeader', () => {
  it('renders fullName as h1', () => {
    render(<PreviewHeader personalInfo={makePersonalInfo({ fullName: 'Alice Wang' })} />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Alice Wang')
  })

  it('renders jobTitle', () => {
    render(<PreviewHeader personalInfo={makePersonalInfo({ jobTitle: 'Product Designer' })} />)
    expect(screen.getByText('Product Designer')).toBeInTheDocument()
  })

  it('renders nothing when both fullName and jobTitle are empty', () => {
    const { container } = render(
      <PreviewHeader personalInfo={makePersonalInfo({ fullName: '', jobTitle: '' })} />,
    )
    expect(container.firstChild).toBeNull()
  })

  it('renders an img when photo is set and photoAlignment is not none', () => {
    render(
      <PreviewHeader
        personalInfo={makePersonalInfo({
          photo: 'data:image/png;base64,abc',
          photoAlignment: 'left',
          fullName: 'Carol',
        })}
      />,
    )
    expect(screen.getByRole('img')).toBeInTheDocument()
  })

  it('does not render avatar when photoAlignment is none', () => {
    const { container } = render(
      <PreviewHeader
        personalInfo={makePersonalInfo({
          photo: 'data:image/png;base64,abc',
          photoAlignment: 'none',
          fullName: 'Dan',
        })}
      />,
    )
    expect(container.querySelector('img')).toBeNull()
  })

  it('renders initials avatar when fullName is set and photo is empty', () => {
    const { container } = render(
      <PreviewHeader
        personalInfo={makePersonalInfo({ fullName: 'Eve Fox', photo: '', photoAlignment: 'left' })}
      />,
    )
    // Initials for "Eve Fox" → "EF"
    expect(container.textContent).toContain('EF')
  })

  it('renders single initial for single-word name', () => {
    const { container } = render(
      <PreviewHeader
        personalInfo={makePersonalInfo({ fullName: 'Madonna', photo: '', photoAlignment: 'left' })}
      />,
    )
    expect(container.textContent).toContain('M')
  })

  it('renders photo on left by default (avatar before name block)', () => {
    const { container } = render(
      <PreviewHeader
        personalInfo={makePersonalInfo({
          fullName: 'Frank',
          photo: 'data:image/png;base64,abc',
          photoAlignment: 'left',
        })}
      />,
    )
    const img = container.querySelector('img')!
    const h1 = container.querySelector('h1')!
    // In DOM order, img should appear before h1 for left alignment
    expect(img.compareDocumentPosition(h1) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  })

  it('renders photo on right (name block before avatar) for right alignment', () => {
    const { container } = render(
      <PreviewHeader
        personalInfo={makePersonalInfo({
          fullName: 'Grace',
          photo: 'data:image/png;base64,abc',
          photoAlignment: 'right',
        })}
      />,
    )
    const img = container.querySelector('img')!
    const h1 = container.querySelector('h1')!
    // For right alignment, h1 should appear before img in DOM
    expect(h1.compareDocumentPosition(img) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  })
})
