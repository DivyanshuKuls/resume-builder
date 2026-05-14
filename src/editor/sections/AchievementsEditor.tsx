import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useResumeStore } from '@/store/resumeStore'
import { EntryCard } from '@/editor/components/EntryCard'
import { SectionHeader } from '@/editor/components/SectionHeader'
import { formatDate } from '@/utils/formatDate'
import type { Achievement } from '@/types/resume'

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
  const [expandedId, setExpandedId] = useState<string | null>(null)

  function handleAdd() {
    const newAch: Achievement = {
      id: crypto.randomUUID(),
      title: '',
      description: '',
      date: '',
    }
    addAchievement(newAch)
    setExpandedId(newAch.id)
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
        <p className="py-8 text-center text-xs text-slate-400">
          No achievements yet. Click &quot;Add Achievement&quot; to get started.
        </p>
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
            onToggle={() => setExpandedId(expandedId === ach.id ? null : ach.id)}
            onDelete={() => {
              removeAchievement(ach.id)
              if (expandedId === ach.id) setExpandedId(null)
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
