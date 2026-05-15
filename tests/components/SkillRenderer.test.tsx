import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SkillRenderer } from '@/preview/renderers/SkillRenderer'
import { makeResume, makeSection, makeSkill, makeSkillGroup, uid } from '../utils/resumeBuilders'

function renderSkill(overrides: Parameters<typeof makeResume>[0] = {}) {
  const resume = makeResume(overrides)
  const section = makeSection({ id: 'skills', type: 'skills' })
  return render(<SkillRenderer resume={resume} section={section} />)
}

describe('SkillRenderer – individual mode', () => {
  it('renders each skill as a pill', () => {
    const { container } = renderSkill({
      skillsConfig: { mode: 'individual', headingStyle: 'inline' },
      skills: [makeSkill({ name: 'React' }), makeSkill({ name: 'TypeScript' })],
    })
    expect(screen.getByText('React')).toBeInTheDocument()
    expect(screen.getByText('TypeScript')).toBeInTheDocument()
  })

  it('renders nothing when skills list is empty', () => {
    const { container } = renderSkill({
      skillsConfig: { mode: 'individual', headingStyle: 'inline' },
      skills: [],
    })
    expect(container.firstChild).toBeNull()
  })

  it('uses rt-skill-pill class on each skill pill', () => {
    const { container } = renderSkill({
      skillsConfig: { mode: 'individual', headingStyle: 'inline' },
      skills: [makeSkill({ name: 'Go' })],
    })
    expect(container.querySelector('.rt-skill-pill')).not.toBeNull()
  })
})

describe('SkillRenderer – grouped mode, inline heading', () => {
  it('renders category labels and skill names', () => {
    renderSkill({
      skillsConfig: { mode: 'grouped', headingStyle: 'inline' },
      skillGroups: [
        makeSkillGroup({
          category: 'Frontend',
          skills: [makeSkill({ name: 'React' }), makeSkill({ name: 'CSS' })],
        }),
      ],
    })
    expect(screen.getByText(/Frontend/)).toBeInTheDocument()
    expect(screen.getByText(/React/)).toBeInTheDocument()
    expect(screen.getByText(/CSS/)).toBeInTheDocument()
  })

  it('joins skills with " · " separator', () => {
    renderSkill({
      skillsConfig: { mode: 'grouped', headingStyle: 'inline' },
      skillGroups: [
        makeSkillGroup({
          category: 'Stack',
          skills: [makeSkill({ name: 'A' }), makeSkill({ name: 'B' })],
        }),
      ],
    })
    expect(screen.getByText('A · B')).toBeInTheDocument()
  })

  it('renders nothing when all groups are empty', () => {
    const { container } = renderSkill({
      skillsConfig: { mode: 'grouped', headingStyle: 'inline' },
      skillGroups: [{ id: uid(), category: 'Empty', skills: [] }],
    })
    expect(container.firstChild).toBeNull()
  })

  it('skips empty groups but renders populated ones', () => {
    renderSkill({
      skillsConfig: { mode: 'grouped', headingStyle: 'inline' },
      skillGroups: [
        { id: uid(), category: 'Empty', skills: [] },
        makeSkillGroup({ category: 'Backend', skills: [makeSkill({ name: 'Node.js' })] }),
      ],
    })
    expect(screen.queryByText(/Empty/)).toBeNull()
    expect(screen.getByText(/Backend/)).toBeInTheDocument()
  })
})

describe('SkillRenderer – grouped mode, block heading', () => {
  it('renders category as a block heading', () => {
    renderSkill({
      skillsConfig: { mode: 'grouped', headingStyle: 'block' },
      skillGroups: [
        makeSkillGroup({
          category: 'DevOps',
          skills: [makeSkill({ name: 'Docker' })],
        }),
      ],
    })
    expect(screen.getByText('DevOps')).toBeInTheDocument()
    expect(screen.getByText('Docker')).toBeInTheDocument()
  })
})
