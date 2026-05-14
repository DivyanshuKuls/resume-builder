import type { RendererProps } from './types'

/**
 * Renders skills in one of three modes:
 * - individual: pill tags
 * - grouped + inline: "Frontend: React · Vue · TypeScript"
 * - grouped + block: category heading on its own line, then skills
 */
export function SkillRenderer({ resume }: RendererProps) {
  const { mode, headingStyle } = resume.skillsConfig

  if (mode === 'individual') {
    if (resume.skills.length === 0) return null
    return (
      <div className="flex flex-wrap gap-1.5">
        {resume.skills.map((skill) => (
          <span
            key={skill.id}
            className="rounded-full bg-slate-100 px-2.5 py-0.5 font-medium text-slate-700"
            style={{ fontSize: 10.5 }}
          >
            {skill.name}
          </span>
        ))}
      </div>
    )
  }

  // Grouped mode
  const populated = resume.skillGroups.filter((g) => g.skills.length > 0)
  if (populated.length === 0) return null

  if (headingStyle === 'inline') {
    return (
      <div className="space-y-1">
        {populated.map((group) => (
          <div key={group.id} className="flex gap-1.5" style={{ fontSize: 10.5 }}>
            <span className="shrink-0 font-semibold text-slate-700" style={{ minWidth: 72 }}>
              {group.category}:
            </span>
            <span className="text-slate-600">
              {group.skills.map((s) => s.name).join(' · ')}
            </span>
          </div>
        ))}
      </div>
    )
  }

  // Block style
  return (
    <div className="space-y-2">
      {populated.map((group) => (
        <div key={group.id}>
          <p className="font-semibold text-slate-800" style={{ fontSize: 11 }}>
            {group.category}
          </p>
          <p className="text-slate-600" style={{ fontSize: 10.5 }}>
            {group.skills.map((s) => s.name).join(' · ')}
          </p>
        </div>
      ))}
    </div>
  )
}
