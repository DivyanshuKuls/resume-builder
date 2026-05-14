import type { RendererProps } from './types'

export function ProjectRenderer({ resume }: RendererProps) {
  if (resume.projects.length === 0) return null

  return (
    <div className="rt-entry-gap flex flex-col">
      {resume.projects.map((proj) => (
        <div key={proj.id} className="resume-entry">
          <div className="flex items-baseline justify-between gap-4">
            <h3 className="rt-entry-title leading-snug">{proj.name}</h3>
            {proj.technologies.length > 0 && (
              <span className="rt-meta shrink-0">{proj.technologies.join(' · ')}</span>
            )}
          </div>

          {proj.url && (
            <a
              href={proj.url.startsWith('http') ? proj.url : `https://${proj.url}`}
              className="rt-link"
            >
              {proj.url}
            </a>
          )}

          {proj.description && (
            <p className="rt-body mt-1 leading-relaxed">{proj.description}</p>
          )}

          {proj.highlights.length > 0 && (
            <ul className="mt-1.5 space-y-1">
              {proj.highlights.map((point, i) => (
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
