interface SectionHeadingProps {
  children: string
}

/**
 * Section heading with full-width rule.
 *
 * The outer div carries `.resume-section-heading` which applies
 * `break-after: avoid` in @media print — ensuring the heading is never
 * stranded at the bottom of a page without content following it.
 */
export function SectionHeading({ children }: SectionHeadingProps) {
  return (
    <div className="resume-section-heading mb-3 flex items-center gap-3">
      <h2 className="rt-section-heading shrink-0">{children}</h2>
      <div className="rt-section-rule flex-1" />
    </div>
  )
}
