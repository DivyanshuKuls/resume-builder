interface EmptyStateProps {
  message: string
  action: string
}

export function EmptyState({ message, action }: EmptyStateProps) {
  return (
    <div className="my-2 flex flex-col items-center gap-2 rounded-md border border-dashed border-slate-200 py-8 text-center">
      <p className="text-xs text-slate-400">{message}</p>
      <p className="text-[11px] text-slate-300">
        Click &ldquo;{action}&rdquo; above to get started.
      </p>
    </div>
  )
}
