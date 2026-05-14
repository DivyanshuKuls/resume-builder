import { ChevronDown, ChevronUp, Trash2, GripVertical, ArrowUp, ArrowDown } from 'lucide-react'
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
}: EntryCardProps) {
  return (
    <div
      className={cn(
        'rounded-md border border-slate-200 bg-white transition-shadow',
        isExpanded && 'shadow-sm ring-1 ring-blue-200',
      )}
    >
      {/* Header row */}
      <div
        className="flex cursor-pointer items-center gap-2 px-3 py-2.5"
        onClick={onToggle}
        role="button"
        aria-expanded={isExpanded}
      >
        <GripVertical className="h-3.5 w-3.5 shrink-0 text-slate-300" />

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

        {isExpanded ? (
          <ChevronUp className="h-3.5 w-3.5 shrink-0 text-slate-400" />
        ) : (
          <ChevronDown className="h-3.5 w-3.5 shrink-0 text-slate-400" />
        )}
      </div>

      {/* Expanded body */}
      {isExpanded && (
        <div className="border-t border-slate-100 px-3 pb-3 pt-3">
          <div className="space-y-3">{children}</div>
        </div>
      )}
    </div>
  )
}
