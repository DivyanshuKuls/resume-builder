import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useResumeStore } from '@/store/resumeStore'

export function SummaryEditor() {
  const { resume, updateSummary } = useResumeStore()

  const { register, watch, reset } = useForm<{ summary: string }>({
    defaultValues: { summary: resume.summary },
  })

  useEffect(() => {
    reset({ summary: resume.summary })
  }, [resume.id, reset])

  const summary = watch('summary')

  useEffect(() => {
    const timer = setTimeout(() => updateSummary(summary), 200)
    return () => clearTimeout(timer)
  }, [summary, updateSummary])

  const charCount = summary?.length ?? 0

  return (
    <div className="space-y-3">
      <div>
        <h2 className="text-sm font-semibold text-slate-900">Professional Summary</h2>
        <p className="mt-0.5 text-xs text-slate-500">
          2–4 sentences that position you for the role
        </p>
      </div>

      <div>
        <Label htmlFor="summary">Summary</Label>
        <Textarea
          id="summary"
          rows={6}
          placeholder="Passionate software engineer with X years of experience…"
          {...register('summary')}
        />
        <p className="mt-1 text-right text-[10px] text-slate-400">{charCount} characters</p>
      </div>

      <div className="rounded-md border border-dashed border-slate-200 bg-slate-50 p-3">
        <p className="text-xs text-slate-500">
          <span className="font-medium text-slate-700">Tip:</span> Include your years of
          experience, core specialisation, and one or two standout achievements.
        </p>
      </div>
    </div>
  )
}
