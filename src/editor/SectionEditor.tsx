import { useResumeStore } from '@/store/resumeStore'
import { PersonalInfoEditor } from '@/editor/sections/PersonalInfoEditor'
import { ContactEditor } from '@/editor/sections/ContactEditor'
import { SummaryEditor } from '@/editor/sections/SummaryEditor'
import { SkillsEditor } from '@/editor/sections/SkillsEditor'
import { ExperienceEditor } from '@/editor/sections/ExperienceEditor'
import { ProjectsEditor } from '@/editor/sections/ProjectsEditor'
import { EducationEditor } from '@/editor/sections/EducationEditor'
import { CertificationsEditor } from '@/editor/sections/CertificationsEditor'
import { AchievementsEditor } from '@/editor/sections/AchievementsEditor'
import { CustomSectionEditor } from '@/editor/sections/CustomSectionEditor'
import { SectionManager } from '@/editor/SectionManager'
import { ThemeEditor } from '@/editor/sections/ThemeEditor'
import { PlaceholderEditor } from '@/editor/sections/PlaceholderEditor'
import type { SectionConfig } from '@/types/resume'

/** Props shared by all section content editors that edit a named body section. */
export interface SectionEditorProps {
  section: SectionConfig
}

export function SectionEditor() {
  const { resume, activeSection } = useResumeStore()

  // Fixed navigation targets — not backed by a SectionConfig
  switch (activeSection) {
    case 'personalInfo': return <PersonalInfoEditor />
    case 'contact':      return <ContactEditor />
    case 'sections':     return <SectionManager />
    case 'theme':        return <ThemeEditor />
  }

  // Dynamic section routing — section.title drives the editor panel header
  const section = resume.sections.find((s) => s.id === activeSection)
  if (!section) {
    return <PlaceholderEditor section="Section" description="Select a section from the left to start editing." />
  }

  switch (section.type) {
    case 'summary':        return <SummaryEditor        section={section} />
    case 'skills':         return <SkillsEditor         section={section} />
    case 'experience':     return <ExperienceEditor     section={section} />
    case 'projects':       return <ProjectsEditor       section={section} />
    case 'education':      return <EducationEditor      section={section} />
    case 'certifications': return <CertificationsEditor section={section} />
    case 'achievements':   return <AchievementsEditor   section={section} />
    case 'custom':         return <CustomSectionEditor  sectionId={activeSection} />
    default:
      return <PlaceholderEditor section={section.title} description="Editor not implemented yet." />
  }
}
