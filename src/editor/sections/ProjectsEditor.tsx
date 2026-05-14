import { useState } from 'react'
import { X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useResumeStore } from '@/store/resumeStore'
import { EntryCard } from '@/editor/components/EntryCard'
import { BulletListEditor } from '@/editor/components/BulletListEditor'
import { SectionHeader } from '@/editor/components/SectionHeader'
import type { Project } from '@/types/resume'

function ProjectEntryForm({ proj }: { proj: Project }) {
  const { updateProject } = useResumeStore()
  const upd = (data: Partial<Project>) => updateProject(proj.id, data)
  const [techInput, setTechInput] = useState('')

  function addTech() {
    const name = techInput.trim()
    if (!name || proj.technologies.includes(name)) return
    upd({ technologies: [...proj.technologies, name] })
    setTechInput('')
  }

  return (
    <>
      <div>
        <Label>Project Name</Label>
        <Input
          value={proj.name}
          placeholder="My Awesome Project"
          onChange={(e) => upd({ name: e.target.value })}
        />
      </div>

      <div>
        <Label>Project URL</Label>
        <Input
          value={proj.url}
          placeholder="github.com/user/project"
          onChange={(e) => upd({ url: e.target.value })}
        />
      </div>

      <div>
        <Label>Description</Label>
        <Textarea
          value={proj.description}
          rows={3}
          placeholder="What the project does and why it matters…"
          onChange={(e) => upd({ description: e.target.value })}
        />
      </div>

      <div>
        <Label className="mb-1.5">Technologies</Label>
        <div className="flex flex-wrap gap-1.5 mb-2">
          {proj.technologies.map((tech, i) => (
            <span
              key={i}
              className="flex items-center gap-1 rounded-full bg-slate-100 pl-2.5 pr-1 py-0.5 text-[11px] text-slate-700"
            >
              {tech}
              <button
                type="button"
                onClick={() =>
                  upd({ technologies: proj.technologies.filter((_, j) => j !== i) })
                }
                className="text-slate-400 hover:text-red-500"
              >
                <X className="h-2.5 w-2.5" />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-1.5">
          <Input
            value={techInput}
            placeholder="Add technology…"
            className="h-7 text-xs"
            onChange={(e) => setTechInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                addTech()
              }
            }}
          />
          <Button type="button" variant="outline" size="sm" onClick={addTech} className="h-7">
            Add
          </Button>
        </div>
      </div>

      <BulletListEditor
        label="Highlights"
        placeholder="Key metric or achievement…"
        value={proj.highlights}
        onChange={(highlights) => upd({ highlights })}
      />
    </>
  )
}

export function ProjectsEditor() {
  const { resume, addProject, removeProject, reorderProjects } = useResumeStore()
  const [expandedId, setExpandedId] = useState<string | null>(null)

  function handleAdd() {
    const newProj: Project = {
      id: crypto.randomUUID(),
      name: '',
      description: '',
      url: '',
      technologies: [],
      highlights: [],
    }
    addProject(newProj)
    setExpandedId(newProj.id)
  }

  function move(index: number, direction: 'up' | 'down') {
    const items = [...resume.projects]
    const swap = direction === 'up' ? index - 1 : index + 1
    ;[items[index], items[swap]] = [items[swap], items[index]]
    reorderProjects(items)
  }

  return (
    <div>
      <SectionHeader
        title="Projects"
        description="Portfolio, open-source, and side projects"
        onAdd={handleAdd}
        addLabel="Add Project"
      />

      {resume.projects.length === 0 && (
        <p className="py-8 text-center text-xs text-slate-400">
          No projects yet. Click &quot;Add Project&quot; to get started.
        </p>
      )}

      <div className="space-y-2">
        {resume.projects.map((proj, i) => (
          <EntryCard
            key={proj.id}
            title={proj.name}
            subtitle={proj.technologies.slice(0, 3).join(' · ')}
            isExpanded={expandedId === proj.id}
            isFirst={i === 0}
            isLast={i === resume.projects.length - 1}
            onToggle={() => setExpandedId(expandedId === proj.id ? null : proj.id)}
            onDelete={() => {
              removeProject(proj.id)
              if (expandedId === proj.id) setExpandedId(null)
            }}
            onMoveUp={() => move(i, 'up')}
            onMoveDown={() => move(i, 'down')}
          >
            <ProjectEntryForm proj={proj} />
          </EntryCard>
        ))}
      </div>
    </div>
  )
}
