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

export function SectionEditor() {
  const { resume, activeSection } = useResumeStore()

  // Fixed navigation targets
  switch (activeSection) {
    case 'personalInfo': return <PersonalInfoEditor />
    case 'contact':      return <ContactEditor />
    case 'sections':     return <SectionManager />
    case 'theme':        return <ThemeEditor />
  }

  // Dynamic section routing — look up the section in the store
  const section = resume.sections.find((s) => s.id === activeSection)
  if (!section) {
    return <PlaceholderEditor section="Section" description="Select a section from the left to start editing." />
  }

  switch (section.type) {
    case 'summary':        return <SummaryEditor />
    case 'skills':         return <SkillsEditor />
    case 'experience':     return <ExperienceEditor />
    case 'projects':       return <ProjectsEditor />
    case 'education':      return <EducationEditor />
    case 'certifications': return <CertificationsEditor />
    case 'achievements':   return <AchievementsEditor />
    case 'custom':         return <CustomSectionEditor sectionId={activeSection} />
    default:
      return <PlaceholderEditor section={section.title} description="Editor not implemented yet." />
  }
}
