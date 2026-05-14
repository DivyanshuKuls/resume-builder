import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface SectionHeaderProps {
  title: string
  description?: string
  onAdd?: () => void
  addLabel?: string
}

export function SectionHeader({ title, description, onAdd, addLabel }: SectionHeaderProps) {
  return (
    <div className="mb-4 flex items-start justify-between gap-2">
      <div>
        <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
        {description && <p className="mt-0.5 text-xs text-slate-500">{description}</p>}
      </div>
      {onAdd && (
        <Button type="button" size="sm" onClick={onAdd} className="shrink-0">
          <Plus className="h-3.5 w-3.5" />
          {addLabel ?? `Add`}
        </Button>
      )}
    </div>
  )
}
