import { useShallow } from 'zustand/shallow'
import { useResumeStore } from '@/store/resumeStore'
import type { ResumeStore } from '@/store/resumeStore'
import type { Resume } from '@/types/resume'

// ── Data ─────────────────────────────────────────────────────────────────────

/** Full Resume object. Re-renders whenever any resume field changes. */
export function useResume(): Resume {
  return useResumeStore((s) => s.resume)
}

// ── UI selectors ─────────────────────────────────────────────────────────────

export interface ResumeSelectors {
  activeSection: string
}

/** UI state derived from the store. Re-renders only when these values change. */
export function useResumeSelectors(): ResumeSelectors {
  return useResumeStore(
    useShallow((s): ResumeSelectors => ({ activeSection: s.activeSection })),
  )
}

// ── Actions ──────────────────────────────────────────────────────────────────

export type ResumeActions = Omit<ResumeStore, 'resume' | 'activeSection'>

/**
 * All store mutation actions. Stable references — never causes re-renders
 * because Zustand action functions are created once and never replaced.
 */
export function useResumeActions(): ResumeActions {
  return useResumeStore(
    useShallow(
      (s): ResumeActions => ({
        setActiveSection:        s.setActiveSection,
        updatePersonalInfo:      s.updatePersonalInfo,
        updatePhoto:             s.updatePhoto,
        updateContact:           s.updateContact,
        updateSummary:           s.updateSummary,
        setSkills:               s.setSkills,
        updateSkillsConfig:      s.updateSkillsConfig,
        addSkillGroup:           s.addSkillGroup,
        updateSkillGroup:        s.updateSkillGroup,
        removeSkillGroup:        s.removeSkillGroup,
        addExperience:           s.addExperience,
        updateExperience:        s.updateExperience,
        removeExperience:        s.removeExperience,
        reorderExperience:       s.reorderExperience,
        addEducation:            s.addEducation,
        updateEducation:         s.updateEducation,
        removeEducation:         s.removeEducation,
        reorderEducation:        s.reorderEducation,
        addProject:              s.addProject,
        updateProject:           s.updateProject,
        removeProject:           s.removeProject,
        reorderProjects:         s.reorderProjects,
        addCertification:        s.addCertification,
        updateCertification:     s.updateCertification,
        removeCertification:     s.removeCertification,
        reorderCertifications:   s.reorderCertifications,
        addAchievement:          s.addAchievement,
        updateAchievement:       s.updateAchievement,
        removeAchievement:       s.removeAchievement,
        reorderAchievements:     s.reorderAchievements,
        updateCustomSection:     s.updateCustomSection,
        addSection:              s.addSection,
        removeSection:           s.removeSection,
        updateSectionConfig:     s.updateSectionConfig,
        updateSectionAlignment:  s.updateSectionAlignment,
        reorderSections:         s.reorderSections,
        toggleSectionVisibility: s.toggleSectionVisibility,
        updateTheme:             s.updateTheme,
        importResume:            s.importResume,
        resetToSample:           s.resetToSample,
        clearResume:             s.clearResume,
      }),
    ),
  )
}
