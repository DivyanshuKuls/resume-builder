import type { RendererProps } from './types'

/** Renders the projects list. */
export function ProjectRenderer({ resume }: RendererProps) {
  if (resume.projects.length === 0) return null

  return (
    <div className="space-y-4">
      {resume.projects.map((proj) => (
        <div key={proj.id} className="resume-entry">
          {/* Name + tech stack */}
          <div className="flex items-baseline justify-between gap-4">
            <h3 className="font-semibold text-slate-900 leading-snug" style={{ fontSize: 12 }}>
              {proj.name}
            </h3>
            {proj.technologies.length > 0 && (
              <span className="shrink-0 text-slate-400" style={{ fontSize: 10 }}>
                {proj.technologies.join(' · ')}
              </span>
            )}
          </div>

          {proj.url && (
            <a
              href={proj.url.startsWith('http') ? proj.url : `https://${proj.url}`}
              className="text-blue-500 hover:text-blue-700 transition-colors"
              style={{ fontSize: 10 }}
            >
              {proj.url}
            </a>
          )}

          {proj.description && (
            <p className="mt-1 leading-relaxed text-slate-600" style={{ fontSize: 11 }}>
              {proj.description}
            </p>
          )}

          {proj.highlights.length > 0 && (
            <ul className="mt-1.5 space-y-1">
              {proj.highlights.map((point, i) => (
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
