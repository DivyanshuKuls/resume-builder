import type { RendererProps } from './types'

export function SummaryRenderer({ resume }: RendererProps) {
  if (!resume.summary) return null
  return (
    <p className="rt-body leading-relaxed">{resume.summary}</p>
  )
}
