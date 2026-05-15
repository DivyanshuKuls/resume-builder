import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DraggableAttributes,
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
import { cn } from '@/utils/cn'

// ── Shared handle-props type ─────────────────────────────────────────────────

type SyntheticListenerMap = NonNullable<ReturnType<typeof useSortable>['listeners']>

/** Props that must be spread onto the drag-handle element. */
export interface DragHandleProps {
  listeners: SyntheticListenerMap | undefined
  attributes: DraggableAttributes
}

// ── SortableEntryList ────────────────────────────────────────────────────────

interface SortableEntryListProps {
  /** Stable IDs of the items in current order. */
  ids: string[]
  /**
   * Called with the new ordered ID array after a drag ends.
   * Editors call their store reorder action with arrayMove here.
   */
  onReorder: (fromIndex: number, toIndex: number) => void
  children: React.ReactNode
}

/**
 * Wraps a list of draggable entry cards with a DndContext + SortableContext.
 *
 * Sensors:
 * - PointerSensor (distance: 8px) — prevents accidental drag on click / text input
 * - TouchSensor (delay: 150ms) — lets the browser distinguish scroll from drag on mobile
 * - KeyboardSensor — arrow keys for full keyboard accessibility
 *
 * Modifiers: vertical-only, confined to the parent element.
 * No nested-context issues because SectionEditor renders only one editor at a time.
 */
export function SortableEntryList({ ids, onReorder, children }: SortableEntryListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor,   { activationConstraint: { delay: 150, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const fromIndex = ids.indexOf(active.id as string)
    const toIndex   = ids.indexOf(over.id   as string)
    if (fromIndex !== -1 && toIndex !== -1) onReorder(fromIndex, toIndex)
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      modifiers={[restrictToVerticalAxis, restrictToParentElement]}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={ids} strategy={verticalListSortingStrategy}>
        <div className="space-y-2">{children}</div>
      </SortableContext>
    </DndContext>
  )
}

// ── SortableEntryCard ────────────────────────────────────────────────────────

interface SortableEntryCardProps {
  id: string
  /** Render prop receives drag-handle props to spread onto the handle element. */
  children: (handleProps: DragHandleProps) => React.ReactNode
}

/**
 * Sortable wrapper for a single entry card.
 * Applies the CSS transform/transition from dnd-kit and passes handle props
 * via render prop so the handle can live anywhere inside EntryCard.
 */
export function SortableEntryCard({ id, children }: SortableEntryCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 20 : undefined,
        position: isDragging ? 'relative' : undefined,
      }}
      className={cn(isDragging && 'opacity-90 shadow-lg rounded-md')}
    >
      {children({ listeners, attributes })}
    </div>
  )
}

// ── Re-export arrayMove so editors don't need a second dnd-kit import ────────
export { arrayMove }
