import { Download, FileText, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useResumeStore } from '@/store/resumeStore'

interface AppHeaderProps {
  onPrint: () => void
}

export function AppHeader({ onPrint }: AppHeaderProps) {
  const { resume, resetToSample, clearResume } = useResumeStore()

  return (
    <header className="no-print flex h-14 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 shadow-sm">
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
          <FileText className="h-4 w-4 text-white" />
        </div>
        <div>
          <span className="text-sm font-semibold text-slate-900">Resume Builder</span>
          {resume.personalInfo.fullName && (
            <span className="ml-2 text-xs text-slate-400">{resume.personalInfo.fullName}</span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={clearResume}
          title="Clear resume"
          className="text-slate-500"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Clear
        </Button>

        <Button
          variant="secondary"
          size="sm"
          onClick={resetToSample}
          title="Load sample data"
        >
          Load Sample
        </Button>

        <Button size="sm" onClick={() => onPrint()} className="gap-1.5">
          <Download className="h-3.5 w-3.5" />
          Export PDF
        </Button>
      </div>
    </header>
  )
}
