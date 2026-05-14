import type { RendererProps } from './types'

/** Renders the professional summary paragraph. */
export function SummaryRenderer({ resume }: RendererProps) {
  if (!resume.summary) return null
  return (
    <p className="leading-relaxed text-slate-700" style={{ fontSize: 11 }}>
      {resume.summary}
    </p>
  )
}
