import { X, CheckCircle, AlertCircle, Info } from 'lucide-react'
import { useToastStore } from '@/hooks/useToast'
import { cn } from '@/utils/cn'

const ICONS = {
  success: <CheckCircle className="h-4 w-4 shrink-0" />,
  error:   <AlertCircle className="h-4 w-4 shrink-0" />,
  info:    <Info className="h-4 w-4 shrink-0" />,
}

const STYLES = {
  success: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  error:   'border-red-200 bg-red-50 text-red-800',
  info:    'border-blue-200 bg-blue-50 text-blue-800',
}

export function Toaster() {
  const { toasts, remove } = useToastStore()

  if (toasts.length === 0) return null

  return (
    <div
      className="no-print fixed bottom-4 right-4 z-50 flex flex-col gap-2"
      aria-live="polite"
      aria-label="Notifications"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            'flex max-w-xs items-start gap-2.5 rounded-lg border px-3.5 py-2.5 shadow-md',
            'animate-in slide-in-from-bottom-2 fade-in duration-200',
            STYLES[toast.type],
          )}
          role="status"
        >
          {ICONS[toast.type]}
          <span className="flex-1 text-sm leading-snug">{toast.message}</span>
          <button
            type="button"
            onClick={() => remove(toast.id)}
            className="mt-0.5 shrink-0 opacity-60 hover:opacity-100"
            aria-label="Dismiss"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
    </div>
  )
}
