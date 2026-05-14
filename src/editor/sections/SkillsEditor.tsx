import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useResumeStore } from '@/store/resumeStore'
import { cn } from '@/utils/cn'
import type { Skill, SkillGroup } from '@/types/resume'

// ── Individual skills tag input ───────────────────────────────────────────────

function IndividualSkills() {
  const { resume, setSkills } = useResumeStore()
  const [input, setInput] = useState('')

  function addSkill() {
    const name = input.trim()
    if (!name) return
    const newSkill: Skill = { id: crypto.randomUUID(), name }
    setSkills([...resume.skills, newSkill])
    setInput('')
  }

  function removeSkill(id: string) {
    setSkills(resume.skills.filter((s) => s.id !== id))
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input
          value={input}
          placeholder="Type a skill and press Enter"
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              addSkill()
            }
          }}
        />
        <Button type="button" variant="outline" size="default" onClick={addSkill}>
          Add
        </Button>
      </div>

      {resume.skills.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {resume.skills.map((skill) => (
            <span
              key={skill.id}
              className="flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 pl-2.5 pr-1.5 py-0.5 text-xs text-slate-700"
            >
              {skill.name}
              <button
                type="button"
                onClick={() => removeSkill(skill.id)}
                className="text-slate-400 hover:text-red-500"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Grouped skills ────────────────────────────────────────────────────────────

function GroupRow({
  group,
  onUpdate,
  onRemove,
}: {
  group: SkillGroup
  onUpdate: (data: Partial<SkillGroup>) => void
  onRemove: () => void
}) {
  const [skillInput, setSkillInput] = useState('')

  function addSkill() {
    const name = skillInput.trim()
    if (!name) return
    onUpdate({ skills: [...group.skills, { id: crypto.randomUUID(), name }] })
    setSkillInput('')
  }

  function removeSkill(id: string) {
    onUpdate({ skills: group.skills.filter((s) => s.id !== id) })
  }

  return (
    <div className="rounded-md border border-slate-200 bg-white p-3">
      <div className="mb-2 flex items-center gap-2">
        <Input
          value={group.category}
          placeholder="Category (e.g. Frontend)"
          className="h-7 text-xs font-semibold"
          onChange={(e) => onUpdate({ category: e.target.value })}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={onRemove}
          className="shrink-0 text-slate-400 hover:text-red-500"
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-2">
        {group.skills.map((skill) => (
          <span
            key={skill.id}
            className="flex items-center gap-1 rounded-full bg-slate-100 pl-2.5 pr-1 py-0.5 text-[11px] text-slate-700"
          >
            {skill.name}
            <button
              type="button"
              onClick={() => removeSkill(skill.id)}
              className="text-slate-400 hover:text-red-500"
            >
              <X className="h-2.5 w-2.5" />
            </button>
          </span>
        ))}
      </div>

      <div className="flex gap-1.5">
        <Input
          value={skillInput}
          placeholder="Add skill…"
          className="h-7 text-xs"
          onChange={(e) => setSkillInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              addSkill()
            }
          }}
        />
        <Button type="button" variant="outline" size="sm" onClick={addSkill} className="h-7">
          <Plus className="h-3 w-3" />
        </Button>
      </div>
    </div>
  )
}

// ── Main editor ───────────────────────────────────────────────────────────────

export function SkillsEditor() {
  const { resume, updateSkillsConfig, addSkillGroup, updateSkillGroup, removeSkillGroup } =
    useResumeStore()
  const { mode, headingStyle } = resume.skillsConfig

  function addGroup() {
    const group: SkillGroup = { id: crypto.randomUUID(), category: '', skills: [] }
    addSkillGroup(group)
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-sm font-semibold text-slate-900">Skills</h2>
        <p className="mt-0.5 text-xs text-slate-500">
          Add skills individually or organize them by category
        </p>
      </div>

      {/* Mode toggle */}
      <div>
        <Label className="mb-1.5">Display mode</Label>
        <div className="flex gap-2">
          {(['individual', 'grouped'] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => updateSkillsConfig({ mode: m })}
              className={cn(
                'flex-1 rounded-md border px-3 py-1.5 text-xs font-medium capitalize transition-colors',
                mode === m
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-slate-300 text-slate-600 hover:border-slate-400',
              )}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Heading style (only relevant for grouped) */}
      {mode === 'grouped' && (
        <div>
          <Label className="mb-1.5">Heading style</Label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => updateSkillsConfig({ headingStyle: 'inline' })}
              className={cn(
                'flex-1 rounded-md border px-3 py-1.5 text-xs font-medium transition-colors',
                headingStyle === 'inline'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-slate-300 text-slate-600 hover:border-slate-400',
              )}
            >
              Inline <span className="text-slate-400">Frontend: React, Vue</span>
            </button>
            <button
              type="button"
              onClick={() => updateSkillsConfig({ headingStyle: 'block' })}
              className={cn(
                'flex-1 rounded-md border px-3 py-1.5 text-xs font-medium transition-colors',
                headingStyle === 'block'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-slate-300 text-slate-600 hover:border-slate-400',
              )}
            >
              Block <span className="text-slate-400">Frontend↵React, Vue</span>
            </button>
          </div>
        </div>
      )}

      {/* Skills input */}
      {mode === 'individual' ? (
        <IndividualSkills />
      ) : (
        <div className="space-y-2">
          {resume.skillGroups.map((group) => (
            <GroupRow
              key={group.id}
              group={group}
              onUpdate={(data) => updateSkillGroup(group.id, data)}
              onRemove={() => removeSkillGroup(group.id)}
            />
          ))}
          <Button type="button" variant="outline" size="sm" onClick={addGroup} className="w-full">
            <Plus className="h-3.5 w-3.5" />
            Add Group
          </Button>
        </div>
      )}
    </div>
  )
}
