import type { RendererProps } from './types'

/**
 * Renders a free-form custom section.
 * Content is split on blank lines to form separate paragraph blocks.
 */
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
        <p
          key={i}
          className="leading-relaxed text-slate-700 whitespace-pre-line"
          style={{ fontSize: 11 }}
        >
          {block}
        </p>
      ))}
    </div>
  )
}
