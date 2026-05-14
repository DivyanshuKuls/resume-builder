import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useResumeStore } from '@/store/resumeStore'
import { EntryCard } from '@/editor/components/EntryCard'
import { BulletListEditor } from '@/editor/components/BulletListEditor'
import { SectionHeader } from '@/editor/components/SectionHeader'
import { formatDateRange } from '@/utils/formatDate'
import type { Education } from '@/types/resume'

function EducationEntryForm({ edu }: { edu: Education }) {
  const { updateEducation } = useResumeStore()
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

export function EducationEditor() {
  const { resume, addEducation, removeEducation, reorderEducation } = useResumeStore()
  const [expandedId, setExpandedId] = useState<string | null>(null)

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
    setExpandedId(newEdu.id)
  }

  function move(index: number, direction: 'up' | 'down') {
    const items = [...resume.education]
    const swap = direction === 'up' ? index - 1 : index + 1
    ;[items[index], items[swap]] = [items[swap], items[index]]
    reorderEducation(items)
  }

  return (
    <div>
      <SectionHeader
        title="Education"
        description="Degrees, diplomas, and certificates"
        onAdd={handleAdd}
        addLabel="Add Education"
      />

      {resume.education.length === 0 && (
        <p className="py-8 text-center text-xs text-slate-400">
          No education entries yet. Click &quot;Add Education&quot; to get started.
        </p>
      )}

      <div className="space-y-2">
        {resume.education.map((edu, i) => (
          <EntryCard
            key={edu.id}
            title={[edu.degree, edu.field].filter(Boolean).join(' in ') || 'Untitled'}
            subtitle={edu.institution}
            meta={formatDateRange(edu.startDate, edu.endDate, false)}
            isExpanded={expandedId === edu.id}
            isFirst={i === 0}
            isLast={i === resume.education.length - 1}
            onToggle={() => setExpandedId(expandedId === edu.id ? null : edu.id)}
            onDelete={() => {
              removeEducation(edu.id)
              if (expandedId === edu.id) setExpandedId(null)
            }}
            onMoveUp={() => move(i, 'up')}
            onMoveDown={() => move(i, 'down')}
          >
            <EducationEntryForm edu={edu} />
          </EntryCard>
        ))}
      </div>
    </div>
  )
}
