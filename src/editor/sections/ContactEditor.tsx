import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useResumeStore } from '@/store/resumeStore'
import type { ContactDetails } from '@/types/resume'

export function ContactEditor() {
  const { resume, updateContact } = useResumeStore()

  const { register, watch, reset } = useForm<ContactDetails>({
    defaultValues: resume.contact,
  })

  useEffect(() => {
    reset(resume.contact)
  }, [resume.id, reset])

  const values = watch()

  useEffect(() => {
    const timer = setTimeout(() => updateContact(values), 200)
    return () => clearTimeout(timer)
  }, [
    values.email,
    values.phone,
    values.address,
    values.website,
    values.github,
    values.linkedin,
    updateContact,
  ])

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-sm font-semibold text-slate-900">Contact & Links</h2>
        <p className="mt-0.5 text-xs text-slate-500">
          Shown in the header strip of your resume
        </p>
      </div>

      <div className="space-y-3">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="alex@example.com"
            {...register('email')}
          />
        </div>

        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" type="tel" placeholder="+1 (555) 123-4567" {...register('phone')} />
        </div>

        <div>
          <Label htmlFor="address">Location</Label>
          <Input id="address" placeholder="City, State or Remote" {...register('address')} />
        </div>

        <div>
          <Label htmlFor="website">Website / Portfolio</Label>
          <Input
            id="website"
            placeholder="yoursite.com"
            {...register('website')}
          />
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Social Profiles
        </p>
        <div className="space-y-3">
          <div>
            <Label htmlFor="github">GitHub</Label>
            <Input
              id="github"
              placeholder="github.com/username"
              {...register('github')}
            />
          </div>

          <div>
            <Label htmlFor="linkedin">LinkedIn</Label>
            <Input
              id="linkedin"
              placeholder="linkedin.com/in/username"
              {...register('linkedin')}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
