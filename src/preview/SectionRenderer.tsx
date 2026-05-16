import { cn } from '@/utils/cn'
import { SectionHeading } from '@/preview/SectionHeading'
import { SECTION_RENDERERS, hasSectionContent } from '@/preview/renderers'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'
import type { Resume, SectionConfig } from '@/types/resume'

interface SectionRendererProps {
  resume: Resume
  section: SectionConfig
}

const ALIGN_CLASS: Record<string, string> = {
  center: 'text-center',
  right:  'text-right',
  left:   '',
}

/**
 * Unified section wrapper responsible for:
 * - Skipping sections with no content (avoids floating headings)
 * - Applying per-section text alignment
 * - Rendering the section heading (h2 + separator rule)
 * - Looking up and rendering the correct content renderer from the registry
 * - Marking the section for print break-inside: avoid via .resume-section
 *
 * Extending for a new section type requires only:
 * 1. Add renderer to SECTION_RENDERERS registry
 * 2. Nothing else here needs to change
 */
export function SectionRenderer({ resume, section }: SectionRendererProps) {
  // Don't render an empty section with a floating heading
  if (!hasSectionContent(resume, section)) return null

  const ContentRenderer = SECTION_RENDERERS[section.type]
  if (!ContentRenderer) return null

  const alignClass = ALIGN_CLASS[section.alignment] ?? ''

  const fallback = (
    <section className="resume-section" data-section-id={section.id}>
      <SectionHeading>{section.title}</SectionHeading>
      <p className="rt-body" style={{ opacity: 0.4 }}>Could not render this section.</p>
    </section>
  )

  return (
    <ErrorBoundary fallback={fallback}>
      <section
        className={cn('resume-section', alignClass)}
        data-section-id={section.id}
        data-section-type={section.type}
        aria-label={section.title}
      >
        <SectionHeading>{section.title}</SectionHeading>
        <ContentRenderer resume={resume} section={section} />
      </section>
    </ErrorBoundary>
  )
}
