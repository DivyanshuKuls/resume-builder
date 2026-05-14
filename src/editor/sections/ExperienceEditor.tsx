import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useResumeStore } from '@/store/resumeStore'
import { EntryCard } from '@/editor/components/EntryCard'
import { BulletListEditor } from '@/editor/components/BulletListEditor'
import { SectionHeader } from '@/editor/components/SectionHeader'
import { formatDateRange } from '@/utils/formatDate'
import type { Experience } from '@/types/resume'

function ExperienceEntryForm({ exp }: { exp: Experience }) {
  const { updateExperience } = useResumeStore()
  const upd = (data: Partial<Experience>) => updateExperience(exp.id, data)

  return (
    <>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label>Job Title</Label>
          <Input
            value={exp.position}
            placeholder="Senior Engineer"
            onChange={(e) => upd({ position: e.target.value })}
          />
        </div>
        <div>
          <Label>Company</Label>
          <Input
            value={exp.company}
            placeholder="Acme Corp"
            onChange={(e) => upd({ company: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label>Start Date</Label>
          <Input
            value={exp.startDate}
            placeholder="YYYY-MM"
            onChange={(e) => upd({ startDate: e.target.value })}
          />
        </div>
        <div>
          <Label>End Date</Label>
          <Input
            value={exp.endDate}
            placeholder="YYYY-MM or leave blank"
            disabled={exp.current}
            onChange={(e) => upd({ endDate: e.target.value })}
          />
        </div>
      </div>

      <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
        <input
          type="checkbox"
          checked={exp.current}
          onChange={(e) => upd({ current: e.target.checked, endDate: '' })}
          className="rounded border-slate-300"
        />
        Currently working here
      </label>

      <div>
        <Label>Location</Label>
        <Input
          value={exp.location}
          placeholder="City, State or Remote"
          onChange={(e) => upd({ location: e.target.value })}
        />
      </div>

      <BulletListEditor
        label="Key Achievements"
        placeholder="Describe an achievement or responsibility…"
        value={exp.highlights}
        onChange={(highlights) => upd({ highlights })}
      />
    </>
  )
}

export function ExperienceEditor() {
  const { resume, addExperience, removeExperience, reorderExperience } = useResumeStore()
  const [expandedId, setExpandedId] = useState<string | null>(null)

  function handleAdd() {
    const newExp: Experience = {
      id: crypto.randomUUID(),
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      current: false,
      location: '',
      description: '',
      highlights: [],
    }
    addExperience(newExp)
    setExpandedId(newExp.id)
  }

  function move(index: number, direction: 'up' | 'down') {
    const items = [...resume.experience]
    const swap = direction === 'up' ? index - 1 : index + 1
    ;[items[index], items[swap]] = [items[swap], items[index]]
    reorderExperience(items)
  }

  return (
    <div>
      <SectionHeader
        title="Work Experience"
        description="Most recent first"
        onAdd={handleAdd}
        addLabel="Add Job"
      />

      {resume.experience.length === 0 && (
        <p className="py-8 text-center text-xs text-slate-400">
          No experience entries yet. Click &quot;Add Job&quot; to get started.
        </p>
      )}

      <div className="space-y-2">
        {resume.experience.map((exp, i) => (
          <EntryCard
            key={exp.id}
            title={exp.position}
            subtitle={exp.company}
            meta={formatDateRange(exp.startDate, exp.endDate, exp.current)}
            isExpanded={expandedId === exp.id}
            isFirst={i === 0}
            isLast={i === resume.experience.length - 1}
            onToggle={() => setExpandedId(expandedId === exp.id ? null : exp.id)}
            onDelete={() => {
              removeExperience(exp.id)
              if (expandedId === exp.id) setExpandedId(null)
            }}
            onMoveUp={() => move(i, 'up')}
            onMoveDown={() => move(i, 'down')}
          >
            <ExperienceEntryForm exp={exp} />
          </EntryCard>
        ))}
      </div>
    </div>
  )
}
