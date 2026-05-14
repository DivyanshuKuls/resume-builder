import { formatDate } from '@/utils/formatDate'
import type { RendererProps } from './types'

export function AchievementRenderer({ resume }: RendererProps) {
  if (resume.achievements.length === 0) return null

  return (
    <div className="rt-entry-gap flex flex-col">
      {resume.achievements.map((ach) => (
        <div key={ach.id} className="resume-entry">
          <div className="flex items-baseline justify-between gap-4">
            <h3 className="rt-entry-title leading-snug">{ach.title}</h3>
            {ach.date && (
              <span className="rt-meta shrink-0 tabular-nums">{formatDate(ach.date)}</span>
            )}
          </div>

          {ach.description && (
            <p className="rt-body mt-1 leading-relaxed">{ach.description}</p>
          )}
        </div>
      ))}
    </div>
  )
}
