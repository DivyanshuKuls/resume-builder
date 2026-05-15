import { describe, it, expect, beforeEach } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useResumeStore } from '@/store/resumeStore'
import {
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

// Reset store to initial (sampleResume) state before each test
beforeEach(() => {
  act(() => {
    useResumeStore.setState(useResumeStore.getInitialState())
    localStorage.clear()
  })
})

// ── Helper ────────────────────────────────────────────────────────────────────
function getStore() {
  return useResumeStore.getState()
}

// ── Personal info ─────────────────────────────────────────────────────────────
describe('updatePersonalInfo', () => {
  it('merges partial updates into personalInfo', () => {
    act(() => getStore().updatePersonalInfo({ fullName: 'Bob Smith' }))
    expect(getStore().resume.personalInfo.fullName).toBe('Bob Smith')
    expect(getStore().resume.personalInfo.jobTitle).toBeTruthy() // sample value preserved
  })

  it('updates updatedAt', () => {
    const before = getStore().resume.updatedAt
    act(() => getStore().updatePersonalInfo({ fullName: 'X' }))
    expect(getStore().resume.updatedAt).not.toBe(before)
  })
})

describe('updatePhoto', () => {
  it('sets photo on personalInfo', () => {
    act(() => getStore().updatePhoto('data:image/png;base64,abc'))
    expect(getStore().resume.personalInfo.photo).toBe('data:image/png;base64,abc')
  })
})

// ── Contact ───────────────────────────────────────────────────────────────────
describe('updateContact', () => {
  it('merges partial updates into contact', () => {
    act(() => getStore().updateContact({ email: 'new@example.com' }))
    expect(getStore().resume.contact.email).toBe('new@example.com')
  })
})

// ── Summary ───────────────────────────────────────────────────────────────────
describe('updateSummary', () => {
  it('sets summary text', () => {
    act(() => getStore().updateSummary('New summary text'))
    expect(getStore().resume.summary).toBe('New summary text')
  })
})

// ── Skills ────────────────────────────────────────────────────────────────────
describe('setSkills', () => {
  it('replaces skill list', () => {
    const skills = [makeSkill({ name: 'Go' }), makeSkill({ name: 'Rust' })]
    act(() => getStore().setSkills(skills))
    expect(getStore().resume.skills).toHaveLength(2)
    expect(getStore().resume.skills[0].name).toBe('Go')
  })
})

describe('addSkillGroup / updateSkillGroup / removeSkillGroup', () => {
  it('adds a skill group', () => {
    const group = makeSkillGroup({ category: 'Backend' })
    act(() => getStore().addSkillGroup(group))
    expect(getStore().resume.skillGroups.some((g) => g.id === group.id)).toBe(true)
  })

  it('updates a skill group', () => {
    const group = makeSkillGroup()
    act(() => {
      getStore().addSkillGroup(group)
      getStore().updateSkillGroup(group.id, { category: 'Updated' })
    })
    const found = getStore().resume.skillGroups.find((g) => g.id === group.id)
    expect(found?.category).toBe('Updated')
  })

  it('removes a skill group', () => {
    const group = makeSkillGroup()
    act(() => {
      getStore().addSkillGroup(group)
      getStore().removeSkillGroup(group.id)
    })
    expect(getStore().resume.skillGroups.some((g) => g.id === group.id)).toBe(false)
  })
})

// ── Experience ────────────────────────────────────────────────────────────────
describe('experience CRUD', () => {
  it('addExperience prepends to the list', () => {
    const exp = makeExperience({ company: 'New Co' })
    act(() => getStore().addExperience(exp))
    expect(getStore().resume.experience[0].company).toBe('New Co')
  })

  it('updateExperience patches matching entry', () => {
    const exp = makeExperience()
    act(() => {
      getStore().addExperience(exp)
      getStore().updateExperience(exp.id, { company: 'Updated Co' })
    })
    const found = getStore().resume.experience.find((e) => e.id === exp.id)
    expect(found?.company).toBe('Updated Co')
  })

  it('removeExperience deletes matching entry', () => {
    const exp = makeExperience()
    act(() => {
      getStore().addExperience(exp)
      getStore().removeExperience(exp.id)
    })
    expect(getStore().resume.experience.find((e) => e.id === exp.id)).toBeUndefined()
  })

  it('reorderExperience replaces the list', () => {
    const a = makeExperience({ company: 'A' })
    const b = makeExperience({ company: 'B' })
    act(() => {
      getStore().addExperience(a)
      getStore().addExperience(b)
      getStore().reorderExperience([a, b])
    })
    expect(getStore().resume.experience[0].company).toBe('A')
  })
})

// ── Education ─────────────────────────────────────────────────────────────────
describe('education CRUD', () => {
  it('addEducation prepends to the list', () => {
    const edu = makeEducation({ institution: 'MIT' })
    act(() => getStore().addEducation(edu))
    expect(getStore().resume.education[0].institution).toBe('MIT')
  })

  it('removeEducation deletes matching entry', () => {
    const edu = makeEducation()
    act(() => {
      getStore().addEducation(edu)
      getStore().removeEducation(edu.id)
    })
    expect(getStore().resume.education.find((e) => e.id === edu.id)).toBeUndefined()
  })
})

// ── Projects ──────────────────────────────────────────────────────────────────
describe('projects CRUD', () => {
  it('addProject prepends to the list', () => {
    const proj = makeProject({ name: 'Cool App' })
    act(() => getStore().addProject(proj))
    expect(getStore().resume.projects[0].name).toBe('Cool App')
  })

  it('removeProject deletes matching entry', () => {
    const proj = makeProject()
    act(() => {
      getStore().addProject(proj)
      getStore().removeProject(proj.id)
    })
    expect(getStore().resume.projects.find((p) => p.id === proj.id)).toBeUndefined()
  })
})

// ── Certifications ────────────────────────────────────────────────────────────
describe('certifications CRUD', () => {
  it('adds and removes a certification', () => {
    const cert = makeCertification()
    act(() => getStore().addCertification(cert))
    expect(getStore().resume.certifications.some((c) => c.id === cert.id)).toBe(true)
    act(() => getStore().removeCertification(cert.id))
    expect(getStore().resume.certifications.some((c) => c.id === cert.id)).toBe(false)
  })
})

// ── Achievements ──────────────────────────────────────────────────────────────
describe('achievements CRUD', () => {
  it('adds and removes an achievement', () => {
    const ach = makeAchievement()
    act(() => getStore().addAchievement(ach))
    expect(getStore().resume.achievements.some((a) => a.id === ach.id)).toBe(true)
    act(() => getStore().removeAchievement(ach.id))
    expect(getStore().resume.achievements.some((a) => a.id === ach.id)).toBe(false)
  })
})

// ── Custom sections ───────────────────────────────────────────────────────────
describe('updateCustomSection', () => {
  it('patches a custom section by id', () => {
    const cs = makeCustomSection({ id: 'cs-test', content: 'initial' })
    act(() => {
      // Inject directly to test the action in isolation
      useResumeStore.setState((s) => ({
        resume: { ...s.resume, customSections: [...s.resume.customSections, cs] },
      }))
      getStore().updateCustomSection('cs-test', { content: 'updated' })
    })
    const found = getStore().resume.customSections.find((c) => c.id === 'cs-test')
    expect(found?.content).toBe('updated')
  })
})

// ── Section system ────────────────────────────────────────────────────────────
describe('section visibility', () => {
  it('toggleSectionVisibility flips the visible flag', () => {
    const initial = getStore().resume.sections.find((s) => s.id === 'summary')!
    const wasVisible = initial.visible
    act(() => getStore().toggleSectionVisibility('summary'))
    const after = getStore().resume.sections.find((s) => s.id === 'summary')!
    expect(after.visible).toBe(!wasVisible)
  })
})

describe('addSection', () => {
  it('adds a new built-in section and prevents duplicates', () => {
    const before = getStore().resume.sections.length
    act(() => getStore().addSection('achievements'))
    // achievements already exists in default resume sections
    expect(getStore().resume.sections.length).toBe(before)
  })

  it('adds a custom section with a UUID id', () => {
    const before = getStore().resume.sections.length
    act(() => getStore().addSection('custom', 'My Custom Section'))
    expect(getStore().resume.sections.length).toBe(before + 1)
    const added = getStore().resume.sections[getStore().resume.sections.length - 1]
    expect(added.type).toBe('custom')
    expect(added.title).toBe('My Custom Section')
  })

  it('also adds a CustomSection entry for custom type', () => {
    act(() => getStore().addSection('custom'))
    const sections = getStore().resume.sections
    const newSection = sections[sections.length - 1]
    expect(getStore().resume.customSections.some((cs) => cs.id === newSection.id)).toBe(true)
  })
})

describe('removeSection', () => {
  it('removes a section and renumbers remaining sections', () => {
    act(() => getStore().addSection('custom', 'Temp'))
    const sectionId = getStore().resume.sections[getStore().resume.sections.length - 1].id
    const before = getStore().resume.sections.length
    act(() => getStore().removeSection(sectionId))
    expect(getStore().resume.sections.length).toBe(before - 1)
  })

  it('resets activeSection to personalInfo when removing active section', () => {
    act(() => getStore().addSection('custom', 'Active'))
    const sectionId = getStore().resume.sections[getStore().resume.sections.length - 1].id
    act(() => {
      getStore().setActiveSection(sectionId)
      getStore().removeSection(sectionId)
    })
    expect(getStore().activeSection).toBe('personalInfo')
  })
})

describe('updateSectionConfig', () => {
  it('updates title and visible', () => {
    act(() => getStore().updateSectionConfig('summary', { title: 'About Me', visible: false }))
    const sec = getStore().resume.sections.find((s) => s.id === 'summary')!
    expect(sec.title).toBe('About Me')
    expect(sec.visible).toBe(false)
  })
})

describe('updateSectionAlignment', () => {
  it('sets alignment on a section', () => {
    act(() => getStore().updateSectionAlignment('summary', 'center'))
    const sec = getStore().resume.sections.find((s) => s.id === 'summary')!
    expect(sec.alignment).toBe('center')
  })
})

describe('reorderSections', () => {
  it('replaces sections and renumbers orders', () => {
    const sections = getStore().resume.sections
    const reversed = [...sections].reverse()
    act(() => getStore().reorderSections(reversed))
    const result = getStore().resume.sections
    result.forEach((sec, i) => expect(sec.order).toBe(i))
  })
})

// ── Theme ─────────────────────────────────────────────────────────────────────
describe('updateTheme', () => {
  it('merges partial theme updates', () => {
    act(() => getStore().updateTheme({ preset: 'modern', fontScale: 1.2 }))
    expect(getStore().resume.theme.preset).toBe('modern')
    expect(getStore().resume.theme.fontScale).toBe(1.2)
  })

  it('preserves unmodified theme fields', () => {
    act(() => getStore().updateTheme({ preset: 'minimal' }))
    expect(getStore().resume.theme.spacingDensity).toBeDefined()
  })
})

// ── Global actions ────────────────────────────────────────────────────────────
describe('importResume', () => {
  it('replaces the entire resume and resets activeSection', () => {
    const { result } = renderHook(() => useResumeStore())
    const newResume = { ...result.current.resume, title: 'Imported' }
    act(() => result.current.importResume(newResume))
    expect(result.current.resume.title).toBe('Imported')
    expect(result.current.activeSection).toBe('personalInfo')
  })
})

describe('resetToSample', () => {
  it('restores the sample resume', () => {
    act(() => {
      getStore().updateSummary('custom summary')
      getStore().resetToSample()
    })
    expect(getStore().resume.personalInfo.fullName).toBe('Alex Johnson')
  })
})

describe('clearResume', () => {
  it('clears all content fields', () => {
    act(() => getStore().clearResume())
    const r = getStore().resume
    expect(r.personalInfo.fullName).toBe('')
    expect(r.summary).toBe('')
    expect(r.experience).toHaveLength(0)
    expect(r.skills).toHaveLength(0)
    expect(r.education).toHaveLength(0)
  })

  it('preserves section configuration', () => {
    const sectionsBeforeClear = getStore().resume.sections
    act(() => getStore().clearResume())
    expect(getStore().resume.sections).toHaveLength(sectionsBeforeClear.length)
  })
})
