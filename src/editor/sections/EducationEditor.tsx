import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useResume, useResumeActions } from '@/hooks/useResume'
import { useUIStore } from '@/store/uiStore'
import { EntryCard } from '@/editor/components/EntryCard'
import { BulletListEditor } from '@/editor/components/BulletListEditor'
import { SectionHeader } from '@/editor/components/SectionHeader'
import { EmptyState } from '@/editor/components/EmptyState'
import { SortableEntryList, SortableEntryCard, arrayMove } from '@/editor/components/SortableEntryList'
import { formatDateRange } from '@/utils/formatDate'
import type { Education } from '@/types/resume'
import type { SectionEditorProps } from '@/editor/SectionEditor'

const SECTION_KEY = 'education'

function EducationEntryForm({ edu }: { edu: Education }) {
  const { updateEducation } = useResumeActions()
  const upd = (data: Partial<Education>) => updateEducation(edu.id, data)

  return (
    <>
      <div>
        <Label>Institution</Label>
        <Input
          value={edu.institution}
          placeholder="University of …"
          onChange={(e) => upd({ institution: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label>Degree</Label>
          <Input
            value={edu.degree}
            placeholder="B.S. / M.S. / Ph.D."
            onChange={(e) => upd({ degree: e.target.value })}
          />
        </div>
        <div>
          <Label>Field of Study</Label>
          <Input
            value={edu.field}
            placeholder="Computer Science"
            onChange={(e) => upd({ field: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div>
          <Label>Start</Label>
          <Input
            value={edu.startDate}
            placeholder="YYYY-MM"
            onChange={(e) => upd({ startDate: e.target.value })}
          />
        </div>
        <div>
          <Label>End</Label>
          <Input
            value={edu.endDate}
            placeholder="YYYY-MM"
            onChange={(e) => upd({ endDate: e.target.value })}
          />
        </div>
        <div>
          <Label>GPA</Label>
          <Input
            value={edu.gpa}
            placeholder="3.8"
            onChange={(e) => upd({ gpa: e.target.value })}
          />
        </div>
      </div>

      <BulletListEditor
        label="Highlights (optional)"
        placeholder="Relevant coursework, awards, activities…"
        value={edu.highlights}
        onChange={(highlights) => upd({ highlights })}
      />
    </>
  )
}

export function EducationEditor({ section }: SectionEditorProps) {
  const resume = useResume()
  const { addEducation, removeEducation, reorderEducation } = useResumeActions()
  const { expandedEntry, setExpandedEntry, toggleExpandedEntry } = useUIStore()
  const expandedId = expandedEntry[SECTION_KEY] ?? null

  function handleAdd() {
    const newEdu: Education = {
      id: crypto.randomUUID(),
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      gpa: '',
      highlights: [],
    }
    addEducation(newEdu)
    setExpandedEntry(SECTION_KEY, newEdu.id)
  }

  return (
    <div>
      <SectionHeader
        title={section.title}
        description="Degrees, diplomas, and certificates · drag to reorder"
        onAdd={handleAdd}
        addLabel="Add Education"
      />

      {resume.education.length === 0 && (
        <EmptyState message="No education entries yet." action="Add Education" />
      )}

      <SortableEntryList
        ids={resume.education.map((e) => e.id)}
        onReorder={(from, to) =>
          reorderEducation(arrayMove([...resume.education], from, to))
        }
      >
        {resume.education.map((edu) => (
          <SortableEntryCard key={edu.id} id={edu.id}>
            {(handleProps) => (
              <EntryCard
                title={[edu.degree, edu.field].filter(Boolean).join(' in ') || 'Untitled'}
                subtitle={edu.institution}
                meta={formatDateRange(edu.startDate, edu.endDate, false)}
                isExpanded={expandedId === edu.id}
                onToggle={() => toggleExpandedEntry(SECTION_KEY, edu.id)}
                onDelete={() => {
                  removeEducation(edu.id)
                  if (expandedId === edu.id) setExpandedEntry(SECTION_KEY, null)
                }}
                dragHandleProps={handleProps}
              >
                <EducationEntryForm edu={edu} />
              </EntryCard>
            )}
          </SortableEntryCard>
        ))}
      </SortableEntryList>
    </div>
  )
}
