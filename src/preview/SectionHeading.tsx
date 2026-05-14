interface SectionHeadingProps {
  children: string
}

/**
 * Consistent resume section heading: uppercase label + full-width hairline rule.
 * Font size is 9px — intentionally small to match standard resume section caps.
 */
export function SectionHeading({ children }: SectionHeadingProps) {
  return (
    <div className="mb-3 flex items-center gap-3">
      <h2
        className="shrink-0 font-bold uppercase text-slate-400"
        style={{ fontSize: 9, letterSpacing: '0.12em' }}
      >
        {children}
      </h2>
      <div className="h-px flex-1 bg-slate-200" />
    </div>
  )
}
