interface AppLayoutProps {
  header: React.ReactNode
  editor: React.ReactNode
  preview: React.ReactNode
}

export function AppLayout({ header, editor, preview }: AppLayoutProps) {
  return (
    <div className="flex h-full flex-col overflow-hidden">
      {header}
      <div className="flex flex-1 overflow-hidden">
        <div className="flex w-[46%] min-w-0 shrink-0 flex-col overflow-hidden border-r border-slate-200">
          {editor}
        </div>
        <div className="flex flex-1 flex-col overflow-hidden bg-slate-100">{preview}</div>
      </div>
    </div>
  )
}
