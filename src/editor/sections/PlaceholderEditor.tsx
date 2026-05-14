import { Construction } from 'lucide-react'

interface PlaceholderEditorProps {
  section: string
  description?: string
}

export function PlaceholderEditor({ section, description }: PlaceholderEditorProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-500 mb-4">
        <Construction className="h-7 w-7" />
      </div>
      <h3 className="text-sm font-semibold text-slate-800">{section} Editor</h3>
      <p className="mt-1.5 max-w-xs text-xs text-slate-500 leading-relaxed">
        {description ?? `The ${section.toLowerCase()} editor is coming soon. The preview already shows your data — edit the store directly for now.`}
      </p>
      <div className="mt-4 rounded-lg border border-dashed border-slate-200 bg-slate-50 px-4 py-2">
        <p className="text-xs text-slate-400">Foundation complete · Forms in progress</p>
      </div>
    </div>
  )
}
