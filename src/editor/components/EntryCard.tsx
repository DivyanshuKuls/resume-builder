import { ChevronDown, Trash2, GripVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/utils/cn'
import type { DragHandleProps } from './SortableEntryList'

interface EntryCardProps {
  title: string
  subtitle?: string
  meta?: string
  isExpanded: boolean
  onToggle: () => void
  onDelete: () => void
  children: React.ReactNode
  /** Provided by SortableEntryCard — spread onto the grip to enable drag. */
  dragHandleProps?: DragHandleProps
}

export function EntryCard({
  title,
  subtitle,
  meta,
  isExpanded,
  onToggle,
  onDelete,
  children,
  dragHandleProps,
}: EntryCardProps) {
  return (
    <div
      className={cn(
        'rounded-md border border-slate-200 bg-white transition-shadow duration-150',
        isExpanded && 'shadow-sm ring-1 ring-blue-200',
      )}
    >
      {/* Header row */}
      <div
        className="flex cursor-pointer select-none items-center gap-2 px-3 py-2.5"
        onClick={onToggle}
        role="button"
        aria-expanded={isExpanded}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onToggle() }
        }}
      >
        {/*
         * Drag handle — stopPropagation prevents the card from toggling when
         * the user grabs the grip. dragHandleProps spreads dnd-kit listeners
         * + attributes (onPointerDown, onKeyDown, aria-roledescription, …).
         */}
        <span
          className="shrink-0 cursor-grab touch-none text-slate-300 hover:text-slate-500 active:cursor-grabbing"
          onClick={(e) => e.stopPropagation()}
          title="Drag to reorder"
          {...(dragHandleProps?.listeners)}
          {...(dragHandleProps?.attributes)}
        >
          <GripVertical className="h-3.5 w-3.5" />
        </span>

        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-medium text-slate-800">
            {title || <span className="italic text-slate-400">Untitled</span>}
          </p>
          {(subtitle || meta) && (
            <p className="truncate text-[10px] text-slate-500">
              {[subtitle, meta].filter(Boolean).join(' · ')}
            </p>
          )}
        </div>

        <div
          className="flex items-center gap-0.5"
          onClick={(e) => e.stopPropagation()}
        >
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={onDelete}
            className="text-slate-400 hover:text-red-500"
            title="Delete"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>

        <ChevronDown
          className={cn(
            'h-3.5 w-3.5 shrink-0 text-slate-400 transition-transform duration-200',
            isExpanded && 'rotate-180',
          )}
        />
      </div>

      {/*
       * Accordion body — always in DOM so form state / focus survives.
       * CSS grid-template-rows trick animates to unknown height without JS.
       */}
      <div
        className={cn(
          'grid transition-[grid-template-rows] duration-200 ease-in-out',
          isExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
        )}
        aria-hidden={!isExpanded}
      >
        <div className="overflow-hidden">
          <div className="border-t border-slate-100 px-3 pb-3 pt-3">
            <div className="space-y-3">{children}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
