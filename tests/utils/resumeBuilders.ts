/**
 * Factory helpers that build minimal valid Resume / sub-objects for tests.
 * Use these instead of importing sampleResume directly so tests don't depend
 * on the sample data's content (which may change).
 */
import type {
  Resume,
  PersonalInfo,
  ContactDetails,
  SectionConfig,
  ThemeSettings,
  Experience,
  Education,
  Skill,
  SkillGroup,
  Project,
  Certification,
  Achievement,
  CustomSection,
} from '@/types/resume'

let _id = 0
export const uid = () => `test-id-${++_id}`

export function makePersonalInfo(overrides: Partial<PersonalInfo> = {}): PersonalInfo {
  return {
    fullName: 'Jane Doe',
    jobTitle: 'Software Engineer',
    photo: '',
    photoAlignment: 'left',
    ...overrides,
  }
}

export function makeContact(overrides: Partial<ContactDetails> = {}): ContactDetails {
  return {
    email: 'jane@example.com',
    phone: '+1 555 000 0000',
    address: 'New York, NY',
    website: 'janedoe.dev',
    github: 'github.com/janedoe',
    linkedin: 'linkedin.com/in/janedoe',
    ...overrides,
  }
}

export function makeSection(overrides: Partial<SectionConfig> = {}): SectionConfig {
  return {
    id: 'experience',
    type: 'experience',
    title: 'Work Experience',
    visible: true,
    order: 0,
    alignment: 'left',
    ...overrides,
  }
}

export function makeTheme(overrides: Partial<ThemeSettings> = {}): ThemeSettings {
  return {
    preset: 'classic',
    fontScale: 1.0,
    spacingDensity: 1.0,
    ...overrides,
  }
}

export function makeExperience(overrides: Partial<Experience> = {}): Experience {
  return {
    id: uid(),
    company: 'Acme Corp',
    position: 'Engineer',
    startDate: '2020-01',
    endDate: '',
    current: true,
    location: 'Remote',
    description: '',
    highlights: ['Built things'],
    ...overrides,
  }
}

export function makeEducation(overrides: Partial<Education> = {}): Education {
  return {
    id: uid(),
    institution: 'State University',
    degree: 'B.S.',
    field: 'Computer Science',
    startDate: '2016-09',
    endDate: '2020-05',
    gpa: '',
    highlights: [],
    ...overrides,
  }
}

export function makeSkill(overrides: Partial<Skill> = {}): Skill {
  return { id: uid(), name: 'TypeScript', ...overrides }
}

export function makeSkillGroup(overrides: Partial<SkillGroup> = {}): SkillGroup {
  return {
    id: uid(),
    category: 'Frontend',
    skills: [makeSkill({ name: 'React' }), makeSkill({ name: 'TypeScript' })],
    ...overrides,
  }
}

export function makeProject(overrides: Partial<Project> = {}): Project {
  return {
    id: uid(),
    name: 'My Project',
    description: 'A test project',
    url: '',
    technologies: ['React'],
    highlights: [],
    ...overrides,
  }
}

export function makeCertification(overrides: Partial<Certification> = {}): Certification {
  return {
    id: uid(),
    name: 'AWS SAA',
    issuer: 'Amazon',
    date: '2023-01',
    expiryDate: '',
    url: '',
    description: '',
    ...overrides,
  }
}

export function makeAchievement(overrides: Partial<Achievement> = {}): Achievement {
  return {
    id: uid(),
    title: 'Best Employee',
    description: 'Won award',
    date: '2023-06',
    ...overrides,
  }
}

export function makeCustomSection(overrides: Partial<CustomSection> = {}): CustomSection {
  return { id: uid(), content: 'Custom content here', ...overrides }
}

export function makeResume(overrides: Partial<Resume> = {}): Resume {
  return {
    id: uid(),
    title: 'Test Resume',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    personalInfo: makePersonalInfo(),
    contact: makeContact(),
    summary: 'A brief summary.',
    skills: [makeSkill()],
    skillGroups: [],
    skillsConfig: { mode: 'individual', headingStyle: 'inline' },
    experience: [makeExperience()],
    projects: [],
    education: [makeEducation()],
    certifications: [],
    achievements: [],
    customSections: [],
    theme: makeTheme(),
    sections: [
      makeSection({ id: 'summary', type: 'summary', title: 'Summary', order: 0 }),
      makeSection({ id: 'experience', type: 'experience', title: 'Work Experience', order: 1 }),
      makeSection({ id: 'education', type: 'education', title: 'Education', order: 2 }),
      makeSection({ id: 'skills', type: 'skills', title: 'Skills', order: 3 }),
    ],
    ...overrides,
  }
}
