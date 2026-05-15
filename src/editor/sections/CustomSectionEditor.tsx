import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useResume, useResumeActions } from '@/hooks/useResume'
import type { SectionEditorProps } from './types'

export function CustomSectionEditor({ section: sectionProp }: SectionEditorProps) {
  const sectionId = sectionProp.id
  const resume = useResume()
  const { updateCustomSection, updateSectionConfig } = useResumeActions()

  const section = resume.sections.find((s) => s.id === sectionId)
  const customData = resume.customSections.find((c) => c.id === sectionId)

  const { register, watch, reset } = useForm<{ title: string; content: string }>({
    defaultValues: {
      title: section?.title ?? '',
      content: customData?.content ?? '',
    },
  })

  useEffect(() => {
    reset({ title: section?.title ?? '', content: customData?.content ?? '' })
  }, [sectionId, reset, section?.title, customData?.content])

  const title = watch('title')
  const content = watch('content')

  useEffect(() => {
    const timer = setTimeout(() => {
      updateSectionConfig(sectionId, { title })
    }, 200)
    return () => clearTimeout(timer)
  }, [title, sectionId, updateSectionConfig])

  useEffect(() => {
    const timer = setTimeout(() => {
      updateCustomSection(sectionId, { content })
    }, 200)
    return () => clearTimeout(timer)
  }, [content, sectionId, updateCustomSection])

  if (!section || !customData) {
    return <p className="text-xs text-slate-400">Section not found.</p>
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-sm font-semibold text-slate-900">{section?.title ?? 'Custom Section'}</h2>
        <p className="mt-0.5 text-xs text-slate-500">
          Free-form section — title and content are fully customisable
        </p>
      </div>

      <div>
        <Label htmlFor="title">Section Heading</Label>
        <Input
          id="title"
          placeholder="e.g. Volunteer Work, Publications, Languages…"
          {...register('title')}
        />
      </div>

      <div>
        <Label htmlFor="content">Content</Label>
        <Textarea
          id="content"
          rows={8}
          placeholder="Enter free-form content. Each paragraph becomes a separate block in the preview."
          {...register('content')}
        />
        <p className="mt-1 text-[10px] text-slate-400">
          Separate multiple entries with a blank line
        </p>
      </div>
    </div>
  )
}
