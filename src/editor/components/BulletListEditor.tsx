import { Plus, X } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

interface BulletListEditorProps {
  label?: string
  placeholder?: string
  value: string[]
  onChange: (value: string[]) => void
}

export function BulletListEditor({
  label,
  placeholder = 'Add a bullet point…',
  value,
  onChange,
}: BulletListEditorProps) {
  function update(index: number, text: string) {
    const next = value.map((v, i) => (i === index ? text : v))
    onChange(next)
  }

  function remove(index: number) {
    onChange(value.filter((_, i) => i !== index))
  }

  function add() {
    onChange([...value, ''])
  }

  return (
    <div>
      {label && <Label className="mb-2">{label}</Label>}
      <div className="space-y-2">
        {value.map((bullet, i) => (
          <div key={i} className="flex items-start gap-2">
            <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
            <Textarea
              value={bullet}
              rows={2}
              placeholder={placeholder}
              onChange={(e) => update(i, e.target.value)}
              className="flex-1 text-xs"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={() => remove(i)}
              className="mt-1 text-slate-400 hover:text-red-500"
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
        ))}
      </div>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={add}
        className="mt-2 text-slate-500"
      >
        <Plus className="h-3.5 w-3.5" />
        Add bullet
      </Button>
    </div>
  )
}
