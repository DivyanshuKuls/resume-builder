import { EditorNav } from '@/editor/EditorNav'
import { SectionEditor } from '@/editor/SectionEditor'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'

const editorFallback = (
  <div className="flex h-full items-center justify-center p-8 text-center">
    <div>
      <p className="text-sm font-medium text-slate-700">Editor encountered an error.</p>
      <p className="mt-1 text-xs text-slate-400">Reload the page to recover.</p>
    </div>
  </div>
)

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
          <ErrorBoundary fallback={editorFallback}>
            <SectionEditor />
          </ErrorBoundary>
        </div>
      </div>
    </div>
  )
}
