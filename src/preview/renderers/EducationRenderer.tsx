import { formatDateRange } from '@/utils/formatDate'
import type { RendererProps } from './types'

export function EducationRenderer({ resume }: RendererProps) {
  if (resume.education.length === 0) return null

  return (
    <div className="rt-entry-gap flex flex-col">
      {resume.education.map((edu) => (
        <div key={edu.id} className="resume-entry">
          <div className="flex items-baseline justify-between gap-4">
            <h3 className="rt-entry-title leading-snug">
              {[edu.degree, edu.field].filter(Boolean).join(' in ')}
            </h3>
            <span className="rt-meta shrink-0 tabular-nums">
              {formatDateRange(edu.startDate, edu.endDate, false)}
            </span>
          </div>

          <div className="mt-0.5 flex items-baseline justify-between gap-4">
            <span className="rt-primary">{edu.institution}</span>
            {edu.gpa && (
              <span className="rt-meta shrink-0">GPA {edu.gpa}</span>
            )}
          </div>

          {edu.highlights.length > 0 && (
            <ul className="mt-1.5 space-y-1">
              {edu.highlights.map((point, i) => (
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
