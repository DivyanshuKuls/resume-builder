import { describe, it, expect } from 'vitest'
import { hasSectionContent } from '@/utils/sectionContent'
import {
  makeResume,
  makeSection,
  makeExperience,
  makeEducation,
  makeSkill,
  makeSkillGroup,
  makeProject,
  makeCertification,
  makeAchievement,
  makeCustomSection,
  uid,
} from '../../utils/resumeBuilders'

describe('hasSectionContent – summary', () => {
  const section = makeSection({ id: 'summary', type: 'summary' })

  it('returns true when summary has text', () => {
    expect(hasSectionContent(makeResume({ summary: 'Some text' }), section)).toBe(true)
  })

  it('returns false when summary is empty', () => {
    expect(hasSectionContent(makeResume({ summary: '' }), section)).toBe(false)
  })

  it('returns false when summary is whitespace only', () => {
    expect(hasSectionContent(makeResume({ summary: '   ' }), section)).toBe(false)
  })
})

describe('hasSectionContent – experience', () => {
  const section = makeSection({ id: 'experience', type: 'experience' })

  it('returns true when there are experience entries', () => {
    expect(hasSectionContent(makeResume({ experience: [makeExperience()] }), section)).toBe(true)
  })

  it('returns false when experience is empty', () => {
    expect(hasSectionContent(makeResume({ experience: [] }), section)).toBe(false)
  })
})

describe('hasSectionContent – education', () => {
  const section = makeSection({ id: 'education', type: 'education' })

  it('returns true when there are education entries', () => {
    expect(hasSectionContent(makeResume({ education: [makeEducation()] }), section)).toBe(true)
  })

  it('returns false when education is empty', () => {
    expect(hasSectionContent(makeResume({ education: [] }), section)).toBe(false)
  })
})

describe('hasSectionContent – skills (individual mode)', () => {
  const section = makeSection({ id: 'skills', type: 'skills' })

  it('returns true when individual skills exist', () => {
    const resume = makeResume({
      skillsConfig: { mode: 'individual', headingStyle: 'inline' },
      skills: [makeSkill()],
    })
    expect(hasSectionContent(resume, section)).toBe(true)
  })

  it('returns false when individual skills list is empty', () => {
    const resume = makeResume({
      skillsConfig: { mode: 'individual', headingStyle: 'inline' },
      skills: [],
    })
    expect(hasSectionContent(resume, section)).toBe(false)
  })
})

describe('hasSectionContent – skills (grouped mode)', () => {
  const section = makeSection({ id: 'skills', type: 'skills' })

  it('returns true when at least one group has skills', () => {
    const resume = makeResume({
      skillsConfig: { mode: 'grouped', headingStyle: 'inline' },
      skillGroups: [makeSkillGroup()],
    })
    expect(hasSectionContent(resume, section)).toBe(true)
  })

  it('returns false when all groups are empty', () => {
    const resume = makeResume({
      skillsConfig: { mode: 'grouped', headingStyle: 'inline' },
      skillGroups: [{ id: uid(), category: 'Empty', skills: [] }],
    })
    expect(hasSectionContent(resume, section)).toBe(false)
  })

  it('returns false when skillGroups is empty', () => {
    const resume = makeResume({
      skillsConfig: { mode: 'grouped', headingStyle: 'inline' },
      skillGroups: [],
    })
    expect(hasSectionContent(resume, section)).toBe(false)
  })
})

describe('hasSectionContent – projects', () => {
  const section = makeSection({ id: 'projects', type: 'projects' })

  it('returns true when projects exist', () => {
    expect(hasSectionContent(makeResume({ projects: [makeProject()] }), section)).toBe(true)
  })

  it('returns false when projects list is empty', () => {
    expect(hasSectionContent(makeResume({ projects: [] }), section)).toBe(false)
  })
})

describe('hasSectionContent – certifications', () => {
  const section = makeSection({ id: 'certifications', type: 'certifications' })

  it('returns true when certifications exist', () => {
    expect(hasSectionContent(makeResume({ certifications: [makeCertification()] }), section)).toBe(true)
  })

  it('returns false when certifications list is empty', () => {
    expect(hasSectionContent(makeResume({ certifications: [] }), section)).toBe(false)
  })
})

describe('hasSectionContent – achievements', () => {
  const section = makeSection({ id: 'achievements', type: 'achievements' })

  it('returns true when achievements exist', () => {
    expect(hasSectionContent(makeResume({ achievements: [makeAchievement()] }), section)).toBe(true)
  })

  it('returns false when achievements list is empty', () => {
    expect(hasSectionContent(makeResume({ achievements: [] }), section)).toBe(false)
  })
})

describe('hasSectionContent – custom', () => {
  it('returns true when custom section has non-empty content', () => {
    const cs = makeCustomSection({ id: 'cs-1', content: 'Some text' })
    const section = makeSection({ id: 'cs-1', type: 'custom' })
    const resume = makeResume({ customSections: [cs] })
    expect(hasSectionContent(resume, section)).toBe(true)
  })

  it('returns false when custom section content is empty', () => {
    const cs = makeCustomSection({ id: 'cs-1', content: '' })
    const section = makeSection({ id: 'cs-1', type: 'custom' })
    const resume = makeResume({ customSections: [cs] })
    expect(hasSectionContent(resume, section)).toBe(false)
  })

  it('returns false when custom section content is whitespace', () => {
    const cs = makeCustomSection({ id: 'cs-1', content: '   ' })
    const section = makeSection({ id: 'cs-1', type: 'custom' })
    const resume = makeResume({ customSections: [cs] })
    expect(hasSectionContent(resume, section)).toBe(false)
  })

  it('returns false when custom section id is not found', () => {
    const section = makeSection({ id: 'nonexistent', type: 'custom' })
    const resume = makeResume({ customSections: [] })
    expect(hasSectionContent(resume, section)).toBe(false)
  })
})
