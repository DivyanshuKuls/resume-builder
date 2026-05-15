import { useState } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable'
import { restrictToVerticalAxis, restrictToParentElement } from '@dnd-kit/modifiers'
import { CSS } from '@dnd-kit/utilities'
import { Eye, EyeOff, Trash2, Plus, GripVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useResume, useResumeActions } from '@/hooks/useResume'
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

// ── Sortable row ──────────────────────────────────────────────────────────────

function SortableSectionRow({ section }: { section: SectionConfig }) {
  const { toggleSectionVisibility, removeSection, updateSectionConfig } = useResumeActions()
  const [editingTitle, setEditingTitle] = useState(false)
  const [draft, setDraft] = useState(section.title)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id })

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : undefined,
  }

  function commitTitle() {
    const trimmed = draft.trim()
    if (trimmed) updateSectionConfig(section.id, { title: trimmed })
    else setDraft(section.title)
    setEditingTitle(false)
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'flex items-center gap-2 rounded-md border px-3 py-2 bg-white transition-shadow',
        section.visible ? 'border-slate-200' : 'border-slate-100 bg-slate-50',
        isDragging && 'shadow-lg ring-1 ring-blue-300 opacity-90',
      )}
    >
      {/* Drag handle */}
      <button
        type="button"
        className="shrink-0 cursor-grab text-slate-300 hover:text-slate-500 active:cursor-grabbing touch-none"
        aria-label="Drag to reorder"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-3.5 w-3.5" />
      </button>

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
              if (e.key === 'Escape') { setDraft(section.title); setEditingTitle(false) }
            }}
          />
        ) : (
          <button
            type="button"
            className={cn(
              'w-full truncate text-left text-xs font-medium',
              section.visible ? 'text-slate-800' : 'text-slate-400',
            )}
            onClick={() => setEditingTitle(true)}
            title="Click to rename"
          >
            {section.title}
          </button>
        )}
        <p className="mt-0.5 text-[10px] text-slate-400">
          {SECTION_TYPE_META[section.type].label}
        </p>
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

// ── SectionManager ────────────────────────────────────────────────────────────

export function SectionManager() {
  const resume = useResume()
  const { reorderSections, addSection } = useResumeActions()
  const [showAddMenu, setShowAddMenu] = useState(false)

  const sorted = [...resume.sections].sort((a, b) => a.order - b.order)
  const addedTypes = new Set(resume.sections.filter((s) => s.type !== 'custom').map((s) => s.type))
  const available = ADDABLE_TYPES.filter((t) => t === 'custom' || !addedTypes.has(t))

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = sorted.findIndex((s) => s.id === active.id)
    const newIndex = sorted.findIndex((s) => s.id === over.id)
    if (oldIndex === -1 || newIndex === -1) return

    reorderSections(arrayMove(sorted, oldIndex, newIndex))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h2 className="text-sm font-semibold text-slate-900">Manage Sections</h2>
          <p className="mt-0.5 text-xs text-slate-500">
            Drag to reorder · toggle visibility · click title to rename
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
            <>
              {/* Backdrop to close menu */}
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowAddMenu(false)}
              />
              <div className="absolute right-0 top-full z-20 mt-1 w-44 rounded-md border border-slate-200 bg-white py-1 shadow-lg">
                {available.length === 0 ? (
                  <p className="px-3 py-2 text-xs text-slate-400">All sections added</p>
                ) : (
                  available.map((type) => (
                    <button
                      key={type}
                      type="button"
                      className="flex w-full items-center px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50"
                      onClick={() => { addSection(type); setShowAddMenu(false) }}
                    >
                      {SECTION_TYPE_META[type].label}
                      {type === 'custom' && (
                        <span className="ml-auto text-[10px] text-slate-400">+ new</span>
                      )}
                    </button>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Sortable list */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        modifiers={[restrictToVerticalAxis, restrictToParentElement]}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={sorted.map((s) => s.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-1.5">
            {sorted.map((section) => (
              <SortableSectionRow key={section.id} section={section} />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {sorted.length === 0 && (
        <div className="rounded-md border border-dashed border-slate-200 py-10 text-center">
          <p className="text-xs text-slate-400">
            No sections yet. Click &ldquo;Add&rdquo; to create your first section.
          </p>
        </div>
      )}

      <div className="rounded-md border border-dashed border-slate-200 bg-slate-50 p-3">
        <p className="text-[11px] text-slate-500">
          <span className="font-medium text-slate-700">Tip:</span> Hidden sections are excluded
          from the preview and PDF export but remain editable here.
        </p>
      </div>
    </div>
  )
}
