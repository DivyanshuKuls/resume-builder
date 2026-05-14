import type { RendererProps } from './types'

export function CustomSectionRenderer({ resume, section }: RendererProps) {
  const data = resume.customSections.find((c) => c.id === section.id)
  if (!data?.content.trim()) return null

  const blocks = data.content
    .split(/\n\s*\n/)
    .map((b) => b.trim())
    .filter(Boolean)

  return (
    <div className="space-y-2">
      {blocks.map((block, i) => (
        <p key={i} className="rt-body whitespace-pre-line leading-relaxed">
          {block}
        </p>
      ))}
    </div>
  )
}
