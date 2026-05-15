import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type {
  Resume,
  PersonalInfo,
  ContactDetails,
  Experience,
  Education,
  Skill,
  SkillGroup,
  SkillsConfig,
  Project,
  Certification,
  Achievement,
  CustomSection,
  ThemeSettings,
  SectionConfig,
  SectionType,
  SectionAlignment,
} from '@/types/resume'
import { sampleResume } from '@/utils/defaults'
import { SECTION_TYPE_META } from '@/types/resume'

export interface ResumeStore {
  resume: Resume
  activeSection: string

  setActiveSection: (id: string) => void

  // ── Personal info ──────────────────────────────────────────────────────────
  updatePersonalInfo: (data: Partial<PersonalInfo>) => void
  updatePhoto: (photo: string) => void

  // ── Contact ────────────────────────────────────────────────────────────────
  updateContact: (data: Partial<ContactDetails>) => void

  // ── Summary ────────────────────────────────────────────────────────────────
  updateSummary: (content: string) => void

  // ── Skills ────────────────────────────────────────────────────────────────
  setSkills: (skills: Skill[]) => void
  updateSkillsConfig: (data: Partial<SkillsConfig>) => void
  addSkillGroup: (group: SkillGroup) => void
  updateSkillGroup: (id: string, data: Partial<SkillGroup>) => void
  removeSkillGroup: (id: string) => void

  // ── Experience ────────────────────────────────────────────────────────────
  addExperience: (exp: Experience) => void
  updateExperience: (id: string, data: Partial<Experience>) => void
  removeExperience: (id: string) => void
  reorderExperience: (items: Experience[]) => void

  // ── Education ─────────────────────────────────────────────────────────────
  addEducation: (edu: Education) => void
  updateEducation: (id: string, data: Partial<Education>) => void
  removeEducation: (id: string) => void
  reorderEducation: (items: Education[]) => void

  // ── Projects ──────────────────────────────────────────────────────────────
  addProject: (proj: Project) => void
  updateProject: (id: string, data: Partial<Project>) => void
  removeProject: (id: string) => void
  reorderProjects: (items: Project[]) => void

  // ── Certifications ────────────────────────────────────────────────────────
  addCertification: (cert: Certification) => void
  updateCertification: (id: string, data: Partial<Certification>) => void
  removeCertification: (id: string) => void
  reorderCertifications: (items: Certification[]) => void

  // ── Achievements ──────────────────────────────────────────────────────────
  addAchievement: (ach: Achievement) => void
  updateAchievement: (id: string, data: Partial<Achievement>) => void
  removeAchievement: (id: string) => void
  reorderAchievements: (items: Achievement[]) => void

  // ── Custom sections ───────────────────────────────────────────────────────
  updateCustomSection: (id: string, data: Partial<CustomSection>) => void

  // ── Section system ────────────────────────────────────────────────────────
  addSection: (type: SectionType, title?: string) => void
  removeSection: (id: string) => void
  updateSectionConfig: (id: string, data: Partial<Pick<SectionConfig, 'title' | 'visible' | 'alignment'>>) => void
  updateSectionAlignment: (id: string, alignment: SectionAlignment) => void
  reorderSections: (sections: SectionConfig[]) => void
  toggleSectionVisibility: (id: string) => void

  // ── Theme ─────────────────────────────────────────────────────────────────
  updateTheme: (theme: Partial<ThemeSettings>) => void

  // ── Global ────────────────────────────────────────────────────────────────
  importResume: (resume: Resume) => void
  resetToSample: () => void
  clearResume: () => void
}

function touch(resume: Resume): Resume {
  return { ...resume, updatedAt: new Date().toISOString() }
}

function renumber(sections: SectionConfig[]): SectionConfig[] {
  return sections.map((s, i) => ({ ...s, order: i }))
}

export const useResumeStore = create<ResumeStore>()(
  persist(
    (set) => ({
      resume: sampleResume,
      activeSection: 'personalInfo',

      setActiveSection: (id) => set({ activeSection: id }),

      // ── Personal info ────────────────────────────────────────────────────
      updatePersonalInfo: (data) =>
        set((s) => ({
          resume: touch({ ...s.resume, personalInfo: { ...s.resume.personalInfo, ...data } }),
        })),

      updatePhoto: (photo) =>
        set((s) => ({
          resume: touch({ ...s.resume, personalInfo: { ...s.resume.personalInfo, photo } }),
        })),

      // ── Contact ──────────────────────────────────────────────────────────
      updateContact: (data) =>
        set((s) => ({
          resume: touch({ ...s.resume, contact: { ...s.resume.contact, ...data } }),
        })),

      // ── Summary ──────────────────────────────────────────────────────────
      updateSummary: (summary) =>
        set((s) => ({ resume: touch({ ...s.resume, summary }) })),

      // ── Skills ──────────────────────────────────────────────────────────
      setSkills: (skills) => set((s) => ({ resume: touch({ ...s.resume, skills }) })),

      updateSkillsConfig: (data) =>
        set((s) => ({
          resume: touch({ ...s.resume, skillsConfig: { ...s.resume.skillsConfig, ...data } }),
        })),

      addSkillGroup: (group) =>
        set((s) => ({
          resume: touch({ ...s.resume, skillGroups: [...s.resume.skillGroups, group] }),
        })),

      updateSkillGroup: (id, data) =>
        set((s) => ({
          resume: touch({
            ...s.resume,
            skillGroups: s.resume.skillGroups.map((g) => (g.id === id ? { ...g, ...data } : g)),
          }),
        })),

      removeSkillGroup: (id) =>
        set((s) => ({
          resume: touch({
            ...s.resume,
            skillGroups: s.resume.skillGroups.filter((g) => g.id !== id),
          }),
        })),

      // ── Experience ───────────────────────────────────────────────────────
      addExperience: (exp) =>
        set((s) => ({
          resume: touch({ ...s.resume, experience: [exp, ...s.resume.experience] }),
        })),

      updateExperience: (id, data) =>
        set((s) => ({
          resume: touch({
            ...s.resume,
            experience: s.resume.experience.map((e) => (e.id === id ? { ...e, ...data } : e)),
          }),
        })),

      removeExperience: (id) =>
        set((s) => ({
          resume: touch({
            ...s.resume,
            experience: s.resume.experience.filter((e) => e.id !== id),
          }),
        })),

      reorderExperience: (items) =>
        set((s) => ({ resume: touch({ ...s.resume, experience: items }) })),

      // ── Education ────────────────────────────────────────────────────────
      addEducation: (edu) =>
        set((s) => ({
          resume: touch({ ...s.resume, education: [edu, ...s.resume.education] }),
        })),

      updateEducation: (id, data) =>
        set((s) => ({
          resume: touch({
            ...s.resume,
            education: s.resume.education.map((e) => (e.id === id ? { ...e, ...data } : e)),
          }),
        })),

      removeEducation: (id) =>
        set((s) => ({
          resume: touch({
            ...s.resume,
            education: s.resume.education.filter((e) => e.id !== id),
          }),
        })),

      reorderEducation: (items) =>
        set((s) => ({ resume: touch({ ...s.resume, education: items }) })),

      // ── Projects ─────────────────────────────────────────────────────────
      addProject: (proj) =>
        set((s) => ({
          resume: touch({ ...s.resume, projects: [proj, ...s.resume.projects] }),
        })),

      updateProject: (id, data) =>
        set((s) => ({
          resume: touch({
            ...s.resume,
            projects: s.resume.projects.map((p) => (p.id === id ? { ...p, ...data } : p)),
          }),
        })),

      removeProject: (id) =>
        set((s) => ({
          resume: touch({
            ...s.resume,
            projects: s.resume.projects.filter((p) => p.id !== id),
          }),
        })),

      reorderProjects: (items) =>
        set((s) => ({ resume: touch({ ...s.resume, projects: items }) })),

      // ── Certifications ───────────────────────────────────────────────────
      addCertification: (cert) =>
        set((s) => ({
          resume: touch({ ...s.resume, certifications: [cert, ...s.resume.certifications] }),
        })),

      updateCertification: (id, data) =>
        set((s) => ({
          resume: touch({
            ...s.resume,
            certifications: s.resume.certifications.map((c) =>
              c.id === id ? { ...c, ...data } : c,
            ),
          }),
        })),

      removeCertification: (id) =>
        set((s) => ({
          resume: touch({
            ...s.resume,
            certifications: s.resume.certifications.filter((c) => c.id !== id),
          }),
        })),

      reorderCertifications: (items) =>
        set((s) => ({ resume: touch({ ...s.resume, certifications: items }) })),

      // ── Achievements ─────────────────────────────────────────────────────
      addAchievement: (ach) =>
        set((s) => ({
          resume: touch({ ...s.resume, achievements: [ach, ...s.resume.achievements] }),
        })),

      updateAchievement: (id, data) =>
        set((s) => ({
          resume: touch({
            ...s.resume,
            achievements: s.resume.achievements.map((a) =>
              a.id === id ? { ...a, ...data } : a,
            ),
          }),
        })),

      removeAchievement: (id) =>
        set((s) => ({
          resume: touch({
            ...s.resume,
            achievements: s.resume.achievements.filter((a) => a.id !== id),
          }),
        })),

      reorderAchievements: (items) =>
        set((s) => ({ resume: touch({ ...s.resume, achievements: items }) })),

      // ── Custom sections ──────────────────────────────────────────────────
      updateCustomSection: (id, data) =>
        set((s) => ({
          resume: touch({
            ...s.resume,
            customSections: s.resume.customSections.map((c) =>
              c.id === id ? { ...c, ...data } : c,
            ),
          }),
        })),

      // ── Section system ───────────────────────────────────────────────────
      addSection: (type, title) => {
        const id = type === 'custom' ? crypto.randomUUID() : type
        const defaultTitle = title ?? SECTION_TYPE_META[type].defaultTitle
        set((s) => {
          // Prevent duplicate built-in sections (custom always allowed)
          if (type !== 'custom' && s.resume.sections.some((sec) => sec.id === id)) return s
          const maxOrder = s.resume.sections.reduce((m, sec) => Math.max(m, sec.order), -1)
          const newSection: SectionConfig = {
            id,
            type,
            title: defaultTitle,
            visible: true,
            order: maxOrder + 1,
            alignment: 'left',
          }
          const customSections =
            type === 'custom'
              ? [...s.resume.customSections, { id, content: '' }]
              : s.resume.customSections
          return {
            resume: touch({
              ...s.resume,
              sections: [...s.resume.sections, newSection],
              customSections,
            }),
            activeSection: id,
          }
        })
      },

      removeSection: (id) =>
        set((s) => {
          const section = s.resume.sections.find((sec) => sec.id === id)
          const remaining = renumber(
            s.resume.sections.filter((sec) => sec.id !== id).sort((a, b) => a.order - b.order),
          )
          const customSections =
            section?.type === 'custom'
              ? s.resume.customSections.filter((c) => c.id !== id)
              : s.resume.customSections
          return {
            resume: touch({ ...s.resume, sections: remaining, customSections }),
            activeSection: s.activeSection === id ? 'personalInfo' : s.activeSection,
          }
        }),

      updateSectionConfig: (id, data) =>
        set((s) => ({
          resume: touch({
            ...s.resume,
            sections: s.resume.sections.map((sec) =>
              sec.id === id ? { ...sec, ...data } : sec,
            ),
          }),
        })),

      updateSectionAlignment: (id, alignment) =>
        set((s) => ({
          resume: touch({
            ...s.resume,
            sections: s.resume.sections.map((sec) =>
              sec.id === id ? { ...sec, alignment } : sec,
            ),
          }),
        })),

      reorderSections: (sections) =>
        set((s) => ({ resume: touch({ ...s.resume, sections: renumber(sections) }) })),

      toggleSectionVisibility: (id) =>
        set((s) => ({
          resume: touch({
            ...s.resume,
            sections: s.resume.sections.map((sec) =>
              sec.id === id ? { ...sec, visible: !sec.visible } : sec,
            ),
          }),
        })),

      // ── Theme ────────────────────────────────────────────────────────────
      updateTheme: (theme) =>
        set((s) => ({
          resume: touch({ ...s.resume, theme: { ...s.resume.theme, ...theme } }),
        })),

      // ── Global ───────────────────────────────────────────────────────────
      importResume: (resume) =>
        set({ resume: touch(resume), activeSection: 'personalInfo' }),

      resetToSample: () => set({ resume: sampleResume, activeSection: 'personalInfo' }),

      clearResume: () =>
        set((s) => ({
          resume: {
            ...sampleResume,
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            personalInfo: { ...sampleResume.personalInfo, fullName: '', jobTitle: '', photo: '' },
            contact: { email: '', phone: '', address: '', website: '', github: '', linkedin: '' },
            summary: '',
            skills: [],
            skillGroups: [],
            experience: [],
            projects: [],
            education: [],
            certifications: [],
            achievements: [],
            customSections: [],
            sections: s.resume.sections,
          },
          activeSection: 'personalInfo',
        })),
    }),
    {
      name: 'resume-builder-data',
      version: 3,
      storage: createJSONStorage(() => localStorage),
      migrate(persistedState, version) {
        const state = persistedState as { resume?: { theme?: Record<string, unknown> } }
        if (version < 3 && state.resume?.theme) {
          const old = state.resume.theme as Record<string, unknown>
          state.resume.theme = {
            preset: 'classic',
            fontScale: old['fontSize'] === 'sm' ? 0.9 : old['fontSize'] === 'lg' ? 1.1 : 1.0,
            spacingDensity: 1.0,
            ...(old['primaryColor'] ? { primaryColor: old['primaryColor'] } : {}),
            ...(old['accentColor']  ? { accentColor:  old['accentColor']  } : {}),
            ...(old['fontFamily'] && old['fontFamily'] !== 'inter' ? { fontFamily: old['fontFamily'] } : {}),
          }
        }
        return persistedState
      },
    },
  ),
)
