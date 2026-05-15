import type { Resume, SectionConfig, SectionType } from '@/types/resume'

/**
 * Single source of truth for whether a section has renderable content.
 * Used by both the preview layer (to skip empty sections) and the editor
 * nav (to show the filled-dot indicator).
 */
export function hasSectionContent(resume: Resume, section: SectionConfig): boolean {
  switch (section.type as SectionType) {
    case 'summary':
      return !!resume.summary.trim()
    case 'experience':
      return resume.experience.length > 0
    case 'education':
      return resume.education.length > 0
    case 'skills':
      return resume.skillsConfig.mode === 'individual'
        ? resume.skills.length > 0
        : resume.skillGroups.some((g) => g.skills.length > 0)
    case 'projects':
      return resume.projects.length > 0
    case 'certifications':
      return resume.certifications.length > 0
    case 'achievements':
      return resume.achievements.length > 0
    case 'custom': {
      const cs = resume.customSections.find((c) => c.id === section.id)
      return !!(cs?.content.trim())
    }
    default:
      return false
  }
}
