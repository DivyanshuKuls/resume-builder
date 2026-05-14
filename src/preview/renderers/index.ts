/**
 * Section renderer registry.
 *
 * To add a new section type:
 * 1. Create a renderer component in this directory
 * 2. Import it here and add it to SECTION_RENDERERS
 * 3. Add the type to SectionType in @/types/resume.ts
 * 4. Add an entry in SECTION_TYPE_META
 * 5. Wire up store actions and editor
 *
 * To swap renderers per-theme in the future, replace this registry with a
 * theme-aware hook: `const renderers = useThemeRenderers()`
 */

import type { SectionType } from '@/types/resume'
import type { SectionContentComponent } from './types'

import { SummaryRenderer } from './SummaryRenderer'
import { ExperienceRenderer } from './ExperienceRenderer'
import { EducationRenderer } from './EducationRenderer'
import { SkillRenderer } from './SkillRenderer'
import { ProjectRenderer } from './ProjectRenderer'
import { CertificationRenderer } from './CertificationRenderer'
import { AchievementRenderer } from './AchievementRenderer'
import { CustomSectionRenderer } from './CustomSectionRenderer'

export const SECTION_RENDERERS: Record<SectionType, SectionContentComponent> = {
  summary:        SummaryRenderer,
  experience:     ExperienceRenderer,
  education:      EducationRenderer,
  skills:         SkillRenderer,
  projects:       ProjectRenderer,
  certifications: CertificationRenderer,
  achievements:   AchievementRenderer,
  custom:         CustomSectionRenderer,
}

export type { SectionContentComponent, RendererProps } from './types'
export { hasSectionContent } from './types'
