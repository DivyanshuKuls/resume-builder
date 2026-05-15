import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useResumeStore } from '@/store/resumeStore'
import { useUIStore } from '@/store/uiStore'
import { EntryCard } from '@/editor/components/EntryCard'
import { SectionHeader } from '@/editor/components/SectionHeader'
import { EmptyState } from '@/editor/components/EmptyState'
import { formatDate } from '@/utils/formatDate'
import type { Achievement } from '@/types/resume'

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

export function AchievementsEditor() {
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

  function move(index: number, direction: 'up' | 'down') {
    const items = [...resume.achievements]
    const swap = direction === 'up' ? index - 1 : index + 1
    ;[items[index], items[swap]] = [items[swap], items[index]]
    reorderAchievements(items)
  }

  return (
    <div>
      <SectionHeader
        title="Achievements"
        description="Awards, recognitions, and notable accomplishments"
        onAdd={handleAdd}
        addLabel="Add Achievement"
      />

      {resume.achievements.length === 0 && (
        <EmptyState message="No achievements yet." action="Add Achievement" />
      )}

      <div className="space-y-2">
        {resume.achievements.map((ach, i) => (
          <EntryCard
            key={ach.id}
            title={ach.title}
            meta={formatDate(ach.date)}
            isExpanded={expandedId === ach.id}
            isFirst={i === 0}
            isLast={i === resume.achievements.length - 1}
            onToggle={() => toggleExpandedEntry(SECTION_KEY, ach.id)}
            onDelete={() => {
              removeAchievement(ach.id)
              if (expandedId === ach.id) setExpandedEntry(SECTION_KEY, null)
            }}
            onMoveUp={() => move(i, 'up')}
            onMoveDown={() => move(i, 'down')}
          >
            <AchievementEntryForm ach={ach} />
          </EntryCard>
        ))}
      </div>
    </div>
  )
}
