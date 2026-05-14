import { useState } from 'react'
import { Eye, EyeOff, Trash2, ArrowUp, ArrowDown, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useResumeStore } from '@/store/resumeStore'
import { cn } from '@/utils/cn'
import { SECTION_TYPE_META } from '@/types/resume'
import type { SectionConfig, SectionType } from '@/types/resume'

const ADDABLE_TYPES: SectionType[] = [
  'summary',
  'experience',
  'education',
  'skills',
  'projects',
  'certifications',
  'achievements',
  'custom',
]

function SectionRow({
  section,
  isFirst,
  isLast,
  onMoveUp,
  onMoveDown,
}: {
  section: SectionConfig
  isFirst: boolean
  isLast: boolean
  onMoveUp: () => void
  onMoveDown: () => void
}) {
  const { toggleSectionVisibility, removeSection, updateSectionConfig } = useResumeStore()
  const [editingTitle, setEditingTitle] = useState(false)
  const [draft, setDraft] = useState(section.title)

  function commitTitle() {
    const trimmed = draft.trim()
    if (trimmed) updateSectionConfig(section.id, { title: trimmed })
    else setDraft(section.title)
    setEditingTitle(false)
  }

  return (
    <div
      className={cn(
        'flex items-center gap-2 rounded-md border px-3 py-2',
        section.visible ? 'border-slate-200 bg-white' : 'border-slate-100 bg-slate-50',
      )}
    >
      {/* Visibility toggle */}
      <button
        type="button"
        onClick={() => toggleSectionVisibility(section.id)}
        className={cn(
          'shrink-0',
          section.visible ? 'text-slate-500 hover:text-slate-700' : 'text-slate-300 hover:text-slate-500',
        )}
        title={section.visible ? 'Hide section' : 'Show section'}
      >
        {section.visible ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
      </button>

      {/* Title */}
      <div className="min-w-0 flex-1">
        {editingTitle ? (
          <Input
            autoFocus
            value={draft}
            className="h-7 text-xs"
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commitTitle}
            onKeyDown={(e) => {
              if (e.key === 'Enter') commitTitle()
              if (e.key === 'Escape') {
                setDraft(section.title)
                setEditingTitle(false)
              }
            }}
          />
        ) : (
          <button
            type="button"
            className={cn(
              'w-full text-left text-xs font-medium truncate',
              section.visible ? 'text-slate-800' : 'text-slate-400',
            )}
            onClick={() => setEditingTitle(true)}
            title="Click to rename"
          >
            {section.title}
          </button>
        )}
        <p className="text-[10px] text-slate-400 mt-0.5">
          {SECTION_TYPE_META[section.type].label}
        </p>
      </div>

      {/* Reorder */}
      <div className="flex items-center gap-0.5">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          disabled={isFirst}
          onClick={onMoveUp}
          className="text-slate-400"
        >
          <ArrowUp className="h-3 w-3" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          disabled={isLast}
          onClick={onMoveDown}
          className="text-slate-400"
        >
          <ArrowDown className="h-3 w-3" />
        </Button>
      </div>

      {/* Delete */}
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        onClick={() => removeSection(section.id)}
        className="text-slate-300 hover:text-red-500"
        title="Remove section"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </Button>
    </div>
  )
}

export function SectionManager() {
  const { resume, reorderSections, addSection } = useResumeStore()
  const [showAddMenu, setShowAddMenu] = useState(false)

  const sorted = [...resume.sections].sort((a, b) => a.order - b.order)

  // Which built-in types are already added
  const addedTypes = new Set(resume.sections.filter((s) => s.type !== 'custom').map((s) => s.type))

  const available = ADDABLE_TYPES.filter((t) => t === 'custom' || !addedTypes.has(t))

  function move(index: number, direction: 'up' | 'down') {
    const items = [...sorted]
    const swap = direction === 'up' ? index - 1 : index + 1
    ;[items[index], items[swap]] = [items[swap], items[index]]
    reorderSections(items)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h2 className="text-sm font-semibold text-slate-900">Manage Sections</h2>
          <p className="mt-0.5 text-xs text-slate-500">
            Reorder, show/hide, rename, or remove sections. Click a title to rename it.
          </p>
        </div>

        <div className="relative">
          <Button
            type="button"
            size="sm"
            onClick={() => setShowAddMenu((v) => !v)}
            className="shrink-0"
          >
            <Plus className="h-3.5 w-3.5" />
            Add
          </Button>

          {showAddMenu && (
            <div className="absolute right-0 top-full z-20 mt-1 w-44 rounded-md border border-slate-200 bg-white py-1 shadow-lg">
              {available.length === 0 ? (
                <p className="px-3 py-2 text-xs text-slate-400">All sections added</p>
              ) : (
                available.map((type) => (
                  <button
                    key={type}
                    type="button"
                    className="flex w-full items-center px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50"
                    onClick={() => {
                      addSection(type)
                      setShowAddMenu(false)
                    }}
                  >
                    {SECTION_TYPE_META[type].label}
                    {type === 'custom' && (
                      <span className="ml-auto text-[10px] text-slate-400">+ new</span>
                    )}
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Section list */}
      <div className="space-y-1.5">
        {sorted.map((section, i) => (
          <SectionRow
            key={section.id}
            section={section}
            isFirst={i === 0}
            isLast={i === sorted.length - 1}
            onMoveUp={() => move(i, 'up')}
            onMoveDown={() => move(i, 'down')}
          />
        ))}
      </div>

      {sorted.length === 0 && (
        <p className="py-8 text-center text-xs text-slate-400">
          No sections yet. Click &quot;Add&quot; to create your first section.
        </p>
      )}

      <div className="rounded-md border border-dashed border-slate-200 bg-slate-50 p-3">
        <p className="text-[11px] text-slate-500">
          <span className="font-medium text-slate-700">Note:</span> Hidden sections still
          appear in the editor but are excluded from the preview and PDF export.
        </p>
      </div>
    </div>
  )
}
