import { useResume, useResumeSelectors } from '@/hooks/useResume'
import { PersonalInfoEditor } from '@/editor/sections/PersonalInfoEditor'
import { ContactEditor } from '@/editor/sections/ContactEditor'
import { SectionManager } from '@/editor/SectionManager'
import { ThemeEditor } from '@/editor/sections/ThemeEditor'
import { PlaceholderEditor } from '@/editor/sections/PlaceholderEditor'
import { SECTION_EDITORS } from '@/editor/sections'

// Re-exported for backward compatibility — section editors import this type from here
export type { SectionEditorProps } from '@/editor/sections'

export function SectionEditor() {
  const resume = useResume()
  const { activeSection } = useResumeSelectors()

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

  const ContentEditor = SECTION_EDITORS[section.type]
  if (!ContentEditor) {
    return <PlaceholderEditor section={section.title} description="Editor not implemented yet." />
  }

  return <ContentEditor section={section} />
}
