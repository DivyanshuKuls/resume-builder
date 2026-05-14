import type { RendererProps } from './types'

export function SkillRenderer({ resume }: RendererProps) {
  const { mode, headingStyle } = resume.skillsConfig

  if (mode === 'individual') {
    if (resume.skills.length === 0) return null
    return (
      <div className="flex flex-wrap gap-1.5">
        {resume.skills.map((skill) => (
          <span key={skill.id} className="rt-skill-pill px-2.5 py-0.5">
            {skill.name}
          </span>
        ))}
      </div>
    )
  }

  const populated = resume.skillGroups.filter((g) => g.skills.length > 0)
  if (populated.length === 0) return null

  if (headingStyle === 'inline') {
    return (
      <div className="space-y-1">
        {populated.map((group) => (
          <div key={group.id} className="rt-body flex gap-1.5">
            <span className="rt-entry-title shrink-0" style={{ minWidth: 72 }}>
              {group.category}:
            </span>
            <span>{group.skills.map((s) => s.name).join(' · ')}</span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {populated.map((group) => (
        <div key={group.id}>
          <p className="rt-entry-title">{group.category}</p>
          <p className="rt-body">{group.skills.map((s) => s.name).join(' · ')}</p>
        </div>
      ))}
    </div>
  )
}
