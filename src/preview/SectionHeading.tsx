interface SectionHeadingProps {
  children: string
}

export function SectionHeading({ children }: SectionHeadingProps) {
  return (
    <div className="mb-3 flex items-center gap-3">
      <h2 className="rt-section-heading shrink-0">{children}</h2>
      <div className="rt-section-rule flex-1" />
    </div>
  )
}
