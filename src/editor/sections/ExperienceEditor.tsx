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
import type { Experience } from '@/types/resume'
import type { SectionEditorProps } from '@/editor/SectionEditor'

const SECTION_KEY = 'experience'

function ExperienceEntryForm({ exp }: { exp: Experience }) {
  const { updateExperience } = useResumeActions()
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

      <label className="flex cursor-pointer items-center gap-2 text-xs text-slate-600">
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

export function ExperienceEditor({ section }: SectionEditorProps) {
  const resume = useResume()
  const { addExperience, removeExperience, reorderExperience } = useResumeActions()
  const { expandedEntry, setExpandedEntry, toggleExpandedEntry } = useUIStore()
  const expandedId = expandedEntry[SECTION_KEY] ?? null

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
    setExpandedEntry(SECTION_KEY, newExp.id)
  }

  return (
    <div>
      <SectionHeader
        title={section.title}
        description="Most recent first · drag to reorder"
        onAdd={handleAdd}
        addLabel="Add Job"
      />

      {resume.experience.length === 0 && (
        <EmptyState message="No experience entries yet." action="Add Job" />
      )}

      <SortableEntryList
        ids={resume.experience.map((e) => e.id)}
        onReorder={(from, to) =>
          reorderExperience(arrayMove([...resume.experience], from, to))
        }
      >
        {resume.experience.map((exp) => (
          <SortableEntryCard key={exp.id} id={exp.id}>
            {(handleProps) => (
              <EntryCard
                title={exp.position}
                subtitle={exp.company}
                meta={formatDateRange(exp.startDate, exp.endDate, exp.current)}
                isExpanded={expandedId === exp.id}
                onToggle={() => toggleExpandedEntry(SECTION_KEY, exp.id)}
                onDelete={() => {
                  removeExperience(exp.id)
                  if (expandedId === exp.id) setExpandedEntry(SECTION_KEY, null)
                }}
                dragHandleProps={handleProps}
              >
                <ExperienceEntryForm exp={exp} />
              </EntryCard>
            )}
          </SortableEntryCard>
        ))}
      </SortableEntryList>
    </div>
  )
}
