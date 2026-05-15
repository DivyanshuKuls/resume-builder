/**
 * Section editor registry.
 *
 * To add a new section type:
 * 1. Create an editor component in this directory
 * 2. Import it here and add it to SECTION_EDITORS
 * 3. Add the type to SectionType in @/types/resume.ts
 * 4. Add an entry in SECTION_TYPE_META
 * 5. Wire up store actions and renderer
 */

import type { SectionType } from '@/types/resume'
import type { SectionEditorProps } from './types'
import type { ComponentType } from 'react'

import { SummaryEditor } from './SummaryEditor'
import { SkillsEditor } from './SkillsEditor'
import { ExperienceEditor } from './ExperienceEditor'
import { ProjectsEditor } from './ProjectsEditor'
import { EducationEditor } from './EducationEditor'
import { CertificationsEditor } from './CertificationsEditor'
import { AchievementsEditor } from './AchievementsEditor'
import { CustomSectionEditor } from './CustomSectionEditor'

export const SECTION_EDITORS: Record<SectionType, ComponentType<SectionEditorProps>> = {
  summary:        SummaryEditor,
  skills:         SkillsEditor,
  experience:     ExperienceEditor,
  projects:       ProjectsEditor,
  education:      EducationEditor,
  certifications: CertificationsEditor,
  achievements:   AchievementsEditor,
  custom:         CustomSectionEditor,
}

export type { SectionEditorProps } from './types'
