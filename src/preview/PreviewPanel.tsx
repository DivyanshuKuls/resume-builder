import { forwardRef } from 'react'
import { ResumePreview } from '@/preview/ResumePreview'
import { useResumeStore } from '@/store/resumeStore'

export const PreviewPanel = forwardRef<HTMLDivElement, Record<never, never>>((_props, ref) => {
  const resume = useResumeStore((s) => s.resume)

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Toolbar */}
      <div className="no-print flex h-10 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4">
        <span className="text-xs font-medium text-slate-500">Live Preview</span>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          <span className="text-xs text-slate-400">Auto-synced</span>
        </div>
      </div>

      {/*
       * Scroll container: overflow-auto handles both axes so the fixed-width
       * A4 paper (794px) doesn't clip when the panel is narrow.
       * justify-center + py-8 keeps the paper floating in the grey canvas.
       */}
      <div className="flex-1 overflow-auto bg-slate-100/80">
        <div className="flex min-h-full justify-center px-6 py-8">
          {/* The ref target — this exact div is captured by react-to-print */}
          <div ref={ref} className="resume-paper">
            <ResumePreview resume={resume} />
          </div>
        </div>
      </div>
    </div>
  )
})

PreviewPanel.displayName = 'PreviewPanel'
