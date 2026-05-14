import type { Resume, SectionConfig, SectionType } from '@/types/resume'

/**
 * Props shared by every section content renderer.
 * `section` is provided so renderers can access alignment, title, and type-specific
 * config stored alongside the section (e.g. skillsConfig lives on Resume but is
 * conceptually tied to the skills section).
 */
export interface RendererProps {
  resume: Resume
  section: SectionConfig
}

/** Every section content renderer satisfies this contract. */
export type SectionContentComponent = React.ComponentType<RendererProps>

/**
 * Determines whether a section has enough data to render.
 * Used by SectionRenderer to skip sections with no content (avoids
 * rendering a floating heading with nothing below it).
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
