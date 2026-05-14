// ─── Primitive types ─────────────────────────────────────────────────────────

export type SectionAlignment = 'left' | 'center' | 'right'
export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert'
export type PhotoAlignment = 'left' | 'right' | 'none'
export type SkillHeadingStyle = 'inline' | 'block'

// ─── Section system ───────────────────────────────────────────────────────────

export type SectionType =
  | 'summary'
  | 'skills'
  | 'experience'
  | 'projects'
  | 'education'
  | 'certifications'
  | 'achievements'
  | 'custom'

export const SECTION_TYPE_META: Record<SectionType, { label: string; defaultTitle: string }> = {
  summary:        { label: 'Summary',        defaultTitle: 'Summary' },
  skills:         { label: 'Skills',         defaultTitle: 'Skills' },
  experience:     { label: 'Experience',     defaultTitle: 'Work Experience' },
  projects:       { label: 'Projects',       defaultTitle: 'Projects' },
  education:      { label: 'Education',      defaultTitle: 'Education' },
  certifications: { label: 'Certifications', defaultTitle: 'Certifications' },
  achievements:   { label: 'Achievements',   defaultTitle: 'Achievements' },
  custom:         { label: 'Custom',         defaultTitle: 'Custom Section' },
}

export interface SectionConfig {
  /** For built-in types: equals the type string. For custom: a UUID. */
  id: string
  type: SectionType
  /** Editable heading shown in the resume */
  title: string
  visible: boolean
  order: number
  alignment: SectionAlignment
}

// ─── Personal info & contact ──────────────────────────────────────────────────

export interface PersonalInfo {
  fullName: string
  jobTitle: string
  photo: string        // base64 or URL
  photoAlignment: PhotoAlignment
}

export interface ContactDetails {
  email: string
  phone: string
  address: string
  website: string
  github: string
  linkedin: string
}

// ─── Sections data ────────────────────────────────────────────────────────────

export interface Skill {
  id: string
  name: string
  level?: SkillLevel
}

export interface SkillGroup {
  id: string
  category: string
  skills: Skill[]
}

export interface SkillsConfig {
  mode: 'individual' | 'grouped'
  headingStyle: SkillHeadingStyle
}

export interface Experience {
  id: string
  company: string
  position: string
  startDate: string
  endDate: string
  current: boolean
  location: string
  description: string
  highlights: string[]
}

export interface Project {
  id: string
  name: string
  description: string
  url: string
  technologies: string[]
  highlights: string[]
}

export interface Education {
  id: string
  institution: string
  degree: string
  field: string
  startDate: string
  endDate: string
  gpa: string
  highlights: string[]
}

export interface Certification {
  id: string
  name: string
  issuer: string
  date: string
  expiryDate: string
  url: string
  description: string
}

export interface Achievement {
  id: string
  title: string
  description: string
  date: string
}

export interface CustomSection {
  id: string
  content: string
}

export interface ThemeSettings {
  primaryColor: string
  fontFamily: string
  fontSize: 'sm' | 'md' | 'lg'
  accentColor: string
}

// ─── Root Resume ──────────────────────────────────────────────────────────────

export interface Resume {
  id: string
  title: string
  createdAt: string
  updatedAt: string
  personalInfo: PersonalInfo
  contact: ContactDetails
  summary: string
  skills: Skill[]
  skillGroups: SkillGroup[]
  skillsConfig: SkillsConfig
  experience: Experience[]
  projects: Project[]
  education: Education[]
  certifications: Certification[]
  achievements: Achievement[]
  customSections: CustomSection[]
  theme: ThemeSettings
  /** Body sections only — personal info and contact are always rendered first */
  sections: SectionConfig[]
}
