import { formatDate } from '@/utils/formatDate'
import type { RendererProps } from './types'

/** Renders the achievements list. */
export function AchievementRenderer({ resume }: RendererProps) {
  if (resume.achievements.length === 0) return null

  return (
    <div className="space-y-2.5">
      {resume.achievements.map((ach) => (
        <div key={ach.id} className="resume-entry">
          <div className="flex items-baseline justify-between gap-4">
            <h3 className="font-semibold text-slate-900 leading-snug" style={{ fontSize: 12 }}>
              {ach.title}
            </h3>
            {ach.date && (
              <span className="shrink-0 tabular-nums text-slate-500" style={{ fontSize: 10 }}>
                {formatDate(ach.date)}
              </span>
            )}
          </div>

          {ach.description && (
            <p className="mt-1 leading-relaxed text-slate-600" style={{ fontSize: 11 }}>
              {ach.description}
            </p>
          )}
        </div>
      ))}
    </div>
  )
}
