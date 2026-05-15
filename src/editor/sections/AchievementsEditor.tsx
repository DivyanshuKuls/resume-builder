import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useResumeStore } from '@/store/resumeStore'
import { useUIStore } from '@/store/uiStore'
import { EntryCard } from '@/editor/components/EntryCard'
import { SectionHeader } from '@/editor/components/SectionHeader'
import { EmptyState } from '@/editor/components/EmptyState'
import { SortableEntryList, SortableEntryCard, arrayMove } from '@/editor/components/SortableEntryList'
import { formatDate } from '@/utils/formatDate'
import type { Achievement } from '@/types/resume'
import type { SectionEditorProps } from '@/editor/SectionEditor'

const SECTION_KEY = 'achievements'

function AchievementEntryForm({ ach }: { ach: Achievement }) {
  const { updateAchievement } = useResumeStore()
  const upd = (data: Partial<Achievement>) => updateAchievement(ach.id, data)

  return (
    <>
      <div>
        <Label>Title</Label>
        <Input
          value={ach.title}
          placeholder="1st Place, HackMIT 2024"
          onChange={(e) => upd({ title: e.target.value })}
        />
      </div>

      <div>
        <Label>Date</Label>
        <Input
          value={ach.date}
          placeholder="YYYY-MM"
          onChange={(e) => upd({ date: e.target.value })}
        />
      </div>

      <div>
        <Label>Description</Label>
        <Textarea
          value={ach.description}
          rows={3}
          placeholder="Briefly describe the achievement and its impact…"
          onChange={(e) => upd({ description: e.target.value })}
        />
      </div>
    </>
  )
}

export function AchievementsEditor({ section }: SectionEditorProps) {
  const { resume, addAchievement, removeAchievement, reorderAchievements } = useResumeStore()
  const { expandedEntry, setExpandedEntry, toggleExpandedEntry } = useUIStore()
  const expandedId = expandedEntry[SECTION_KEY] ?? null

  function handleAdd() {
    const newAch: Achievement = {
      id: crypto.randomUUID(),
      title: '',
      description: '',
      date: '',
    }
    addAchievement(newAch)
    setExpandedEntry(SECTION_KEY, newAch.id)
  }

  return (
    <div>
      <SectionHeader
        title={section.title}
        description="Awards, recognitions, and notable accomplishments · drag to reorder"
        onAdd={handleAdd}
        addLabel="Add Achievement"
      />

      {resume.achievements.length === 0 && (
        <EmptyState message="No achievements yet." action="Add Achievement" />
      )}

      <SortableEntryList
        ids={resume.achievements.map((a) => a.id)}
        onReorder={(from, to) =>
          reorderAchievements(arrayMove([...resume.achievements], from, to))
        }
      >
        {resume.achievements.map((ach) => (
          <SortableEntryCard key={ach.id} id={ach.id}>
            {(handleProps) => (
              <EntryCard
                title={ach.title}
                meta={formatDate(ach.date)}
                isExpanded={expandedId === ach.id}
                onToggle={() => toggleExpandedEntry(SECTION_KEY, ach.id)}
                onDelete={() => {
                  removeAchievement(ach.id)
                  if (expandedId === ach.id) setExpandedEntry(SECTION_KEY, null)
                }}
                dragHandleProps={handleProps}
              >
                <AchievementEntryForm ach={ach} />
              </EntryCard>
            )}
          </SortableEntryCard>
        ))}
      </SortableEntryList>
    </div>
  )
}
