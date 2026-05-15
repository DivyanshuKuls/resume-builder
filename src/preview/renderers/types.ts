import type { Resume, SectionConfig } from '@/types/resume'

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

export { hasSectionContent } from '@/utils/sectionContent'
