import { forwardRef } from 'react'
import { Printer } from 'lucide-react'
import { ResumePreview } from '@/preview/ResumePreview'
import { useResume } from '@/hooks/useResume'
import { computeThemeCSSVars } from '@/themes'

interface PreviewPanelProps {
  onPrint: () => void
}

export const PreviewPanel = forwardRef<HTMLDivElement, PreviewPanelProps>(({ onPrint }, ref) => {
  const resume = useResume()

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Toolbar — hidden in print via .no-print */}
      <div className="no-print flex h-10 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          <span className="text-xs font-medium text-slate-500">Live Preview</span>
        </div>
        <button
          type="button"
          onClick={onPrint}
          title="Print or save as PDF"
          className="flex items-center gap-1.5 rounded px-2 py-1 text-xs text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
        >
          <Printer className="h-3.5 w-3.5" />
          Print
        </button>
      </div>

      {/*
       * Scroll container: overflow-auto on both axes so the fixed-width
       * A4 paper (794px) doesn't clip on narrow viewports.
       * The paper itself uses overflow-x: hidden + word-break so content
       * never escapes horizontally in either screen or print contexts.
       */}
      <div className="flex-1 overflow-auto bg-slate-100/80">
        <div className="flex min-h-full justify-center px-6 py-8">
          {/*
           * This div is the react-to-print target.
           * Inline style injects theme CSS vars so all rt-* semantic classes
           * resolve correctly in both screen preview and printed output.
           */}
          <div ref={ref} className="resume-paper" style={computeThemeCSSVars(resume.theme)}>
            <ResumePreview resume={resume} />
          </div>
        </div>
      </div>
    </div>
  )
})

PreviewPanel.displayName = 'PreviewPanel'
