import { formatDateRange } from '@/utils/formatDate'
import type { RendererProps } from './types'

/** Renders the education entry list. */
export function EducationRenderer({ resume }: RendererProps) {
  if (resume.education.length === 0) return null

  return (
    <div className="space-y-3">
      {resume.education.map((edu) => (
        <div key={edu.id} className="resume-entry">
          <div className="flex items-baseline justify-between gap-4">
            <h3 className="font-semibold text-slate-900 leading-snug" style={{ fontSize: 12 }}>
              {[edu.degree, edu.field].filter(Boolean).join(' in ')}
            </h3>
            <span className="shrink-0 tabular-nums text-slate-500" style={{ fontSize: 10 }}>
              {formatDateRange(edu.startDate, edu.endDate, false)}
            </span>
          </div>

          <div className="mt-0.5 flex items-baseline justify-between gap-4">
            <span className="font-medium text-blue-700" style={{ fontSize: 11 }}>
              {edu.institution}
            </span>
            {edu.gpa && (
              <span className="shrink-0 text-slate-500" style={{ fontSize: 10 }}>
                GPA {edu.gpa}
              </span>
            )}
          </div>

          {edu.highlights.length > 0 && (
            <ul className="mt-1.5 space-y-1">
              {edu.highlights.map((point, i) => (
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
