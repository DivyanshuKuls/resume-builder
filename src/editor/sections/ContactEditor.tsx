import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useResume, useResumeActions } from '@/hooks/useResume'
import { isValidEmail, isValidUrl } from '@/utils/validate'
import type { ContactDetails } from '@/types/resume'

function FieldHint({ message }: { message: string }) {
  return <p className="mt-1 text-[11px] text-red-500">{message}</p>
}

export function ContactEditor() {
  const resume = useResume()
  const { updateContact } = useResumeActions()

  const { register, watch, reset, formState: { touchedFields } } = useForm<ContactDetails>({
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
    values.email, values.phone, values.address,
    values.website, values.github, values.linkedin,
    updateContact,
  ])

  const showEmailError   = touchedFields.email   && !!values.email   && !isValidEmail(values.email)
  const showWebsiteError = touchedFields.website  && !!values.website && !isValidUrl(values.website)
  const showGithubError  = touchedFields.github   && !!values.github  && !isValidUrl(values.github)
  const showLinkedInError = touchedFields.linkedin && !!values.linkedin && !isValidUrl(values.linkedin)

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
          {showEmailError && <FieldHint message="Enter a valid email address." />}
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
          <Input id="website" placeholder="yoursite.com" {...register('website')} />
          {showWebsiteError && <FieldHint message="Enter a valid URL (e.g. yoursite.com)." />}
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Social Profiles
        </p>
        <div className="space-y-3">
          <div>
            <Label htmlFor="github">GitHub</Label>
            <Input id="github" placeholder="github.com/username" {...register('github')} />
            {showGithubError && <FieldHint message="Enter a valid URL." />}
          </div>

          <div>
            <Label htmlFor="linkedin">LinkedIn</Label>
            <Input id="linkedin" placeholder="linkedin.com/in/username" {...register('linkedin')} />
            {showLinkedInError && <FieldHint message="Enter a valid URL." />}
          </div>
        </div>
      </div>
    </div>
  )
}
