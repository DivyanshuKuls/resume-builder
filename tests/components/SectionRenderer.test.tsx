import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SectionRenderer } from '@/preview/SectionRenderer'
import {
  makeResume,
  makeSection,
  makeExperience,
  makeCustomSection,
  uid,
} from '../utils/resumeBuilders'

describe('SectionRenderer – empty section guard', () => {
  it('renders nothing when section has no content', () => {
    const { container } = render(
      <SectionRenderer
        resume={makeResume({ experience: [] })}
        section={makeSection({ id: 'experience', type: 'experience' })}
      />,
    )
    expect(container.firstChild).toBeNull()
  })

  it('renders when section has content', () => {
    const { container } = render(
      <SectionRenderer
        resume={makeResume({ experience: [makeExperience()] })}
        section={makeSection({ id: 'experience', type: 'experience' })}
      />,
    )
    expect(container.firstChild).not.toBeNull()
  })
})

describe('SectionRenderer – heading', () => {
  it('renders the section title as a heading', () => {
    render(
      <SectionRenderer
        resume={makeResume({ experience: [makeExperience()] })}
        section={makeSection({ id: 'experience', type: 'experience', title: 'Work Experience' })}
      />,
    )
    expect(screen.getByText('Work Experience')).toBeInTheDocument()
  })
})

describe('SectionRenderer – data attributes', () => {
  it('sets data-section-type on the wrapper element', () => {
    const { container } = render(
      <SectionRenderer
        resume={makeResume({ experience: [makeExperience()] })}
        section={makeSection({ id: 'experience', type: 'experience' })}
      />,
    )
    expect(container.querySelector('[data-section-type="experience"]')).not.toBeNull()
  })

  it('sets data-section-id on the wrapper element', () => {
    const { container } = render(
      <SectionRenderer
        resume={makeResume({ experience: [makeExperience()] })}
        section={makeSection({ id: 'experience', type: 'experience' })}
      />,
    )
    expect(container.querySelector('[data-section-id="experience"]')).not.toBeNull()
  })
})

describe('SectionRenderer – alignment classes', () => {
  it('applies text-center class for center alignment', () => {
    const { container } = render(
      <SectionRenderer
        resume={makeResume({ experience: [makeExperience()] })}
        section={makeSection({ id: 'experience', type: 'experience', alignment: 'center' })}
      />,
    )
    expect(container.querySelector('.text-center')).not.toBeNull()
  })

  it('applies text-right class for right alignment', () => {
    const { container } = render(
      <SectionRenderer
        resume={makeResume({ experience: [makeExperience()] })}
        section={makeSection({ id: 'experience', type: 'experience', alignment: 'right' })}
      />,
    )
    expect(container.querySelector('.text-right')).not.toBeNull()
  })

  it('applies no alignment class for left alignment', () => {
    const { container } = render(
      <SectionRenderer
        resume={makeResume({ experience: [makeExperience()] })}
        section={makeSection({ id: 'experience', type: 'experience', alignment: 'left' })}
      />,
    )
    const el = container.querySelector('[data-section-type="experience"]')
    expect(el?.className).not.toContain('text-center')
    expect(el?.className).not.toContain('text-right')
  })
})

describe('SectionRenderer – custom section', () => {
  it('renders custom section content', () => {
    const csId = uid()
    const resume = makeResume({
      customSections: [makeCustomSection({ id: csId, content: 'My custom text' })],
    })
    const section = makeSection({ id: csId, type: 'custom', title: 'Extra' })
    render(<SectionRenderer resume={resume} section={section} />)
    expect(screen.getByText('My custom text')).toBeInTheDocument()
  })

  it('renders nothing for empty custom section', () => {
    const csId = uid()
    const resume = makeResume({
      customSections: [makeCustomSection({ id: csId, content: '' })],
    })
    const { container } = render(
      <SectionRenderer
        resume={resume}
        section={makeSection({ id: csId, type: 'custom', title: 'Empty' })}
      />,
    )
    expect(container.firstChild).toBeNull()
  })
})

describe('SectionRenderer – hidden section', () => {
  it('still renders content when visible is false (visibility is controlled by parent)', () => {
    // SectionRenderer itself does not gate on visible — the ResumePreview does.
    // So a hidden-but-content-filled section should still render if passed directly.
    const { container } = render(
      <SectionRenderer
        resume={makeResume({ experience: [makeExperience()] })}
        section={makeSection({ id: 'experience', type: 'experience', visible: false })}
      />,
    )
    expect(container.firstChild).not.toBeNull()
  })
})
