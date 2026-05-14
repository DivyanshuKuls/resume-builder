import { formatDateRange } from '@/utils/formatDate'
import type { RendererProps } from './types'

export function ExperienceRenderer({ resume }: RendererProps) {
  if (resume.experience.length === 0) return null

  return (
    <div className="rt-entry-gap flex flex-col">
      {resume.experience.map((exp) => (
        <div key={exp.id} className="resume-entry">
          <div className="flex items-baseline justify-between gap-4">
            <h3 className="rt-entry-title leading-snug">{exp.position}</h3>
            <span className="rt-meta shrink-0 tabular-nums">{formatDateRange(exp.startDate, exp.endDate, exp.current)}</span>
          </div>

          <div className="mt-0.5 flex items-baseline justify-between gap-4">
            <span className="rt-primary">{exp.company}</span>
            {exp.location && (
              <span className="rt-meta shrink-0">{exp.location}</span>
            )}
          </div>

          {exp.description && (
            <p className="rt-body mt-1.5 leading-relaxed">{exp.description}</p>
          )}

          {exp.highlights.length > 0 && (
            <ul className="mt-1.5 space-y-1" aria-label="Key achievements">
              {exp.highlights.map((point, i) => (
                <li key={i} className="rt-body flex gap-2 leading-relaxed">
                  <span aria-hidden="true" className="rt-bullet mt-[6px] h-[3px] w-[3px] shrink-0 rounded-full" />
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
