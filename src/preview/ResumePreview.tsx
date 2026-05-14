import { SectionRenderer } from '@/preview/SectionRenderer'
import { PreviewHeader } from '@/preview/sections/PreviewHeader'
import { PreviewContact } from '@/preview/sections/PreviewContact'
import type { Resume } from '@/types/resume'

interface ResumePreviewProps {
  resume: Resume
}

/**
 * Top-level resume rendering orchestrator.
 *
 * Layout (one-column, ATS-friendly):
 *   1. Header   — candidate name, job title, photo
 *   2. Contact  — email, phone, location, links (always shown)
 *   3. Sections — rendered in user-defined order via SectionRenderer
 *
 * Adding a new section type requires zero changes here.
 * Extend SECTION_RENDERERS in src/preview/renderers/index.ts instead.
 */
export function ResumePreview({ resume }: ResumePreviewProps) {
  const bodySections = [...resume.sections]
    .filter((s) => s.visible)
    .sort((a, b) => a.order - b.order)

  return (
    <>
      {/* ── Fixed header block ─────────────────────────────────────── */}
      <PreviewHeader personalInfo={resume.personalInfo} />
      <PreviewContact contact={resume.contact} />

      {/* ── Dynamic section body ───────────────────────────────────── */}
      <div className="rt-section-gap mt-5 flex flex-col">
        {bodySections.map((section) => (
          <SectionRenderer key={section.id} resume={resume} section={section} />
        ))}
      </div>
    </>
  )
}
