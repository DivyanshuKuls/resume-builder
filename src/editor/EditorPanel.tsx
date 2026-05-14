import { EditorNav } from '@/editor/EditorNav'
import { SectionEditor } from '@/editor/SectionEditor'

export function EditorPanel() {
  return (
    <div className="flex h-full overflow-hidden">
      {/* Section navigation sidebar */}
      <div className="no-print flex w-52 shrink-0 flex-col overflow-y-auto border-r border-slate-200 bg-white py-2">
        <div className="px-4 pb-2 pt-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Sections</p>
        </div>
        <EditorNav />
      </div>

      {/* Form content area */}
      <div className="no-print flex flex-1 flex-col overflow-hidden bg-slate-50">
        <div className="flex-1 overflow-y-auto p-5">
          <SectionEditor />
        </div>
      </div>
    </div>
  )
}
