import { ChevronDown, Trash2, GripVertical, ArrowUp, ArrowDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/utils/cn'

interface EntryCardProps {
  title: string
  subtitle?: string
  meta?: string
  isExpanded: boolean
  isFirst: boolean
  isLast: boolean
  onToggle: () => void
  onDelete: () => void
  onMoveUp: () => void
  onMoveDown: () => void
  children: React.ReactNode
  /** Optional drag handle attributes from dnd-kit */
  dragHandleProps?: Record<string, unknown>
}

export function EntryCard({
  title,
  subtitle,
  meta,
  isExpanded,
  isFirst,
  isLast,
  onToggle,
  onDelete,
  onMoveUp,
  onMoveDown,
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
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onToggle() } }}
      >
        {/* Drag handle — shows as grip, can receive dnd attributes */}
        <span
          className="shrink-0 cursor-grab text-slate-300 active:cursor-grabbing"
          onClick={(e) => e.stopPropagation()}
          {...(dragHandleProps as React.HTMLAttributes<HTMLSpanElement>)}
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
            onClick={onMoveUp}
            disabled={isFirst}
            className="text-slate-400"
            title="Move up"
          >
            <ArrowUp className="h-3 w-3" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={onMoveDown}
            disabled={isLast}
            className="text-slate-400"
            title="Move down"
          >
            <ArrowDown className="h-3 w-3" />
          </Button>
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
       * Accordion body — always in DOM so form state / focus is preserved.
       * Uses CSS grid row height trick: grid-template-rows 0fr→1fr is
       * the only way to animate to unknown height without JS measurement.
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
