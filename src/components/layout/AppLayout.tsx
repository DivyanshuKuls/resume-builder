import { useState } from 'react'
import { Pencil, Eye } from 'lucide-react'
import { cn } from '@/utils/cn'

interface AppLayoutProps {
  header: React.ReactNode
  editor: React.ReactNode
  preview: React.ReactNode
}

export function AppLayout({ header, editor, preview }: AppLayoutProps) {
  const [mobileTab, setMobileTab] = useState<'editor' | 'preview'>('editor')

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {header}

      {/* ── Desktop: side-by-side ─────────────────────────────── */}
      <div className="hidden flex-1 overflow-hidden md:flex">
        <div className="flex w-[46%] min-w-0 shrink-0 flex-col overflow-hidden border-r border-slate-200">
          {editor}
        </div>
        <div className="flex flex-1 flex-col overflow-hidden bg-slate-100">
          {preview}
        </div>
      </div>

      {/* ── Mobile: tab switcher ─────────────────────────────── */}
      <div className="flex flex-1 flex-col overflow-hidden md:hidden">
        {/* Tab bar */}
        <div className="no-print flex shrink-0 border-b border-slate-200 bg-white">
          <button
            type="button"
            onClick={() => setMobileTab('editor')}
            className={cn(
              'flex flex-1 items-center justify-center gap-2 py-2.5 text-sm font-medium transition-colors',
              mobileTab === 'editor'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-slate-500 hover:text-slate-700',
            )}
          >
            <Pencil className="h-3.5 w-3.5" />
            Edit
          </button>
          <button
            type="button"
            onClick={() => setMobileTab('preview')}
            className={cn(
              'flex flex-1 items-center justify-center gap-2 py-2.5 text-sm font-medium transition-colors',
              mobileTab === 'preview'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-slate-500 hover:text-slate-700',
            )}
          >
            <Eye className="h-3.5 w-3.5" />
            Preview
          </button>
        </div>

        {/* Panels — both mounted, only one visible, so state is preserved */}
        <div className={cn('flex-1 overflow-hidden', mobileTab === 'editor' ? 'block' : 'hidden')}>
          {editor}
        </div>
        <div className={cn('flex-1 overflow-hidden', mobileTab === 'preview' ? 'block' : 'hidden')}>
          {preview}
        </div>
      </div>
    </div>
  )
}
