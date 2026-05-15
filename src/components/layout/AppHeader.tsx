import { useRef, useEffect, useState } from 'react'
import { Download, FileText, Upload, FolderOpen, Check, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useResume, useResumeActions } from '@/hooks/useResume'
import { useToast } from '@/hooks/useToast'
import { exportResumeJSON, readJSONFile, parseResumeJSON } from '@/utils/importExport'

interface AppHeaderProps {
  onPrint: () => void
}

/** Shows "Saving…" briefly then "Saved ✓" after any resume change. */
function AutoSaveIndicator() {
  const { updatedAt } = useResume()
  const [state, setState] = useState<'idle' | 'saving' | 'saved'>('idle')

  useEffect(() => {
    setState('saving')
    const t = setTimeout(() => setState('saved'), 600)
    const t2 = setTimeout(() => setState('idle'), 2800)
    return () => { clearTimeout(t); clearTimeout(t2) }
  }, [updatedAt])

  if (state === 'idle') return null

  return (
    <span className="flex items-center gap-1 text-xs text-slate-400">
      {state === 'saving' ? (
        <><Loader2 className="h-3 w-3 animate-spin" /> Saving…</>
      ) : (
        <><Check className="h-3 w-3 text-emerald-500" /> Saved</>
      )}
    </span>
  )
}

export function AppHeader({ onPrint }: AppHeaderProps) {
  const resume = useResume()
  const { resetToSample, clearResume, importResume } = useResumeActions()
  const toast = useToast()
  const importInputRef = useRef<HTMLInputElement>(null)

  function handleExport() {
    try {
      exportResumeJSON(resume)
      toast('Resume exported as JSON.', 'success')
    } catch {
      toast('Export failed. Please try again.', 'error')
    }
  }

  async function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    // Reset input so the same file can be re-imported
    e.target.value = ''
    try {
      const raw = await readJSONFile(file)
      const imported = parseResumeJSON(raw)
      importResume(imported)
      toast('Resume imported successfully.', 'success')
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Failed to import file.', 'error')
    }
  }

  function handleClear() {
    if (!window.confirm('Clear all resume content? This cannot be undone.')) return
    clearResume()
    toast('Resume cleared.', 'info')
  }

  function handleReset() {
    if (!window.confirm('Replace with sample data? Your current content will be lost.')) return
    resetToSample()
    toast('Sample resume loaded.', 'info')
  }

  return (
    <header className="no-print flex h-14 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 shadow-sm">
      {/* Brand */}
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-600">
          <FileText className="h-4 w-4 text-white" />
        </div>
        <div className="hidden sm:block">
          <span className="text-sm font-semibold text-slate-900">Resume Builder</span>
          {resume.personalInfo.fullName && (
            <span className="ml-2 text-xs text-slate-400">{resume.personalInfo.fullName}</span>
          )}
        </div>
        <AutoSaveIndicator />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1.5">
        {/* Import */}
        <input
          ref={importInputRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={handleImport}
        />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => importInputRef.current?.click()}
          title="Import JSON"
          className="hidden gap-1.5 text-slate-500 sm:inline-flex"
        >
          <FolderOpen className="h-3.5 w-3.5" />
          Import
        </Button>

        {/* Export JSON */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleExport}
          title="Export JSON"
          className="hidden gap-1.5 text-slate-500 sm:inline-flex"
        >
          <Upload className="h-3.5 w-3.5" />
          Export
        </Button>

        <div className="mx-1 hidden h-4 w-px bg-slate-200 sm:block" />

        {/* Reset / Clear */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClear}
          title="Clear all content"
          className="text-slate-500"
        >
          Clear
        </Button>

        <Button
          variant="secondary"
          size="sm"
          onClick={handleReset}
          title="Load sample data"
        >
          Sample
        </Button>

        {/* Export PDF */}
        <Button size="sm" onClick={() => onPrint()} className="gap-1.5">
          <Download className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Export PDF</span>
          <span className="sm:hidden">PDF</span>
        </Button>
      </div>
    </header>
  )
}
