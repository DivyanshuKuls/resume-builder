import { useState } from 'react'
import { X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useResume, useResumeActions } from '@/hooks/useResume'
import { useUIStore } from '@/store/uiStore'
import { EntryCard } from '@/editor/components/EntryCard'
import { BulletListEditor } from '@/editor/components/BulletListEditor'
import { SectionHeader } from '@/editor/components/SectionHeader'
import { EmptyState } from '@/editor/components/EmptyState'
import { SortableEntryList, SortableEntryCard, arrayMove } from '@/editor/components/SortableEntryList'
import type { Project } from '@/types/resume'
import type { SectionEditorProps } from '@/editor/SectionEditor'

const SECTION_KEY = 'projects'

function ProjectEntryForm({ proj }: { proj: Project }) {
  const { updateProject } = useResumeActions()
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
        <div className="mb-2 flex flex-wrap gap-1.5">
          {proj.technologies.map((tech, i) => (
            <span
              key={i}
              className="flex items-center gap-1 rounded-full bg-slate-100 py-0.5 pl-2.5 pr-1 text-[11px] text-slate-700"
            >
              {tech}
              <button
                type="button"
                onClick={() => upd({ technologies: proj.technologies.filter((_, j) => j !== i) })}
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
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTech() } }}
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

export function ProjectsEditor({ section }: SectionEditorProps) {
  const resume = useResume()
  const { addProject, removeProject, reorderProjects } = useResumeActions()
  const { expandedEntry, setExpandedEntry, toggleExpandedEntry } = useUIStore()
  const expandedId = expandedEntry[SECTION_KEY] ?? null

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
    setExpandedEntry(SECTION_KEY, newProj.id)
  }

  return (
    <div>
      <SectionHeader
        title={section.title}
        description="Portfolio, open-source, and side projects · drag to reorder"
        onAdd={handleAdd}
        addLabel="Add Project"
      />

      {resume.projects.length === 0 && (
        <EmptyState message="No projects yet." action="Add Project" />
      )}

      <SortableEntryList
        ids={resume.projects.map((p) => p.id)}
        onReorder={(from, to) =>
          reorderProjects(arrayMove([...resume.projects], from, to))
        }
      >
        {resume.projects.map((proj) => (
          <SortableEntryCard key={proj.id} id={proj.id}>
            {(handleProps) => (
              <EntryCard
                title={proj.name}
                subtitle={proj.technologies.slice(0, 3).join(' · ')}
                isExpanded={expandedId === proj.id}
                onToggle={() => toggleExpandedEntry(SECTION_KEY, proj.id)}
                onDelete={() => {
                  removeProject(proj.id)
                  if (expandedId === proj.id) setExpandedEntry(SECTION_KEY, null)
                }}
                dragHandleProps={handleProps}
              >
                <ProjectEntryForm proj={proj} />
              </EntryCard>
            )}
          </SortableEntryCard>
        ))}
      </SortableEntryList>
    </div>
  )
}
