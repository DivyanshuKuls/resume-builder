import { formatDateRange } from '@/utils/formatDate'
import type { RendererProps } from './types'

/** Renders the work experience entry list. */
export function ExperienceRenderer({ resume }: RendererProps) {
  if (resume.experience.length === 0) return null

  return (
    <div className="space-y-4">
      {resume.experience.map((exp) => (
        <div key={exp.id} className="resume-entry">
          {/* Position + date range */}
          <div className="flex items-baseline justify-between gap-4">
            <h3 className="font-semibold text-slate-900 leading-snug" style={{ fontSize: 12 }}>
              {exp.position}
            </h3>
            <span className="shrink-0 tabular-nums text-slate-500" style={{ fontSize: 10 }}>
              {formatDateRange(exp.startDate, exp.endDate, exp.current)}
            </span>
          </div>

          {/* Company + location */}
          <div className="mt-0.5 flex items-baseline justify-between gap-4">
            <span className="font-medium text-blue-700" style={{ fontSize: 11 }}>
              {exp.company}
            </span>
            {exp.location && (
              <span className="shrink-0 text-slate-400" style={{ fontSize: 10 }}>
                {exp.location}
              </span>
            )}
          </div>

          {exp.description && (
            <p className="mt-1.5 leading-relaxed text-slate-600" style={{ fontSize: 11 }}>
              {exp.description}
            </p>
          )}

          {exp.highlights.length > 0 && (
            <ul className="mt-1.5 space-y-1" aria-label="Key achievements">
              {exp.highlights.map((point, i) => (
                <li key={i} className="flex gap-2 leading-relaxed text-slate-700" style={{ fontSize: 11 }}>
                  <span aria-hidden="true" className="mt-[6px] h-[3px] w-[3px] shrink-0 rounded-full bg-slate-400" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  )
}
